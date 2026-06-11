export enum SeckillStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ENDED = 'ended',
  SOLD_OUT = 'sold_out'
}

export enum SessionStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  PAST = 'past'
}

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  COMPLETED = 'completed'
}

export interface SeckillActivityConfig {
  id: string
  name: string
  title: string
  subtitle: string
  bannerImage: string
  posterImage: string
  startTime: number
  endTime: number
  rules: ActivityRule[]
  limitPerUser: number
  limitPerSession: number
  dailyLimit: number
  enableLoginRequired: boolean
  enableStockAnimation: boolean
  enableCountdownPopup: boolean
  enableSuccessParticles: boolean
  paymentTimeout: number
  shareTitle: string
  shareImage: string
  backgroundColor: string
  primaryColor: string
  sortType: 'discount' | 'price' | 'stock' | 'sold' | 'custom'
}

export interface ActivityRule {
  id: string
  title: string
  content: string
  type: 'normal' | 'important'
}

export interface SeckillSession {
  id: string
  name: string
  title: string
  startTime: number
  endTime: number
  status: SessionStatus
  productIds: string[]
  discountRate: number
  isHot: boolean
  sort: number
}

export interface SeckillProduct {
  id: string
  name: string
  description: string
  images: string[]
  mainImage: string
  originalPrice: number
  seckillPrice: number
  discount: number
  totalStock: number
  soldCount: number
  remainingStock: number
  sessionId: string
  category: string
  tags: string[]
  sort: number
  isHot: boolean
  isNew: boolean
  specs: ProductSpec[]
  detailImages: string[]
}

export interface ProductSpec {
  name: string
  value: string
}

export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone: string
  isLoggedIn: boolean
  purchaseHistory: PurchaseRecord[]
}

export interface PurchaseRecord {
  productId: string
  sessionId: string
  quantity: number
  purchaseTime: number
  orderId: string
}

export interface SeckillOrder {
  id: string
  orderNo: string
  productId: string
  product: SeckillProduct
  sessionId: string
  userId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  originalTotalPrice: number
  status: OrderStatus
  createTime: number
  expireTime: number
  payTime?: number
  cancelTime?: number
  cancelReason?: string
  specInfo?: string
  receiverName?: string
  receiverPhone?: string
  receiverAddress?: string
}

export interface SeckillModalConfig {
  visible: boolean
  type: 'countdown' | 'order_confirm' | 'rules' | 'success' | 'error' | 'info'
  title?: string
  content?: string
  data?: any
  onConfirm?: () => void
  onCancel?: () => void
}

export interface CountdownInfo {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMilliseconds: number
  isExpired: boolean
}

export interface StockChangeEvent {
  productId: string
  oldStock: number
  newStock: number
  changeAmount: number
  timestamp: number
}

export interface PurchaseLimitInfo {
  canPurchase: boolean
  reason?: 'not_logged_in' | 'daily_limit' | 'session_limit' | 'total_limit' | 'sold_out' | 'not_started' | 'ended'
  remaining?: number
  limit?: number
  message?: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface SeckillPurchaseResult {
  success: boolean
  orderId?: string
  order?: SeckillOrder
  errorCode?: 'stock_insufficient' | 'activity_ended' | 'limit_exceeded' | 'not_logged_in' | 'system_error'
  errorMessage?: string
}

export interface LazyLoadOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export interface ParticleConfig {
  count: number
  colors: string[]
  minSize: number
  maxSize: number
  duration: number
}
