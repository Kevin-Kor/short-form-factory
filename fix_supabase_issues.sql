-- 1️⃣ RLS (Row Level Security) 정책 추가
-- 관리자 이메일: manyd950222@gmail.com

-- orders 테이블: 관리자는 모든 데이터 읽기 가능
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT
USING (
    auth.jwt() ->> 'email' = 'manyd950222@gmail.com'
);

-- profiles 테이블: 관리자는 모든 프로필 읽기 가능
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT
USING (
    auth.jwt() ->> 'email' = 'manyd950222@gmail.com'
);

-- credit_requests 테이블: 관리자는 모든 요청 읽기 가능
CREATE POLICY "Admins can view all credit_requests" ON credit_requests
FOR SELECT
USING (
    auth.jwt() ->> 'email' = 'manyd950222@gmail.com'
);

-- business_info 테이블: 관리자는 모든 정보 읽기 가능
CREATE POLICY "Admins can view all business_info" ON business_info
FOR SELECT
USING (
    auth.jwt() ->> 'email' = 'manyd950222@gmail.com'
);

-- 2️⃣ 외래 키 (Foreign Key) 관계 설정
-- orders 테이블의 user_id가 profiles 테이블의 id를 참조하도록 설정
-- (이미 설정되어 있다면 에러가 날 수 있으니, 에러가 나면 무시하셔도 됩니다)
ALTER TABLE orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id);

-- 3️⃣ (선택사항) RLS 활성화 확인
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
