"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { CreditCard, Landmark, Plus, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreditsPage() {
    const { user, isLoggedIn } = useAuth();
    // const router = useRouter(); // Unused for now
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [history, setHistory] = useState<any[]>([]);
    const [filterStatus, setFilterStatus] = useState("all"); // all | pending | approved | rejected
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);

    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [depositorName, setDepositorName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch profile for balance
            const { data: profile } = await supabase
                .from('profiles')
                .select('credit_balance')
                .eq('id', user!.id)
                .single();

            if (profile) {
                setBalance(profile.credit_balance || 0);
            }

            // Fetch credit requests
            const { data: requests, error: requestsError } = await supabase
                .from('credit_requests')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (requestsError) throw requestsError;

            // Fetch orders (usage)
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            // Combine and sort
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const combinedHistory = [
                ...(requests || []).map((r: any) => ({ ...r, type: 'deposit' })),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(orders || []).map((o: any) => ({
                    ...o,
                    type: 'usage',
                    amount: -o.amount, // Negative for usage
                    depositor_name: o.service_type === 'shooting' ? '촬영 서비스' :
                        o.service_type === 'editing' ? '편집 서비스' :
                            o.service_type === 'shooting_editing' ? '촬영+편집' : '올인원 패키지',
                    status: o.status === 'pending' ? 'pending' : 'completed' // Map order status
                }))
            ].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setHistory(combinedHistory);
        } catch (error) {
            console.error("Error fetching credits data:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isLoggedIn && user) {
            fetchData();
        } else if (!isLoggedIn) {
            // router.push("/login"); // Optional: redirect if not logged in
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isLoggedIn, fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !depositorName) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('credit_requests')
                .insert({
                    user_id: user!.id,
                    amount: parseInt(amount.replace(/,/g, '')),
                    depositor_name: depositorName,
                    status: 'pending'
                });

            if (error) throw error;

            alert("충전 요청이 접수되었습니다. 입금이 확인되면 크레딧이 충전됩니다.");
            setIsModalOpen(false);
            setAmount("");
            setDepositorName("");
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("요청 제출 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount).replace('₩', '') + '원';
    };

    const filteredHistory = history.filter(item => {
        if (filterStatus === "all") return true;
        return item.status === filterStatus;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 relative">
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
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(balance)}</p>
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
            <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
                <Plus size={20} />
                크레딧 신청 / 충전 요청
            </Button>

            {/* Request Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-6">
                        <h3 className="text-xl font-bold text-accent">크레딧 충전 신청</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">충전 금액</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="금액을 입력하세요"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">입금자명</label>
                                <input
                                    type="text"
                                    value={depositorName}
                                    onChange={(e) => setDepositorName(e.target.value)}
                                    placeholder="입금자명을 입력하세요"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                                    취소
                                </Button>
                                <Button type="submit" disabled={submitting} className="flex-1 bg-primary text-white hover:bg-primary/90">
                                    {submitting ? "신청 중..." : "신청하기"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* History Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-100 gap-4">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <div className="px-4 py-2 rounded-md text-sm font-bold bg-primary text-white shadow-sm">
                            전체 내역 <span className="ml-1 opacity-80 text-xs">{history.length}</span>
                        </div>
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
                                <th className="px-6 py-4">일시</th>
                                <th className="px-6 py-4">구분</th>
                                <th className="px-6 py-4">금액</th>
                                <th className="px-6 py-4">내용</th>
                                <th className="px-6 py-4">상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-muted">로딩 중...</td>
                                </tr>
                            ) : filteredHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-muted">내역이 없습니다.</td>
                                </tr>
                            ) : (
                                filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600">{new Date(item.created_at).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'deposit' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                                {item.type === 'deposit' ? '충전' : '사용'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${item.amount > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
                                            {item.bonus_amount > 0 && <span className="text-xs text-green-600 block">(+보너스 {formatCurrency(item.bonus_amount)})</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{item.depositor_name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === "approved" || item.status === "completed" ? "bg-green-100 text-green-700" :
                                                item.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                                }`}>
                                                {item.status === "approved" && "승인됨"}
                                                {item.status === "completed" && "결제완료"}
                                                {item.status === "pending" && "대기중"}
                                                {item.status === "rejected" && "거부됨"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
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
