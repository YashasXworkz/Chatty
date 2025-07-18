import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useEmotionStore } from "../store/useEmotionStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";

// Simple client-side emotion detection preview
const getPreviewEmotion = (text) => {
  if (!text) return null;

  // Happy keywords
  if (/happy|glad|joy|yay|great|excellent|delighted|cheerful|pleased|wonderful|smile|love|enjoy|blessed|fantastic|good|lovely|positive|content|ecstatic|elated|jubilant|thrilled|blissful|radiant|joyful|merry|optimistic|pleased|satisfied|cheerful|gratified|beaming|glowing|jolly|fortunate|grateful|amused|encouraged|fulfilled|hopeful|peaceful|proud|relaxed|relieved|respected|terrific|tranquil|valued/i.test(text)) return "happy";

  // Sad keywords
  if (/sad|upset|unfortunate|sorry|miss you|disappointed|depressed|unhappy|heartbroken|down|regret|grief|lonely|gloomy|crying|tears|hurt|painful|melancholy|despair|hopeless|miserable|devastated|blue|despondent|disheartened|forlorn|sorrowful|dejected|downcast|wistful|brokenhearted|crushed|distressed|woeful|anguished|desolate|somber|ashamed|burdened|drained|empty|exhausted|helpless|humbled|inadequate|isolated|mournful|neglected|rejected|worthless|wounded/i.test(text)) return "sad";

  // Angry keywords
  if (/angry|mad|frustrated|annoyed|furious|irritated|outraged|hate|rage|fed up|upset|pissed|infuriated|livid|hostile|disgusted|resent|irate|fuming|enraged|seething|bitter|incensed|indignant|offended|agitated|exasperated|resentful|provoked|vexed|irked|aggravated|displeased|contempt|loathing|scorn|wrath|betrayed|humiliated|peeved|spiteful|vengeful|vindictive/i.test(text)) return "angry";

  // Excited keywords
  if (/excited|thrilled|awesome|amazing|pumped|stoked|ecstatic|enthusiastic|eager|hyped|can't wait|looking forward|incredible|unbelievable|wow|fantastic|brilliant|exhilarated|energized|animated|vibrant|passionate|zealous|fervent|ardent|elated|euphoric|overjoyed|jubilant|exuberant|enthralled|delighted|psyched|buzzed|fired up|amped|perky|frisky|giddy|giggly|zestful/i.test(text)) return "excited";

  // Surprised keywords
  if (/surprised|wow|omg|unexpected|cannot believe|shocked|astonished|stunned|startled|amazed|speechless|whoa|what|really|seriously|unbelievable|no way|astounded|dumbfounded|flabbergasted|thunderstruck|awestruck|taken aback|bewildered|dazed|floored|staggered|baffled|perplexed|blindsided|gobsmacked|mind blown|jaw dropped|jolted|alarmed/i.test(text)) return "surprised";

  return null;
};

// Emotion UI labels
const emotionLabels = {
  happy: { text: "Happy", color: "text-amber-500" },
  sad: { text: "Sad", color: "text-blue-500" },
  angry: { text: "Angry", color: "text-red-500" },
  excited: { text: "Excited", color: "text-green-500" },
  surprised: { text: "Surprised", color: "text-purple-500" },
};

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [previewEmotion, setPreviewEmotion] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const { emotionDetectionEnabled } = useEmotionStore();

  // Update preview emotion when text changes
  useEffect(() => {
    if (!emotionDetectionEnabled) {
      setPreviewEmotion(null);
      return;
    }

    const emotion = getPreviewEmotion(text);
    setPreviewEmotion(emotion);
  }, [text, emotionDetectionEnabled]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setPreviewEmotion(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {emotionDetectionEnabled && previewEmotion && (
            <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Smile className={`size-4 ${emotionLabels[previewEmotion].color}`} />
              <span className={`text-xs ${emotionLabels[previewEmotion].color}`}>
                {emotionLabels[previewEmotion].text}
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
