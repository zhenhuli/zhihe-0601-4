import type { CaseItem, HouseLayout, QuoteItem, DecorGrade } from '~/types'

export const mockCases: CaseItem[] = [
  {
    id: 1,
    title: '晨曦·原木雅致三居',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20nordic%20style%20living%20room%20interior%20design%20with%20wood%20furniture%20light%20colors%20cozy%20atmosphere&image_size=landscape_16_9',
    style: 'nordic',
    area: 128,
    priceRange: '20-30',
    priceMin: 22,
    priceMax: 28,
    layout: '3-2',
    community: '万科城·翡翠郡',
    designer: '林小雅',
    description: '以原木色调为主，搭配柔和的米白与浅灰，打造自然温馨的居家氛围。开放式厨房与客厅相连，空间通透感十足。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spacious%20modern%20living%20room%20panorama%20view%20large%20windows%20natural%20light%20wooden%20floor%20scandinavian%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20open%20kitchen%20with%20island%20white%20cabinets%20wood%20countertops%20pendant%20lights%20interior%20design&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20master%20bedroom%20with%20king%20size%20bed%20wooden%20headboard%20soft%20lighting%20nordic%20style%20interior&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20bathroom%20with%20freestanding%20bathtub%20marble%20tiles%20large%20mirror%20vanity%20luxury%20interior&image_size=landscape_16_9'
    ],
    materials: [
      { name: '实木地板', brand: '圣象', specification: '15mm厚橡木', quantity: '128㎡', unitPrice: 380 },
      { name: '乳胶漆', brand: '多乐士', specification: '竹炭净味', quantity: '420㎡', unitPrice: 45 },
      { name: '定制衣柜', brand: '索菲亚', specification: 'E0级颗粒板', quantity: '28㎡', unitPrice: 1280 },
      { name: '整体橱柜', brand: '欧派', specification: '石英石台面', quantity: '6延米', unitPrice: 6800 },
      { name: '瓷砖', brand: '东鹏', specification: '800x800抛釉砖', quantity: '56㎡', unitPrice: 180 },
      { name: '卫浴套装', brand: 'TOTO', specification: '智能马桶+花洒+台盆', quantity: '2套', unitPrice: 15800 }
    ],
    tags: ['北欧', '原木', '三室两厅', '热门']
  },
  {
    id: 2,
    title: '墨韵·东方意境雅居',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20chinese%20style%20living%20room%20interior%20design%20elegant%20traditional%20elements%20modern%20furniture%20ink%20painting%20decor&image_size=landscape_16_9',
    style: 'chinese',
    area: 156,
    priceRange: '30-50',
    priceMin: 38,
    priceMax: 46,
    layout: '4-2',
    community: '保利·西山林语',
    designer: '王墨轩',
    description: '融入传统东方美学元素，以水墨画般的意境呈现。深色木作与淡雅留白相结合，彰显文化底蕴。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20chinese%20style%20spacious%20living%20room%20panorama%20dark%20wood%20furniture%20traditional%20decor%20elegant%20interior&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20style%20study%20room%20with%20bookshelf%20desk%20calligraphy%20painting%20traditional%20lantern%20lighting&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20chinese%20style%20dining%20room%20round%20table%20wood%20chairs%20pendant%20lantern%20warm%20lighting&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=oriental%20style%20bedroom%20canopy%20bed%20silk%20bedding%20elegant%20decor%20soft%20ambient%20lighting&image_size=landscape_16_9'
    ],
    materials: [
      { name: '实木复合地板', brand: '大自然', specification: '黑胡桃木', quantity: '156㎡', unitPrice: 480 },
      { name: '定制木作', brand: '曲美', specification: '胡桃木饰面', quantity: '68㎡', unitPrice: 2680 },
      { name: '真丝墙纸', brand: '瑞宝', specification: '手绘山水图案', quantity: '180㎡', unitPrice: 520 },
      { name: '红木家具', brand: '年年红', specification: '客厅12件套', quantity: '1套', unitPrice: 128000 },
      { name: '天然石材', brand: '简一', specification: '雅士白大理石', quantity: '45㎡', unitPrice: 880 },
      { name: '铜制灯具', brand: '月影凯顿', specification: '新中式吊灯', quantity: '8盏', unitPrice: 4600 }
    ],
    tags: ['新中式', '四室两厅', '高端', '文化']
  },
  {
    id: 3,
    title: '清风·极简光影空间',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20modern%20living%20room%20interior%20design%20white%20walls%20clean%20lines%20large%20windows%20natural%20light%20simple%20furniture&image_size=landscape_16_9',
    style: 'minimalist',
    area: 98,
    priceRange: '20-30',
    priceMin: 20,
    priceMax: 26,
    layout: '3-1',
    community: '龙湖·春江郦城',
    designer: '陈一然',
    description: '极简主义的极致演绎，以纯净的白色为主调，搭配灯光与光影变化，创造宁静致远的空间感受。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20white%20living%20room%20panorama%20clean%20lines%20floor%20to%20ceiling%20windows%20hidden%20lighting&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20kitchen%20white%20handleless%20cabinets%20island%20stainless%20steel%20appliances%20clean%20design&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20bedroom%20platform%20bed%20white%20bedding%20recessed%20lighting%20floating%20nightstands&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20bathroom%20walk%20in%20shower%20large%20format%20tiles%20wall%20mounted%20vanity%20clean%20design&image_size=landscape_16_9'
    ],
    materials: [
      { name: '微水泥地面', brand: 'CEMENTONE', specification: '高强度微水泥', quantity: '98㎡', unitPrice: 680 },
      { name: '艺术涂料', brand: '本杰明摩尔', specification: '哑光白色', quantity: '380㎡', unitPrice: 85 },
      { name: '定制衣柜', brand: '我乐', specification: 'PET高光门板', quantity: '22㎡', unitPrice: 1680 },
      { name: '嵌入式厨电', brand: '西门子', specification: '蒸烤一体+洗碗机', quantity: '3件', unitPrice: 18800 },
      { name: '无主灯系统', brand: '西顿照明', specification: '磁吸轨道灯', quantity: '1套', unitPrice: 26800 },
      { name: '系统门窗', brand: '旭格', specification: '断桥铝合金', quantity: '38㎡', unitPrice: 2200 }
    ],
    tags: ['极简', '三室一厅', '无主灯', '现代']
  },
  {
    id: 4,
    title: '暖阳·美式乡村温情',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=american%20country%20style%20living%20room%20interior%20design%20warm%20colors%20wooden%20beams%20fireplace%20cozy%20furniture&image_size=landscape_16_9',
    style: 'american',
    area: 142,
    priceRange: '30-50',
    priceMin: 32,
    priceMax: 40,
    layout: '3-2',
    community: '绿城·桃花源',
    designer: '张晓晴',
    description: '美式乡村的温暖与惬意，实木横梁与复古壁炉营造浓郁的田园风情，舒适大沙发承载家人欢聚时光。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=american%20country%20style%20living%20room%20panorama%20wood%20beams%20stone%20fireplace%20large%20comfortable%20sofa%20warm%20lighting&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=american%20style%20kitchen%20with%20island%20white%20shaker%20cabinets%20farmhouse%20sink%20brick%20backsplash&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=american%20country%20master%20bedroom%20four%20poster%20bed%20floral%20bedding%20vintage%20furniture%20warm%20cozy&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20american%20style%20dining%20room%20wooden%20table%20bench%20seating%20pendant%20lights%20warm%20atmosphere&image_size=landscape_16_9'
    ],
    materials: [
      { name: '仿古实木地板', brand: '安信', specification: '缅因州红橡木', quantity: '142㎡', unitPrice: 560 },
      { name: '复古砖', brand: '马可波罗', specification: '做旧效果砖', quantity: '62㎡', unitPrice: 320 },
      { name: '实木橱柜', brand: '美睿Merillat', specification: '美式做旧风格', quantity: '8延米', unitPrice: 12800 },
      { name: '布艺沙发', brand: 'Harbor House', specification: '三人位+单人位', quantity: '1套', unitPrice: 38800 },
      { name: '实木门', brand: 'TATA', specification: '复合烤漆门', quantity: '8樘', unitPrice: 4600 },
      { name: '中央空调', brand: '大金', specification: 'VRV-P系列', quantity: '1套', unitPrice: 68000 }
    ],
    tags: ['美式乡村', '三室两厅', '田园', '温馨']
  },
  {
    id: 5,
    title: '简悦·现代都市两居',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20contemporary%20apartment%20living%20room%20two%20bedroom%20urban%20style%20gray%20tones%20designer%20furniture&image_size=landscape_16_9',
    style: 'modern',
    area: 78,
    priceRange: '10-20',
    priceMin: 12,
    priceMax: 18,
    layout: '2-1',
    community: '融创·融公馆',
    designer: '李思远',
    description: '都市精英的理想之选，灰调基底搭配亮色软装点缀，功能收纳设计巧妙解决小户型痛点。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20urban%20apartment%20living%20room%20panorama%20gray%20sofa%20accent%20chair%20floor%20lamp%20small%20space%20design&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=small%20modern%20kitchen%20design%20space%20saving%20solutions%20white%20cabinets%20black%20countertops%20compact&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20small%20bedroom%20design%20storage%20solutions%20floating%20shelves%20cozy%20urban%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20compact%20bathroom%20design%20walk%20in%20shower%20wall%20hung%20toilet%20space%20saving&image_size=landscape_16_9'
    ],
    materials: [
      { name: '强化复合地板', brand: '圣象', specification: '12mm灰色系', quantity: '78㎡', unitPrice: 220 },
      { name: '硅藻泥墙面', brand: '大津', specification: '细砂肌理', quantity: '280㎡', unitPrice: 180 },
      { name: '定制收纳柜', brand: '好莱客', specification: '多功能收纳', quantity: '32㎡', unitPrice: 980 },
      { name: '整体橱柜', brand: '志邦', specification: '双饰面门板', quantity: '4.5延米', unitPrice: 4200 },
      { name: '瓷砖', brand: '冠珠', specification: '600x600仿古砖', quantity: '32㎡', unitPrice: 120 },
      { name: '成品家具', brand: '林氏木业', specification: '全屋12件套', quantity: '1套', unitPrice: 28800 }
    ],
    tags: ['现代简约', '两室一厅', '小户型', '收纳']
  },
  {
    id: 6,
    title: '禅意·日式和风雅居',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20style%20living%20room%20interior%20design%20tatami%20shoji%20screens%20wood%20elements%20zen%20minimalist%20natural%20light&image_size=landscape_16_9',
    style: 'japanese',
    area: 112,
    priceRange: '20-30',
    priceMin: 24,
    priceMax: 30,
    layout: '3-2',
    community: '招商·雍景湾',
    designer: '佐藤健一',
    description: '纯正日式禅意空间，障子门、榻榻米、天然竹材的运用，营造宁静致远的东方禅境。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20style%20living%20room%20panorama%20tatami%20floor%20shoji%20paper%20screens%20low%20furniture%20zen%20garden%20view&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20tatami%20room%20with%20futon%20storage%20built%20in%20closet%20shoji%20doors%20minimalist%20design&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20style%20kitchen%20wood%20cabinets%20simple%20clean%20design%20natural%20materials%20zen%20atmosphere&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20style%20bathroom%20ofuro%20wooden%20bathtub%20stone%20tiles%20natural%20elements%20spa%20atmosphere&image_size=landscape_16_9'
    ],
    materials: [
      { name: '榻榻米地台', brand: '唐风', specification: '蔺草面稻草芯', quantity: '36㎡', unitPrice: 680 },
      { name: '障子门', brand: '美鹤', specification: '实木框和纸', quantity: '12樘', unitPrice: 2800 },
      { name: '原木地板', brand: '松下', specification: '日本桧木', quantity: '112㎡', unitPrice: 580 },
      { name: '和室家具', brand: '唐人街', specification: '矮桌坐垫套装', quantity: '3套', unitPrice: 8800 },
      { name: '日式卫浴', brand: 'INAX伊奈', specification: '整体浴室套装', quantity: '2套', unitPrice: 32000 },
      { name: '竹制装饰', brand: '春竹', specification: '竹帘+竹编装饰', quantity: '1套', unitPrice: 12800 }
    ],
    tags: ['日式原木', '三室两厅', '禅意', '榻榻米']
  },
  {
    id: 7,
    title: '工业风·LOFT个性空间',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20style%20loft%20apartment%20living%20room%20exposed%20brick%20walls%20metal%20beams%20concrete%20floor%20edgy%20designer%20furniture&image_size=landscape_16_9',
    style: 'industrial',
    area: 86,
    priceRange: '10-20',
    priceMin: 14,
    priceMax: 19,
    layout: '2-2',
    community: '华润·橡树湾',
    designer: '赵铁男',
    description: 'LOFT工业风的个性张扬，裸露的红砖、金属管道、水泥地坪，打造充满艺术气息的个性居所。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20loft%20living%20room%20panorama%20exposed%20brick%20concrete%20floor%20metal%20ducts%20leather%20sofa%20edgy%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20style%20kitchen%20open%20shelving%20metal%20cabinets%20concrete%20island%20exposed%20pipes&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20bedroom%20loft%20style%20metal%20bed%20frame%20brick%20wall%20edison%20bulb%20lighting%20edgy&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20style%20bathroom%20exposed%20plumbing%20concrete%20sink%20metal%20fixtures%20black%20tiles&image_size=landscape_16_9'
    ],
    materials: [
      { name: '复古地坪', brand: '西卡', specification: '做旧水泥地坪', quantity: '86㎡', unitPrice: 280 },
      { name: '文化砖', brand: '古德', specification: '红砖饰面', quantity: '96㎡', unitPrice: 180 },
      { name: '铁艺置物架', brand: '铁工坊', specification: '定制金属架', quantity: '28米', unitPrice: 680 },
      { name: '皮革家具', brand: 'HTL', specification: '复古皮沙发', quantity: '1套', unitPrice: 26800 },
      { name: '工业风灯具', brand: 'KC灯具', specification: '爱迪生吊灯系列', quantity: '12盏', unitPrice: 680 },
      { name: '管道装饰', brand: '镀锌铁艺', specification: '装饰性管道', quantity: '1套', unitPrice: 8800 }
    ],
    tags: ['工业风', 'LOFT', '两室两厅', '个性']
  },
  {
    id: 8,
    title: '臻品·欧式古典大宅',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=european%20classical%20luxury%20living%20room%20interior%20design%20ornate%20details%20crystal%20chandelier%20gold%20accents%20marble%20floors%20elegant&image_size=landscape_16_9',
    style: 'european',
    area: 220,
    priceRange: '50+',
    priceMin: 88,
    priceMax: 120,
    layout: 'villa',
    community: '碧桂园·凤凰城别墅',
    designer: '周慧敏',
    description: '欧式古典的奢华典雅，大理石拼花、描金雕花、水晶吊灯，每一处细节都彰显尊贵品质。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20european%20classical%20villa%20living%20room%20panorama%20double%20height%20ceiling%20crystal%20chandelier%20marble%20columns%20gold%20details&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20european%20kitchen%20ornate%20wood%20cabinets%20gold%20handles%20marble%20island%20high%20end%20appliances%20elegant&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20master%20bedroom%20suite%20european%20style%20canopy%20bed%20silk%20drapes%20chandelier%20sitting%20area&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20european%20bathroom%20marble%20walls%20freestanding%20tub%20gold%20fixtures%20chandelier%20spa%20like&image_size=landscape_16_9'
    ],
    materials: [
      { name: '进口大理石', brand: '卡拉拉', specification: '鱼肚白拼花', quantity: '220㎡', unitPrice: 2680 },
      { name: '实木护墙板', brand: '豪利', specification: '描金雕花护墙板', quantity: '380㎡', unitPrice: 4800 },
      { name: '定制橱柜', brand: '博德宝', specification: '德国原装进口', quantity: '12延米', unitPrice: 68000 },
      { name: '水晶灯具', brand: '施华洛世奇', specification: '定制水晶灯', quantity: '1套', unitPrice: 188000 },
      { name: '欧式家具', brand: 'FENDI CASA', specification: '全屋定制家具', quantity: '1套', unitPrice: 680000 },
      { name: '智能家居', brand: 'Control4', specification: '全屋智能系统', quantity: '1套', unitPrice: 128000 }
    ],
    tags: ['欧式古典', '别墅', '奢华', '高端定制']
  },
  {
    id: 9,
    title: '悦享·现代轻奢三居',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20luxury%20contemporary%20living%20room%20interior%20design%20gold%20accents%20marble%20velvet%20furniture%20elegant%20chandelier&image_size=landscape_16_9',
    style: 'modern',
    area: 136,
    priceRange: '30-50',
    priceMin: 35,
    priceMax: 45,
    layout: '3-2',
    community: '中海·寰宇天下',
    designer: '吴雅婷',
    description: '现代轻奢的精致品味，金属线条、大理石、丝绒面料的完美结合，低调中尽显奢华。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20luxury%20living%20room%20panorama%20marble%20tv%20wall%20gold%20trim%20velvet%20sofa%20elegant%20pendant%20lighting&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20modern%20kitchen%20design%20marble%20island%20gold%20hardware%20wine%20cooler%20high%20end%20appliances&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20modern%20master%20bedroom%20velvet%20headboard%20marble%20accent%20wall%20walk%20in%20closet%20elegant&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20modern%20bathroom%20freestanding%20tub%20marble%20tile%20gold%20fixtures%20double%20vanity%20designer&image_size=landscape_16_9'
    ],
    materials: [
      { name: '大理石瓷砖', brand: '简一', specification: '大板连纹', quantity: '136㎡', unitPrice: 680 },
      { name: '金属线条', brand: '玫瑰金', specification: '不锈钢装饰条', quantity: '260米', unitPrice: 180 },
      { name: '定制衣柜', brand: '威法', specification: '进口烤漆门板', quantity: '42㎡', unitPrice: 3280 },
      { name: '岩板橱柜', brand: '拉丘娜', specification: '进口岩板台面', quantity: '7延米', unitPrice: 18800 },
      { name: '丝绒家具', brand: '锐驰', specification: '客厅+餐厅套装', quantity: '1套', unitPrice: 128000 },
      { name: '新风系统', brand: '松下', specification: '全热交换新风', quantity: '1套', unitPrice: 38000 }
    ],
    tags: ['现代轻奢', '三室两厅', '大理石', '金属']
  },
  {
    id: 10,
    title: '逸居·清新北欧两居',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bright%20scandinavian%20style%20apartment%20living%20room%20white%20walls%20pastel%20colors%20plants%20natural%20wood%20cozy%20hygge&image_size=landscape_16_9',
    style: 'nordic',
    area: 68,
    priceRange: '10-20',
    priceMin: 10,
    priceMax: 15,
    layout: '2-1',
    community: '金地·自在城',
    designer: '林晓月',
    description: '清新北欧风的Hygge生活，马卡龙色软装搭配绿植，小空间也能充满温馨与生机。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bright%20scandinavian%20living%20room%20panorama%20pastel%20colors%20many%20plants%20wooden%20furniture%20cozy%20hygge%20style&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=small%20scandinavian%20kitchen%20pastel%20green%20cabinets%20hexagon%20tiles%20plants%20window%20cozy&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20scandinavian%20bedroom%20pastel%20pink%20bedding%20plants%20string%20lights%20wooden%20furniture%20hygge&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=scandinavian%20style%20bathroom%20subway%20tiles%20plants%20wooden%20vanity%20mirror%20with%20lights%20fresh%20clean&image_size=landscape_16_9'
    ],
    materials: [
      { name: '浅色木地板', brand: '菲林格尔', specification: '白蜡木浅色', quantity: '68㎡', unitPrice: 260 },
      { name: '乳胶漆', brand: '立邦', specification: '马卡龙色系', quantity: '240㎡', unitPrice: 38 },
      { name: '定制家具', brand: '尚品宅配', specification: '北欧风格系列', quantity: '26㎡', unitPrice: 880 },
      { name: '简约橱柜', brand: '皮阿诺', specification: '平板门板', quantity: '4延米', unitPrice: 3600 },
      { name: '小砖', brand: '蜜蜂', specification: '六角砖/小白砖', quantity: '28㎡', unitPrice: 220 },
      { name: '北欧家具', brand: '宜家+造作', specification: '精选北欧套装', quantity: '1套', unitPrice: 22000 }
    ],
    tags: ['北欧', '两室一厅', '小户型', '清新']
  },
  {
    id: 11,
    title: '山海·海景别墅奢华',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20ocean%20view%20villa%20living%20room%20floor%20to%20ceiling%20windows%20panoramic%20sea%20view%20modern%20design%20high%20end&image_size=landscape_16_9',
    style: 'modern',
    area: 380,
    priceRange: '50+',
    priceMin: 158,
    priceMax: 220,
    layout: 'villa',
    community: '融创·东海湾独栋别墅',
    designer: '陈逸飞',
    description: '无敌海景独栋别墅，无边际泳池与海天一线融为一体，全开放式设计让自然景观成为最美装饰。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20ocean%20view%20villa%20living%20room%20panorama%20floor%20to%20ceiling%20windows%20infinity%20pool%20view%20modern%20minimalist&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20villa%20open%20kitchen%20dining%20area%20ocean%20view%20large%20table%20wine%20cellar%20high%20end%20modern&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20master%20bedroom%20suite%20ocean%20view%20private%20terrace%20freestanding%20bathtub%20spa%20like%20modern&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20outdoor%20infinity%20pool%20area%20ocean%20view%20sunset%20lounge%20chairs%20palm%20trees%20tropical%20villa&image_size=landscape_16_9'
    ],
    materials: [
      { name: '进口石材', brand: '意大利雪花白', specification: '外墙+地面', quantity: '680㎡', unitPrice: 5800 },
      { name: '系统门窗', brand: '阿鲁克', specification: '防弹级系统窗', quantity: '180㎡', unitPrice: 8800 },
      { name: '进口橱柜', brand: 'SieMatic', specification: '德国顶级定制', quantity: '18延米', unitPrice: 128000 },
      { name: '私家电梯', brand: '通力', specification: '家用别墅电梯', quantity: '1部', unitPrice: 380000 },
      { name: '泳池设备', brand: 'Pentair', specification: '无边际泳池系统', quantity: '1套', unitPrice: 580000 },
      { name: '智能家居', brand: 'Crestron快思聪', specification: '全屋智能中控', quantity: '1套', unitPrice: 380000 }
    ],
    tags: ['现代', '别墅', '海景', '顶奢']
  },
  {
    id: 12,
    title: '时光·复古工业一居',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vintage%20industrial%20style%20studio%20apartment%20exposed%20brick%20leather%20furniture%20edison%20bulbs%20wood%20accents%20cozy%20bachelor%20pad&image_size=landscape_16_9',
    style: 'industrial',
    area: 52,
    priceRange: '0-10',
    priceMin: 7,
    priceMax: 10,
    layout: '1-1',
    community: '青年公寓·文创园',
    designer: '刘大伟',
    description: '单身贵族的工业风小窝，复古质感与现代功能完美结合，开放式布局让空间更显宽敞。',
    panoramaImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vintage%20industrial%20studio%20apartment%20panorama%20open%20plan%20loft%20bed%20exposed%20brick%20cozy%20lighting&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=small%20industrial%20kitchenette%20open%20shelves%20metal%20racks%20wood%20countertop%20compact%20studio%20apartment&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20loft%20bed%20area%20mezzanine%20style%20exposed%20pipes%20warm%20lighting%20bachelor%20pad&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=small%20industrial%20bathroom%20black%20tiles%20exposed%20shower%20pipes%20concrete%20sink%20vintage%20style&image_size=landscape_16_9'
    ],
    materials: [
      { name: '耐磨地板', brand: 'OSMO', specification: '工业风强化地板', quantity: '52㎡', unitPrice: 180 },
      { name: '仿砖壁纸', brand: '格莱美', specification: '3D立体砖纹', quantity: '120㎡', unitPrice: 68 },
      { name: '铁艺隔断', brand: '铁工坊', specification: '黑色金属屏风', quantity: '12㎡', unitPrice: 480 },
      { name: '多功能家具', brand: '索菲亚', specification: '沙发床+收纳', quantity: '1套', unitPrice: 12800 },
      { name: '复古灯具', brand: 'RH风格', specification: '工业风灯具套装', quantity: '1套', unitPrice: 4800 },
      { name: '轨道插座', brand: '公牛', specification: '可移动电力轨道', quantity: '8米', unitPrice: 280 }
    ],
    tags: ['工业风', '一室一厅', '单身公寓', '复古']
  }
]

