"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Award } from 'lucide-react';
import styles from './PopularCourses.module.css';
import SectionHeader from '@/components/ui/SectionHeader';

const MOCK_COURSES = [
    { id: 1, title: "การจัดการความดันโลหิตสูงในผู้ป่วยสูงอายุ", category: "เภสัชกรรมโรงพยาบาล", duration: "2.5 ชม.", cpe: "2.5 หน่วยกิต", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop" },
    { id: 2, title: "ทักษะการสื่อสารเพื่อการดูแลผู้ป่วยเบาหวาน", category: "เภสัชกรรมชุมชน", duration: "1.5 ชม.", cpe: "1.5 หน่วยกิต", image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=600&auto=format&fit=crop" },
    { id: 3, title: "เภสัชกรรมคลินิกในโรคไตเรื้อรัง", category: "เภสัชกรรมชุมชน", duration: "3 ชม.", cpe: "3.0 หน่วยกิต", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop" },
    { id: 4, title: "การบริบาลทางเภสัชกรรมในผู้ป่วยมะเร็ง", category: "เภสัชกรรมโรงพยาบาล", duration: "2 ชม.", cpe: "2.0 หน่วยกิต", image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=600&auto=format&fit=crop" },
    { id: 5, title: "การประเมินความปลอดภัยของผลิตภัณฑ์สมุนไพร", category: "การผลิตและควบคุม", duration: "4 ชม.", cpe: "4.0 หน่วยกิต", image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop" },
    { id: 6, title: "กฎหมายและจรรยาบรรณวิชาชีพเภสัชกรรม 2024", category: "กฎหมายและจริยธรรม", duration: "1.5 ชม.", cpe: "1.5 หน่วยกิต", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop" },
    { id: 7, title: "เทคโนโลยี AI ในงานเภสัชกรรมสมัยใหม่", category: "เภสัชศาสตร์นวัตกรรม", duration: "2.5 ชม.", cpe: "2.5 หน่วยกิต", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop" },
    { id: 8, title: "การจัดการคลังยาและโลจิสติกส์การแพทย์", category: "การบริหารงานคลัง", duration: "3 ชม.", cpe: "3.0 หน่วยกิต", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop" },
    { id: 9, title: "จิตวิทยาการบริการสำหรับเภสัชกรชุมชน", category: "เภสัชกรรมชุมชน", duration: "2 ชม.", cpe: "2.0 หน่วยกิต", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop" }
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

export default function PopularCourses() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <SectionHeader
                    title="คอร์สเรียนยอดนิยม"
                    viewAllHref="/learning/courses"
                    viewAllText="ดูทั้งหมด"
                />

                <div className={styles.grid}>
                    {MOCK_COURSES.map((course) => (
                        <Link href={`/learning/${course.id}`} key={course.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    fill
                                    className={styles.image}
                                />
                                <div
                                    className={styles.badge}
                                    style={{ backgroundColor: getCategoryColor(course.category) }}
                                >
                                    {course.category}
                                </div>
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{course.title}</h3>
                                <div className={styles.meta}>
                                    <div className={styles.metaItem}>
                                        <Clock size={16} />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <Award size={16} />
                                        <span>{course.cpe}</span>
                                    </div>
                                </div>
                                <div className={styles.footer}>
                                    <div className={styles.enrollBtn}>
                                        <span>เข้าสู่บทเรียน</span>
                                        <ArrowRight size={16} className={styles.arrow} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
