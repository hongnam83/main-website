import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import data
import { categories } from '../src/data/products';
import { blogPosts } from '../src/data/blogPosts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data_store');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Convert product categories array into a flat list of products for the CMS,
// or just keep categories structure. For now let's just save them as is.
fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(categories, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'blogPosts.json'), JSON.stringify(blogPosts, null, 2));

const faqs = [
    {
      id: "1",
      question: "Sản phẩm FURANO có dùng được cho răng nhạy cảm không?",
      answer: "Hoàn toàn được. Công thức của chúng tôi không chứa chất mài mòn mạnh (low RDA), an toàn tuyệt đối cho men răng đang trong giai đoạn yếu ớt khi chịu quá trình kéo chỉnh của mắc cài."
    },
    {
      id: "2",
      question: "Bao nhiêu lâu thì nên thay đổi bàn chải kẽ?",
      answer: "Với người đang niềng răng, nha sĩ khuyên nên làm vệ sinh bàn chải sau mỗi lần sử dụng và thay thế bàn chải/đầu bàn chải kẽ 2-3 tuần một lần để đảm bảo vệ sinh và hiệu quả làm sạch tốt nhất."
    },
    {
      id: "3",
      question: "Viên sủi Invisalign có làm ố màu khay không?",
      answer: "Không. Viên sủi FURANO làm sạch bằng bọt khí O2 siêu nhỏ và các enzym diệt khuẩn, hoàn toàn không sử dụng chất nhuộm màu độc hại gây ảnh hưởng đến cấu trúc nhựa và độ trong suốt của khay niềng."
    },
    {
      id: "4",
      question: "FURANO có hỗ trợ tư vấn chăm sóc cá nhân không?",
      answer: "Có. Đội ngũ chuyên viên của FURANO luôn sẵn sàng hỗ trợ bạn theo dõi tình trạng răng miệng và thiết kế chu trình chăm sóc riêng biệt. Hãy liên hệ với chúng tôi để được tư vấn miễn phí."
    }
];

fs.writeFileSync(path.join(DATA_DIR, 'faqs.json'), JSON.stringify(faqs, null, 2));

console.log('Seeded data store successfully');
