import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import MyCourses from '@/app/(member)/05_learning/mine/page';

vi.mock('next/navigation', () => ({useRouter: () => ({push: vi.fn(), back: vi.fn()})}));
afterEach(() => {cleanup(); vi.unstubAllGlobals();});

it('keeps the empty state hidden until loading completes', () => {
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
  render(<MyCourses />);
  expect(screen.getByRole('status', {name: 'กำลังโหลดคอร์สของฉัน...'})).toBeInTheDocument();
  expect(screen.queryByText('ยังไม่มีคอร์สเรียน')).not.toBeInTheDocument();
});

it('shows a useful empty state with a course discovery link', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: true, json: async () => []}));
  render(<MyCourses />);
  expect(await screen.findByRole('heading', {name: 'ยังไม่มีคอร์สเรียน'})).toBeInTheDocument();
  expect(screen.getByRole('link', {name: 'ค้นหาคอร์สเรียน'})).toHaveAttribute('href', '/learning/courses');
});

it('handles a network failure and retries without displaying empty results', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ok: true, json: async () => []}));
  render(<MyCourses />);
  fireEvent.click(await screen.findByRole('button', {name: 'ลองอีกครั้ง'}));
  expect(await screen.findByRole('heading', {name: 'ยังไม่มีคอร์สเรียน'})).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(2);
});

it('shows progress and keeps cancelled courses separate from active learning', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: true, json: async () => [
    {courseId: 2, title: 'คอร์สที่เรียนอยู่', status: 'active', progressPercent: 45},
    {courseId: 3, title: 'คอร์สที่ยกเลิก', status: 'cancelled', progressPercent: 80},
  ]}));
  render(<MyCourses />);
  expect(await screen.findByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
  expect(screen.getByRole('link', {name: 'เรียนต่อ'})).toHaveAttribute('href', '/learning/2/learn');
  expect(screen.getByText('ยกเลิกแล้ว')).toBeInTheDocument();
  expect(screen.getByRole('link', {name: 'ดูรายละเอียด'})).toHaveAttribute('href', '/learning/3');
});

it('does not expose a technical error when the server returns an empty body', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false, json: async () => {throw new SyntaxError('Unexpected end of JSON input');}}));
  render(<MyCourses />);
  expect(await screen.findByRole('alert')).toHaveTextContent('ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง');
  expect(screen.queryByText(/Unexpected/)).not.toBeInTheDocument();
});
