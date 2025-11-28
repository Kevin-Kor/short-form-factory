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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            const success = await login(email, password);
            if (success) {
                router.push("/dashboard");
            } else {
                alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">로그인</h1>
                    <p className="text-gray-400">숏폼팩토리 서비스 이용을 위해 로그인해주세요.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">이메일</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">비밀번호</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-bold">
                        로그인
                    </Button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-surface text-gray-500">SNS 계정으로 로그인</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => signInWithOAuth('kakao')}
                        className="flex items-center justify-center bg-[#FEE500] hover:bg-[#FEE500]/90 text-black py-3 rounded-lg font-medium transition-colors"
                    >
                        K
                    </button>
                    <button
                        type="button"
                        onClick={() => signInWithOAuth('naver')}
                        className="flex items-center justify-center bg-[#03C75A] hover:bg-[#03C75A]/90 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        N
                    </button>
                    <button
                        type="button"
                        onClick={() => signInWithOAuth('google')}
                        className="flex items-center justify-center bg-white hover:bg-gray-100 text-black py-3 rounded-lg font-medium transition-colors"
                    >
                        G
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-400">
                    계정이 없으신가요?{" "}
                    <Link href="/register" className="text-primary hover:underline font-bold">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
