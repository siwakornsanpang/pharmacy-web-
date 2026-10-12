"use client";

import AcademySkeleton from '@/components/member/learning/AcademySkeleton';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import LearningBanner from '@/components/member/learning/LearningBanner';
import CourseFilters from '@/components/member/learning/courses/CourseFilters';
import PopularCategories from '@/components/member/learning/PopularCategories';
import FeaturedCourse from '@/components/member/learning/FeaturedCourse';
import PopularCourses from '@/components/member/learning/PopularCourses';
import ExperiencedInstructors from '@/components/member/learning/ExperiencedInstructors';
import LearningStats from '@/components/member/learning/LearningStats';
import LearnerReviews from '@/components/member/learning/LearnerReviews';
import SectionHeader from '@/components/ui/SectionHeader';
import { getAcademyStats, getAcademyCategories as listAcademyCategories, getAcademyCourses, getAcademyInstructors as listAcademyInstructors, getAcademyReviews as listAcademyReviews } from '@/lib/academy';
import styles from './learning.module.css';

const loadPopularCourses = () => getAcademyCourses().then(items => items.slice(0, 9));
const loadFeaturedCourses = () => getAcademyCourses({ featured: true }).then(items => items.filter(course => course.isFeatured));

type SectionStatus = 'loading' | 'ready' | 'error';

function useAcademySection<T>(load: () => Promise<T>, initialData: T, fallbackError: string) {
    const [data, setData] = useState(initialData);
    const [status, setStatus] = useState<SectionStatus>('loading');
    const [error, setError] = useState('');
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let active = true;
        load().then((result) => {
            if (active) { setData(result); setStatus('ready'); }
        }).catch(() => {
            if (active) { setError(fallbackError); setStatus('error'); }
        });
        return () => { active = false; };
    }, [load, fallbackError, version]);

    const retry = () => {
        setStatus('loading');
        setError('');
        setVersion((current) => current + 1);
    };
    return { data, status, error, retry };
}

function SectionState({ title, href, loadingText, emptyText, section }: {
    title: string;
    href?: string;
    loadingText: string;
    emptyText: string;
    section: { status: SectionStatus; error: string; retry: () => void };
}) {
    return <section className={styles.sectionState} aria-label={title}>
        <div className={styles.container}>
            <SectionHeader title={title} viewAllHref={href} />
            <div className={styles.sectionMessage} role={section.status === 'loading' ? undefined : section.status === 'error' ? 'alert' : 'status'}>
                {section.status === 'loading' ? <AcademySkeleton count={title.includes('วิทยากร') || title.includes('หมวดหมู่') ? 4 : title.includes('แนะนำ') ? 2 : 3} label={loadingText} variant={title === 'สถิติการเรียนรู้' ? 'stats' : title.includes('หมวดหมู่') ? 'categories' : title.includes('วิทยากร') ? 'instructors' : title.includes('รีวิว') ? 'lines' : title.includes('แนะนำ') ? 'detail' : 'cards'} /> : <p>{section.status === 'error' ? section.error : emptyText}</p>}
                {section.status === 'error' && <button type="button" className={styles.retryButton}
                    aria-label={`ลองอีกครั้ง: ${title}`} onClick={section.retry}>ลองอีกครั้ง</button>}
            </div>
        </div>
    </section>;
}

