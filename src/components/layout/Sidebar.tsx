"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Video,
    FolderOpen,
    Download,
    CreditCard,
    MessageSquare,
    Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = "manyd950222@gmail.com"; // Admin email constant

export function Sidebar() {
    const pathname = usePathname();
    const { user, isLoggedIn, logout } = useAuth();

    const isAdmin = user?.email === ADMIN_EMAIL;

    const navItems = [
        { name: "대시보드", href: "/dashboard", icon: LayoutDashboard },
        { name: "영상 제작", href: "/order", icon: Video },
        { name: "내 콘텐츠", href: "/content", icon: FolderOpen },
        { name: "리소스", href: "/resources", icon: Download },
        { name: "결제 관리", href: "/payment", icon: CreditCard },
        { name: "고객 지원", href: "/support", icon: MessageSquare },
    ];

    if (isAdmin) {
        navItems.push({ name: "관리자", href: "/admin", icon: Settings });
    }

    return (
        <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0 hidden md:flex">
            <div className="p-6 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight">Shortform Factory</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary font-bold"
                                    : "text-muted hover:bg-gray-100 hover:text-accent"
                            )}
                        >
                            <item.icon size={20} className={cn(
                                "transition-colors",
                                isActive ? "text-primary" : "text-muted group-hover:text-accent"
                            )} />
                            <span className="font-medium">{item.name}</span>
                            {item.name === "리소스" && (
                                <span className="ml-auto px-2.5 py-1 bg-accent/90 text-black text-[10px] font-extrabold rounded-full whitespace-nowrap shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse relative z-10 tracking-tight">
                                    FREE 1000+
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                {isLoggedIn && user ? (
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors group">
                        <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">{(user.user_metadata?.name || user.email || "U")[0].toUpperCase()}</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-accent">{user.user_metadata?.name || user.email?.split('@')[0]}</p>
                                <p className="text-xs text-muted truncate w-24">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-xs text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <Link href="/login">
                        <div className="w-full bg-primary text-white rounded-xl py-3 flex items-center justify-center font-bold hover:bg-primary/90 transition-all duration-300 cursor-pointer shadow-sm">
                            로그인 / 회원가입
                        </div>
                    </Link>
                )}
            </div>
        </aside>
    );
}
