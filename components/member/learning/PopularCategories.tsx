"use client";

import Link from 'next/link';
import { Pill, FlaskConical, Stethoscope, Briefcase, Microscope, ClipboardList, HeartPulse, UserCheck } from 'lucide-react';
import styles from './PopularCategories.module.css';
import SectionHeader from '@/components/ui/SectionHeader';

const categories = [
    { id: 1, title: 'เภสัชกรรมชุมชน', count: 124, icon: <Pill size={28} />, color: '#4e73df' },
    { id: 2, title: 'เภสัชกรรมโรงพยาบาล', count: 85, icon: <Stethoscope size={28} />, color: '#1cc88a' },
    { id: 3, title: 'การผลิตและควบคุม', count: 42, icon: <FlaskConical size={28} />, color: '#f6c23e' },
    { id: 4, title: 'กฎหมายและจริยธรรม', count: 56, icon: <Briefcase size={28} />, color: '#e74a3b' },
    { id: 5, title: 'เภสัชวิเคราะห์', count: 38, icon: <Microscope size={28} />, color: '#36b9cc' },
    { id: 6, title: 'การคุ้มครองผู้บริโภค', count: 29, icon: <UserCheck size={28} />, color: '#f6c23e' },
    { id: 7, title: 'เภสัชศาสตร์นวัตกรรม', count: 15, icon: <HeartPulse size={28} />, color: '#4e73df' },
    { id: 8, title: 'การบริหารงานคลัง', count: 22, icon: <ClipboardList size={28} />, color: '#1cc88a' }
];

export default function PopularCategories() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <SectionHeader title="หมวดหมู่ยอดนิยม" viewAllHref="/learning/categories" viewAllText="ดูทั้งหมด" />

                <div className={styles.grid}>
                    {categories.map(cat => (
                        <Link 
                            key={cat.id} 
                            href={`/learning/courses?category=${cat.title}`}
                            className={styles.card} 
                            style={{ '--hover-color': cat.color } as any}
                        >
                            <div className={styles.iconWrapper} style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                {cat.icon}
                            </div>
                            <h3 className={styles.catTitle}>{cat.title}</h3>
                            <p className={styles.catCount}>{cat.count} คอร์สเรียน</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