export default function LearningPage() {
    const router = useRouter();
    const [searching, startSearch] = useTransition();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
    const categories = useAcademySection(listAcademyCategories, [], 'โหลดหมวดหมู่ไม่สำเร็จ');
    const courses = useAcademySection(loadPopularCourses, [], 'โหลดคอร์สยอดนิยมไม่สำเร็จ');
    const featured = useAcademySection(loadFeaturedCourses, [], 'โหลดคอร์สแนะนำไม่สำเร็จ');
    const instructors = useAcademySection(listAcademyInstructors, [], 'โหลดวิทยากรไม่สำเร็จ');
    const reviews = useAcademySection(listAcademyReviews, [], 'โหลดรีวิวไม่สำเร็จ');
    const stats = useAcademySection(getAcademyStats, null, 'โหลดสถิติไม่สำเร็จ');

    useEffect(() => {
        // Restore this tab's search after hydration, including browser Back.
        const frame = requestAnimationFrame(() => {
            try {
                const saved = JSON.parse(sessionStorage.getItem('academy-home-filters') || '{}');
                if (typeof saved.search === 'string') setSearchTerm(saved.search);
                if (typeof saved.category === 'string') setSelectedCategory(saved.category);
            } catch { /* Use the default filters when storage is unavailable. */ }
        });
        return () => cancelAnimationFrame(frame);
    }, []);
    const rememberFilters = (search: string, category: string) => {
        setSearchTerm(search);
        setSelectedCategory(category);
        try { sessionStorage.setItem('academy-home-filters', JSON.stringify({search, category})); } catch { /* Storage may be disabled. */ }
    };

    const openCourses = (search = searchTerm, category = selectedCategory) => {
        const query = new URLSearchParams();
        if (search.trim()) query.set('search', search.trim());
        if (category !== 'ทั้งหมด') query.set('category', category);
        startSearch(() => router.push(`/learning/courses${query.size ? `?${query}` : ''}#course-results`));
    };

    return <div className={styles.page}>
        <LearningBanner />
        <div className={`${styles.container} ${styles.search}`}>
            <CourseFilters categories={['ทั้งหมด', ...categories.data.map((item) => item.name)]}
                selectedCategory={selectedCategory} searchTerm={searchTerm}
                onCategoryChange={category => {
                    rememberFilters(searchTerm, category);
                    openCourses(searchTerm, category);
                }} onSearchChange={search => rememberFilters(search, selectedCategory)} onSearch={openCourses} searching={searching} />
            <div className={styles.myCoursesHeader}><SectionHeader title="คอร์สของฉัน" viewAllHref="/learning/mine" /></div>
        </div>
        {categories.status === 'ready' && categories.data.length > 0 ? <PopularCategories categories={categories.data} /> :
            <SectionState title="หมวดหมู่คอร์สเรียน" href="/learning/categories" loadingText="กำลังโหลดหมวดหมู่..." emptyText="ยังไม่มีหมวดหมู่คอร์สเรียน" section={categories} />}
        {featured.status === 'ready' && featured.data.length > 0 ? <FeaturedCourse courses={featured.data} /> :
            <SectionState title="คอร์สเรียนแนะนำ" href="/learning/courses" loadingText="กำลังโหลดคอร์สแนะนำ..." emptyText="ยังไม่มีคอร์สแนะนำ" section={featured} />}
        {instructors.status === 'ready' && instructors.data.length > 0 ? <ExperiencedInstructors instructors={instructors.data} /> :
            <SectionState title="วิทยากรผู้เชี่ยวชาญ" href="/learning/instructors" loadingText="กำลังโหลดวิทยากร..." emptyText="ยังไม่มีข้อมูลวิทยากร" section={instructors} />}
        {stats.status === 'ready' && stats.data ? <LearningStats courseCount={stats.data.courseCount} learnerCount={stats.data.learnerCount} instructorCount={stats.data.instructorCount} /> :
            <SectionState title="สถิติการเรียนรู้" loadingText="กำลังโหลดสถิติ..." emptyText="ยังไม่มีข้อมูลสถิติ" section={stats} />}
        {courses.status === 'ready' && courses.data.length > 0 ? <PopularCourses courses={courses.data} /> :
            <SectionState title="คอร์สเรียนยอดนิยม" href="/learning/courses" loadingText="กำลังโหลดคอร์สยอดนิยม..." emptyText="ยังไม่มีคอร์สที่เผยแพร่" section={courses} />}
        {reviews.status === 'ready' && reviews.data.length > 0 ? <LearnerReviews reviews={reviews.data} /> :
            <SectionState title="รีวิวจากผู้เรียน" href="/learning/reviews" loadingText="กำลังโหลดรีวิว..." emptyText="ยังไม่มีรีวิวจากผู้เรียน" section={reviews} />}
    </div>;
}
