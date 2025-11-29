"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
    const { user, isLoggedIn } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isLoggedIn && user) {
            fetchOrders();
        }
    }, [user, isLoggedIn, fetchOrders]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount).replace('₩', '') + '원';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">완료</span>;
            case 'pending':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">대기중</span>;
            default:
                return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const getServiceLabel = (type: string) => {
        switch (type) {
            case 'shooting': return '촬영';
            case 'editing': return '편집';
            case 'all-in-one': return '올인원';
            default: return type;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <ShoppingBag size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-accent">주문 내역</h1>
                </div>
                <p className="text-muted">신청하신 영상 제작 서비스의 진행 상황을 확인하세요 🎬</p>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">주문일시</th>
                                <th className="px-6 py-4">서비스 종류</th>
                                <th className="px-6 py-4">결제 금액 (차감 크레딧)</th>
                                <th className="px-6 py-4">진행 상태</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-muted">로딩 중...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-muted">주문 내역이 없습니다.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600">{new Date(order.created_at).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium text-accent">{getServiceLabel(order.service_type)}</td>
                                        <td className="px-6 py-4 font-bold text-red-600">-{formatCurrency(order.amount || 0)}</td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
