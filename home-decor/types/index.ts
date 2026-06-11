export interface CaseItem {
  id: number
  title: string
  coverImage: string
  style: string
  area: number
  priceRange: string
  priceMin: number
  priceMax: number
  layout: string
  community: string
  designer: string
  description: string
  panoramaImages: string[]
  materials: MaterialItem[]
  tags: string[]
}

export interface MaterialItem {
  name: string
  brand: string
  specification: string
  quantity: string
  unitPrice: number
}

export interface QuoteItem {
  id: string
  name: string
  category: 'hard' | 'soft'
  unit: string
  basePrice: number
  description: string
  defaultSelected: boolean
  required: boolean
}

export interface SelectedQuoteItem {
  itemId: string
  quantity: number
  unitPrice: number
}

export interface DecorGrade {
  id: string
  name: string
  multiplier: number
  description: string
}

export interface HouseLayout {
  id: string
  name: string
  bedrooms: number
  livingrooms: number
  bathrooms: number
  kitchens: number
  typicalArea: string
  description: string
  image: string
  caseIds: number[]
}

export interface AppointmentRecord {
  id: string
  name: string
  phone: string
  community: string
  area?: number
  createdAt: string
  status: 'pending' | 'confirmed' | 'completed'
}

export interface FilterState {
  style: string
  areaRange: string
  priceRange: string
  layout: string
}

export const STYLE_OPTIONS = [
  { value: '', label: '全部风格' },
  { value: 'modern', label: '现代简约' },
  { value: 'nordic', label: '北欧风格' },
  { value: 'chinese', label: '新中式' },
  { value: 'european', label: '欧式古典' },
  { value: 'american', label: '美式乡村' },
  { value: 'japanese', label: '日式原木' },
  { value: 'industrial', label: '工业风' },
  { value: 'minimalist', label: '极简主义' }
]

export const AREA_OPTIONS = [
  { value: '', label: '全部面积' },
  { value: '0-60', label: '60㎡以下' },
  { value: '60-90', label: '60-90㎡' },
  { value: '90-120', label: '90-120㎡' },
  { value: '120-150', label: '120-150㎡' },
  { value: '150+', label: '150㎡以上' }
]

export const PRICE_OPTIONS = [
  { value: '', label: '全部价位' },
  { value: '0-10', label: '10万以下' },
  { value: '10-20', label: '10-20万' },
  { value: '20-30', label: '20-30万' },
  { value: '30-50', label: '30-50万' },
  { value: '50+', label: '50万以上' }
]

export const LAYOUT_OPTIONS = [
  { value: '', label: '全部户型' },
  { value: '1-1', label: '一室一厅' },
  { value: '2-1', label: '两室一厅' },
  { value: '2-2', label: '两室两厅' },
  { value: '3-1', label: '三室一厅' },
  { value: '3-2', label: '三室两厅' },
  { value: '4-2', label: '四室两厅' },
  { value: 'villa', label: '别墅复式' }
]
