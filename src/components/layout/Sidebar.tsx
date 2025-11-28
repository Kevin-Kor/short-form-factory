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
    MessageCircle,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navigation = [
    { name: "대시보드", href: "/dashboard", icon: LayoutDashboard },
    { name: "영상 제작", href: "/order", icon: Video },
    { name: "내 콘텐츠", href: "/content", icon: FolderOpen },
    { name: "리소스", href: "/resources", icon: Download },
    { name: "결제 관리", href: "/payment", icon: CreditCard },
    { name: "고객 지원", href: "/support", icon: MessageCircle },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { user, isLoggedIn, logout } = useAuth();

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-md text-white shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-72 bg-surface/95 backdrop-blur-xl border-r border-gray-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-24 flex items-center px-8 border-b border-gray-800 bg-gradient-to-r from-surface to-surface/50">
                        <h1 className="text-3xl font-black italic bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent tracking-tighter">
                            SHORT FORM<br />FACTORY
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-5 py-4 text-sm font-medium rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? "bg-primary/20 text-white shadow-lg shadow-primary/10 border border-primary/20"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white hover:shadow-md"
                                    )}
                                >
                                    <div className={cn("absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity duration-300", isActive ? "opacity-100" : "group-hover:opacity-100")} />

                                    <div className="flex items-center relative z-10">
                                        <item.icon className={cn("mr-4 h-5 w-5 transition-colors duration-300", isActive ? "text-primary" : "group-hover:text-primary")} />
                                        <span className="whitespace-nowrap">{item.name}</span>
                                    </div>

                                    {item.name === "리소스" && (
                                        <span className="ml-2 px-2.5 py-1 bg-accent/90 text-black text-[10px] font-extrabold rounded-full whitespace-nowrap shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse relative z-10 tracking-tight">
                                            FREE 1000+
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Footer */}
                    <div className="p-4 border-t border-gray-800 bg-surface/50">
                        {isLoggedIn && user ? (
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                                        <span className="text-xs font-bold text-white">{(user.user_metadata?.name || user.email || "U")[0].toUpperCase()}</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-bold text-white">{user.user_metadata?.name || user.email?.split('@')[0]}</p>
                                        <p className="text-xs text-gray-400 truncate w-24">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-xs text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <div className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-xl py-3 flex items-center justify-center font-bold transition-all duration-300 cursor-pointer">
                                    로그인 / 회원가입
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
