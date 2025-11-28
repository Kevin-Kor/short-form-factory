import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    badge?: string;
}

export function ServiceCard({ title, description, icon: Icon, href, badge }: ServiceCardProps) {
    return (
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-primary group-hover:scale-110 transition-transform duration-300")}>
                    <Icon size={24} />
                </div>
                {badge && (
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        {badge}
                    </span>
                )}
            </div>

            <h3 className="text-xl font-bold text-accent mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted text-sm mb-6 flex-1 leading-relaxed">{description}</p>

            <Link href={href} className="w-full">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-xl py-5 font-bold">
                    신청하기
                </Button>
            </Link>
        </div>
    );
}
