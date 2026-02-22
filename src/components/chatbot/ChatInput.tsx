import { useState } from 'react';
import { Send } from "lucide-react";
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
        onSend(message.trim());
        setMessage('');
    }
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-border bg-card">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        className="min-h-[44px] max-h-[120px] resize-none rounded-xl"
        rows={1}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || disabled}
        className="h-11 w-11 rounded-xl shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;