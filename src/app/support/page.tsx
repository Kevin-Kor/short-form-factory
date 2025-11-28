"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
}

export default function SupportPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "안녕하세요! 숏폼팩토리 AI 매니저입니다. 무엇을 도와드릴까요?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = { id: Date.now(), text: input, sender: "user" };
        setMessages([...messages, newMessage]);
        setInput("");

        // Mock AI Response
        setTimeout(() => {
            const botResponse: Message = {
                id: Date.now() + 1,
                text: "죄송합니다. 현재는 데모 버전이라 실제 상담이 어렵습니다. 카카오톡 채널을 이용해주세요.",
                sender: "bot"
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">고객 지원</h1>
                    <p className="text-gray-400">AI 챗봇에게 궁금한 점을 물어보세요.</p>
                </div>
                <Button className="bg-[#FAE100] text-[#371D1E] hover:bg-[#FAE100]/90 font-bold">
                    카카오톡 상담하기
                </Button>
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-surface rounded-xl border border-gray-700 flex flex-col overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex items-start max-w-[80%]",
                                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.sender === "user" ? "bg-primary ml-3" : "bg-gray-700 mr-3"
                            )}>
                                {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={cn(
                                "p-3 rounded-lg text-sm",
                                msg.sender === "user"
                                    ? "bg-primary text-white rounded-tr-none"
                                    : "bg-gray-800 text-gray-200 rounded-tl-none"
                            )}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-900 border-t border-gray-700 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                    <Button onClick={handleSend} className="bg-primary hover:bg-primary/90">
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
