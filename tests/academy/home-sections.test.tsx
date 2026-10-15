import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import LearningPage from '@/app/(member)/05_learning/page';
import { getAcademyStats, getAcademyCategories, getAcademyCourses, getAcademyInstructors, getAcademyReviews } from '@/lib/academy';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/lib/academy', () => ({
  AcademyError: class extends Error {}, getAcademyStats: vi.fn(), getAcademyCategories: vi.fn(),
  getAcademyCourses: vi.fn(), getAcademyInstructors: vi.fn(), getAcademyReviews: vi.fn(),
}));
beforeEach(() => { vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} unobserve() {} }); });
afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals(); sessionStorage.clear(); });

describe('Academy home section loading', () => {
  it('restores the search draft and category when returning to Academy home', async () => {
    vi.mocked(getAcademyCategories).mockResolvedValue([{id:1,name:'เภสัชกรรมชุมชน',courseCount:0,description:null,imageUrl:null,color:null}]);
    vi.mocked(getAcademyCourses).mockResolvedValue([]);
    vi.mocked(getAcademyInstructors).mockResolvedValue([]);
    vi.mocked(getAcademyReviews).mockResolvedValue([]);
    vi.mocked(getAcademyStats).mockResolvedValue({courseCount:0,learnerCount:0,instructorCount:0});
    const view = render(<LearningPage />);
    await screen.findByRole('option', {name:'เภสัชกรรมชุมชน'});
    fireEvent.change(screen.getByRole('textbox',{name:'ค้นหาคอร์ส'}), {target:{value:'diabetes'}});
    expect(push).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole('combobox'), {target:{value:'เภสัชกรรมชุมชน'}});
    expect(push).toHaveBeenLastCalledWith('/learning/courses?search=diabetes&category=%E0%B9%80%E0%B8%A0%E0%B8%AA%E0%B8%B1%E0%B8%8A%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8A%E0%B8%B8%E0%B8%A1%E0%B8%8A%E0%B8%99#course-results');
    fireEvent.click(screen.getByRole('button', {name:'ค้นหา'}));
    expect(push).toHaveBeenLastCalledWith('/learning/courses?search=diabetes&category=%E0%B9%80%E0%B8%A0%E0%B8%AA%E0%B8%B1%E0%B8%8A%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8A%E0%B8%B8%E0%B8%A1%E0%B8%8A%E0%B8%99#course-results');
    view.unmount();
    render(<LearningPage />);
    await waitFor(() => expect(screen.getByRole('textbox',{name:'ค้นหาคอร์ส'})).toHaveValue('diabetes'));
    expect(screen.getByRole('combobox')).toHaveValue('เภสัชกรรมชุมชน');
  });

  it('keeps successful courses visible when categories fail and retries only the failed section', async () => {
    vi.mocked(getAcademyCategories).mockRejectedValueOnce(new Error('offline')).mockResolvedValue([{ id: 1, name: 'หมวดหมู่ใหม่', courseCount: 1, description:null, imageUrl:null, color:null }]);
    const course = { id: 1, title: 'คอร์สที่โหลดสำเร็จ', summary: null, instructorName: null,
      coverUrl:null,durationLabel:'1 ชั่วโมง',cpeLabel:'1 หน่วยกิต',categoryName:null,categoryColor:null,instructorTitle:null,studentCount:0,rating:null,reviewCount:0,outcomes:[],isFeatured:false,format:'online' as const,venue:null,trainingStartsAt:null,trainingEndsAt:null };
    vi.mocked(getAcademyCourses).mockResolvedValue([course]);
    vi.mocked(getAcademyInstructors).mockResolvedValue([]);
    vi.mocked(getAcademyReviews).mockResolvedValue([]);
    vi.mocked(getAcademyStats).mockResolvedValue({ courseCount: 1, learnerCount: 2, instructorCount: 0 });
    render(<LearningPage />);
    expect(screen.queryAllByText(/ยังไม่มี/)).toHaveLength(0);
    expect(screen.getAllByRole('status')).toHaveLength(6);
    expect(screen.getByRole('status', { name: 'กำลังโหลดคอร์สยอดนิยม...' }).querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    await screen.findByText('คอร์สที่โหลดสำเร็จ');
    expect(await screen.findByRole('alert')).toHaveTextContent('โหลดหมวดหมู่ไม่สำเร็จ');
    const calls = vi.mocked(getAcademyCourses).mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: /ลองอีกครั้ง/ }));
    await screen.findByRole('link', { name: /หมวดหมู่ใหม่/ });
    expect(getAcademyCourses).toHaveBeenCalledTimes(calls);
    expect(screen.getByText('คอร์สที่โหลดสำเร็จ')).toBeInTheDocument();
  });
});
