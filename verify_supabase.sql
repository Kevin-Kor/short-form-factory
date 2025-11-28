-- 1️⃣ 테이블 존재 여부 확인 및 데이터 조회
-- orders 테이블 확인
SELECT * FROM orders LIMIT 10;

-- profiles 테이블 확인
SELECT * FROM profiles LIMIT 10;

-- credit_requests 테이블 확인
SELECT * FROM credit_requests LIMIT 10;

-- business_info 테이블 확인
SELECT * FROM business_info LIMIT 10;

-- 2️⃣ RLS 정책 확인 (시스템 카탈로그 조회)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('orders', 'profiles', 'credit_requests', 'business_info');

-- 정책 상세 확인
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('orders', 'profiles', 'credit_requests', 'business_info');

-- 3️⃣ (필요시) RLS 정책 추가 스크립트
-- 만약 위 조회 결과에서 정책이 없거나 RLS가 꺼져있다면 아래 쿼리를 실행하세요.

-- RLS 활성화
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.credit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_info ENABLE ROW LEVEL SECURITY;

-- 기본 읽기 정책 (테스트용: 모든 사용자 허용)
-- 주의: 실제 운영 환경에서는 더 제한적인 정책을 사용해야 합니다.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'credit_requests' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON credit_requests FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'business_info' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON business_info FOR SELECT USING (true);
    END IF;
END
$$;
