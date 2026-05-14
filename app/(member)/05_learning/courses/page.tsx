"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import styles from './courses.module.css';
import LearningBanner from '@/components/member/learning/LearningBanner';
import CourseCard from '@/components/member/learning/courses/CourseCard';
import CourseFilters from '@/components/member/learning/courses/CourseFilters';

const ALL_COURSES = [
    { id: 1, title: "การจัดการความดันโลหิตสูงในผู้ป่วยสูงอายุ", category: "เภสัชกรรมโรงพยาบาล", type: "online", duration: "2.5 ชม.", cpe: "2.5 หน่วยกิต" },
    { id: 2, title: "ทักษะการสื่อสารเพื่อการดูแลผู้ป่วยเบาหวาน", category: "เภสัชกรรมชุมชน", type: "online", duration: "1.5 ชม.", cpe: "1.5 หน่วยกิต" },
    { id: 3, title: "เภสัชกรรมคลินิกในโรคไตเรื้อรัง", category: "เภสัชกรรมชุมชน", type: "onsite", duration: "3 ชม.", cpe: "3.0 หน่วยกิต" },
    { id: 4, title: "การบริบาลทางเภสัชกรรมในผู้ป่วยมะเร็ง", category: "เภสัชกรรมโรงพยาบาล", type: "online", duration: "2 ชม.", cpe: "2.0 หน่วยกิต" },
    { id: 5, title: "การประเมินความปลอดภัยของผลิตภัณฑ์สมุนไพร", category: "การผลิตและควบคุม", type: "onsite", duration: "4 ชม.", cpe: "4.0 หน่วยกิต" },
    { id: 6, title: "กฎหมายและจรรยาบรรณวิชาชีพเภสัชกรรม 2024", category: "กฎหมายและจริยธรรม", type: "online", duration: "1.5 ชม.", cpe: "1.5 หน่วยกิต" },
    { id: 7, title: "เทคโนโลยี AI ในงานเภสัชกรรมสมัยใหม่", category: "เภสัชศาสตร์นวัตกรรม", type: "online", duration: "2.5 ชม.", cpe: "2.5 หน่วยกิต" },
    { id: 8, title: "การจัดการคลังยาและโลจิสติกส์การแพทย์", category: "การบริหารงานคลัง", type: "onsite", duration: "3 ชม.", cpe: "3.0 หน่วยกิต" },
    { id: 9, title: "จิตวิทยาการบริการสำหรับเภสัชกรชุมชน", category: "เภสัชกรรมชุมชน", type: "online", duration: "2 ชม.", cpe: "2.0 หน่วยกิต" },
];

const CATEGORIES = [
    "ทั้งหมด",
    "เภสัชกรรมชุมชน",
    "เภสัชกรรมโรงพยาบาล",
    "การผลิตและควบคุม",
    "กฎหมายและจริยธรรม",
    "เภสัชศาสตร์นวัตกรรม",
    "การบริหารงานคลัง",
    "เภสัชกรรมคลินิก"
];

const COURSE_TYPES = [
    { value: 'all', label: 'ทุกประเภท' },
    { value: 'online', label: 'คอร์สออนไลน์' },
    { value: 'onsite', label: 'อบรมสัมมนา' },
];

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'เภสัชกรรมชุมชน': return '#4e73df';
        case 'เภสัชกรรมโรงพยาบาล': return '#1cc88a';
        case 'การผลิตและควบคุม': return '#f6c23e';
        case 'กฎหมายและจริยธรรม': return '#e74a3b';
        case 'เภสัชวิเคราะห์': return '#36b9cc';
        case 'การคุ้มครองผู้บริโภค': return '#f6c23e';
        case 'เภสัชศาสตร์นวัตกรรม': return '#4e73df';
        case 'การบริหารงานคลัง': return '#1cc88a';
        default: return '#737300';
    }
};

function CoursesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
    const [selectedType, setSelectedType] = useState("all");

    useEffect(() => {
        const catParam = searchParams.get('category');
        if (catParam && CATEGORIES.includes(catParam)) {
            setSelectedCategory(catParam);
        }
    }, [searchParams]);

    const filteredCourses = ALL_COURSES.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "ทั้งหมด" || course.category === selectedCategory;
        const matchesType = selectedType === "all" || course.type === selectedType;
        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className={styles.page}>
            <LearningBanner onBack={() => router.back()} />
            
            <section className={styles.searchSection}>
                <div className={styles.container}>
                    <CourseFilters 
                        categories={CATEGORIES}
                        courseTypes={COURSE_TYPES}
                        selectedCategory={selectedCategory}
                        selectedType={selectedType}
                        searchTerm={searchTerm}
                        onCategoryChange={setSelectedCategory}
                        onTypeChange={setSelectedType}
                        onSearchChange={setSearchTerm}
                    />
                </div>
            </section>

            <section className={styles.coursesSection}>
                <div className={styles.container}>
                    <div className={styles.resultsBar}>
                        <div className={styles.resultsCount}>
                            พบทั้งหมด <span>{filteredCourses.length}</span> รายการ
                        </div>
                    </div>

                    {filteredCourses.length > 0 ? (
                        <div className={styles.grid}>
                            {filteredCourses.map((course) => (
                                <CourseCard 
                                    key={course.id}
                                    {...course}
                                    getCategoryColor={getCategoryColor}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <Search size={60} color="#e2e8f0" strokeWidth={1.5} />
                            <h3 className={styles.emptyTitle}>ไม่พบคอร์สที่ต้องการ</h3>
                            <p className={styles.emptySubtitle}>ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ใหม่อีกครั้ง</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div>กำลังโหลด...</div>}>
            <CoursesContent />
        </Suspense>
    );
}
