/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client for API route (using service role if needed, but anon is fine for now if RLS allows)
// Ideally use a server-side client helper, but for now we use the basic client.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nqqjcykjvhmybemmtufa.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcWpjeWtqdmhteWJlbW10dWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzAzOTAsImV4cCI6MjA3OTkwNjM5MH0.Np_Co31N6Qxdmx8qJ0NS3IZHsYp8CPzqxkXChPFIgMQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.userId) {
            return NextResponse.json(
                { error: "로그인이 필요합니다." },
                { status: 401 }
            );
        }

        // Insert into Supabase
        // Note: We do NOT use .select() here because the anon client might not have permission 
        // to SELECT the row it just inserted depending on RLS policies (auth.uid() is null).
        const { error } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: body.userId,
                    service_type: body.serviceType,
                    details: body,
                    status: 'pending',
                    amount: 0
                }
            ]);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: "주문이 성공적으로 접수되었습니다."
        }, { status: 201 });

    } catch (error) {
        console.error("Order error", error);
        return NextResponse.json(
            { error: "주문 처리 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
