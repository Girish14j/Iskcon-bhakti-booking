    import { useState, useRef, useEffect } from "react";
    import { MessageCircle, X, Minimize2 } from "lucide-react";
    import { Button } from "@/components/ui/button";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import ChatMessage from "./chatMessage";
    import ChatInput from "./chatInput";
    import { supabase } from "@/integrations/supabase/client";
    import { useToast } from "@/hooks/use-toast";

    interface Message {
    id: string;
    content: string;
    isBot: boolean;
    timestamp: Date;
    }

    const suggestions = [
    "Check available halls",
    "I want to book a hall",
    "What are the hall timings?",
    "Tell me the hall rules",
    "Contact the admin"
    ];

    const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
        id: "welcome",
        content: "Hello! I'm your virtual assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
        },
    ]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        setShowSuggestions(false);
        
        const userMessage: Message = {
        id: Date.now().toString(),
        content,
        isBot: false,
        timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
        const { data, error } = await supabase.functions.invoke("ai-chatbot", {
            body: {
            message: content,
            conversationHistory: messages.map((m) => ({
                role: m.isBot ? "assistant" : "user",
                content: m.content,
            })),
            },
        });

        if (error) throw error;

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data?.response || "Sorry, I couldn't process your request.",
            isBot: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
        console.error("Chatbot error:", error);
        toast({
            title: "Error",
            description: "Failed to get response. Please try again.",
            variant: "destructive",
        });

        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Sorry, I'm having trouble connecting. Please try again later.",
            isBot: true,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <>
        {/* Floating Button */}
        {!isOpen && (
            <Button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-105 transition-transform"
            size="icon"
            >
            <MessageCircle className="h-6 w-6" />
            </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
            <div className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-2xl">
                <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">Chat Support</h3>
                    <p className="text-xs opacity-80">We're here to help</p>
                </div>
                </div>
                <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => setIsOpen(false)}
                >
                    <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {messages.map((message) => (
                <ChatMessage
                    key={message.id}
                    message={message.content}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                />
                ))}
                {isLoading && (
                <div className="flex justify-start mb-3">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    </div>
                </div>
                )}
                
                {/* Suggestions */}
                {showSuggestions && !isLoading && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                        {suggestion}
                    </button>
                    ))}
                </div>
                )}
            </ScrollArea>

            {/* Input */}
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
        )}
        </>
    );
    };

    export default ChatWidget;
