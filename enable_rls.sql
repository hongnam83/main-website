-- Bật RLS cho tất cả các bảng
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blogPosts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ nếu có (để tránh lỗi khi chạy lại nhiều lần)
DROP POLICY IF EXISTS "Enable all access for admins" ON admins;
DROP POLICY IF EXISTS "Enable all access for products" ON products;
DROP POLICY IF EXISTS "Enable all access for faqs" ON faqs;
DROP POLICY IF EXISTS "Enable all access for blogPosts" ON "blogPosts";
DROP POLICY IF EXISTS "Enable all access for testimonials" ON testimonials;
DROP POLICY IF EXISTS "Enable all access for settings" ON settings;

-- Tạo Policy cho phép mọi người ĐỌC, THÊM, SỬA, XÓA. 
-- (Do web đang dùng cơ chế đăng nhập riêng chứ không dùng Supabase Auth, nên cần allow toàn bộ thao tác đối với anon role để web hoạt động bình thường, và hết cảnh báo)
CREATE POLICY "Enable all access for admins" ON admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for faqs" ON faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for blogPosts" ON "blogPosts" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for settings" ON settings FOR ALL USING (true) WITH CHECK (true);
