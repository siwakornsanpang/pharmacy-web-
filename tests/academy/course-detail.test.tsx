import { beforeEach } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import CourseDetailPage from '@/app/(member)/05_learning/[id]/page';
import { createAcademyOrder, getAcademyEnrollments, listAcademyReviews } from '@/lib/academy/client';
import { getAcademyCourse } from '@/lib/academy';

vi.mock('@/lib/academy', () => ({ getAcademyCourse: vi.fn() }));

const { route, push } = vi.hoisted(() => ({ route: { id: '1' }, push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: route.id }),
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push, back: vi.fn() }),
}));
vi.mock('@/lib/academy/client', () => ({
  AcademyError: class extends Error {}, getAcademyCourse: vi.fn(), getAcademyEnrollments: vi.fn(),
  listAcademyReviews: vi.fn(), createAcademyOrder: vi.fn(),
}));

const course = (id: number) => ({ id: Number(id), title: `คอร์ส ${id}`, summary: 'รายละเอียด', instructorName: 'ผู้สอน',
  coverUrl: null, durationLabel: '1 ชั่วโมง', cpeCredits: '1', cpeLabel: '1 หน่วยกิต', price: '0', categoryName: null,
  categoryColor: null, instructorTitle: null, studentCount: 0, rating: null, reviewCount: 0, outcomes: [],
  isFeatured: false, format: undefined as unknown as 'online', venue: null, trainingStartsAt: null, trainingEndsAt: null,
  conferenceCode: null, audience: 'all', instructorExpertise: null, instructorImageUrl: null, lessons: [] });

beforeEach(() => {
  vi.mocked(getAcademyEnrollments).mockResolvedValue([]);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: true, json: async () => ({enrolled: false, progressPercent: 0})}));
});

afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals(); route.id = '1'; });

