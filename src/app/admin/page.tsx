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
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders"); // orders | users | credits | business

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

    // Mock data for credit requests
    const mockCreditRequests = [
        { id: 1, user: "강미정", amount: 300000, depositName: "강미정", status: "pending", date: "2024-11-28 17:34" },
        { id: 2, user: "김철수", amount: 500000, depositName: "김철수", status: "approved", date: "2024-11-28 14:20" },
    ];

    // Mock data for business info
    const mockBusinessInfo = [
        { id: 1, user: "강미정", company: "테판쉐프", regNo: "123-45-67890", rep: "강미정", type: "음식점", item: "한식" },
        { id: 2, user: "김철수", company: "김철수스튜디오", regNo: "111-22-33333", rep: "김철수", type: "서비스", item: "사진촬영" },
    ];

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
                            <p className="text-sm font-medium text-muted">신규 주문</p>
                            <h3 className="text-2xl font-bold text-accent">12건</h3>
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
                            <h3 className="text-2xl font-bold text-accent">1,234명</h3>
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
                            <h3 className="text-2xl font-bold text-accent">5건</h3>
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
                <button
                    onClick={() => setActiveTab("orders")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "orders" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    주문 관리
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "users" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    회원 관리
                </button>
                <button
                    onClick={() => setActiveTab("credits")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "credits" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    크레딧 관리
                </button>
                <button
                    onClick={() => setActiveTab("business")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "business" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    사업자 정보
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                                            <td className="px-4 py-3">{order.user?.email || 'N/A'}</td>
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
                        <div className="text-center py-12 text-muted">
                            회원 관리 기능이 준비 중입니다.
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
                                    {mockCreditRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 text-gray-500">{req.date}</td>
                                            <td className="px-4 py-3 font-medium">{req.user}</td>
                                            <td className="px-4 py-3">{req.depositName}</td>
                                            <td className="px-4 py-3 font-bold text-blue-600">{req.amount.toLocaleString()}원</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${req.status === "approved" ? "bg-green-100 text-green-700" :
                                                    "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {req.status === "approved" ? "승인됨" : "대기중"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 flex gap-2">
                                                {req.status === "pending" && (
                                                    <>
                                                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">승인</button>
                                                        <button className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-xs hover:bg-red-200">거절</button>
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
                                        <th className="px-4 py-3 rounded-r-lg">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {mockBusinessInfo.map((info) => (
                                        <tr key={info.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium">{info.user}</td>
                                            <td className="px-4 py-3">{info.company}</td>
                                            <td className="px-4 py-3">{info.regNo}</td>
                                            <td className="px-4 py-3">{info.rep}</td>
                                            <td className="px-4 py-3">{info.type} / {info.item}</td>
                                            <td className="px-4 py-3">
                                                <button className="text-primary hover:underline font-medium">수정</button>
                                            </td>
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
