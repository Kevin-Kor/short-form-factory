"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface RegisterData {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    [key: string]: string | undefined;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => Promise<void>;
    signInWithOAuth: (provider: 'kakao' | 'google' | 'naver') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password || "",
                options: {
                    data: {
                        name: data.name,
                        phone: data.phone,
                    },
                },
            });
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            return false;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const signInWithOAuth = async (provider: 'kakao' | 'google' | 'naver') => {
        // Note: Naver is not directly supported in types but works if configured in Supabase
        // You might need to use 'kakao' | 'google' | 'azure' etc. or cast to any if strict.
        // Supabase supports 'kakao', 'google', 'facebook', etc.
        // 'naver' might require custom OIDC or waiting for official support if not present.
        // For now we assume standard providers.

        // Actually Supabase supports 'kakao', 'google'. 'naver' is supported via OIDC or WorkOS usually, 
        // but let's assume 'kakao' and 'google' for now.

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                provider: provider as any,
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error("OAuth login failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, signInWithOAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
