"use client";

import { useState, Suspense, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Camera, Scissors, Video, Layers, Info, Minus, Plus, Wallet, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ChargeModal } from "@/components/ChargeModal";

const steps = [
    { id: 1, name: "서비스 선택" },
    { id: 2, name: "세부 옵션" },
    { id: 3, name: "상세 요청" },
    { id: 4, name: "결제" },
];

function OrderForm() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get("type") || "";
    const [currentStep, setCurrentStep] = useState(initialType ? 2 : 1);
    const [formData, setFormData] = useState({
        serviceType: initialType,
        // Editing Options
        editingType: "", // cut_only, full_edit
        duration: "under_30s", // under_30s, 30s_1m
        // Shooting Options
        location: "", // studio, outdoor, visit
        isNonCapital: false, // 수도권 외
        camera: "", // phone, pro
        format: "", // interview, ad, sketch, other
        formatOther: "",
        aiSource: false,
        // Common
        details: "", // Legacy field, keeping for safety
        productInfo: "",
        brandGoal: "",
        toneManner: "",
        referenceUrl: "",
        files: [],
        quantity: 1,
    });

    const [estimatedPrice, setEstimatedPrice] = useState(0);
    const [creditBalance, setCreditBalance] = useState(0);
    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const type = params.get("type");
        if (type) {
            setFormData(prev => ({ ...prev, serviceType: type }));
        }

        // Load temp save
        const savedData = localStorage.getItem("tempOrderData");
        if (savedData) {
            if (confirm("임시 저장된 주문 내역이 있습니다. 불러오시겠습니까?")) {
                setFormData(JSON.parse(savedData));
            }
        }
    }, [searchParams]);

    const handleTempSave = () => {
        localStorage.setItem("tempOrderData", JSON.stringify(formData));
        alert("주문 내역이 임시 저장되었습니다.\n나중에 다시 방문하시면 이어서 작성하실 수 있습니다.");
    };

    // Price Calculation Logic
    useEffect(() => {
        let price = 0;
        const { serviceType, editingType, duration, location, isNonCapital, camera } = formData;

        // Shooting Price
        if (["shooting", "shooting_editing", "all_in_one"].includes(serviceType)) {
            if (camera === "phone") price += 150000;
            if (camera === "pro") price += 200000;
            if (location === "visit" && isNonCapital) price += 100000;
        }

        // Editing Price
        if (["editing", "shooting_editing", "all_in_one"].includes(serviceType)) {
            if (editingType === "cut_only") {
                if (duration === "under_30s") price += 80000;
                if (duration === "30s_1m") price += 150000;
            }
            if (editingType === "full_edit") {
                if (duration === "under_30s") price += 150000;
                if (duration === "30s_1m") price += 250000;
            }
        }

        setEstimatedPrice(price * formData.quantity);
    }, [formData]);


    const { user } = useAuth(); // Get user from auth context

    const fetchCreditBalance = useCallback(async () => {
        if (!user?.id) return;
        setIsLoadingBalance(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('credit_balance')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setCreditBalance(data?.credit_balance || 0);
        } catch (error) {
            console.error("Error fetching credit balance:", error);
        } finally {
            setIsLoadingBalance(false);
        }
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            fetchCreditBalance();
        }
    }, [user, fetchCreditBalance]);

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Submit Order
            try {
                const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...formData,
                        userId: user?.id,
                        amount: estimatedPrice
                    }),
                });

                if (res.ok) {
                    localStorage.removeItem("tempOrderData"); // Clear temp save on success
                    alert("주문이 접수되었습니다! 담당자가 곧 연락드리겠습니다.");
                    router.push("/dashboard");
                } else {
                    alert("주문 접수 중 오류가 발생했습니다.");
                }
            } catch (error) {
                console.error("Order submission failed", error);
                alert("주문 접수 중 오류가 발생했습니다.");
            }
        }
    };
    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const isShooting = ["shooting", "shooting_editing", "all_in_one"].includes(formData.serviceType);
    const isEditing = ["editing", "shooting_editing", "all_in_one"].includes(formData.serviceType);

    return (
        <div className="max-w-6xl mx-auto flex gap-8">
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-8 text-accent tracking-tight">영상 제작 신청</h1>

                {/* Progress Stepper */}
                <div className="mb-12">
                    <div className="flex items-center justify-between relative">
                        {steps.map((step, index) => {
                            return (
                                <div key={step.id} className="flex items-center relative z-10">
                                    <div className="flex flex-col items-center bg-background px-4">
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-lg",
                                                step.id <= currentStep
                                                    ? "bg-primary text-white shadow-primary/30 scale-110"
                                                    : "bg-gray-200 text-gray-400"
                                            )}
                                        >
                                            {step.id < currentStep ? <Check size={20} /> : step.id}
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs mt-3 font-medium transition-colors whitespace-nowrap",
                                                step.id <= currentStep ? "text-primary" : "text-gray-400"
                                            )}
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                    {/* Line Connector */}
                                    {index < steps.length - 1 && (
                                        <div className={cn(
                                            "w-20 h-0.5 mx-2 transition-colors duration-300",
                                            step.id < currentStep ? "bg-primary" : "bg-gray-200"
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white p-8 rounded-2xl border border-border shadow-sm min-h-[400px]">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-accent">원하시는 서비스를 선택해주세요</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: "shooting", name: "촬영", icon: Camera, desc: "전문 장비 촬영" },
                                    { id: "editing", name: "편집", icon: Scissors, desc: "트렌디한 컷편집/보정" },
                                    { id: "shooting_editing", name: "촬영 + 편집", icon: Video, desc: "촬영부터 편집까지" },
                                    { id: "all_in_one", name: "올인원", icon: Layers, desc: "기획+촬영+편집+업로드" },
                                ].map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => setFormData({ ...formData, serviceType: service.id })}
                                        className={cn(
                                            "p-6 rounded-xl border transition-all text-left flex items-center space-x-4",
                                            formData.serviceType === service.id
                                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                                        )}
                                    >
                                        <div className={cn("p-3 rounded-full transition-colors", formData.serviceType === service.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500")}>
                                            <service.icon size={20} />
                                        </div>
                                        <div>
                                            <span className="block text-lg font-bold text-accent">{service.name}</span>
                                            <span className="text-sm text-muted">{service.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-semibold text-accent">세부 옵션을 선택해주세요</h2>

                            {isEditing && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-primary flex items-center"><Scissors size={18} className="mr-2" /> 편집 옵션</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setFormData({ ...formData, editingType: "cut_only" })}
                                            className={cn("p-4 rounded-xl border text-left transition-all", formData.editingType === "cut_only" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200 hover:bg-gray-50")}
                                        >
                                            <span className="block font-bold text-accent">컷편집 중심</span>
                                            <span className="text-sm text-muted">자막, 기본 컷편집 위주</span>
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, editingType: "full_edit" })}
                                            className={cn("p-4 rounded-xl border text-left transition-all", formData.editingType === "full_edit" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200 hover:bg-gray-50")}
                                        >
                                            <span className="block font-bold text-accent">풀 편집</span>
                                            <span className="text-sm text-muted">특수효과, 모션그래픽, 색보정 포함</span>
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-2">영상 길이</label>
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { id: "under_30s", label: "30초 이내" },
                                                { id: "30s_1m", label: "30초 초과 ~ 1분 이내" }
                                            ].map((dur) => (
                                                <button
                                                    key={dur.id}
                                                    onClick={() => setFormData({ ...formData, duration: dur.id })}
                                                    className={cn("px-4 py-2 rounded-full border transition-all whitespace-nowrap", formData.duration === dur.id ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
                                                >
                                                    {dur.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isShooting && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-primary flex items-center"><Camera size={18} className="mr-2" /> 촬영 옵션</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-2">촬영 장소</label>
                                        <div className="flex flex-wrap gap-3 items-center">
                                            {[
                                                { id: "studio", label: "스튜디오" },
                                                { id: "outdoor", label: "야외/로케이션" },
                                                { id: "visit", label: "방문 촬영" }
                                            ].map((loc) => (
                                                <button
                                                    key={loc.id}
                                                    onClick={() => setFormData({ ...formData, location: loc.id })}
                                                    className={cn("px-4 py-2 rounded-full border transition-all whitespace-nowrap", formData.location === loc.id ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
                                                >
                                                    {loc.label}
                                                </button>
                                            ))}

                                            {formData.location === "visit" && (
                                                <div className="flex items-center space-x-2 ml-2">
                                                    <input
                                                        type="checkbox"
                                                        id="isNonCapital"
                                                        checked={formData.isNonCapital}
                                                        onChange={(e) => setFormData({ ...formData, isNonCapital: e.target.checked })}
                                                        className="w-4 h-4 accent-primary"
                                                    />
                                                    <label htmlFor="isNonCapital" className="text-sm text-gray-600">수도권 외 지역 (+10만원)</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-2">촬영 장비</label>
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { id: "phone", label: "아이폰 (15만원)" },
                                                { id: "pro", label: "전문 카메라 (20만원)" }
                                            ].map((cam) => (
                                                <button
                                                    key={cam.id}
                                                    onClick={() => setFormData({ ...formData, camera: cam.id })}
                                                    className={cn("px-4 py-2 rounded-full border transition-all whitespace-nowrap", formData.camera === cam.id ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
                                                >
                                                    {cam.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-2">영상 형식</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {["인터뷰", "스케치 코미디", "제품 광고", "챌린지", "정보 전달", "기타"].map((fmt) => (
                                                <button
                                                    key={fmt}
                                                    onClick={() => setFormData({ ...formData, format: fmt })}
                                                    className={cn("px-4 py-2 rounded-full border transition-all whitespace-nowrap", formData.format === fmt ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
                                                >
                                                    {fmt}
                                                </button>
                                            ))}
                                        </div>
                                        {formData.format === "기타" && (
                                            <input
                                                type="text"
                                                placeholder="원하시는 형식을 입력해주세요"
                                                value={formData.formatOther}
                                                onChange={(e) => setFormData({ ...formData, formatOther: e.target.value })}
                                                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-accent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            />
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="aiSource"
                                            checked={formData.aiSource}
                                            onChange={(e) => setFormData({ ...formData, aiSource: e.target.checked })}
                                            className="w-5 h-5 accent-primary"
                                        />
                                        <label htmlFor="aiSource" className="text-gray-700">AI 소스(이미지/영상) 추가 사용</label>
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selection */}
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-medium text-accent mb-4">제작 수량</h3>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="text-xl font-bold text-accent w-12 text-center">{formData.quantity}건</span>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                    <span className="text-sm text-muted ml-2">
                                        {formData.quantity >= 5 ? "(5건 이상 대량 제작 문의는 고객센터로 연락주세요)" : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-accent">상세 요청사항을 입력해주세요</h2>

                            {formData.serviceType === "all_in_one" ? (
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-6">
                                    <p className="text-primary font-bold mb-1">✨ 올인원 서비스 신청 중</p>
                                    <p className="text-sm text-gray-600">기획부터 업로드까지 전담해드립니다. 브랜드의 방향성만 알려주세요!</p>
                                </div>
                            ) : formData.serviceType === "shooting_editing" ? (
                                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl mb-6">
                                    <p className="text-purple-600 font-bold mb-1">🎬 촬영+편집 서비스 신청 중</p>
                                    <p className="text-sm text-gray-600">준비하신 기획안을 바탕으로 제작해드립니다.</p>
                                </div>
                            ) : null}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-1">제품/서비스 정보</label>
                                    <input
                                        type="text"
                                        value={formData.productInfo}
                                        onChange={(e) => setFormData({ ...formData, productInfo: e.target.value })}
                                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-accent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="예: 다이어트 보조제, 홍대 맛집"
                                    />
                                </div>

                                {formData.serviceType === "all_in_one" ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-muted mb-1">브랜드 목표 / 타겟 고객</label>
                                            <textarea
                                                value={formData.brandGoal}
                                                onChange={(e) => setFormData({ ...formData, brandGoal: e.target.value })}
                                                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-accent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-24 resize-none"
                                                placeholder="누구에게 어떤 메시지를 전달하고 싶으신가요? (예: 20대 여성에게 신제품 인지도 확산)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted mb-1">선호하는 톤앤매너</label>
                                            <input
                                                type="text"
                                                value={formData.toneManner}
                                                onChange={(e) => setFormData({ ...formData, toneManner: e.target.value })}
                                                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-accent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                placeholder="예: 유쾌한, 감성적인, 신뢰감 있는"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-muted mb-1">
                                            {formData.serviceType === "shooting_editing" ? "촬영 콘티 / 스크립트" : "핵심 메시지 / 컨셉"}
                                        </label>
                                        <textarea
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                            className="w-full bg-white border border-gray-300 rounded-xl p-3 text-accent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-32 resize-none"
                                            placeholder={formData.serviceType === "shooting_editing"
                                                ? "촬영에 필요한 대본이나 장면 구성을 적어주세요."
                                                : "영상에서 강조하고 싶은 내용이나 원하는 분위기를 설명해주세요."}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-muted mb-1">레퍼런스 URL (선택)</label>
                                    <input
                                        type="text"
                                        value={formData.referenceUrl}
                                        onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
                                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-accent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="참고할 만한 영상 링크가 있다면 붙여넣어주세요."
                                    />
                                </div>
                            </div>
                        </div>
                    )}



                    {currentStep === 4 && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-semibold text-accent">결제 정보 확인</h2>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-accent mb-4">최종 견적서</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>서비스 종류</span>
                                        <span className="font-medium text-accent">
                                            {formData.serviceType === "shooting" && "촬영"}
                                            {formData.serviceType === "editing" && "편집"}
                                            {formData.serviceType === "shooting_editing" && "촬영 + 편집"}
                                            {formData.serviceType === "all_in_one" && "올인원"}
                                        </span>
                                    </div>

                                    {isShooting && (
                                        <>
                                            <div className="flex justify-between text-gray-500">
                                                <span>촬영 장비</span>
                                                <span className="font-medium text-accent">
                                                    {formData.camera === "phone" ? "아이폰 (+150,000원)" : "전문 카메라 (+200,000원)"}
                                                </span>
                                            </div>
                                            {formData.location === "visit" && formData.isNonCapital && (
                                                <div className="flex justify-between text-gray-500">
                                                    <span>출장비 (수도권 외)</span>
                                                    <span className="font-medium text-accent">+100,000원</span>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {isEditing && (
                                        <div className="flex justify-between text-gray-500">
                                            <span>편집 옵션 ({formData.editingType === "cut_only" ? "컷편집" : "풀편집"})</span>
                                            <span className="font-medium text-accent">
                                                {formData.editingType === "cut_only" && formData.duration === "under_30s" && "+80,000원"}
                                                {formData.editingType === "cut_only" && formData.duration === "30s_1m" && "+150,000원"}
                                                {formData.editingType === "full_edit" && formData.duration === "under_30s" && "+150,000원"}
                                                {formData.editingType === "full_edit" && formData.duration === "30s_1m" && "+250,000원"}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-gray-500">
                                        <span>제작 수량</span>
                                        <span className="font-medium text-accent">{formData.quantity}건</span>
                                    </div>

                                    <div className="border-t border-gray-200 my-4 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-accent">총 결제 금액</span>
                                        <span className="text-2xl font-bold text-primary">{estimatedPrice.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-accent mb-4 flex items-center">
                                    <Wallet className="mr-2 text-primary" size={20} />
                                    결제 및 크레딧
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                                        <span className="text-gray-600">보유 크레딧</span>
                                        <span className="text-xl font-bold text-primary">
                                            {isLoadingBalance ? "..." : creditBalance.toLocaleString()}원
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-4 rounded-lg bg-white border border-gray-200">
                                        <span className="text-gray-600">결제 예정 금액</span>
                                        <span className="text-xl font-bold text-accent">{estimatedPrice.toLocaleString()}원</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-bold text-gray-700">결제 후 잔액</span>
                                            <span className={cn(
                                                "text-xl font-bold",
                                                creditBalance - estimatedPrice >= 0 ? "text-blue-600" : "text-red-600"
                                            )}>
                                                {(creditBalance - estimatedPrice).toLocaleString()}원
                                            </span>
                                        </div>

                                        {creditBalance < estimatedPrice && (
                                            <div className="bg-red-50 border border-red-100 rounded-lg p-4 space-y-3">
                                                <div className="flex items-start text-red-600 text-sm">
                                                    <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                                    <span>
                                                        크레딧이 <strong>{(estimatedPrice - creditBalance).toLocaleString()}원</strong> 부족합니다.<br />
                                                        충전 후 주문을 완료해주세요.
                                                    </span>
                                                </div>
                                                <Button
                                                    onClick={() => setIsChargeModalOpen(true)}
                                                    className="w-full bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
                                                >
                                                    크레딧 충전하기
                                                </Button>
                                                <Button
                                                    onClick={handleTempSave}
                                                    variant="outline"
                                                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                                                >
                                                    현재 내용 임시저장
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <ChargeModal
                        isOpen={isChargeModalOpen}
                        onClose={() => setIsChargeModalOpen(false)}
                        userId={user?.id || ""}
                        onChargeComplete={fetchCreditBalance}
                    />
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        이전 단계
                    </Button>

                    {currentStep < 4 ? (
                        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                            다음 단계 <ChevronRight size={16} className="ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={creditBalance < estimatedPrice}
                            className={cn(
                                "text-white font-bold shadow-lg",
                                creditBalance < estimatedPrice
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-primary hover:bg-primary/90 shadow-primary/20"
                            )}
                        >
                            {creditBalance < estimatedPrice ? "잔액 부족" : "결제 및 주문 완료"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Sticky Estimated Price Panel */}
            <div className="w-80 hidden lg:block">
                <div className="sticky top-8 bg-white p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-accent mb-4 flex items-center">
                        <Info size={18} className="mr-2 text-primary" /> 예상 견적
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>기본 서비스</span>
                            <span className="text-accent font-medium">
                                {formData.serviceType ? "선택됨" : "-"}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>수량</span>
                            <span className="text-accent font-medium">{formData.quantity}건</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-gray-500">총 합계</span>
                            <span className="text-2xl font-bold text-primary">{estimatedPrice.toLocaleString()}원</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            * 선택한 옵션에 따라 최종 금액이 달라질 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <OrderForm />
        </Suspense>
    );
}
