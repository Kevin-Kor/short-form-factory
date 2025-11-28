"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Grid, FileText, User } from "lucide-react";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "홈", href: "/dashboard", icon: Home },
        { name: "서비스", href: "/order", icon: Grid },
        { name: "내 콘텐츠", href: "/content", icon: FileText },
        { name: "마이", href: "/payment", icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-primary" : "text-muted hover:text-accent"
                            )}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
