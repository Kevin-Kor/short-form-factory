-- 관리자에게 수정(UPDATE) 권한 부여
-- 관리자 이메일: manyd950222@gmail.com

-- 1. profiles 테이블 수정 권한 (크레딧 잔액 수정 등)
CREATE POLICY "Admins can update profiles" ON profiles
FOR UPDATE
USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

-- 2. credit_requests 테이블 수정 권한 (승인/거절 상태 변경 등)
CREATE POLICY "Admins can update credit_requests" ON credit_requests
FOR UPDATE
USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

-- 3. business_info 테이블 수정 권한
CREATE POLICY "Admins can update business_info" ON business_info
FOR UPDATE
USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

-- 4. orders 테이블 수정 권한 (상태 변경 등)
CREATE POLICY "Admins can update orders" ON orders
FOR UPDATE
USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');
