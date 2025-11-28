"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Upload, Camera, Scissors, Video, Layers, Info } from "lucide-react";

const steps = [
    { id: 1, name: "서비스 선택" },
    { id: 2, name: "세부 옵션" },
    { id: 3, name: "상세 요청" },
    { id: 4, name: "파일 업로드" },
    { id: 5, name: "결제" },
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
        details: "",
        files: [],
    });

    const [estimatedPrice, setEstimatedPrice] = useState(0);

    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const type = params.get("type");
        if (type) {
            setFormData(prev => ({ ...prev, serviceType: type }));
        }
    }, [searchParams]);

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

        setEstimatedPrice(price);
    }, [formData]);


    const { user } = useAuth(); // Get user from auth context

    const handleNext = async () => {
        if (currentStep < 5) {
            // Skip file upload step for shooting-only service
            if (currentStep === 3 && formData.serviceType === "shooting") {
                setCurrentStep(5);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } else {
            // Submit Order
            try {
                const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, userId: user?.id }), // Add userId
                });

                if (res.ok) {
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
        if (currentStep === 5 && isShooting) {
            setCurrentStep(3);
        } else {
            setCurrentStep((prev) => Math.max(prev - 1, 1));
        }
    };

    const isShooting = ["shooting", "shooting_editing", "all_in_one"].includes(formData.serviceType);
    const isEditing = ["editing", "shooting_editing", "all_in_one"].includes(formData.serviceType);

    return (
        <div className="max-w-6xl mx-auto flex gap-8">
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">영상 제작 신청</h1>

                {/* Progress Stepper */}
                <div className="mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-800 -z-10" />
                        {steps.map((step) => {
                            // Hide File Upload step in stepper for Shooting services
                            if (isShooting && step.id === 4) return null;

                            return (
                                <div key={step.id} className="flex flex-col items-center bg-background px-2">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-lg",
                                            step.id <= currentStep
                                                ? "bg-primary text-white shadow-primary/30 scale-110"
                                                : "bg-gray-800 text-gray-500"
                                        )}
                                    >
                                        {step.id < currentStep ? <Check size={20} /> : step.id}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-xs mt-3 font-medium transition-colors",
                                            step.id <= currentStep ? "text-primary" : "text-gray-500"
                                        )}
                                    >
                                        {step.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-surface/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-xl min-h-[400px]">
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">원하시는 서비스를 선택해주세요</h2>
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
                                            "p-6 rounded-lg border-2 transition-all text-left flex items-center space-x-4",
                                            formData.serviceType === service.id
                                                ? "border-primary bg-primary/10"
                                                : "border-gray-700 hover:border-gray-500"
                                        )}
                                    >
                                        <div className={cn("p-3 rounded-full", formData.serviceType === service.id ? "bg-primary text-white" : "bg-gray-800 text-gray-400")}>
                                            <service.icon size={24} />
                                        </div>
                                        <div>
                                            <span className="block text-lg font-bold text-white">{service.name}</span>
                                            <span className="text-sm text-gray-400">{service.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-semibold text-white">세부 옵션을 선택해주세요</h2>

                            {isEditing && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-primary flex items-center"><Scissors size={18} className="mr-2" /> 편집 옵션</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setFormData({ ...formData, editingType: "cut_only" })}
                                            className={cn("p-4 rounded-lg border-2 text-left", formData.editingType === "cut_only" ? "border-primary bg-primary/10" : "border-gray-700")}
                                        >
                                            <span className="block font-bold text-white">컷편집 중심</span>
                                            <span className="text-sm text-gray-400">자막, 기본 컷편집 위주</span>
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, editingType: "full_edit" })}
                                            className={cn("p-4 rounded-lg border-2 text-left", formData.editingType === "full_edit" ? "border-primary bg-primary/10" : "border-gray-700")}
                                        >
                                            <span className="block font-bold text-white">풀 편집</span>
                                            <span className="text-sm text-gray-400">특수효과, 모션그래픽, 색보정 포함</span>
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">영상 길이</label>
                                        <div className="flex space-x-4">
                                            {[
                                                { id: "under_30s", label: "30초 이내" },
                                                { id: "30s_1m", label: "30초 초과 ~ 1분 이내" }
                                            ].map((dur) => (
                                                <button
                                                    key={dur.id}
                                                    onClick={() => setFormData({ ...formData, duration: dur.id })}
                                                    className={cn("px-4 py-2 rounded-full border", formData.duration === dur.id ? "bg-white text-black border-white" : "border-gray-600 text-gray-400")}
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
                                        <label className="block text-sm font-medium text-gray-400 mb-2">촬영 장소</label>
                                        <div className="flex flex-wrap gap-4 items-center">
                                            {[
                                                { id: "studio", label: "스튜디오" },
                                                { id: "outdoor", label: "야외/로케이션" },
                                                { id: "visit", label: "방문 촬영" }
                                            ].map((loc) => (
                                                <button
                                                    key={loc.id}
                                                    onClick={() => setFormData({ ...formData, location: loc.id })}
                                                    className={cn("px-4 py-2 rounded-full border", formData.location === loc.id ? "bg-white text-black border-white" : "border-gray-600 text-gray-400")}
                                                >
                                                    {loc.label}
                                                </button>
                                            ))}

                                            {formData.location === "visit" && (
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <input
                                                        type="checkbox"
                                                        id="isNonCapital"
                                                        checked={formData.isNonCapital}
                                                        onChange={(e) => setFormData({ ...formData, isNonCapital: e.target.checked })}
                                                        className="w-4 h-4 accent-primary"
                                                    />
                                                    <label htmlFor="isNonCapital" className="text-sm text-gray-300">수도권 외 지역 (+10만원)</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">촬영 장비</label>
                                        <div className="flex space-x-4">
                                            {[
                                                { id: "phone", label: "아이폰 (15만원)" },
                                                { id: "pro", label: "전문 카메라 (20만원)" }
                                            ].map((cam) => (
                                                <button
                                                    key={cam.id}
                                                    onClick={() => setFormData({ ...formData, camera: cam.id })}
                                                    className={cn("px-4 py-2 rounded-full border", formData.camera === cam.id ? "bg-white text-black border-white" : "border-gray-600 text-gray-400")}
                                                >
                                                    {cam.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">영상 형식</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {["인터뷰", "스케치 코미디", "제품 광고", "챌린지", "정보 전달", "기타"].map((fmt) => (
                                                <button
                                                    key={fmt}
                                                    onClick={() => setFormData({ ...formData, format: fmt })}
                                                    className={cn("px-4 py-2 rounded-full border", formData.format === fmt ? "bg-white text-black border-white" : "border-gray-600 text-gray-400")}
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
                                                className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-primary"
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
                                        <label htmlFor="aiSource" className="text-white">AI 소스(이미지/영상) 추가 사용</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">상세 요청사항을 입력해주세요</h2>

                            {formData.serviceType === "all_in_one" ? (
                                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-6">
                                    <p className="text-primary font-bold mb-1">✨ 올인원 서비스 신청 중</p>
                                    <p className="text-sm text-gray-300">기획부터 업로드까지 전담해드립니다. 브랜드의 방향성만 알려주세요!</p>
                                </div>
                            ) : formData.serviceType === "shooting_editing" ? (
                                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-6">
                                    <p className="text-purple-400 font-bold mb-1">🎬 촬영+편집 서비스 신청 중</p>
                                    <p className="text-sm text-gray-300">준비하신 기획안을 바탕으로 제작해드립니다.</p>
                                </div>
                            ) : null}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">제품/서비스 정보</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-primary"
                                        placeholder="예: 다이어트 보조제, 홍대 맛집"
                                    />
                                </div>

                                {formData.serviceType === "all_in_one" ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">브랜드 목표 / 타겟 고객</label>
                                            <textarea
                                                className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-primary h-24"
                                                placeholder="누구에게 어떤 메시지를 전달하고 싶으신가요? (예: 20대 여성에게 신제품 인지도 확산)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">선호하는 톤앤매너</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-primary"
                                                placeholder="예: 유쾌한, 감성적인, 신뢰감 있는"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            {formData.serviceType === "shooting_editing" ? "촬영 콘티 / 스크립트" : "핵심 메시지 / 컨셉"}
                                        </label>
                                        <textarea
                                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-primary h-32"
                                            placeholder={formData.serviceType === "shooting_editing"
                                                ? "촬영에 필요한 대본이나 장면 구성을 적어주세요."
                                                : "영상에서 강조하고 싶은 내용이나 원하는 분위기를 설명해주세요."}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">레퍼런스 URL (선택)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-primary"
                                        placeholder="참고할 만한 영상 링크가 있다면 붙여넣어주세요."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white">소스 파일을 업로드해주세요</h2>
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-gray-800/50">
                                <Upload size={48} className="mb-4" />
                                <p className="text-lg font-medium">드래그 앤 드롭 또는 클릭하여 업로드</p>
                                <p className="text-sm mt-2 opacity-70">영상, 이미지, 로고 파일 등 (최대 500MB)</p>
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-semibold text-white">결제 정보 확인</h2>

                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4">최종 견적서</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-300">
                                        <span>서비스 종류</span>
                                        <span className="font-medium text-white">
                                            {formData.serviceType === "shooting" && "촬영"}
                                            {formData.serviceType === "editing" && "편집"}
                                            {formData.serviceType === "shooting_editing" && "촬영 + 편집"}
                                            {formData.serviceType === "all_in_one" && "올인원"}
                                        </span>
                                    </div>

                                    {isShooting && (
                                        <>
                                            <div className="flex justify-between text-gray-300">
                                                <span>촬영 장비</span>
                                                <span className="font-medium text-white">
                                                    {formData.camera === "phone" ? "아이폰 (+150,000원)" : "전문 카메라 (+200,000원)"}
                                                </span>
                                            </div>
                                            {formData.location === "visit" && formData.isNonCapital && (
                                                <div className="flex justify-between text-gray-300">
                                                    <span>출장비 (수도권 외)</span>
                                                    <span className="font-medium text-white">+100,000원</span>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {isEditing && (
                                        <div className="flex justify-between text-gray-300">
                                            <span>편집 옵션 ({formData.editingType === "cut_only" ? "컷편집" : "풀편집"})</span>
                                            <span className="font-medium text-white">
                                                {formData.editingType === "cut_only" && formData.duration === "under_30s" && "+80,000원"}
                                                {formData.editingType === "cut_only" && formData.duration === "30s_1m" && "+150,000원"}
                                                {formData.editingType === "full_edit" && formData.duration === "under_30s" && "+150,000원"}
                                                {formData.editingType === "full_edit" && formData.duration === "30s_1m" && "+250,000원"}
                                            </span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-600 my-4 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-white">총 결제 금액</span>
                                        <span className="text-2xl font-bold text-primary">{estimatedPrice.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-4">입금 계좌 안내</h3>
                                <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                            KB
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">국민은행</p>
                                            <p className="text-lg font-bold text-white">1234-56-789012</p>
                                            <p className="text-sm text-gray-400">예금주: 숏폼팩토리</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="text-xs">복사하기</Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">
                                    * 입금 확인 후 담당자가 배정되며 제작이 시작됩니다.<br />
                                    * 세금계산서 발행을 원하시면 고객센터로 문의해주세요.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="border-gray-600 text-white hover:bg-gray-800"
                    >
                        이전 단계
                    </Button>

                    {currentStep < 5 ? (
                        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white">
                            다음 단계 <ChevronRight size={16} className="ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-black font-bold">
                            입금 완료 신청
                        </Button>
                    )}
                </div>
            </div>

            {/* Sticky Estimated Price Panel */}
            <div className="w-80 hidden lg:block">
                <div className="sticky top-8 bg-surface p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Info size={18} className="mr-2 text-primary" /> 예상 견적
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>기본 서비스</span>
                            <span className="text-white font-medium">
                                {formData.serviceType ? "선택됨" : "-"}
                            </span>
                        </div>
                        <div className="h-px bg-gray-700" />
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-gray-400">총 합계</span>
                            <span className="text-2xl font-bold text-primary">{estimatedPrice.toLocaleString()}원</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
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
