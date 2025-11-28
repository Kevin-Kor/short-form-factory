"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { FolderOpen, Download, Lock } from "lucide-react";
import Link from "next/link";

export default function ContentPage() {
    const { user, isLoggedIn, isLoading } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [contents, setContents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchContents = async () => {
                try {
                    // For now, we treat 'orders' as content projects
                    const { data, error } = await supabase
                        .from('orders')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    setContents(data || []);
                } catch (error) {
                    console.error("Error fetching content:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchContents();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-10 h-10 text-gray-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">로그인이 필요한 서비스입니다</h1>
                <p className="text-gray-400 max-w-md">
                    내 콘텐츠를 확인하고 다운로드하려면 로그인이 필요합니다.<br />
                    계정이 없다면 회원가입을 진행해주세요.
                </p>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
                            로그인하기
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3">
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
                <span className="text-sm text-gray-400">
                    <span className="text-primary font-bold">{user?.user_metadata?.name || user?.email}</span>님의 프로젝트
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400 col-span-full text-center py-10">로딩 중...</p>
                ) : contents.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-surface rounded-xl border border-gray-700">
                        <FolderOpen size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">진행 중인 프로젝트가 없습니다.</p>
                        <Link href="/order">
                            <Button className="bg-primary text-white">새 프로젝트 시작하기</Button>
                        </Link>
                    </div>
                ) : (
                    contents.map((item) => (
                        <div key={item.id} className="bg-surface rounded-xl overflow-hidden border border-gray-700 group">
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
                                        <h3 className="text-white font-bold text-lg">
                                            {item.service_type === 'shooting' ? '촬영 프로젝트' :
                                                item.service_type === 'editing' ? '편집 프로젝트' : '올인원 프로젝트'}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                                        }`}>
                                        {item.status === 'completed' ? '완료됨' : '진행중'}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mt-2 truncate">
                                    {item.details?.concept || "상세 내용 없음"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
