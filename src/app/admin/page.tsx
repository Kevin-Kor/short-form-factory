"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "manyd950222@gmail.com";

export default function AdminPage() {
    const { user, isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            if (!isLoggedIn || user?.email !== ADMIN_EMAIL) {
                // Redirect unauthorized users
                router.push("/dashboard");
                return;
            }

            // Fetch ALL orders for admin
            const fetchAllOrders = async () => {
                try {
                    const { data, error } = await supabase
                        .from('orders')
                        .select('*, user:user_id(email)') // Attempt to join user email if possible, or just raw data
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    setOrders(data || []);
                } catch (error) {
                    console.error("Error fetching all orders:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllOrders();
        }
    }, [user, isLoggedIn, isLoading, router]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            alert("상태가 변경되었습니다.");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("상태 변경 실패");
        }
    };

    if (isLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isLoggedIn || user?.email !== ADMIN_EMAIL) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">관리자 대시보드</h1>
                <span className="text-sm text-gray-400">
                    관리자 계정: <span className="text-primary font-bold">{user?.email}</span>
                </span>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-gray-700 overflow-x-auto">
                <h2 className="text-xl font-bold text-white mb-6">전체 주문 내역 ({orders.length}건)</h2>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                            <th className="p-4">ID</th>
                            <th className="p-4">날짜</th>
                            <th className="p-4">서비스</th>
                            <th className="p-4">상태</th>
                            <th className="p-4">금액</th>
                            <th className="p-4">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-4 text-gray-400">#{order.id}</td>
                                <td className="p-4 text-white">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-white">
                                    {order.service_type === 'shooting' ? '촬영' :
                                        order.service_type === 'editing' ? '편집' : '올인원'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                            'bg-blue-500/20 text-blue-500'
                                        }`}>
                                        {order.status === 'completed' ? '완료' :
                                            order.status === 'pending' ? '대기' : order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-white">
                                    {order.amount > 0 ? `${order.amount.toLocaleString()}원` : '-'}
                                </td>
                                <td className="p-4 flex gap-2">
                                    {order.status !== 'completed' && (
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                                            onClick={() => updateStatus(order.id, 'completed')}
                                        >
                                            완료 처리
                                        </Button>
                                    )}
                                    {order.status === 'completed' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-yellow-600 text-yellow-500 hover:bg-yellow-600/10 h-8 text-xs"
                                            onClick={() => updateStatus(order.id, 'pending')}
                                        >
                                            대기 처리
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
