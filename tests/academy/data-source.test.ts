import {afterEach, describe, expect, it, vi} from 'vitest';
import {listAcademyCategories, listAcademyCourses, listAcademyReviews} from '@/lib/academy/client';
afterEach(()=>{vi.unstubAllGlobals();vi.clearAllMocks();});
describe('Academy public data for UI',()=>{
  it('uses the existing public catalog reader and preserves search parameters',async()=>{
    const request=vi.fn<typeof fetch>(async()=>Response.json([{id:7,title:'คอร์ส',coverUrl:'/cover.jpg',price:'350',categoryId:2}]));
    vi.stubGlobal('fetch',request);
    const page=await listAcademyCourses({search:'ยา',categoryId:2});
    const url=String(request.mock.calls[0][0]);
    expect(url).toContain('/academy/courses');
    expect(url).not.toContain('/api/academy/');
    expect(new URL(url,'https://example.test').searchParams.get('q')).toBe('ยา');
    expect(page.items[0]).toMatchObject({id:7,thumbnailUrl:'/cover.jpg',price:'350'});
    expect(request.mock.calls.every(([,init])=>!init?.method||init.method==='GET')).toBe(true);
  });
  it('maps categories from the existing reader and preserves Back Office order',async()=>{
    vi.stubGlobal('fetch',vi.fn<typeof fetch>(async()=>Response.json([{id:4,name:'B',courseCount:1},{id:2,name:'A',courseCount:5}])));
    expect(await listAcademyCategories()).toMatchObject([{id:4,name:'B',count:1},{id:2,name:'A',count:5}]);
  });
  it('loads reviews without adding member authentication requests',async()=>{
    const request=vi.fn<typeof fetch>(async()=>Response.json([{id:1,courseId:7,reviewerName:'ผู้เรียน',body:'ดี',rating:5}]));
    vi.stubGlobal('fetch',request);
    expect(await listAcademyReviews()).toMatchObject([{id:1,courseId:7}]);
    expect(request).toHaveBeenCalledOnce();
    expect(String(request.mock.calls[0][0])).toContain('/academy/reviews');
    expect(String(request.mock.calls[0][0])).not.toContain('/auth/');
  });
});
