"use client";

import { useState } from "react";
import { X, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface ChargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userEmail: string;
    onChargeComplete: () => void;
}

const TIERS = [
    { id: "tier1", amount: 500000, bonus: 30000, label: "Starter" },
    { id: "tier2", amount: 1000000, bonus: 100000, label: "Pro", popular: true },
    { id: "tier3", amount: 2000000, bonus: 250000, label: "Business" },
];

export function ChargeModal({ isOpen, onClose, userId, userEmail, onChargeComplete }: ChargeModalProps) {
    const [selectedTier, setSelectedTier] = useState<string | null>("tier2");
    const [customAmount, setCustomAmount] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [depositorName, setDepositorName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleCopyAccount = () => {
        navigator.clipboard.writeText("1234-56-789012");
        alert("계좌번호가 복사되었습니다.");
    };

    const handleSubmit = async () => {
        if (!depositorName) {
            alert("입금자명을 입력해주세요.");
            return;
        }

        let finalAmount = 0;
        let finalBonus = 0;

        if (isCustom) {
            finalAmount = parseInt(customAmount.replace(/,/g, ""), 10);
            if (isNaN(finalAmount) || finalAmount < 10000) {
                alert("최소 충전 금액은 10,000원입니다.");
                return;
            }
        } else {
            const tier = TIERS.find(t => t.id === selectedTier);
            if (tier) {
                finalAmount = tier.amount;
                finalBonus = tier.bonus;
            }
        }

        setIsSubmitting(true);

        try {
            // 1. Create Credit Request
            const { error } = await supabase
                .from('credit_requests')
                .insert({
                    user_id: userId,
                    amount: finalAmount, // Bonus is applied by admin upon approval
                    depositor_name: depositorName,
                    status: 'pending'
                });

            if (error) throw error;

            alert("충전 신청이 완료되었습니다! 입금 확인 후 크레딧이 반영됩니다.");
            onChargeComplete();
            onClose();
        } catch (error) {
            console.error("Error requesting credit:", error);
            alert("충전 신청 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalAmount = isCustom
        ? parseInt(customAmount.replace(/,/g, "") || "0", 10)
        : (TIERS.find(t => t.id === selectedTier)?.amount || 0);

    const bonusAmount = isCustom
        ? 0
        : (TIERS.find(t => t.id === selectedTier)?.bonus || 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-accent">크레딧 충전</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Pricing Tiers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {TIERS.map((tier) => (
                            <button
                                key={tier.id}
                                onClick={() => { setSelectedTier(tier.id); setIsCustom(false); }}
                                className={cn(
                                    "relative p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                                    !isCustom && selectedTier === tier.id
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-gray-100 bg-white"
                                )}
                            >
                                {tier.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                        MOST POPULAR
                                    </span>
                                )}
                                <div className="mb-2">
                                    <span className="text-sm font-medium text-gray-500">{tier.label}</span>
                                    <div className="text-lg font-bold text-accent">{tier.amount.toLocaleString()}원</div>
                                </div>
                                <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full inline-block">
                                    +{tier.bonus.toLocaleString()}원 추가 지급
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Direct Input */}
                    <button
                        onClick={() => { setIsCustom(true); setSelectedTier(null); }}
                        className={cn(
                            "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                            isCustom
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-gray-100 hover:border-gray-200"
                        )}
                    >
                        <span className="font-bold text-accent">직접 입력</span>
                        {isCustom ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={customAmount}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        setCustomAmount(val ? parseInt(val).toLocaleString() : "");
                                    }}
                                    className="w-32 text-right bg-transparent border-b border-primary focus:outline-none font-bold text-lg"
                                    placeholder="0"
                                    autoFocus
                                />
                                <span className="ml-1 text-accent">원</span>
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm">원하는 금액 충전하기</span>
                        )}
                    </button>

                    {/* Summary & Bank Info */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                            <span className="text-gray-600">총 충전 금액</span>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()}원</div>
                                {bonusAmount > 0 && (
                                    <div className="text-sm text-green-600 font-medium">
                                        (+{bonusAmount.toLocaleString()}원 보너스 적립 예정)
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-600">입금자명</label>
                            <input
                                type="text"
                                value={depositorName}
                                onChange={(e) => setDepositorName(e.target.value)}
                                placeholder="입금하시는 분 성함을 입력해주세요"
                                className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">입금 계좌 (국민은행)</div>
                                <div className="font-bold text-accent text-lg">1234-56-789012</div>
                                <div className="text-xs text-gray-400">예금주: 숏폼팩토리</div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleCopyAccount} className="h-8 text-xs">
                                <Copy size={12} className="mr-1" /> 복사
                            </Button>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || totalAmount === 0 || !depositorName}
                        className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? "신청 중..." : "충전 신청하기"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
