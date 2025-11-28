"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Users, Settings, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "manyd950222@gmail.com";

export default function AdminPage() {
    const { user, isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, setUsers] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [creditRequests, setCreditRequests] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [businessInfos, setBusinessInfos] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders"); // orders | users | credits | business
    const [stats, setStats] = useState({
        ordersCount: 0,
        usersCount: 0,
        pendingCreditsCount: 0
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading) {
            if (!isLoggedIn || user?.email !== ADMIN_EMAIL) {
                router.push("/dashboard");
                return;
            }
            fetchStats();
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isLoggedIn, isLoading, router, activeTab]);

    const fetchStats = async () => {
        try {
            const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
            const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: pendingCreditsCount } = await supabase.from('credit_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');

            setStats({
                ordersCount: ordersCount || 0,
                usersCount: usersCount || 0,
                pendingCreditsCount: pendingCreditsCount || 0
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null); // Reset error
        try {
            if (activeTab === "orders") {
                // Fetch orders first (without join to avoid RLS/FK issues)
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;

                // Fetch profiles to map emails
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, email');

                if (profilesError) throw profilesError;

                // Map profiles to orders
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ordersWithUser = (ordersData || []).map((order: any) => ({
                    ...order,
                    user: profilesMap[order.user_id] || { email: 'Unknown' }
                }));

                console.log("Fetched Orders:", ordersWithUser); // Debug log
                setOrders(ordersWithUser);

            } else if (activeTab === "users") {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setUsers(data || []);
            } else if (activeTab === "credits") {
                const { data, error } = await supabase
                    .from('credit_requests')
                    .select('*, user:user_id(email, full_name)')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setCreditRequests(data || []);
            } else if (activeTab === "business") {
                const { data, error } = await supabase
                    .from('business_info')
                    .select('*, user:user_id(email, full_name)')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setBusinessInfos(data || []);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(`Error fetching ${activeTab}:`, error);
            setError(error.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            alert("상태가 변경되었습니다.");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("상태 변경 실패");
        }
    };

    const handleCreditRequest = async (requestId: string, userId: string, amount: number, action: 'approved' | 'rejected') => {
        try {
            if (action === 'approved') {
                // 1. Update request status
                const { error: updateError } = await supabase
                    .from('credit_requests')
                    .update({ status: 'approved' })
                    .eq('id', requestId);
                if (updateError) throw updateError;

                // 2. Add credits to user profile (RPC would be better for atomicity, but doing client-side for MVP)
                // First get current balance
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('credit_balance')
                    .eq('id', userId)
                    .single();

                if (profileError) throw profileError;

                const newBalance = (profile?.credit_balance || 0) + amount;

                const { error: balanceError } = await supabase
                    .from('profiles')
                    .update({ credit_balance: newBalance })
                    .eq('id', userId);

                if (balanceError) throw balanceError;
            } else {
                const { error } = await supabase
                    .from('credit_requests')
                    .update({ status: 'rejected' })
                    .eq('id', requestId);
                if (error) throw error;
            }

            setCreditRequests(creditRequests.map(req => req.id === requestId ? { ...req, status: action } : req));
            fetchStats(); // Refresh stats after action
            alert(`요청이 ${action === 'approved' ? '승인' : '거절'}되었습니다.`);
        } catch (error) {
            console.error("Error handling credit request:", error);
            alert("처리 중 오류가 발생했습니다.");
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
        return null;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-accent mb-2">관리자 대시보드</h1>
                <p className="text-muted">서비스 현황을 한눈에 확인하고 관리하세요.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted">총 주문</p>
                            <h3 className="text-2xl font-bold text-accent">{stats.ordersCount}건</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted">총 회원수</p>
                            <h3 className="text-2xl font-bold text-accent">{stats.usersCount}명</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted">크레딧 충전 대기</p>
                            <h3 className="text-2xl font-bold text-accent">{stats.pendingCreditsCount}건</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                            <Settings size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted">시스템 상태</p>
                            <h3 className="text-2xl font-bold text-accent">정상</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
                {["orders", "users", "credits", "business"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        {tab === "orders" && "주문 관리"}
                        {tab === "users" && "회원 관리"}
                        {tab === "credits" && "크레딧 관리"}
                        {tab === "business" && "사업자 정보"}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
                        오류 발생: {error}
                    </div>
                )}
                {activeTab === "orders" && (
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-accent mb-4">최근 주문 내역</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">주문번호</th>
                                        <th className="px-4 py-3">서비스</th>
                                        <th className="px-4 py-3">고객명</th>
                                        <th className="px-4 py-3">상태</th>
                                        <th className="px-4 py-3">날짜</th>
                                        <th className="px-4 py-3 rounded-r-lg">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium">#{order.id}</td>
                                            <td className="px-4 py-3">
                                                {order.service_type === 'shooting' ? '촬영' :
                                                    order.service_type === 'editing' ? '편집' : '올인원'}
                                            </td>
                                            <td className="px-4 py-3">{order.user?.email || order.user_id}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.status === 'completed' ? '완료' :
                                                        order.status === 'pending' ? '대기' : order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 flex gap-2">
                                                {order.status !== 'completed' && (
                                                    <button
                                                        className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                                                        onClick={() => updateStatus(order.id, 'completed')}
                                                    >
                                                        완료 처리
                                                    </button>
                                                )}
                                                {order.status === 'completed' && (
                                                    <button
                                                        className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-md text-xs hover:bg-yellow-200"
                                                        onClick={() => updateStatus(order.id, 'pending')}
                                                    >
                                                        대기 처리
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-accent mb-4">회원 목록</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">이메일</th>
                                        <th className="px-4 py-3">이름</th>
                                        <th className="px-4 py-3">보유 크레딧</th>
                                        <th className="px-4 py-3">가입일</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium">{u.email}</td>
                                            <td className="px-4 py-3">{u.full_name || '-'}</td>
                                            <td className="px-4 py-3 font-bold text-blue-600">{(u.credit_balance || 0).toLocaleString()}원</td>
                                            <td className="px-4 py-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "credits" && (
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-accent mb-4">크레딧 충전 요청</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">신청일시</th>
                                        <th className="px-4 py-3">회원명</th>
                                        <th className="px-4 py-3">입금자명</th>
                                        <th className="px-4 py-3">충전금액</th>
                                        <th className="px-4 py-3">상태</th>
                                        <th className="px-4 py-3 rounded-r-lg">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {creditRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 text-gray-500">{new Date(req.created_at).toLocaleString()}</td>
                                            <td className="px-4 py-3 font-medium">{req.user?.full_name || req.user?.email || 'Unknown'}</td>
                                            <td className="px-4 py-3">{req.depositor_name}</td>
                                            <td className="px-4 py-3 font-bold text-blue-600">{req.amount.toLocaleString()}원</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${req.status === "approved" ? "bg-green-100 text-green-700" :
                                                    req.status === "rejected" ? "bg-red-100 text-red-700" :
                                                        "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {req.status === "approved" && "승인됨"}
                                                    {req.status === "pending" && "대기중"}
                                                    {req.status === "rejected" && "거절됨"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 flex gap-2">
                                                {req.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleCreditRequest(req.id, req.user_id, req.amount, 'approved')}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                                                        >
                                                            승인
                                                        </button>
                                                        <button
                                                            onClick={() => handleCreditRequest(req.id, req.user_id, req.amount, 'rejected')}
                                                            className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-xs hover:bg-red-200"
                                                        >
                                                            거절
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "business" && (
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-accent mb-4">사업자 정보 목록</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">회원명</th>
                                        <th className="px-4 py-3">상호명</th>
                                        <th className="px-4 py-3">사업자번호</th>
                                        <th className="px-4 py-3">대표자</th>
                                        <th className="px-4 py-3">업태/종목</th>
                                        <th className="px-4 py-3 rounded-r-lg">이메일</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {businessInfos.map((info) => (
                                        <tr key={info.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium">{info.user?.full_name || info.user?.email || 'Unknown'}</td>
                                            <td className="px-4 py-3">{info.company_name}</td>
                                            <td className="px-4 py-3">{info.registration_number}</td>
                                            <td className="px-4 py-3">{info.representative_name}</td>
                                            <td className="px-4 py-3">{info.business_type} / {info.business_item}</td>
                                            <td className="px-4 py-3 text-gray-500">{info.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
