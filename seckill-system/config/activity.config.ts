import type { SeckillActivityConfig, ActivityRule } from '~/types'

const now = Date.now()
const oneHour = 60 * 60 * 1000
const oneDay = 24 * oneHour

export const activityRules: ActivityRule[] = [
  {
    id: 'rule-1',
    title: '活动时间',
    content: '本次秒杀活动分为多个场次，每场次商品数量有限，售完即止。',
    type: 'normal'
  },
  {
    id: 'rule-2',
    title: '限购规则',
    content: '单用户每日限购2件，单场次限购1件，活动期间总限购5件。',
    type: 'important'
  },
  {
    id: 'rule-3',
    title: '支付规则',
    content: '下单后请在15分钟内完成支付，超时未支付订单将自动取消。',
    type: 'important'
  },
  {
    id: 'rule-4',
    title: '发货说明',
    content: '秒杀商品将在活动结束后3个工作日内安排发货，节假日顺延。',
    type: 'normal'
  },
  {
    id: 'rule-5',
    title: '退换货政策',
    content: '秒杀商品非质量问题不支持退换，请谨慎下单。如有质量问题，请在收到商品后7天内联系客服。',
    type: 'normal'
  },
  {
    id: 'rule-6',
    title: '温馨提示',
    content: '同一账户、手机号、设备号、收货地址均视为同一用户。恶意刷单行为将被取消订单资格。',
    type: 'important'
  }
]

export const activityConfig: SeckillActivityConfig = {
  id: 'seckill-2024-618',
  name: '618年中大促秒杀',
  title: '🔥 618限时秒杀',
  subtitle: '爆款好物 低至1折 限量开抢',
  bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ecommerce%20promotion%20banner%20red%20orange%20gradient%20618%20sale&image_size=landscape_16_9',
  posterImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=seckill%20activity%20poster%20vertical%20mobile%20promotion&image_size=portrait_9_16',
  startTime: now - oneHour,
  endTime: now + 7 * oneDay,
  rules: activityRules,
  limitPerUser: 5,
  limitPerSession: 1,
  dailyLimit: 2,
  enableLoginRequired: true,
  enableStockAnimation: true,
  enableCountdownPopup: true,
  enableSuccessParticles: true,
  paymentTimeout: 900,
  shareTitle: '618秒杀来了！爆款低至1折，手慢无！',
  shareImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=seckill%20share%20image%20promotion&image_size=square',
  backgroundColor: '#fff5f5',
  primaryColor: '#ff3b30',
  sortType: 'discount'
}
