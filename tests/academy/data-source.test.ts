import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  const values = new Map<string, string>();
  Object.defineProperty(window, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
    clear: () => { values.clear(); },
  } });
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('Academy data source', () => {
  it('loads the published catalog from the shared API', async () => {
    const fetchRequest = vi.fn().mockResolvedValue(Response.json([{
      id: 87, title: 'คอร์สจริง', coverUrl: '/cover.jpg', categoryId: 4, price: '350',
    }]));
    vi.stubGlobal('fetch', fetchRequest);

    const { listAcademyCourses } = await import('@/lib/academy/client');
    const page = await listAcademyCourses({ categoryId: 4, limit: 1 });

    expect(fetchRequest).toHaveBeenCalledOnce();
    expect(String(fetchRequest.mock.calls[0][0])).toContain('/api/academy/courses');
    expect(page.items[0]).toMatchObject({ id: 87, title: 'คอร์สจริง', thumbnailUrl: '/cover.jpg' });
    expect(page.total).toBe(1);
  });

  it('persists simulated payment through the member API, and reloads server registration', async () => {
    let enrolled = false;
    const fetchRequest = vi.fn(async (url: string, init?: RequestInit) => {
      if (url === '/api/academy/enrollments') return Response.json(enrolled ? [{ courseId: 87, status: 'active' }] : []);
      if (url === '/api/academy/courses/87/order' && init?.method === 'POST') {
        enrolled = true;
        return Response.json({ success: true, orderId: 15, status: 'paid' });
      }
      return Response.json({ id: 87, title: 'คอร์สจริง', categoryId: 4, price: '350' });
    });
    vi.stubGlobal('fetch', fetchRequest);
    const { createAcademyOrder, completeMockAcademyOrder, getAcademyOrder, getAcademyEnrollments } = await import('@/lib/academy/client');
    const result = await createAcademyOrder(87);
    expect(result.type).toBe('payment_required');
    if (result.type !== 'payment_required') throw new Error('Expected checkout');
    expect(fetchRequest.mock.calls.some(([, init]) => init?.method === 'POST')).toBe(false);
    expect(await completeMockAcademyOrder(result.order.id)).toEqual({ status: 'paid' });
    expect(fetchRequest).toHaveBeenCalledWith('/api/academy/courses/87/order', expect.objectContaining({ method: 'POST', credentials: 'include' }));
    expect(await getAcademyEnrollments()).toMatchObject([{ courseId: 87, status: 'active' }]);
    expect(await getAcademyOrder(result.order.id)).toMatchObject({ status: 'paid' });
    await completeMockAcademyOrder(result.order.id);
    expect(fetchRequest.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1);
  });

  it.each([500, 401])('does not mark payment successful after API failure %s', async status => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => url.endsWith('/order')
      ? Response.json({ message: 'บันทึกไม่สำเร็จ' }, { status })
      : Response.json([])));
    const { localRegistration } = await import('@/lib/academy/local-registration');
    const { mapIncomingCourse } = await import('@/lib/academy/incoming');
    const { completeMockAcademyOrder, getAcademyOrder } = await import('@/lib/academy/client');
    const { order } = localRegistration.createPendingOrder(mapIncomingCourse({ id: 87, title: 'Test', price: '350' }));
    await expect(completeMockAcademyOrder(order.id)).rejects.toThrow('บันทึกไม่สำเร็จ');
    expect(await getAcademyOrder(order.id)).toMatchObject({ status: 'pending' });
  });

  it('does not treat an old browser-only payment as a database enrollment', async () => {
    window.localStorage.setItem('pharmacy-academy-local-registration-v1', JSON.stringify({
      enrollments: [{courseId: 87, status: 'active'}], nextOrderId: 8002,
      orders: [{id: 8001, courseId: 87, status: 'mock_paid', amountSnapshot: '350'}],
    }));
    vi.stubGlobal('fetch', vi.fn(async () => Response.json([])));
    const { getAcademyOrder, getAcademyEnrollments } = await import('@/lib/academy/client');
    expect(await getAcademyOrder(8001)).toMatchObject({status: 'pending'});
    expect(await getAcademyEnrollments()).toEqual([]);
  });

  it('does not show success when the API only accepts a pending payment', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => Response.json(url.endsWith('/order')
      ? {success: true, status: 'pending'} : [])));
    const { localRegistration } = await import('@/lib/academy/local-registration');
    const { mapIncomingCourse } = await import('@/lib/academy/incoming');
    const { completeMockAcademyOrder } = await import('@/lib/academy/client');
    const {order} = localRegistration.createPendingOrder(mapIncomingCourse({id: 87, title: 'Test', price: '350'}));
    await expect(completeMockAcademyOrder(order.id)).rejects.toThrow('ระบบยังไม่ยืนยัน');
  });
});
