import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { Camera, Scissors, Video, Layers } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-secondary p-10 text-white">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-bold mb-4">
                        전문가가 만드는 바이럴 숏폼, <br />
                        간편하게 신청하세요! 🎬
                    </h1>
                    <p className="text-lg opacity-90 mb-8">
                        기획부터 편집까지, 숏폼 전문가들이 당신의 브랜드를 성장시켜 드립니다.
                    </p>
                    <button className="bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                        지금 바로 시작하기
                    </button>
                </div>
                {/* Abstract shapes or image could go here */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            </section>

            {/* Services Grid */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-white">서비스 선택</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ServiceCard
                        title="촬영"
                        description="전문 장비와 인력을 통한 고퀄리티 영상 촬영 서비스"
                        icon={Camera}
                        href="/order/new?type=shooting"
                        color="bg-blue-600"
                    />
                    <ServiceCard
                        title="편집"
                        description="원본 영상을 트렌디한 숏폼으로 재탄생시키는 편집 서비스"
                        icon={Scissors}
                        href="/order/new?type=editing"
                        color="bg-pink-600"
                    />
                    <ServiceCard
                        title="촬영 + 편집"
                        description="기획해주신 내용을 바탕으로 촬영부터 편집까지 깔끔하게 제작해드립니다."
                        icon={Video}
                        href="/order/new?type=shooting_editing"
                        color="bg-purple-600"
                    />
                    <ServiceCard
                        title="올인원"
                        description="기획부터 촬영, 편집, 업로드까지! 전담 PD가 알아서 다 해드립니다."
                        icon={Layers}
                        href="/order/new?type=all_in_one"
                        color="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
                        badge="추천"
                    />
                </div>
            </section>

            {/* Success Stories */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-white">성공 사례</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-surface rounded-xl overflow-hidden border border-gray-700">
                            <div className="h-48 bg-gray-800 relative group">
                                {/* Placeholder for video thumbnail */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                    Video Thumbnail {i}
                                </div>
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium">재생하기</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-accent text-sm font-bold">조회수 120만+</span>
                                    <span className="text-gray-400 text-xs">뷰티 브랜드 A사</span>
                                </div>
                                <h3 className="text-white font-medium">신제품 런칭 바이럴 영상</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
