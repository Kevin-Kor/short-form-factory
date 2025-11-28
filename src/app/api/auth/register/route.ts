/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, phone } = body;

        // Mock validation
        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { error: "모든 필드를 입력해주세요." },
                { status: 400 }
            );
        }

        // Simulate DB save
        // In a real app, you would save the user to the database here.
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            phone
        };

        return NextResponse.json({ user: newUser }, { status: 201 });

    } catch (_error) {
        return NextResponse.json(
            { error: "회원가입 처리 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
