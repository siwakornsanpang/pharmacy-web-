import {afterEach, expect, it, vi} from 'vitest';
import {localRegistration} from '@/lib/academy/local-registration';
import {mapIncomingCourse} from '@/lib/academy/incoming';
afterEach(() => vi.unstubAllGlobals());
it('isolates checkout drafts and never imports anonymous legacy payments', () => {
  const values = new Map<string,string>();
  vi.stubGlobal('localStorage', {getItem: (key:string) => values.get(key) ?? null, setItem: (key:string,value:string) => values.set(key,value)});
  values.set('pharmacy-academy-local-registration-v1', JSON.stringify({orders:[{id:99,courseId:1,status:'mock_paid'}],enrollments:[],nextOrderId:100}));
  const course = mapIncomingCourse({id:1,title:'A',price:'100'});
  const a = localRegistration.createPendingOrder(course, 'ภ12345');
  expect(() => localRegistration.getOrder(a.order.id,'11111')).toThrow();
  expect(() => localRegistration.getOrder(99,'ภ12345')).toThrow();
  const b = localRegistration.createPendingOrder({...course,title:'B'}, '11111');
  expect(localRegistration.getOrder(a.order.id,'ภ12345').courseTitle).toBe('A');
  expect(localRegistration.getOrder(b.order.id,'11111').courseTitle).toBe('B');
});
