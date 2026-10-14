import { beforeEach } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import CourseDetailPage from '@/app/(member)/05_learning/[id]/page';
import { listAcademyReviews } from '@/lib/academy/client';
import { getAcademyCourse } from '@/lib/academy';

vi.mock('@/lib/academy', () => ({ getAcademyCourse: vi.fn() }));

const {route, push} = vi.hoisted(() => ({route: {id:'1'}, push:vi.fn()}));
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: route.id }),
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push, back: vi.fn() }),
}));
vi.mock('@/lib/academy/client', () => ({
  AcademyError: class extends Error {}, getAcademyCourse: vi.fn(),
  listAcademyReviews: vi.fn(),
}));

const course = (id: number) => ({ id: Number(id), title: `คอร์ส ${id}`, summary: 'รายละเอียด', instructorName: 'ผู้สอน',
  coverUrl: null, durationLabel: '1 ชั่วโมง', cpeCredits: '1', cpeLabel: '1 หน่วยกิต', price: '0', categoryName: null,
  categoryColor: null, instructorTitle: null, studentCount: 0, rating: null, reviewCount: 0, outcomes: [],
  isFeatured: false, format: undefined as unknown as 'online', venue: null, trainingStartsAt: null, trainingEndsAt: null,
  conferenceCode: null, audience: 'all', instructorExpertise: null, instructorImageUrl: null, lessons: [] });

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: true, json: async () => ({enrolled: false, progressPercent: 0})}));
});

afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals(); route.id = '1'; });

describe('Academy detail UI with existing member flow', () => {
  it('matches Siwakorn: posts simulated payment directly and opens learning after API success', async () => {
    vi.mocked(getAcademyCourse).mockResolvedValue({...course(1), price: '1200'});
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    render(<CourseDetailPage />);
    fireEvent.click(await screen.findByRole('button', {name: 'ชำระเงินจำลอง'}));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/academy/courses/1/order', expect.objectContaining({method: 'POST', body: '{}'})));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/learning/1/learn'));
    expect(screen.getByText(/ไม่มีการเรียกเก็บเงินจริง/)).toBeInTheDocument();
  });

  it('stays on details and shows the API error when simulated payment is rejected', async () => {
    vi.mocked(getAcademyCourse).mockResolvedValue({...course(1), price: '1200'});
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    vi.mocked(fetch).mockImplementation(async (_url, init) => ({
      ok: init?.method !== 'POST',
      json: async () => init?.method === 'POST' ? {message: 'Unauthorized: Pharmacy session ไม่ถูกต้องหรือหมดอายุ'} : {enrolled: false},
    }) as Response);
    render(<CourseDetailPage />);
    fireEvent.click(await screen.findByRole('button', {name: 'ชำระเงินจำลอง'}));
    expect(await screen.findByText('Unauthorized: Pharmacy session ไม่ถูกต้องหรือหมดอายุ')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole('button', {name: 'ชำระเงินจำลอง'})).toBeEnabled();
  });

  it('keeps API enrollment in the restored detail design', async () => {
    vi.mocked(getAcademyCourse).mockResolvedValue(course(1));
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    render(<CourseDetailPage />);
    fireEvent.click(await screen.findByRole('button', {name: 'ลงทะเบียนเรียน'}));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/academy/courses/1/enroll', expect.objectContaining({method: 'POST'})));
  });

  it('shows learning and certificate links for a completed enrollment', async () => {
    vi.mocked(getAcademyCourse).mockResolvedValue(course(1));
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    vi.mocked(fetch).mockResolvedValue({ok: true, json: async () => ({enrolled: true, progressPercent: 100})} as Response);
    render(<CourseDetailPage />);
    expect(await screen.findByRole('link', {name: 'เข้าเรียน'})).toHaveAttribute('href', '/learning/1/learn');
    expect(screen.getByRole('link', {name: 'ใบประกาศ'})).toHaveAttribute('href', '/learning/1/certificate');
    expect(screen.queryByRole('button', {name: 'ลงทะเบียนเรียน'})).not.toBeInTheDocument();
  });

  it('replaces previous course content when the route changes', async () => {
    vi.mocked(getAcademyCourse).mockImplementation(async (id) => course(Number(id)));
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    const view = render(<CourseDetailPage />);
    await screen.findByRole('heading', { level: 1, name: 'คอร์ส 1' });
    route.id = '2';
    view.rerender(<CourseDetailPage />);
    await screen.findByRole('heading', { level: 1, name: 'คอร์ส 2' });
    expect(screen.queryByRole('heading', { level: 1, name: 'คอร์ส 1' })).not.toBeInTheDocument();
    await waitFor(() => expect(getAcademyCourse).toHaveBeenLastCalledWith('2'));
  });
});