export const mockLayouts: HouseLayout[] = [
  {
    id: '1-1',
    name: '一室一厅',
    bedrooms: 1,
    livingrooms: 1,
    bathrooms: 1,
    kitchens: 1,
    typicalArea: '40-70㎡',
    description: '适合单身人士或小情侣的温馨小窝，功能紧凑布局合理',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=one%20bedroom%20apartment%20floor%20plan%203d%20rendering%20modern%20layout%20living%20room%20bedroom%20kitchen%20bathroom&image_size=square',
    caseIds: [12]
  },
  {
    id: '2-1',
    name: '两室一厅',
    bedrooms: 2,
    livingrooms: 1,
    bathrooms: 1,
    kitchens: 1,
    typicalArea: '60-90㎡',
    description: '小两口或三口之家的经典选择，主卧次卧分区明确',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=two%20bedroom%20apartment%20floor%20plan%203d%20rendering%20modern%20layout%20living%20room%20dining%20kitchen&image_size=square',
    caseIds: [5, 10]
  },
  {
    id: '2-2',
    name: '两室两厅',
    bedrooms: 2,
    livingrooms: 2,
    bathrooms: 1,
    kitchens: 1,
    typicalArea: '80-110㎡',
    description: '客厅餐厅独立分区，空间动线更加流畅舒适',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=two%20bedroom%20two%20living%20room%20apartment%20floor%20plan%203d%20rendering%20spacious%20modern&image_size=square',
    caseIds: [7]
  },
  {
    id: '3-1',
    name: '三室一厅',
    bedrooms: 3,
    livingrooms: 1,
    bathrooms: 1,
    kitchens: 1,
    typicalArea: '90-120㎡',
    description: '三口之家的理想选择，可做书房或儿童房灵活搭配',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=three%20bedroom%20apartment%20floor%20plan%203d%20rendering%20modern%20family%20home%20layout&image_size=square',
    caseIds: [3]
  },
  {
    id: '3-2',
    name: '三室两厅',
    bedrooms: 3,
    livingrooms: 2,
    bathrooms: 2,
    kitchens: 1,
    typicalArea: '110-160㎡',
    description: '改善型家庭首选，双卫设计早高峰不拥挤',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=three%20bedroom%20two%20bathroom%20apartment%20floor%20plan%203d%20rendering%20spacious%20modern%20family&image_size=square',
    caseIds: [1, 4, 6, 9]
  },
  {
    id: '4-2',
    name: '四室两厅',
    bedrooms: 4,
    livingrooms: 2,
    bathrooms: 2,
    kitchens: 1,
    typicalArea: '140-200㎡',
    description: '二胎家庭或三代同堂的完美选择，房间充足功能齐全',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=four%20bedroom%20house%20floor%20plan%203d%20rendering%20large%20family%20home%20modern%20layout&image_size=square',
    caseIds: [2]
  },
  {
    id: 'villa',
    name: '别墅复式',
    bedrooms: 5,
    livingrooms: 3,
    bathrooms: 4,
    kitchens: 2,
    typicalArea: '220㎡以上',
    description: '独栋/联排别墅、顶层复式，享受尊贵私密的居住体验',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20villa%20floor%20plan%203d%20rendering%20multi%20level%20spacious%20high%20end%20modern&image_size=square',
    caseIds: [8, 11]
  }
]

