-- 1️⃣ orders 테이블에 대한 INSERT 정책 추가
-- API Route가 anon 키를 사용하므로, 누구나(public) insert 할 수 있게 허용합니다.
-- 단, user_id가 profiles 테이블에 존재해야만 성공합니다 (Foreign Key 제약조건 덕분).
CREATE POLICY "Enable insert for all users" ON orders
FOR INSERT
WITH CHECK (true);

-- 2️⃣ orders 테이블에 대한 SELECT 정책 추가 (본인 주문 확인용)
-- 로그인한 유저는 자신의 주문만 볼 수 있습니다.
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT
USING (auth.uid() = user_id);

-- 3️⃣ (혹시 모르니) RLS 활성화 확인
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
