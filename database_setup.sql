-- Chạy đoạn mã này trong phần SQL Editor của Supabase để tạo các bảng lưu trữ dữ liệu
-- (Nếu bạn đã chạy trước đó, nó sẽ tự động bỏ qua nhờ lệnh IF NOT EXISTS, 
-- và cập nhật thêm các cột dịch thuật mới bên dưới)

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    "heroImage" TEXT,
    products JSONB
);

CREATE TABLE IF NOT EXISTS "blogPosts" (
    id TEXT PRIMARY KEY,
    title TEXT,
    category TEXT,
    image TEXT,
    date TEXT,
    excerpt TEXT,
    content TEXT
);

CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT,
    answer TEXT
);

CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    content TEXT,
    rating INTEGER,
    avatar TEXT
);

CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    "siteName" TEXT,
    "logoUrl" TEXT,
    contact JSONB,
    social JSONB,
    features JSONB,
    "heroSection" JSONB,
    "blogSection" JSONB,
    "ctaSection" JSONB
);

CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT
);

-- =======================================================
-- MÃ LỆNH THÊM CÁC CỘT (ĐỂ SỬA LỖI LƯU & CẤP NHẬT DỊCH THUẬT)
-- =======================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE "blogPosts" ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE "blogPosts" ADD COLUMN IF NOT EXISTS excerpt_en TEXT;
ALTER TABLE "blogPosts" ADD COLUMN IF NOT EXISTS content_en TEXT;

ALTER TABLE faqs ADD COLUMN IF NOT EXISTS question_en TEXT;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS answer_en TEXT;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role_en TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS content_en TEXT;

ALTER TABLE "blogPosts" ADD COLUMN IF NOT EXISTS "createdAt" BIGINT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS "createdAt" BIGINT;

-- Cột mới cho bảng settings
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "footerDescription" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "facebookLink" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "instagramLink" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "tiktokLink" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeHeroImage" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "routineStep1Image" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "routineStep2Image" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "routineStep3Image" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "productsCoverImage" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "blogCoverImage" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutCoverImage" TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "storesCoverImage" TEXT;
