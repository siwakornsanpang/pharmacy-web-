import type { AcademyCourse, AcademyOrder } from './client';

const STORAGE_KEY = 'pharmacy-academy-checkout-v2';
interface LocalStore {orders: AcademyOrder[]; nextOrderId: number}
function storageKey(userId: string) {
  if (!userId.trim()) throw new Error('กรุณาเข้าสู่ระบบใหม่');
  return `${STORAGE_KEY}:${encodeURIComponent(userId)}`;
}
function readStore(userId: string): LocalStore {
  const key = storageKey(userId);
  try {
    const saved = window.localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved) as LocalStore;
      if (Array.isArray(parsed.orders) && Number.isSafeInteger(parsed.nextOrderId)) return parsed;
    }
  } catch { /* Ignore damaged drafts; legacy shared payments are never imported. */ }
  return {orders: [], nextOrderId: Date.now()};
}
function saveStore(store: LocalStore, userId: string) {
  window.localStorage.setItem(storageKey(userId), JSON.stringify(store));
}
export const localRegistration = {
  createPendingOrder(course: AcademyCourse, userId: string): {type: 'payment_required'; order: AcademyOrder} {
    const store = readStore(userId);
    const pending = store.orders.find(item => item.courseId === course.id && item.status === 'pending');
    if (pending) {
      pending.courseTitle = course.title;
      pending.amountSnapshot = String(course.price);
      saveStore(store, userId);
      return {type: 'payment_required', order: pending};
    }
    const order: AcademyOrder = {id: store.nextOrderId++, courseId: course.id, courseTitle: course.title,
      amountSnapshot: String(course.price), status: 'pending'};
    store.orders.push(order);
    saveStore(store, userId);
    return {type: 'payment_required', order};
  },
  getOrder(orderId: number, userId: string): AcademyOrder {
    const order = readStore(userId).orders.find(item => item.id === orderId);
    if (!order) throw Object.assign(new Error('ไม่พบคำสั่งซื้อของบัญชีนี้ กรุณาเลือกคอร์สใหม่'), {status: 404});
    return order;
  },
};
