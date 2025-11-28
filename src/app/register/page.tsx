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

        const result = await register(formData);
        if (result.success) {
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            router.push("/login");
        } else {
            alert(`회원가입 실패: ${result.error?.message || "알 수 없는 오류가 발생했습니다."}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-accent mb-2">회원가입</h1>
                    <p className="text-muted">숏폼팩토리의 회원이 되어주세요.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted pl-1">이름</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                placeholder="홍길동"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted pl-1">이메일</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted pl-1">비밀번호 확인</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted pl-1">연락처</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                                placeholder="010-1234-5678"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
                        가입하기
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted">
                    이미 계정이 있으신가요?{" "}
                    <Link href="/login" className="text-primary hover:underline font-bold ml-1">
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}
