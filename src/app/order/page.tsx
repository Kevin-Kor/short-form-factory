import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { Camera, Scissors, Video, Layers } from "lucide-react";

export default function OrderIndexPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-accent">영상 제작 신청</h1>
                <p className="text-muted">원하시는 제작 방식을 선택해주세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ServiceCard
                    title="촬영"
                    description="전문 장비와 인력을 통한 고퀄리티 영상 촬영 서비스"
                    icon={Camera}
                    href="/order/new?type=shooting"
                />
                <ServiceCard
                    title="편집"
                    description="원본 영상을 트렌디한 숏폼으로 재탄생시키는 편집 서비스"
                    icon={Scissors}
                    href="/order/new?type=editing"
                />
                <ServiceCard
                    title="촬영 + 편집"
                    description="기획해주신 내용을 바탕으로 촬영부터 편집까지 깔끔하게 제작해드립니다."
                    icon={Video}
                    href="/order/new?type=shooting_editing"
                />
                <ServiceCard
                    title="올인원"
                    description="기획부터 촬영, 편집, 업로드까지! 전담 PD가 알아서 다 해드립니다."
                    icon={Layers}
                    href="/order/new?type=all_in_one"
                    badge="추천"
                />
            </div>
        </div>
    );
}
