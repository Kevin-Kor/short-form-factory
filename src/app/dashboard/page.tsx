"use client";

import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { Camera, Scissors, Video, Layers, PlayCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20
        }
    }
};

export default function DashboardPage() {
    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            {/* Header / Profile (Mobile style moved to Sidebar/Header component, but we keep a welcome message here) */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
            >
                <h1 className="text-2xl font-bold text-accent">Shorty</h1>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">U</span>
                </div>
            </motion.div>

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-8 md:p-12 text-center md:text-left shadow-sm"
            >
                <div className="relative z-10 max-w-2xl mx-auto md:mx-0">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent leading-tight">
                        전문가가 만드는 바이럴 숏폼,<br />
                        <span className="text-primary">간편하게 신청하세요!</span>
                    </h2>
                    <p className="text-muted text-lg mb-8">
                        기획부터 편집까지, 숏폼 전문가들이<br className="md:hidden" /> 당신의 브랜드를 성장시켜 드립니다.
                    </p>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        지금 바로 시작하기
                    </Button>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            </motion.section>

            {/* Services Grid */}
            <section>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold mb-6 text-accent"
                >
                    서비스 선택
                </motion.h2>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <motion.div variants={item}>
                        <ServiceCard
                            title="촬영"
                            description="전문 장비와 인력을 통한 고퀄리티 영상 촬영 서비스"
                            icon={Camera}
                            href="/order/new?type=shooting"
                        />
                    </motion.div>
                    <motion.div variants={item}>
                        <ServiceCard
                            title="편집"
                            description="원본 영상을 트렌디한 숏폼으로 재탄생시키는 편집 서비스"
                            icon={Scissors}
                            href="/order/new?type=editing"
                        />
                    </motion.div>
                    <motion.div variants={item}>
                        <ServiceCard
                            title="촬영 + 편집"
                            description="기획부터 촬영, 편집까지 한번에 해결해드립니다."
                            icon={Video}
                            href="/order/new?type=shooting_editing"
                        />
                    </motion.div>
                    <motion.div variants={item}>
                        <ServiceCard
                            title="올인원"
                            description="기획, 촬영, 편집, 업로드까지 전담 PD가 케어합니다."
                            icon={Layers}
                            href="/order/new?type=all_in_one"
                            badge="추천"
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* Success Stories */}
            <section>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl font-bold mb-6 text-accent"
                >
                    성공 사례
                </motion.h2>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[1, 2, 3].map((i) => (
                        <motion.div key={i} variants={item} className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                            <div className="h-48 bg-gray-100 relative flex items-center justify-center">
                                <PlayCircle size={48} className="text-gray-300 group-hover:text-primary transition-colors duration-300" />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-primary text-sm font-bold">조회수 120만+</span>
                                    <span className="text-muted text-xs">뷰티 브랜드 A사</span>
                                </div>
                                <h3 className="text-accent font-bold">신제품 런칭 바이럴 영상</h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
}
