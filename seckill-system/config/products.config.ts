import type { SeckillProduct } from '~/types'

const generateImageUrl = (prompt: string) => 
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square_hd`

export const productsConfig: SeckillProduct[] = [
  {
    id: 'prod-101',
    name: 'Apple iPhone 15 Pro Max 256GB',
    description: '最新款A17 Pro芯片，钛金属设计，专业级摄影系统',
    images: [
      generateImageUrl('iPhone 15 Pro Max natural titanium color product photo'),
      generateImageUrl('iPhone 15 Pro Max back view camera module'),
      generateImageUrl('iPhone 15 Pro Max side view button details')
    ],
    mainImage: generateImageUrl('iPhone 15 Pro Max natural titanium color product photo'),
    originalPrice: 9999,
    seckillPrice: 7999,
    discount: 80,
    totalStock: 100,
    soldCount: 67,
    remainingStock: 33,
    sessionId: 'session-10',
    category: '手机数码',
    tags: ['爆款', '新品'],
    sort: 1,
    isHot: true,
    isNew: true,
    specs: [
      { name: '颜色', value: '原色钛金属' },
      { name: '容量', value: '256GB' }
    ],
    detailImages: [
      generateImageUrl('iPhone 15 Pro Max product detail page feature 1'),
      generateImageUrl('iPhone 15 Pro Max product detail page feature 2')
    ]
  },
  {
    id: 'prod-102',
    name: 'Sony WH-1000XM5 无线降噪耳机',
    description: '业界领先降噪，30小时续航，舒适佩戴体验',
    images: [
      generateImageUrl('Sony WH-1000XM5 wireless headphones black color'),
      generateImageUrl('Sony headphones wearing on head lifestyle')
    ],
    mainImage: generateImageUrl('Sony WH-1000XM5 wireless headphones black color'),
    originalPrice: 2999,
    seckillPrice: 1899,
    discount: 63,
    totalStock: 200,
    soldCount: 156,
    remainingStock: 44,
    sessionId: 'session-10',
    category: '数码配件',
    tags: ['热销'],
    sort: 2,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '黑色' },
      { name: '连接方式', value: '蓝牙5.2' }
    ],
    detailImages: [generateImageUrl('Sony headphones features infographic')]
  },
  {
    id: 'prod-103',
    name: 'Dyson V15 Detect 无线吸尘器',
    description: '激光探测灰尘，智能感应吸力，60分钟续航',
    images: [
      generateImageUrl('Dyson V15 Detect cordless vacuum cleaner product shot'),
      generateImageUrl('Dyson vacuum laser dust detection feature')
    ],
    mainImage: generateImageUrl('Dyson V15 Detect cordless vacuum cleaner product shot'),
    originalPrice: 5990,
    seckillPrice: 4290,
    discount: 72,
    totalStock: 50,
    soldCount: 48,
    remainingStock: 2,
    sessionId: 'session-10',
    category: '家用电器',
    tags: ['爆款', '限量'],
    sort: 3,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '紫镍色' },
      { name: '续航时间', value: '60分钟' }
    ],
    detailImages: [generateImageUrl('Dyson vacuum features display')]
  },
  {
    id: 'prod-104',
    name: 'Apple MacBook Pro 14英寸 M3 Pro',
    description: 'M3 Pro芯片，18小时续航，Liquid Retina XDR显示屏',
    images: [
      generateImageUrl('MacBook Pro 14 inch space black product photo'),
      generateImageUrl('MacBook Pro 14 inch keyboard trackpad')
    ],
    mainImage: generateImageUrl('MacBook Pro 14 inch space black product photo'),
    originalPrice: 16999,
    seckillPrice: 13999,
    discount: 82,
    totalStock: 30,
    soldCount: 23,
    remainingStock: 7,
    sessionId: 'session-10',
    category: '电脑办公',
    tags: ['新品'],
    sort: 4,
    isHot: false,
    isNew: true,
    specs: [
      { name: '颜色', value: '深空黑色' },
      { name: '配置', value: '18GB+512GB' }
    ],
    detailImages: [generateImageUrl('MacBook Pro performance chart')]
  },
  {
    id: 'prod-105',
    name: 'Nintendo Switch OLED 游戏机',
    description: '7英寸OLED屏幕，64GB存储，随时随地畅玩',
    images: [
      generateImageUrl('Nintendo Switch OLED white edition product shot'),
      generateImageUrl('Nintendo Switch OLED gameplay scene')
    ],
    mainImage: generateImageUrl('Nintendo Switch OLED white edition product shot'),
    originalPrice: 2599,
    seckillPrice: 1999,
    discount: 77,
    totalStock: 150,
    soldCount: 0,
    remainingStock: 150,
    sessionId: 'session-10',
    category: '电玩游戏',
    tags: ['限量'],
    sort: 5,
    isHot: true,
    isNew: false,
    specs: [
      { name: '版本', value: '日版' },
      { name: '颜色', value: '白色' }
    ],
    detailImages: [generateImageUrl('Nintendo Switch games library')]
  },
  {
    id: 'prod-106',
    name: 'Levi\'s 501经典直筒牛仔裤',
    description: '经典501版型，100%棉质面料，百搭时尚',
    images: [
      generateImageUrl('Levis 501 classic straight jeans dark blue wash'),
      generateImageUrl('Levis 501 jeans wearing model lifestyle')
    ],
    mainImage: generateImageUrl('Levis 501 classic straight jeans dark blue wash'),
    originalPrice: 799,
    seckillPrice: 399,
    discount: 50,
    totalStock: 300,
    soldCount: 245,
    remainingStock: 55,
    sessionId: 'session-10',
    category: '服饰鞋包',
    tags: ['爆款'],
    sort: 6,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '深蓝色' },
      { name: '尺码', value: '32/32' }
    ],
    detailImages: [generateImageUrl('Levis 501 jeans details stitching')]
  },
  {
    id: 'prod-201',
    name: 'iPad Pro 12.9英寸 M2芯片',
    description: 'M2芯片，Liquid Retina XDR显示屏，专业级创作工具',
    images: [generateImageUrl('iPad Pro 12.9 inch silver product photo')],
    mainImage: generateImageUrl('iPad Pro 12.9 inch silver product photo'),
    originalPrice: 9299,
    seckillPrice: 7599,
    discount: 82,
    totalStock: 80,
    soldCount: 0,
    remainingStock: 80,
    sessionId: 'session-14',
    category: '电脑办公',
    tags: ['新品', '爆款'],
    sort: 1,
    isHot: true,
    isNew: true,
    specs: [
      { name: '颜色', value: '银色' },
      { name: '容量', value: '256GB' }
    ],
    detailImages: []
  },
  {
    id: 'prod-202',
    name: 'Bose QuietComfort Ultra 耳机',
    description: '空间音频技术，世界级降噪，舒适奢华体验',
    images: [generateImageUrl('Bose QuietComfort Ultra headphones black')],
    mainImage: generateImageUrl('Bose QuietComfort Ultra headphones black'),
    originalPrice: 4299,
    seckillPrice: 3299,
    discount: 77,
    totalStock: 120,
    soldCount: 0,
    remainingStock: 120,
    sessionId: 'session-14',
    category: '数码配件',
    tags: ['热销'],
    sort: 2,
    isHot: true,
    isNew: true,
    specs: [
      { name: '颜色', value: '黑色' },
      { name: '降噪', value: '自适应' }
    ],
    detailImages: []
  },
  {
    id: 'prod-203',
    name: '戴森 Airwrap 卷发棒 HS05',
    description: '康达效应，无需过高温度，打造完美造型',
    images: [generateImageUrl('Dyson Airwrap hair styler complete set')],
    mainImage: generateImageUrl('Dyson Airwrap hair styler complete set'),
    originalPrice: 3690,
    seckillPrice: 2990,
    discount: 81,
    totalStock: 60,
    soldCount: 0,
    remainingStock: 60,
    sessionId: 'session-14',
    category: '个护健康',
    tags: ['爆款'],
    sort: 3,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '紫红镍色' },
      { name: '版本', value: '完整版' }
    ],
    detailImages: []
  },
  {
    id: 'prod-204',
    name: 'Nike Air Jordan 1 Retro High OG',
    description: '经典复刻，限量配色，收藏级运动鞋',
    images: [generateImageUrl('Nike Air Jordan 1 Retro High OG sneakers')],
    mainImage: generateImageUrl('Nike Air Jordan 1 Retro High OG sneakers'),
    originalPrice: 1599,
    seckillPrice: 999,
    discount: 62,
    totalStock: 200,
    soldCount: 0,
    remainingStock: 200,
    sessionId: 'session-14',
    category: '服饰鞋包',
    tags: ['限量', '爆款'],
    sort: 4,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '黑红脚趾' },
      { name: '尺码', value: '42' }
    ],
    detailImages: []
  },
  {
    id: 'prod-301',
    name: 'Apple Watch Ultra 2',
    description: '49mm钛金属表壳，精准双频GPS，100米防水',
    images: [generateImageUrl('Apple Watch Ultra 2 titanium case product shot')],
    mainImage: generateImageUrl('Apple Watch Ultra 2 titanium case product shot'),
    originalPrice: 6499,
    seckillPrice: 5299,
    discount: 82,
    totalStock: 100,
    soldCount: 0,
    remainingStock: 100,
    sessionId: 'session-20',
    category: '智能穿戴',
    tags: ['新品', '爆款'],
    sort: 1,
    isHot: true,
    isNew: true,
    specs: [
      { name: '表壳', value: '49mm钛金属' },
      { name: '表带', value: '高山回环式' }
    ],
    detailImages: []
  },
  {
    id: 'prod-302',
    name: 'Sony A7M4 全画幅微单相机',
    description: '3300万像素全画幅，4K60p视频，5轴防抖',
    images: [generateImageUrl('Sony A7M4 mirrorless camera with lens')],
    mainImage: generateImageUrl('Sony A7M4 mirrorless camera with lens'),
    originalPrice: 16999,
    seckillPrice: 13999,
    discount: 82,
    totalStock: 40,
    soldCount: 0,
    remainingStock: 40,
    sessionId: 'session-20',
    category: '摄影摄像',
    tags: ['热销'],
    sort: 2,
    isHot: true,
    isNew: false,
    specs: [
      { name: '镜头', value: '24-70mm F4套机' },
      { name: '颜色', value: '黑色' }
    ],
    detailImages: []
  },
  {
    id: 'prod-303',
    name: 'Breville 铂富 BES878 半自动咖啡机',
    description: '专业级意式咖啡机，智能研磨，恒温萃取',
    images: [generateImageUrl('Breville BES878 espresso machine stainless steel')],
    mainImage: generateImageUrl('Breville BES878 espresso machine stainless steel'),
    originalPrice: 7990,
    seckillPrice: 6490,
    discount: 81,
    totalStock: 25,
    soldCount: 0,
    remainingStock: 25,
    sessionId: 'session-20',
    category: '家用电器',
    tags: ['限量'],
    sort: 3,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '不锈钢色' },
      { name: '产地', value: '澳大利亚' }
    ],
    detailImages: []
  },
  {
    id: 'prod-304',
    name: 'Lululemon Align 瑜伽裤 25"',
    description: 'Nulu面料，裸感体验，高腰设计，运动休闲两用',
    images: [generateImageUrl('Lululemon Align yoga pants 25 inch black')],
    mainImage: generateImageUrl('Lululemon Align yoga pants 25 inch black'),
    originalPrice: 980,
    seckillPrice: 580,
    discount: 59,
    totalStock: 500,
    soldCount: 0,
    remainingStock: 500,
    sessionId: 'session-20',
    category: '运动户外',
    tags: ['爆款'],
    sort: 4,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '黑色' },
      { name: '尺码', value: 'M' }
    ],
    detailImages: []
  },
  {
    id: 'prod-305',
    name: 'Marshall Stanmore II 蓝牙音箱',
    description: '经典摇滚风格，80W大功率，aptX无损传输',
    images: [generateImageUrl('Marshall Stanmore II bluetooth speaker black')],
    mainImage: generateImageUrl('Marshall Stanmore II bluetooth speaker black'),
    originalPrice: 3299,
    seckillPrice: 2499,
    discount: 76,
    totalStock: 90,
    soldCount: 0,
    remainingStock: 90,
    sessionId: 'session-20',
    category: '数码配件',
    tags: ['热销'],
    sort: 5,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '黑色' },
      { name: '功率', value: '80W' }
    ],
    detailImages: []
  },
  {
    id: 'prod-401',
    name: 'Google Pixel 8 Pro 256GB',
    description: 'Tensor G3芯片，AI摄影大师，7年系统更新支持',
    images: [generateImageUrl('Google Pixel 8 Pro bay color product photo')],
    mainImage: generateImageUrl('Google Pixel 8 Pro bay color product photo'),
    originalPrice: 7999,
    seckillPrice: 5999,
    discount: 75,
    totalStock: 60,
    soldCount: 0,
    remainingStock: 60,
    sessionId: 'session-22',
    category: '手机数码',
    tags: ['新品'],
    sort: 1,
    isHot: false,
    isNew: true,
    specs: [
      { name: '颜色', value: '海湾蓝' },
      { name: '容量', value: '256GB' }
    ],
    detailImages: []
  },
  {
    id: 'prod-402',
    name: 'Hermès 爱马仕 大地男士淡香水 100ml',
    description: '经典木质香调，优雅绅士气息，持久留香',
    images: [generateImageUrl('Hermes Terre dHermes perfume bottle 100ml')],
    mainImage: generateImageUrl('Hermes Terre dHermes perfume bottle 100ml'),
    originalPrice: 1280,
    seckillPrice: 799,
    discount: 62,
    totalStock: 150,
    soldCount: 0,
    remainingStock: 150,
    sessionId: 'session-22',
    category: '个护健康',
    tags: ['限量'],
    sort: 2,
    isHot: true,
    isNew: false,
    specs: [
      { name: '规格', value: '100ml' },
      { name: '香调', value: '木质香调' }
    ],
    detailImages: []
  },
  {
    id: 'prod-403',
    name: 'IKEA 宜家 波昂 单人扶手椅',
    description: '经典北欧设计，弯曲实木框架，舒适休闲',
    images: [generateImageUrl('IKEA Poang armchair birch veneer')],
    mainImage: generateImageUrl('IKEA Poang armchair birch veneer'),
    originalPrice: 699,
    seckillPrice: 399,
    discount: 57,
    totalStock: 200,
    soldCount: 0,
    remainingStock: 200,
    sessionId: 'session-22',
    category: '家居家装',
    tags: ['爆款'],
    sort: 3,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '桦木色/黑褐色' },
      { name: '材质', value: '弯曲实木' }
    ],
    detailImages: []
  },
  {
    id: 'prod-001',
    name: 'Xiaomi 小米14 Ultra 摄影旗舰',
    description: '徕卡联合研发，1英寸大底主摄，骁龙8Gen3',
    images: [generateImageUrl('Xiaomi 14 Ultra white color product photo')],
    mainImage: generateImageUrl('Xiaomi 14 Ultra white color product photo'),
    originalPrice: 6499,
    seckillPrice: 5699,
    discount: 88,
    totalStock: 200,
    soldCount: 200,
    remainingStock: 0,
    sessionId: 'session-00',
    category: '手机数码',
    tags: ['爆款', '已售罄'],
    sort: 1,
    isHot: true,
    isNew: true,
    specs: [
      { name: '颜色', value: '白色' },
      { name: '容量', value: '256GB' }
    ],
    detailImages: []
  },
  {
    id: 'prod-002',
    name: 'Apple AirPods Pro 2',
    description: '主动降噪，自适应通透模式，空间音频',
    images: [generateImageUrl('Apple AirPods Pro 2 with charging case')],
    mainImage: generateImageUrl('Apple AirPods Pro 2 with charging case'),
    originalPrice: 1899,
    seckillPrice: 1399,
    discount: 74,
    totalStock: 300,
    soldCount: 300,
    remainingStock: 0,
    sessionId: 'session-00',
    category: '数码配件',
    tags: ['已售罄'],
    sort: 2,
    isHot: true,
    isNew: false,
    specs: [
      { name: '版本', value: 'USB-C版' },
      { name: '降噪', value: '主动降噪' }
    ],
    detailImages: []
  },
  {
    id: 'prod-003',
    name: 'Uniqlo 优衣库 摇粒绒外套',
    description: '柔软保暖，轻盈舒适，多色可选',
    images: [generateImageUrl('Uniqlo fleece jacket gray color')],
    mainImage: generateImageUrl('Uniqlo fleece jacket gray color'),
    originalPrice: 399,
    seckillPrice: 199,
    discount: 50,
    totalStock: 500,
    soldCount: 500,
    remainingStock: 0,
    sessionId: 'session-00',
    category: '服饰鞋包',
    tags: ['已售罄'],
    sort: 3,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', value: '灰色' },
      { name: '尺码', value: 'L' }
    ],
    detailImages: []
  }
]

export const getProductById = (id: string): SeckillProduct | undefined => {
  return productsConfig.find(p => p.id === id)
}

export const getProductsBySessionId = (sessionId: string): SeckillProduct[] => {
  return productsConfig.filter(p => p.sessionId === sessionId)
}

export const updateProductStock = (productId: string, newStock: number): boolean => {
  const product = productsConfig.find(p => p.id === productId)
  if (product) {
    const oldStock = product.remainingStock
    product.remainingStock = newStock
    product.soldCount = product.totalStock - newStock
    return true
  }
  return false
}

export const decreaseProductStock = (productId: string, amount: number = 1): boolean => {
  const product = productsConfig.find(p => p.id === productId)
  if (product && product.remainingStock >= amount) {
    product.remainingStock -= amount
    product.soldCount += amount
    return true
  }
  return false
}

export const getProductsByCategory = (category: string): SeckillProduct[] => {
  return productsConfig.filter(p => p.category === category)
}

export const getAllCategories = (): string[] => {
  return [...new Set(productsConfig.map(p => p.category))]
}
