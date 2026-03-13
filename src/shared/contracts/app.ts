export const userRoles = ['CUSTOMER', 'ATTENDANT', 'ADMIN'] as const
export type UserRole = (typeof userRoles)[number]

export const orderStatuses = [
  'PENDING',
  'PROCESSING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const
export type OrderStatus = (typeof orderStatuses)[number]

export const paymentMethods = ['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH'] as const
export type PaymentMethod = (typeof paymentMethods)[number]

export const customerModes = ['AUTHENTICATED', 'GUEST'] as const
export type CustomerMode = (typeof customerModes)[number]

export const productKinds = ['MENU', 'COMBO_COMPONENT'] as const
export type ProductKind = (typeof productKinds)[number]

export const comboGroups = ['MASSA', 'SABOR', 'ADDON'] as const
export type ComboGroup = (typeof comboGroups)[number]

export interface ApiErrorPayload {
  message: string
}

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  phone: string | null
  role: UserRole
}

export interface Address {
  id: string
  label?: string | null
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  reference?: string | null
  isDefault: boolean
}

export interface DeliveryAddressInput {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  reference?: string
}

export interface GuestInfoInput {
  name: string
  phone: string
}

export interface AuthSessionPayload {
  user: AuthenticatedUser
  defaultAddress?: Address | null
}

export interface OrderItemInput {
  productId: string
  quantity: number
  notes?: string
}

export interface CreateOrderInput {
  items: OrderItemInput[]
  deliveryAddress: DeliveryAddressInput
  paymentMethod: PaymentMethod
  changeFor?: number
  notes?: string
  customerMode: CustomerMode
  guestInfo?: GuestInfoInput
}

export interface CatalogProduct {
  id: string
  categoryId: string
  categoryName: string
  name: string
  description: string
  price: number
  imageUrl: string | null
}

export interface ComboOption {
  id: string
  name: string
  description?: string
  price: number
  group: ComboGroup
  iconKey?: string
  tag?: string
}

export interface OrderLineSnapshot {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
  notes?: string | null
}

export interface OrderStatusHistoryEntry {
  fromStatus: OrderStatus | null
  toStatus: OrderStatus
  changedAt: string
  changedByName: string | null
}

export interface OrderSummary {
  id: string
  trackingCode: string
  status: OrderStatus
  createdAt: string
  total: number
  paymentMethod: PaymentMethod
  customerName: string
}

export interface AdminOrderSummary extends OrderSummary {
  customerMode: CustomerMode
  updatedAt: string
}

export interface AdminUserSummary {
  id: string
  name: string
  email: string
  phone: string | null
  role: UserRole
  createdAt: string
  hasDefaultAddress: boolean
}

export interface OrderDetail extends OrderSummary {
  subtotal: number
  deliveryFee: number
  discount: number
  changeFor: number | null
  deliveryAddress: DeliveryAddressInput
  items: OrderLineSnapshot[]
  history: OrderStatusHistoryEntry[]
  notes?: string | null
}

export interface OrderMetrics {
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  totalRevenue: number
}

export interface AdminDashboardMetrics extends OrderMetrics {
  processingOrders: number
  readyOrders: number
  outForDeliveryOrders: number
  revenueToday: number
  averageTicket: number
  customerCount: number
  ordersToday: number
}

export interface AdminOrderFilters {
  status?: OrderStatus
  customerMode?: CustomerMode
  search?: string
  dateFrom?: string
  dateTo?: string
}
