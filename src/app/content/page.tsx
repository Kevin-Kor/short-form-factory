"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FolderOpen, Download, Lock } from "lucide-react";
import Link from "next/link";

export default function ContentPage() {
    // Mock Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Lock size={40} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">로그인이 필요한 서비스입니다</h1>
                <p className="text-gray-400 max-w-md">
                    내 콘텐츠를 확인하고 다운로드하려면 로그인이 필요합니다.<br />
                    계정이 없다면 회원가입을 진행해주세요.
                </p>
                <div className="flex space-x-4">
                    <Button onClick={() => setIsLoggedIn(true)} className="bg-primary hover:bg-primary/90 text-white">
                        로그인 (테스트용)
                    </Button>
                    <Link href="/auth/register">
                        <Button variant="outline" className="border-gray-600 text-white">
                            회원가입
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">내 콘텐츠</h1>
                <Button variant="outline" onClick={() => setIsLoggedIn(false)} className="text-sm">
                    로그아웃 (테스트)
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-surface rounded-xl overflow-hidden border border-gray-700 group">
                        <div className="h-48 bg-gray-800 relative flex items-center justify-center">
                            <FolderOpen size={48} className="text-gray-600" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button className="bg-white text-black hover:bg-gray-200">
                                    <Download size={16} className="mr-2" /> 다운로드
                                </Button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-white font-bold text-lg">프로젝트 #{100 + item}</h3>
                                    <p className="text-sm text-gray-400">2024.05.{10 + item}</p>
                                </div>
                                <span className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded">
                                    완료됨
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                                인스타그램 릴스 / 컷편집 / 30초 이내
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
