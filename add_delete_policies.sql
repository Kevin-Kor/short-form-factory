-- 관리자에게 삭제(DELETE) 권한 부여
-- 관리자 이메일: manyd950222@gmail.com

-- 1. orders 테이블 삭제 권한
CREATE POLICY "Admins can delete orders" ON orders
FOR DELETE
USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

-- 2. credit_requests 테이블 삭제 권한
CREATE POLICY "Admins can delete credit_requests" ON credit_requests
FOR DELETE
USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

-- 3. business_info 테이블 삭제 권한
CREATE POLICY "Admins can delete business_info" ON business_info
FOR DELETE
USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');

-- 4. profiles 테이블 삭제 권한 (주의: 연관된 데이터가 있으면 에러가 날 수 있음 - CASCADE 설정 필요할 수 있음)
-- profiles는 보통 함부로 삭제하지 않지만, 테스트 유저 삭제를 위해 추가합니다.
CREATE POLICY "Admins can delete profiles" ON profiles
FOR DELETE
USING (auth.jwt() ->> 'email' = 'manyd950222@gmail.com');
