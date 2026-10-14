import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ScrollToTopOnNavigate from '@/components/member/learning/AcademyScrollRestoration';
import GlobalScrollToTop from '@/components/ui/ScrollToTopOnNavigate';

import {academyCourseHref, academyCoursesHref, academySource} from '@/lib/academy/navigation';
import {goBack, nextBackEntry} from '@/lib/academy/back-navigation';

const route = vi.hoisted(() => ({pathname: '/learning'}));
vi.mock('next/navigation', () => ({usePathname: () => route.pathname}));

describe('Academy navigation', () => {
  it('returns to the Academy home for a course opened there', () => {
    const href = academyCourseHref(1, '/learning');
    const source = academySource(new URL(href, 'https://academy.local').searchParams.get('from'));
    expect(source).toBe('/learning');
  });

  it('retains course list filters through course details', () => {
    const source = academySource('/learning/courses?search=ไต&category=เภสัชกรรมชุมชน');
    const courseHref = academyCourseHref(3, source);
    expect(academySource(new URL(courseHref, 'https://academy.local').searchParams.get('from'))).toBe(source);
  });

  it('falls back to Academy home for an untrusted return URL', () => {
    expect(academySource('https://example.com/learning/courses')).toBe('/learning');
    expect(academySource('//example.com/learning/courses')).toBe('/learning');
  });

  it('keeps list filters in the history URL', () => {
    const url = new URL(academyCoursesHref('ไต', 'เภสัชกรรมชุมชน'), 'https://academy.local');
    expect(url.pathname).toBe('/learning/courses');
    expect(url.searchParams.get('search')).toBe('ไต');
    expect(url.searchParams.get('category')).toBe('เภสัชกรรมชุมชน');
    expect(academyCoursesHref('', 'ทั้งหมด')).toBe('/learning/courses');
  });
});

describe('back navigation', () => {
  it('returns to the most recent history entry when one exists', () => {
    const router = { back: vi.fn(), push: vi.fn() };

    goBack(router, '/learning', { __pharmacyBack: { path: '/learning/3', depth: 1 } }, 2);

    expect(router.back).toHaveBeenCalledOnce();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('uses the fallback for a directly opened page', () => {
    const router = { back: vi.fn(), push: vi.fn() };

    goBack(router, '/learning', { __pharmacyBack: { path: '/learning/3', depth: 0 } }, 2);

    expect(router.back).not.toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/learning');
  });

  it('tracks app pages but does not count a direct entry as a previous app page', () => {
    const entry = nextBackEntry({}, '/learning/3', null);
    expect(entry.depth).toBe(0);

    const next = nextBackEntry(entry, '/learning/checkout', { path: '/learning/3', depth: 0 });
    expect(next.depth).toBe(1);

    const restored = nextBackEntry({ __pharmacyBack: entry }, '/learning/3', { path: '/learning/checkout', depth: 1 });
    expect(restored.depth).toBe(0);
  });
});

describe('Academy return scroll position', () => {
  beforeEach(() => {
    sessionStorage.clear();
    route.pathname = '/learning';
    history.replaceState({}, '', '/learning');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 4000 });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => { callback(0); return 1; });
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('keeps the global scroll behavior unchanged on pages outside Academy', () => {
    route.pathname = '/home';
    history.replaceState({}, '', '/home');
    render(<GlobalScrollToTop />);
    expect(window.scrollTo).toHaveBeenCalledWith({top: 0, left: 0, behavior: 'auto'});
  });

  it('lets the Academy layout reveal results without a global reset', () => {
    route.pathname = '/learning/courses';
    history.replaceState({}, '', '/learning/courses?search=test#course-results');
    const results = document.createElement('div');
    results.id = 'course-results';
    results.scrollIntoView = vi.fn();
    document.body.appendChild(results);
    try {
      render(<><ScrollToTopOnNavigate /><GlobalScrollToTop /></>);
      expect(results.scrollIntoView).toHaveBeenCalledWith({block: 'start', behavior: 'instant'});
      expect(window.scrollTo).not.toHaveBeenCalled();
    } finally {results.remove();}
  });

  it('waits for the fetched list to grow before restoring the full position', () => {
    let resize: (() => void) | undefined;
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { resize = callback; }
      observe() {}
      disconnect() {}
    });
    const page = render(<ScrollToTopOnNavigate />);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1200 });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    history.pushState({}, '', '/learning/1');
    route.pathname = '/learning/1';
    page.rerender(<ScrollToTopOnNavigate />);
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 600 });
    history.replaceState({}, '', '/learning');
    act(() => { window.dispatchEvent(new PopStateEvent('popstate')); });
    route.pathname = '/learning';
    page.rerender(<ScrollToTopOnNavigate />);
    vi.mocked(window.scrollTo).mockClear();
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 4000 });
    act(() => { resize?.(); });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1200, left: 0, behavior: 'instant' });
    vi.unstubAllGlobals();
  });

  it('restores the last position after returning from a course', () => {
    const page = render(<ScrollToTopOnNavigate />);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 920 });
    act(() => { window.dispatchEvent(new Event('scroll')); });
    history.pushState({}, '', '/learning/1');
    route.pathname = '/learning/1';
    page.rerender(<ScrollToTopOnNavigate />);
    vi.mocked(window.scrollTo).mockClear();

    history.replaceState({}, '', '/learning');
    act(() => { window.dispatchEvent(new PopStateEvent('popstate')); });
    route.pathname = '/learning';
    page.rerender(<ScrollToTopOnNavigate />);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 920, left: 0, behavior: 'instant' });
    expect(window.scrollTo).not.toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
  });
});
