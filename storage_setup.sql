-- Chạy đoạn mã này trong tab SQL Editor của Supabase để tạo Storage (Nơi lưu trữ ảnh)

INSERT INTO storage.buckets (id, name, public) 
VALUES ('public_assets', 'public_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Cho phép đọc ảnh công khai
CREATE POLICY "Public read access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'public_assets' );

-- Cho phép tải ảnh lên từ trang quản trị
CREATE POLICY "Public insert access" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'public_assets' );

-- Cho phép cập nhật ảnh
CREATE POLICY "Public update access"
ON storage.objects FOR UPDATE
WITH CHECK ( bucket_id = 'public_assets' );

-- Cho phép xóa ảnh
CREATE POLICY "Public delete access"
ON storage.objects FOR DELETE
USING ( bucket_id = 'public_assets' );
