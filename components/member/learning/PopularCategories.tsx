"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './PopularCategories.module.css';
import SectionHeader from '@/components/ui/SectionHeader';

const categories = [
    { id: 1, title: 'เภสัชกรรมชุมชน', count: 124, image: '/images/public/learning/categories/cat1.png', color: '#4e73df' },
    { id: 2, title: 'เภสัชกรรมโรงพยาบาล', count: 85, image: '/images/public/learning/categories/cat2.png', color: '#1cc88a' },
    { id: 3, title: 'การผลิตและควบคุม', count: 42, image: '/images/public/learning/categories/cat3.png', color: '#f6c23e' },
    { id: 4, title: 'กฎหมายและจริยธรรม', count: 56, image: '/images/public/learning/categories/cat4.png', color: '#e74a3b' },
    { id: 5, title: 'เภสัชวิเคราะห์', count: 38, image: '/images/public/learning/categories/cat5.png', color: '#36b9cc' },
    { id: 6, title: 'การคุ้มครองผู้บริโภค', count: 29, image: '/images/public/learning/categories/cat6.png', color: '#f6c23e' },
    { id: 7, title: 'เภสัชศาสตร์นวัตกรรม', count: 15, image: '/images/public/learning/categories/cat7.png', color: '#4e73df' },
    { id: 8, title: 'การบริหารงานคลัง', count: 22, image: '/images/public/learning/categories/cat8.png', color: '#1cc88a' }
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
                            <div className={styles.imageWrapper}>
                                <div className={styles.imageInner}>
                                    <img src={cat.image} alt={cat.title} className={styles.catImage} onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=' + encodeURIComponent(cat.title) }} />
                                </div>
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
