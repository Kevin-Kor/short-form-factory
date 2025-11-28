"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, signInWithOAuth } = useAuth();
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            const success = await login(email, password);
            if (success) {
                setShowSuccess(true);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
            } else {
                alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-[scaleIn_0.3s_ease-out]">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h3 className="text-xl font-bold text-accent mb-2">로그인 성공!</h3>
                        <p className="text-muted">대시보드로 이동합니다...</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-accent mb-2">로그인</h1>
                    <p className="text-muted">숏폼팩토리 서비스 이용을 위해 로그인해주세요.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5 mb-8">
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted pl-1">비밀번호</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        로그인
                    </Button>
                </form>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-50 text-gray-400">SNS 계정으로 로그인</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => signInWithOAuth('kakao')}
                        className="flex items-center justify-center bg-[#FEE500] hover:bg-[#FEE500]/90 text-black py-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    >
                        K
                    </button>
                    <button
                        type="button"
                        onClick={() => signInWithOAuth('google')}
                        className="flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-black py-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    >
                        G
                    </button>
                </div>

                <div className="mt-10 text-center text-sm text-muted">
                    계정이 없으신가요?{" "}
                    <Link href="/register" className="text-primary hover:underline font-bold ml-1">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
