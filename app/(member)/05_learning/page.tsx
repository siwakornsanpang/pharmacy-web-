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

export default function LearningPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    return (
        <div className={styles.page}>
            <LearningBanner />
            
            <div className={styles.container} style={{ marginTop: '3rem', marginBottom: '4rem' }}>
                <CourseFilters 
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    searchTerm={searchTerm}
                    onCategoryChange={setSelectedCategory}
                    onSearchChange={setSearchTerm}
                />
            </div>

            <PopularCategories />

            <FeaturedCourse />

            <ExperiencedInstructors />

            <LearningStats />

            <PopularCourses />

            <LearnerReviews />
        </div>
    );
}
