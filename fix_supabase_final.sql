-- 1️⃣ 기존 정책 삭제 (에러 방지)
-- 이미 정책이 있다면 삭제하고 다시 만듭니다.
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all credit_requests" ON credit_requests;
DROP POLICY IF EXISTS "Admins can view all business_info" ON business_info;

-- 2️⃣ 관리자 읽기 정책 다시 생성
-- 관리자 이메일: manyd950222@gmail.com
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

CREATE POLICY "Admins can view all credit_requests" ON credit_requests
FOR SELECT USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

CREATE POLICY "Admins can view all business_info" ON business_info
FOR SELECT USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

-- 3️⃣ RLS (보안) 활성화
-- 에러가 나더라도 무시하고 진행되도록 각각 실행됩니다.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
