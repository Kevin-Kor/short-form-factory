"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { User, Shield, Building2, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

function BusinessInfoForm({ userId }: { userId: string }) {
    const [formData, setFormData] = useState({
        company_name: "",
        representative_name: "",
        registration_number: "",
        address: "",
        business_type: "",
        business_item: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const { data } = await supabase
                    .from('business_info')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (data) {
                    setFormData({
                        company_name: data.company_name,
                        representative_name: data.representative_name,
                        registration_number: data.registration_number || "",
                        address: data.address || "",
                        business_type: data.business_type || "",
                        business_item: data.business_item || "",
                        email: data.email || ""
                    });
                }
            } catch {
                // Ignore error if no data found
            } finally {
                setFetching(false);
            }
        };
        fetchInfo();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('business_info')
                .select('id')
                .eq('user_id', userId)
                .single();

            if (existing) {
                const { error } = await supabase
                    .from('business_info')
                    .update(formData)
                    .eq('user_id', userId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('business_info')
                    .insert({ ...formData, user_id: userId });
                if (error) throw error;
            }
            alert("사업자 정보가 저장되었습니다.");
        } catch (error) {
            console.error("Error saving business info:", error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-8">로딩 중...</div>;

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-accent">상호명 (법인명)</label>
                    <input
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        type="text"
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="예: 숏폼팩토리"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-accent">대표자명</label>
                    <input
                        name="representative_name"
                        value={formData.representative_name}
                        onChange={handleChange}
                        type="text"
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="예: 홍길동"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-accent">사업자등록번호</label>
                    <input
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleChange}
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="000-00-00000"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-accent">사업장 주소</label>
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="주소를 입력해주세요"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-accent">업태</label>
                    <input
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleChange}
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="예: 서비스업"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-accent">종목</label>
                    <input
                        name="business_item"
                        value={formData.business_item}
                        onChange={handleChange}
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="예: 영상제작"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-accent">세금계산서 수신 이메일</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="tax@example.com"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button disabled={loading} className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20">
                    {loading ? "저장 중..." : "저장하기"}
                </Button>
            </div>
        </form>
    );
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    if (!user) {
        return <div className="p-8 text-center text-muted">로그인이 필요합니다.</div>;
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-accent mb-2">마이페이지</h1>
                    <p className="text-muted flex items-center gap-2">
                        계정 정보를 관리하고 설정을 변경하세요 <span className="animate-spin-slow">⚙️</span>
                    </p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-blue-100">
                    <CreditCard size={18} className="text-primary" />
                    <span className="font-bold text-primary">0원</span>
                    <span className="text-xs text-muted cursor-pointer hover:text-primary hover:underline">충전하러 가기 👆</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "profile" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <User size={16} /> 프로필 정보
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "security" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <Shield size={16} /> 보안 설정
                </button>
                <button
                    onClick={() => setActiveTab("business")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "business" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <Building2 size={16} /> 사업자 정보
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                {activeTab === "profile" && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-bold text-accent mb-1">프로필 정보</h2>
                            <p className="text-sm text-muted">회원정보를 확인하세요. (정보 변경은 고객센터에 문의해주세요)</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-accent mb-2">아이디</label>
                                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-600">
                                    {user.id}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-accent mb-2">이메일</label>
                                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-600">
                                    {user.email}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-accent mb-2">닉네임</label>
                                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-600">
                                    {user.user_metadata?.name || "설정되지 않음"}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-accent mb-2">연락처</label>
                                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-600">
                                    {user.phone || "010-0000-0000 (기본값)"}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-accent mb-2">역할</label>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200">
                                    회원
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-accent mb-2">가입일</label>
                                <div className="text-gray-600 flex items-center gap-2">
                                    📅 {formatDate(user.created_at)}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-accent text-sm">카카오 연동</p>
                                    <p className="text-xs text-muted">카카오 계정과의 연동 상태</p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                                    {user.app_metadata?.provider === 'kakao' ? '연동됨' : '연동 안됨'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-accent text-sm">일반 회원가입</p>
                                    <p className="text-xs text-muted">아이디/비밀번호 로그인 가능 상태</p>
                                </div>
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200">
                                    {user.app_metadata?.provider === 'email' ? '가입됨' : '가입 안됨'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="text-center py-12">
                        <Shield size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-accent mb-2">보안 설정 준비 중</h3>
                        <p className="text-muted">비밀번호 변경 및 2단계 인증 기능이 곧 추가될 예정입니다.</p>
                    </div>
                )}

                {activeTab === "business" && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-bold text-accent mb-1">사업자 정보 관리</h2>
                            <p className="text-sm text-muted">세금계산서 발행을 위한 사업자 정보를 등록해주세요.</p>
                        </div>

                        <BusinessInfoForm userId={user.id} />
                    </div>
                )}
            </div>
        </div>
    );
}
