"use client";

import React from 'react';
import { BookOpen, Stethoscope, Pill, FlaskConical, Shirt, GraduationCap } from 'lucide-react';
import styles from './CategoryHighlights.module.css';

const CATEGORIES = [
    { icon: <BookOpen size={28} />, name: 'ตำราวิชาการ', count: 48 },
    { icon: <Stethoscope size={28} />, name: 'อุปกรณ์การแพทย์', count: 35 },
    { icon: <Pill size={28} />, name: 'ผลิตภัณฑ์สุขภาพ', count: 62 },
    { icon: <FlaskConical size={28} />, name: 'อุปกรณ์ห้องปฏิบัติการ', count: 21 },
    { icon: <Shirt size={28} />, name: 'เครื่องแบบ', count: 18 },
    { icon: <GraduationCap size={28} />, name: 'สื่อการเรียนรู้', count: 29 },
];

interface CategoryHighlightsProps {
    onCategorySelect: (name: string) => void;
}

export default function CategoryHighlights({ onCategorySelect }: CategoryHighlightsProps) {
    return (
        <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} ThaiFont`}>หมวดหมู่สินค้า</h2>
            <div className={styles.grid}>
                {CATEGORIES.map((cat, i) => (
                    <button
                        key={i}
                        className={styles.card}
                        onClick={() => onCategorySelect(cat.name)}
                    >
                        <div className={styles.iconWrap}>{cat.icon}</div>
                        <span className={`${styles.catName} ThaiFont`}>{cat.name}</span>
                        <span className={`${styles.catCount} ThaiFont`}>{cat.count} รายการ</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
