-- 1️⃣ 프로필 데이터 복구 (Backfill)
-- auth.users에는 있지만 public.profiles에는 없는 유저들을 복사합니다.
INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'avatar_url',
  created_at,
  created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 2️⃣ 트리거 재설정 (앞으로 가입할 유저들을 위해)
-- 함수 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- 기존 트리거 삭제 후 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3️⃣ 데이터 확인
SELECT count(*) as "복구된_프로필_수" FROM public.profiles;
