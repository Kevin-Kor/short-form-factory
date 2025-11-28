"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await resetPassword(email);
        setIsLoading(false);

        if (result.success) {
            setIsSubmitted(true);
        } else {
            alert(`비밀번호 재설정 메일 발송 실패: ${result.error?.message || "알 수 없는 오류가 발생했습니다."}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-accent mb-2">비밀번호 찾기</h1>
                    <p className="text-muted">가입하신 이메일 주소를 입력해 주세요.<br />비밀번호 재설정 링크를 보내드립니다.</p>
                </div>

                {isSubmitted ? (
                    <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="text-green-600" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-accent mb-2">메일 발송 완료!</h3>
                            <p className="text-muted text-sm">
                                <strong>{email}</strong>으로<br />비밀번호 재설정 링크가 발송되었습니다.<br />
                                메일함을 확인해 주세요.
                            </p>
                        </div>
                        <Link href="/login">
                            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold mt-4">
                                로그인 페이지로 돌아가기
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted pl-1">이메일</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "전송 중..." : "비밀번호 재설정 메일 받기"}
                        </Button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link href="/login" className="inline-flex items-center text-muted hover:text-accent transition-colors text-sm font-medium">
                        <ArrowLeft size={16} className="mr-2" />
                        로그인 페이지로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
