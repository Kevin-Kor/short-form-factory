"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, User, Phone } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const success = await register(formData);
        if (success) {
            router.push("/dashboard");
        } else {
            alert("회원가입에 실패했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-surface/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
                    <p className="text-gray-400">숏폼팩토리의 회원이 되어주세요.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">이름</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="홍길동"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">이메일</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">비밀번호 확인</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">연락처</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="010-1234-5678"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-bold mt-4">
                        가입하기
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    이미 계정이 있으신가요?{" "}
                    <Link href="/login" className="text-primary hover:underline font-bold">
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}
