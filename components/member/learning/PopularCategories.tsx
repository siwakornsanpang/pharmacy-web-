"use client";

import type { CSSProperties } from "react";
import Link from 'next/link';
import styles from './PopularCategories.module.css';
import SectionHeader from '@/components/member/learning/SectionHeader';
import type { AcademyCategory } from '@/lib/academy';
import AcademyImage from './AcademyImage';
import AcademyImagePlaceholder from './AcademyImagePlaceholder';

export default function PopularCategories({ categories, showAll = false }: { categories: AcademyCategory[]; showAll?: boolean }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {!showAll && <SectionHeader title="หมวดหมู่ยอดนิยม" viewAllHref="/learning/categories" viewAllText="ดูทั้งหมด" />}

                <div className={styles.grid}>
                    {(showAll ? categories : categories.slice(0, 8)).map(cat => (
                        <Link 
                            key={cat.id} 
                            href={`/learning/courses?category=${encodeURIComponent(cat.name)}`}
                            className={styles.card} 
                            style={{ '--hover-color': cat.color || '#737300' } as CSSProperties}
                        >
                            <div className={styles.imageWrapper}>
                                <div className={styles.imageInner}>
                                    {cat.imageUrl ? <AcademyImage src={cat.imageUrl} alt={cat.name} fill sizes="60px" className={styles.catImage} /> : <AcademyImagePlaceholder />}
                                </div>
                            </div>
                            <h3 className={styles.catTitle}>{cat.name}</h3>
                            <p className={styles.catCount}>{cat.courseCount} คอร์สเรียน</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
