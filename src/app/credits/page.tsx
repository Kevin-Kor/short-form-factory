"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CreditCard, Landmark, Plus, Info } from "lucide-react";

// Mock data for credit history
const mockHistory = [
    {
        id: 1,
        date: "2024-11-28 17:34",
        amount: 300000,
        depositAmount: 330000,
        depositor: "강미정",
        status: "approved",
        business: "테판쉐프"
    },
    {
        id: 2,
        date: "2024-11-29 10:00",
        amount: 500000,
        depositAmount: 550000,
        depositor: "김철수",
        status: "pending",
        business: "김철수스튜디오"
    }
];

export default function CreditsPage() {
    const [activeTab, setActiveTab] = useState("requests"); // requests | usage
    const [filterStatus, setFilterStatus] = useState("all"); // all | pending | approved | rejected

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount).replace('₩', '') + '원';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-primary">
                        <CreditCard size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-accent">크레딧 관리</h1>
                </div>
                <p className="text-muted">광고비를 충전하고 거래 내역을 관리하세요 💰</p>
            </div>

            {/* Balance Section */}
            <div className="flex gap-12">
                <div>
                    <p className="text-sm font-bold text-muted mb-1">현재 잔액</p>
                    <p className="text-3xl font-bold text-blue-600">0원</p>
                </div>
                <div>
                    <p className="text-sm font-bold text-muted mb-1">광고 환급액</p>
                    <p className="text-3xl font-bold text-green-600">0원</p>
                </div>
            </div>

            {/* Deposit Info Box */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-3 mb-4">
                    <Landmark className="text-primary mt-1" size={20} />
                    <div>
                        <h3 className="font-bold text-accent mb-4">입금 계좌 정보</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                            <div>
                                <p className="text-blue-600 font-bold mb-1">은행</p>
                                <p className="text-accent font-medium">신한은행</p>
                            </div>
                            <div>
                                <p className="text-blue-600 font-bold mb-1">계좌번호</p>
                                <p className="text-accent font-medium">140-015-398888</p>
                            </div>
                            <div>
                                <p className="text-blue-600 font-bold mb-1">예금주</p>
                                <p className="text-accent font-medium">(주)와이드어웨이크</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100/50 p-3 rounded-lg">
                    <Info size={14} />
                    <span>충전 절차: 크레딧 신청 → 위 계좌로 입금 → 10분 내 자동 충전 완료</span>
                </div>
            </div>

            {/* Action Button */}
            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <Plus size={20} />
                크레딧 신청 / 충전 요청
            </Button>

            {/* History Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-100 gap-4">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "requests" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            충전 요청 내역 <span className="ml-1 opacity-80 text-xs">2</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("usage")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "usage" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            광고비 사용 내역 <span className="ml-1 opacity-80 text-xs">0</span>
                        </button>
                    </div>

                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        {["all", "pending", "approved", "rejected"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterStatus === status ? "bg-white text-accent shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {status === "all" && "전체"}
                                {status === "pending" && "대기중"}
                                {status === "approved" && "승인됨"}
                                {status === "rejected" && "거부됨"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">신청일시</th>
                                <th className="px-6 py-4">충전금액</th>
                                <th className="px-6 py-4">입금금액</th>
                                <th className="px-6 py-4">입금자명</th>
                                <th className="px-6 py-4">처리상태</th>
                                <th className="px-6 py-4">사업자 정보</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">{item.date}</td>
                                    <td className="px-6 py-4 font-bold text-blue-600">{formatCurrency(item.amount)}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">{formatCurrency(item.depositAmount)}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.depositor}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === "approved" ? "bg-green-100 text-green-700" :
                                                item.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                            }`}>
                                            {item.status === "approved" && "승인됨"}
                                            {item.status === "pending" && "대기중"}
                                            {item.status === "rejected" && "거부됨"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{item.business}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-4 flex justify-center border-t border-gray-100">
                    <button className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">1</button>
                </div>
            </div>
        </div>
    );
}