describe('Academy course details', () => {
  it('opens the original local mock checkout without posting a paid order to the API', async () => {
    vi.mocked(getAcademyCourse).mockResolvedValue({...course(1), price: '1200'});
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    vi.mocked(createAcademyOrder).mockResolvedValue({type: 'payment_required', order: {
      id: 8001, courseId: 1, courseTitle: 'คอร์ส 1', amountSnapshot: '1200', status: 'pending',
    }});
    render(<CourseDetailPage />);
    fireEvent.click(await screen.findByRole('button', {name: 'ชำระเงินจำลอง'}));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/learning/checkout?orderId=8001&from=%2Flearning'));
    expect(createAcademyOrder).toHaveBeenCalledWith(1, expect.objectContaining({id: 1, price: '1200'}));
    expect(vi.mocked(fetch).mock.calls.some(([, init]) => init?.method === 'POST')).toBe(false);
  });

  it('ignores old local mock registrations and still offers checkout', async () => {
    vi.mocked(getAcademyCourse).mockResolvedValue({...course(1), price: '1200'});
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    vi.mocked(getAcademyEnrollments).mockResolvedValue([{courseId: 1, status: 'active'}]);
    render(<CourseDetailPage />);
    expect(await screen.findByRole('button', {name: 'ชำระเงินจำลอง'})).toBeInTheDocument();
    expect(screen.queryByText(/ลงทะเบียนจำลองแล้ว/)).not.toBeInTheDocument();
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

  it('shows a skeleton during loading and omits absent category and format tags', async () => {
    let resolveCourse!: (value: ReturnType<typeof course>) => void;
    vi.mocked(getAcademyCourse).mockReturnValue(new Promise((resolve) => { resolveCourse = resolve; }));
    vi.mocked(getAcademyEnrollments).mockResolvedValue([]);
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    render(<CourseDetailPage />);
    const status = screen.getByRole('status', { name: 'กำลังโหลดรายละเอียดคอร์ส...' });
    expect(status.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    resolveCourse(course(1));
    await screen.findByRole('heading', { level: 1, name: 'คอร์ส 1' });
    expect(screen.queryByText('Pharmacy Academy')).not.toBeInTheDocument();
    expect(screen.queryByText('คอร์สออนไลน์')).not.toBeInTheDocument();
    expect(screen.queryByText('รูปแบบ')).not.toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'กำลังโหลดรายละเอียดคอร์ส...' })).not.toBeInTheDocument();
  });

  it('scrolls to lessons without adding hash history that would trap the back link', async () => {
    vi.mocked(getAcademyEnrollments).mockResolvedValue([]);
    vi.mocked(getAcademyCourse).mockResolvedValue(course(1));
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    render(<CourseDetailPage />);
    await screen.findByRole('heading', { level: 1, name: 'คอร์ส 1' });
    const lessons = screen.getByRole('heading', { name: 'บทเรียนในคอร์ส' }).closest('section')!;
    const scrollIntoView = vi.fn();
    lessons.scrollIntoView = scrollIntoView;
    const historyLength = window.history.length;
    const hash = window.location.hash;
    fireEvent.click(screen.getByRole('link', { name: 'บทเรียน' }));
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(window.history.length).toBe(historyLength);
    expect(window.location.hash).toBe(hash);
  });

  it('keeps the back link after a load failure and retries details and reviews separately', async () => {
    vi.mocked(getAcademyEnrollments).mockResolvedValue([]);
    vi.mocked(getAcademyCourse).mockRejectedValueOnce(new Error('offline')).mockResolvedValue(course(1));
    vi.mocked(listAcademyReviews).mockRejectedValueOnce(new Error('offline')).mockResolvedValue([]);
    render(<CourseDetailPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent('โหลดรายละเอียดคอร์สไม่สำเร็จ');
    expect(screen.getByRole('link', { name: 'ย้อนกลับ' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'ลองอีกครั้ง' }));
    await screen.findByRole('heading', { level: 1, name: 'คอร์ส 1' });
    fireEvent.click(await screen.findByRole('button', { name: 'โหลดรีวิวอีกครั้ง' }));
    await screen.findByText('ยังไม่มีรีวิวสำหรับคอร์สนี้');
    expect(getAcademyCourse).toHaveBeenCalledTimes(2);
    expect(listAcademyReviews).toHaveBeenCalledTimes(2);
  });

  it('replaces previous course content when the route changes', async () => {
    vi.mocked(getAcademyEnrollments).mockResolvedValue([]);
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


describe('Academy course audit fixes', () => {
  it('matches reviews by course ID even when course titles are identical', async () => {
    vi.mocked(getAcademyEnrollments).mockResolvedValue([]);
    vi.mocked(getAcademyCourse).mockResolvedValue(course(1));
    vi.mocked(listAcademyReviews).mockResolvedValue([
      {id:1,courseId:1,courseTitle:'คอร์ส 1',rating:5,body:'รีวิวคอร์สที่เลือก',reviewerName:'A',reviewerRole:null},
      {id:2,courseId:2,courseTitle:'คอร์ส 1',rating:5,body:'รีวิวคอร์สอื่นชื่อซ้ำ',reviewerName:'B',reviewerRole:null},
    ]);
    render(<CourseDetailPage />);
    await screen.findByText('รีวิวคอร์สที่เลือก');
    expect(screen.queryByText('รีวิวคอร์สอื่นชื่อซ้ำ')).not.toBeInTheDocument();
  });
  it('shows onsite start and end dates in Bangkok time', async () => {
    vi.mocked(getAcademyEnrollments).mockResolvedValue([]);
    vi.mocked(listAcademyReviews).mockResolvedValue([]);
    vi.mocked(getAcademyCourse).mockResolvedValue({...course(1),format:'onsite',trainingStartsAt:'2026-10-07T02:00:00Z',trainingEndsAt:'2026-10-07T09:00:00Z'});
    render(<CourseDetailPage />);
    await screen.findByText('เริ่มอบรม');
    expect(screen.getByText('สิ้นสุดอบรม')).toBeInTheDocument();
    expect(screen.getByText(/09:00 น./)).toBeInTheDocument();
    expect(screen.getByText(/16:00 น./)).toBeInTheDocument();
  });
});


it('shows a retry state rather than claiming no reviews when the old API omits course IDs', async () => {
  vi.mocked(getAcademyEnrollments).mockResolvedValue([]);
  vi.mocked(getAcademyCourse).mockResolvedValue(course(1));
  vi.mocked(listAcademyReviews).mockResolvedValue([{id:1,courseTitle:'คอร์ส 1',rating:5,body:'รีวิวเก่า',reviewerName:'A',reviewerRole:null}]);
  render(<CourseDetailPage />);
  await screen.findByRole('button',{name:'โหลดรีวิวอีกครั้ง'});
  expect(screen.queryByText('ยังไม่มีรีวิวสำหรับคอร์สนี้')).not.toBeInTheDocument();
});
