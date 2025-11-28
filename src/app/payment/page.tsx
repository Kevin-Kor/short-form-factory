"use client";

import { useAuth } from "@/context/AuthContext";
import { History, Wallet, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function PaymentPage() {
    const { user, isLoggedIn } = useAuth();

    // Optional: Redirect if not logged in (or just show a different UI)
    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         router.push("/login");
    //     }
    // }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-10 h-10 text-gray-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">로그인이 필요한 서비스입니다</h1>
                <p className="text-gray-400 max-w-md">
                    결제 내역을 확인하고 관리하려면 로그인이 필요합니다.<br />
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
                <h1 className="text-3xl font-bold text-white">결제 관리</h1>
                <span className="text-sm text-gray-400">
                    <span className="text-primary font-bold">{user?.user_metadata?.name || user?.email}</span>님의 결제 내역
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Method */}
                <div className="bg-surface p-6 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Wallet className="mr-2 text-primary" /> 결제 수단
                    </h2>

                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400">현재 결제 방식</span>
                            <span className="text-primary font-bold">무통장 입금 (계좌이체)</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-white font-medium">국민은행 1234-56-789012</p>
                            <p className="text-sm text-gray-400">예금주: 숏폼팩토리</p>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                        <p className="text-sm text-blue-400">
                            * 현재는 계좌이체 결제만 지원하고 있습니다.<br />
                            * 카드 결제 도입 준비 중입니다.
                        </p>
                    </div>
                </div>

                {/* Payment History */}
                <div className="bg-surface p-6 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <History className="mr-2 text-primary" /> 결제 내역
                    </h2>

                    <div className="space-y-4">
                        {/* Mock Data for Demo */}
                        {[1, 2].map((item) => (
                            <div key={item} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">프로젝트 #{100 + item} 착수금</p>
                                    <p className="text-xs text-gray-400">2024.05.{10 + item}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">150,000원</p>
                                    <span className="text-xs text-green-500">입금 완료</span>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg opacity-50">
                            <div>
                                <p className="text-white font-medium">프로젝트 #103 잔금</p>
                                <p className="text-xs text-gray-400">2024.05.20</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold">100,000원</p>
                                <span className="text-xs text-yellow-500">입금 대기</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full mt-6 border-gray-600 text-white hover:bg-gray-800">
                        전체 내역 보기
                    </Button>
                </div>
            </div>
        </div>
    );
}