export const mockDecorGrades: DecorGrade[] = [
  {
    id: 'economy',
    name: '经济实用型',
    multiplier: 0.8,
    description: '选用国内一线品牌主材，注重性价比，满足基本居住需求'
  },
  {
    id: 'standard',
    name: '品质标准型',
    multiplier: 1.0,
    description: '国内外优质品牌组合，环保达标，工艺精细，适合大多数家庭'
  },
  {
    id: 'premium',
    name: '高端品质型',
    multiplier: 1.4,
    description: '进口主材+定制化设计，工艺考究，彰显生活品味'
  },
  {
    id: 'luxury',
    name: '奢华定制型',
    multiplier: 2.0,
    description: '国际顶级品牌，私人定制，大师级工艺，尊享品质生活'
  }
]

export const mockQuoteItems: QuoteItem[] = [
  {
    id: 'floor',
    name: '地面工程',
    category: 'hard',
    unit: '㎡',
    basePrice: 280,
    description: '包含地面找平、铺贴、辅料及人工费',
    defaultSelected: true,
    required: true
  },
  {
    id: 'wall',
    name: '墙面工程',
    category: 'hard',
    unit: '㎡',
    basePrice: 120,
    description: '包含墙面基层处理、批刮腻子、乳胶漆涂刷',
    defaultSelected: true,
    required: true
  },
  {
    id: 'ceiling',
    name: '吊顶工程',
    category: 'hard',
    unit: '㎡',
    basePrice: 180,
    description: '石膏板造型吊顶，包含龙骨、饰面及人工费',
    defaultSelected: true,
    required: false
  },
  {
    id: 'door',
    name: '室内门',
    category: 'hard',
    unit: '樘',
    basePrice: 3200,
    description: '实木复合门，含五金件及安装',
    defaultSelected: true,
    required: true
  },
  {
    id: 'window',
    name: '门窗套',
    category: 'hard',
    unit: '套',
    basePrice: 800,
    description: '木质门窗套，含石材窗台板',
    defaultSelected: true,
    required: false
  },
  {
    id: 'kitchen_cabinet',
    name: '整体橱柜',
    category: 'hard',
    unit: '延米',
    basePrice: 5800,
    description: '地柜+台面+吊柜，含基础五金',
    defaultSelected: true,
    required: true
  },
  {
    id: 'kitchen_appliance',
    name: '厨房电器',
    category: 'hard',
    unit: '套',
    basePrice: 12800,
    description: '烟机+灶具+水槽龙头三件套',
    defaultSelected: true,
    required: false
  },
  {
    id: 'bathroom_set',
    name: '卫浴套装',
    category: 'hard',
    unit: '套',
    basePrice: 8800,
    description: '马桶+花洒+台盆+浴室柜组合',
    defaultSelected: true,
    required: true
  },
  {
    id: 'waterproof',
    name: '防水工程',
    category: 'hard',
    unit: '㎡',
    basePrice: 160,
    description: '厨房卫生间防水处理，含闭水试验',
    defaultSelected: true,
    required: true
  },
  {
    id: 'plumbing',
    name: '水电改造',
    category: 'hard',
    unit: '㎡',
    basePrice: 380,
    description: '全屋水路电路重新布线，含国标电线水管',
    defaultSelected: true,
    required: true
  },
  {
    id: 'heating',
    name: '采暖系统',
    category: 'hard',
    unit: '㎡',
    basePrice: 320,
    description: '地暖/暖气片系统，含壁挂炉及安装',
    defaultSelected: false,
    required: false
  },
  {
    id: 'wardrobe',
    name: '定制衣柜',
    category: 'hard',
    unit: '㎡',
    basePrice: 1280,
    description: 'E0级板材定制衣柜，含基础五金',
    defaultSelected: true,
    required: false
  },
  {
    id: 'sofa',
    name: '沙发组合',
    category: 'soft',
    unit: '套',
    basePrice: 18800,
    description: '三人位+单人位/贵妃位布艺或皮艺沙发',
    defaultSelected: true,
    required: false
  },
  {
    id: 'dining',
    name: '餐桌椅',
    category: 'soft',
    unit: '套',
    basePrice: 6800,
    description: '餐桌+餐椅4-6把套装',
    defaultSelected: true,
    required: false
  },
  {
    id: 'bed',
    name: '卧室床品',
    category: 'soft',
    unit: '套',
    basePrice: 8800,
    description: '床架+床垫+床头柜组合',
    defaultSelected: true,
    required: false
  },
  {
    id: 'tv_stand',
    name: '电视柜茶几',
    category: 'soft',
    unit: '套',
    basePrice: 5600,
    description: '电视柜+茶几组合套装',
    defaultSelected: true,
    required: false
  },
  {
    id: 'curtain',
    name: '窗帘布艺',
    category: 'soft',
    unit: '套',
    basePrice: 4800,
    description: '全屋窗帘+纱帘+轨道罗马杆',
    defaultSelected: true,
    required: false
  },
  {
    id: 'lighting',
    name: '灯具灯饰',
    category: 'soft',
    unit: '套',
    basePrice: 3800,
    description: '全屋主灯+辅灯+光源套装',
    defaultSelected: true,
    required: false
  },
  {
    id: 'decoration',
    name: '装饰挂画',
    category: 'soft',
    unit: '套',
    basePrice: 2800,
    description: '装饰画+摆件+绿植软装搭配',
    defaultSelected: false,
    required: false
  },
  {
    id: 'carpet',
    name: '地毯地垫',
    category: 'soft',
    unit: '套',
    basePrice: 1800,
    description: '客厅地毯+各功能区地垫',
    defaultSelected: false,
    required: false
  },
  {
    id: 'smart_home',
    name: '智能系统',
    category: 'soft',
    unit: '套',
    basePrice: 18800,
    description: '智能开关+窗帘+安防+语音控制',
    defaultSelected: false,
    required: false
  }
]
