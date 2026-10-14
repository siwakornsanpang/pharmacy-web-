import {afterEach, expect, it, vi} from 'vitest';
import {act, cleanup, renderHook} from '@testing-library/react';
import {useAcademyRefresh} from '@/lib/academy/use-academy-refresh';
afterEach(() => {cleanup();vi.useRealTimers();});
it('refreshes after returning to the tab and deduplicates focus plus visibility events', () => {
  vi.useFakeTimers();vi.setSystemTime(new Date('2026-10-14T00:00:00Z'));
  const {result, unmount}=renderHook(()=>useAcademyRefresh());
  expect(result.current).toBe(0);
  act(()=>{window.dispatchEvent(new Event('focus'));document.dispatchEvent(new Event('visibilitychange'));});
  expect(result.current).toBe(1);
  vi.advanceTimersByTime(300);
  act(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
  expect(result.current).toBe(2);
  unmount();
  act(()=>window.dispatchEvent(new Event('focus')));
});
