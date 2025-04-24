import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Sentiment from "sentiment";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Function to determine emotion based on sentiment analysis
const detectEmotion = (text) => {
  if (!text) return "neutral";

  const analysis = sentiment.analyze(text);
  const score = analysis.score;

  // Simple emotion detection rules
  if (score >= 3) return "excited";
  if (score > 0) return "happy";
  if (score < -2) return "angry";
  if (score < 0) return "sad";

  // Check for exclamation marks to detect excitement/surprise
  if (text.includes("!") && (text.match(/!/g) || []).length >= 2) return "surprised";

  return "neutral";
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Detect emotion from message text
    const emotion = detectEmotion(text);

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      emotion,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
