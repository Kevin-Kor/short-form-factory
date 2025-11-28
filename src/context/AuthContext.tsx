"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User, AuthError } from "@supabase/supabase-js";

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
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: AuthError | null }>;
    logout: () => Promise<void>;
    signInWithOAuth: (provider: 'kakao' | 'google' | 'naver') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const initSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error("Error checking session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initSession();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false); // Ensure loading is false after any auth change
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
            return { success: true };
        } catch (error) {
            console.error("Registration failed", error);
            return { success: false, error: error as AuthError };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const signInWithOAuth = async (provider: 'kakao' | 'google' | 'naver') => {
        try {
            const options: { redirectTo: string; queryParams?: { scope: string } } = {
                redirectTo: `${window.location.origin}/dashboard`,
            };

            // 카카오는 queryParams로 scope를 완전히 override
            if (provider === 'kakao') {
                options.queryParams = {
                    scope: 'profile_nickname profile_image',
                };
            }

            const { error } = await supabase.auth.signInWithOAuth({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                provider: provider as any,
                options,
            });
            if (error) throw error;
        } catch (error) {
            console.error("OAuth login failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, register, logout, signInWithOAuth }}>
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
