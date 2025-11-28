/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Mock validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "이메일과 비밀번호를 입력해주세요." },
                { status: 400 }
            );
        }

        // Simulate DB check
        // In a real app, you would check the database here.
        // For demo purposes, we accept any password.
        const user = {
            id: "1",
            name: "김대표", // Mock name
            email: email,
        };
        return NextResponse.json({ user });

    } catch (_error) {
        return NextResponse.json(
            { error: "로그인 처리 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
