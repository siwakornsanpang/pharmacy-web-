"use client";

import LearningBanner from "@/components/member/learning/LearningBanner";
import CourseFilters from "@/components/member/learning/courses/CourseFilters";
import PopularCategories from "@/components/member/learning/PopularCategories";
import FeaturedCourse from "@/components/member/learning/FeaturedCourse";
import PopularCourses from "@/components/member/learning/PopularCourses";
import ExperiencedInstructors from "@/components/member/learning/ExperiencedInstructors";
import LearningStats from "@/components/member/learning/LearningStats";
import LearnerReviews from "@/components/member/learning/LearnerReviews";
import styles from "./learning.module.css";
import { useState } from 'react';

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

export default function LearningPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
    const [selectedType, setSelectedType] = useState("all");

    return (
        <div className={styles.page}>
            <LearningBanner />
            
            <div className={styles.container} style={{ marginTop: '3rem', marginBottom: '4rem' }}>
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

            <PopularCategories />

            <FeaturedCourse />

            <PopularCourses />

            <ExperiencedInstructors />

            <LearningStats />

            <LearnerReviews />
        </div>
    );
}
