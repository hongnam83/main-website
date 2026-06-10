export type Variant = {
  name: string;
  colorClass: string;
  image: string;
};

export type ProductDetail = {
  id: string;
  name: string;
  features: string[];
  image: string;
  variants?: Variant[];
  mainUses?: string[];
  materials?: string[];
  ingredients?: string[];
  specs?: string;
  description?: string;
  tag?: string;
};

export type Category = {
  id: string;
  title: string;
  description: string;
  heroImage?: string;
  products: ProductDetail[];
};

export const categories: Category[] = [
  {
    id: 'khi-nieng',
    title: 'Chăm Sóc Khi Niềng',
    description: 'Chuyên dụng cho người đang mắc cài, bảo vệ toàn diện nướu và men răng.',
    heroImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1600',
    products: [
      {
        id: 'kem-danh-rang-ortho-sabai',
        name: 'Kem đánh răng Ortho Sabai',
        tag: 'Bán chạy',
        features: ['Tái khoáng hóa men răng', 'Kháng khuẩn CPC & Fluoride'],
        variants: [
          { name: 'Nha Đam', colorClass: 'bg-green-500', image: 'https://images.unsplash.com/photo-1559598467-f8b76c8105d0?auto=format&fit=crop&q=80&w=600&color=green' },
          { name: 'Bạc Hà', colorClass: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1559598467-f8b76c8105d0?auto=format&fit=crop&q=80&w=600&color=blue' }
        ],
        image: 'https://images.unsplash.com/photo-1559598467-f8b76c8105d0?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Làm sạch sâu vùng mắc cài – kẽ răng.',
          'Tái khoáng hoá men răng, bảo vệ và ngăn ngừa sâu răng giúp răng chắc khoẻ.',
          'Kháng khuẩn, chống mảng bám nhờ thành phần CPC, Sodium Fluoride.',
          'Hạn chế viêm nướu – nhiệt miệng – hôi miệng trong quá trình niềng.',
          'Nha Đam dịu nhẹ cho nướu nhạy cảm, Bạc Hà thơm mát sâu.'
        ],
        ingredients: [
          'Kết hợp 2-Fluorides 1480ppm và CPC – những thành phần lý tưởng giúp chăm sóc răng niềng.',
          'Không chứa paraben, chất bảo quản hay saccharin – An toàn, lành tính cho nướu nhạy cảm.',
          'Lô hội, rau má, B5: giúp cấp ẩm, làm dịu, làm lành các vết thương.',
          'Giảm thiểu chất SLS (chất tạo bọt): Đối với phân loại vị nha đam sẽ không có SLS, còn các vị khác sẽ được giảm thiểu tối đa.'
        ],
        specs: 'Khối lượng: Bạc hà: 100g, Nha đam: 125g'
      },
      {
        id: 'nuoc-suc-mieng-ortho-sabai',
        name: 'Nước súc miệng Ortho Sabai',
        features: ['Không cồn', 'Dịu nhẹ nướu', 'Làm sạch sâu khoang miệng'],
        variants: [
          { name: 'Nha Đam', colorClass: 'bg-pink-400', image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=600&color=pink' },
          { name: 'Bạc Hà', colorClass: 'bg-blue-400', image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=600&color=cyan' }
        ],
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Bảo vệ răng – nướu khỏi vi khuẩn khi không thể chải răng ngay.',
          'CPC kháng khuẩn, không cồn – không xót – dùng an toàn hàng ngày.',
          'Ngăn mùi hôi, làm dịu vết nhiệt, tăng hiệu quả khi dùng chung kem đánh răng Ortho.',
          'Công thức độc quyền: Fluo kép (NaF và MFP) tạo lớp bảo vệ, ngăn sâu răng.'
        ],
        ingredients: [
          'Hàm lượng fluoride tiêu chuẩn 250ppm.',
          'Chất CPC: kháng khuẩn, kháng viêm.',
          'Thành phần tự nhiên (rau má, lô hội, Vitamin B5): làm dịu, làm lành vết thương, dưỡng ẩm.',
          'Không cồn, không cay, không paraben.'
        ],
        specs: 'Dung tích: 500ml'
      },
      {
        id: 'ban-chai-fluocaril-hybrid',
        name: 'Bàn chải Fluocaril Hybrid',
        features: ['Lông chải chữ V', 'Slim & Soft', 'Spiral xoắn ốc'],
        variants: [
          { name: 'Cam', colorClass: 'bg-orange-500', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600&color=orange' },
          { name: 'Hồng', colorClass: 'bg-pink-400', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600&color=pink' },
          { name: 'Xanh nhạt', colorClass: 'bg-blue-300', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600&color=lightblue' },
          { name: 'Xanh đậm', colorClass: 'bg-blue-600', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600&color=darkblue' }
        ],
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Lông chải chữ V ôm sát mắc cài, làm sạch mà không bung dây cung.',
          'Đầu chải nhỏ, dễ len vào vùng khó tiếp cận.',
          'An toàn cho nướu, không gây tổn thương khi dùng lực.'
        ],
        materials: [
          'Lông bàn chải bên ngoài: Slim & Soft, mềm mại, làm sạch kẽ răng.',
          'Lông bàn chải bên trong: Spiral xoắn ốc, mạnh mẽ loại bỏ mảng bám.',
          'Tay cầm kết hợp 2 chất liệu nhựa PP và elastomer cao cấp.'
        ],
        specs: 'Chất liệu: Nhựa an toàn. Phân loại màu: xanh da trời, xanh đậm, da cam, hồng.'
      },
      {
        id: 'ban-chai-ke-fluocaril',
        name: 'Bàn chải kẽ Fluocaril',
        features: ['Size SS, S, M', 'Làm sạch sâu dưới dây cung', 'Cán uốn linh hoạt'],
        variants: [
          { name: 'Size M', colorClass: 'bg-green-400', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600&color=green' },
          { name: 'Size S', colorClass: 'bg-yellow-400', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600&color=yellow' },
          { name: 'Size SS', colorClass: 'bg-blue-400', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600&color=blue' }
        ],
        image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Làm sạch sâu giữa các khe răng và dưới dây cung.',
          'Giảm nguy cơ tụ mảng bám – sâu răng – viêm lợi quanh mắc cài.',
          'Cán uốn linh hoạt, dễ điều khiển khi đánh răng một mình.'
        ],
        materials: [
          'Được làm từ sợi nilon cao cấp, thép không gỉ.',
          'Lông bàn chải mềm mại, không làm tổn thương nướu.'
        ],
        specs: 'Phân loại: Size SS (0.8 mm), Size S (1 mm), Size M (1.2 mm)'
      }
    ]
  },
  {
    id: 'sau-nieng',
    title: 'Chăm Sóc Sau Niềng (Duy Trì)',
    description: 'Hỗ trợ tháo niềng, vệ sinh hàm duy trì và tăng cường độ vững chắc cho răng.',
    heroImage: 'https://images.unsplash.com/photo-1596755490226-d62f6b8c9fd6?auto=format&fit=crop&q=80&w=1600',
    products: [
      {
        id: 'kem-danh-rang-7-benefits',
        name: 'Kem đánh răng 7 Benefits',
        features: ['Tái khoáng men răng', 'Làm trắng tự nhiên', 'Chống ê buốt'],
        image: 'https://images.unsplash.com/photo-1596755490226-d62f6b8c9fd6?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Tái khoáng men răng, làm trắng – khử mùi – ngừa sâu răng.',
          'Phù hợp người vừa tháo niềng, đang đeo hàm duy trì hoặc chỉnh nha invisalign.',
          '7 công dụng: sạch – trắng – thơm – chống ê – chống sâu – chắc răng – sạch kẽ.',
          'Tăng độ bền chắc của răng với nướu.'
        ],
        ingredients: [
          'Công thức fluo kép (NaF và MFP) độc quyền.',
          'Chứa chất mài mòn nhẹ hydrat silica.',
          'Chứa thành phần muối tự nhiên, tinh dầu liên hương, bách xù, vỏ cam.'
        ],
        specs: 'Khối lượng: 150g'
      },
      {
        id: 'vien-sui-ve-sinh',
        name: 'Viên sủi vệ sinh',
        tag: 'Bán chạy',
        features: ['Sạch vi khuẩn 99.9%', 'Duy trì độ trong suốt'],
        variants: [
          { name: 'Bạc Hà', colorClass: 'bg-blue-400', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600&color=mint' },
          { name: 'Hoa Hồng', colorClass: 'bg-pink-400', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600&color=rose' },
          { name: 'Trà Xanh', colorClass: 'bg-green-400', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600&color=greentea' }
        ],
        image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Làm sạch hàm duy trì trong suốt, hàm trainer hoặc khay Invisalign.',
          'Loại bỏ mảng bám, vết ố, mùi hôi – duy trì độ trong suốt.',
          'Dễ sử dụng – thả viên vào nước, ngâm 1 phút có thể loại bỏ 99,99% vi khuẩn, 5 phút loại bỏ hoàn toàn vi khuẩn.'
        ]
      }
    ]
  },
  {
    id: 'trang-rang-khu-mui',
    title: 'Trắng Răng & Khử Mùi',
    description: 'Giữ hơi thở thơm mát tức thì, nuôi dưỡng men răng trắng sáng.',
    heroImage: 'https://images.unsplash.com/photo-1559598467-f8b76c8105d0?auto=format&fit=crop&q=80&w=1600',
    products: [
      {
        id: 'kem-trang-rang-white-expert',
        name: 'White Expert',
        tag: 'Bán chạy',
        features: ['Hạt mài mòn siêu mịn', 'Không mòn men', 'Sáng tự nhiên'],
        image: 'https://images.unsplash.com/photo-1559598467-f8b76c8105d0?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Làm trắng răng sau niềng, không gây mòn men.',
          'Kết hợp chất mài mòn siêu mịn và thành phần làm trắng dịu nhẹ.',
          'Phù hợp dùng xen kẽ 1–2 lần/ngày hoặc sau chu kỳ làm sạch.'
        ],
        ingredients: [
          'Công thức cải tiến với 2 hoạt chất làm trắng giúp loại bỏ vết ố và mảng bám.',
          'Kết hợp 2-Fluorides 1450ppm.',
          'Chứa Hydrated Silica làm sạch, đánh bóng nhẹ nhàng.',
          'Không chứa paraben, chất bảo quản hay saccharin.'
        ],
        specs: 'Khối lượng: 150g'
      },
      {
        id: 'kem-khu-mui-breath-expert',
        name: 'Breath Expert',
        features: ['Đặc trị mùi hôi', 'Tinh dầu thiên nhiên', 'Bạc hà the mát'],
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Đặc trị hôi miệng do vi khuẩn, viêm nướu, khô miệng.',
          'Lá trà xanh, lá ổi: chống oxi hóa, bảo vệ kháng khuẩn, bảo vệ nướu.',
          'Dùng xen kẽ sáng – tối, kết hợp nước súc miệng để hiệu quả tối đa.'
        ],
        ingredients: [
          'Công thức kép 2-fluorides 1450 ppm.',
          'Không chứa chất bảo quản, paraben, saccharin.',
          'Thành phần kháng khuẩn, tinh dầu thiên nhiên (trà xanh, ổi).',
          'Chất CPC: kháng khuẩn.'
        ],
        specs: 'Khối lượng: 150g'
      },
      {
        id: 'binh-xit-fresh-mint',
        name: 'Bình xịt Fresh Mint',
        features: ['Thơm mát tức thì', 'Dưỡng ẩm khoang miệng', 'Chứa Xylitol & CPC'],
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600',
        mainUses: [
          'Làm thơm miệng tức thì, loại bỏ mùi hôi miệng sau ăn uống.',
          'Mang lại hơi thở thơm mát trong vòng 30 phút.',
          'Giúp khoang miệng sạch hơn, hỗ trợ bảo vệ răng và ngăn ngừa sâu răng.'
        ],
        ingredients: [
          'Tinh dầu bạc hà, chiết suất nha đam hữu cơ và cỏ ngọt tự nhiên.',
          'Có chứa CPC.',
          'Chất dưỡng ẩm hữu cơ (glycerin), Xylitol.',
          'Không chứa cồn, không đường.'
        ],
        specs: 'Thể tích: 15ml (dùng được hơn 150 lần)'
      }
    ]
  }
];
