"use client";

import styles from './PopularCourses.module.css';
import SectionHeader from '@/components/member/learning/SectionHeader';
import CourseCard from './courses/CourseCard';
import type { AcademyCourse } from '@/lib/academy';

export default function PopularCourses({ courses }: { courses: AcademyCourse[] }) {
    return <section className={styles.section}>
        <div className={styles.container}>
            <SectionHeader title="คอร์สเรียนยอดนิยม" viewAllHref="/learning/courses" viewAllText="ดูทั้งหมด" />
            <div className={styles.grid}>
                {courses.slice(0, 9).map(course => <CourseCard key={course.id}
                    id={course.id} title={course.title} category={course.categoryName}
                    duration={course.durationLabel || 'เรียนตามเวลาของคุณ'} cpe={course.cpeLabel}
                    image={course.coverUrl} color={course.categoryColor || undefined}
                    format={course.format} instructor={course.instructorName} returnTo="/learning" />)}
            </div>
        </div>
    </section>;
}
