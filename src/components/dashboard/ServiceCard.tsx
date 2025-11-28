import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
    badge?: string;
}

export function ServiceCard({ title, description, icon: Icon, href, color, badge }: ServiceCardProps) {
    return (
        <div className={cn(
            "bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col h-full",
            badge ? "border-primary/50 shadow-primary/5" : "border-gray-800 hover:border-primary/50 hover:shadow-primary/10"
        )}>
            {badge && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-lg z-10">
                    {badge}
                </div>
            )}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${color} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed flex-1">
                {description}
            </p>
            <Link href={href} className="mt-auto w-full">
                <Button variant="outline" className={cn(
                    "w-full transition-all duration-300 font-semibold py-6",
                    badge
                        ? "bg-primary text-white border-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-primary hover:border-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
                )}>
                    신청하기
                </Button>
            </Link>
        </div>
    );
}
