"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import JobCard from './JobCard';
import styles from './JobListing.module.css';

interface JobListingProps {
    jobs: any[];
}

const SORT_OPTIONS = [
    { value: 'latest', label: 'ล่าสุด' },
    { value: 'salary_desc', label: 'เงินเดือน (สูง-ต่ำ)' },
    { value: 'salary_asc', label: 'เงินเดือน (ต่ำ-สูง)' },
];

export default function JobListing({ jobs }: JobListingProps) {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState('latest');
    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label;

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.sortContainer} ref={sortRef}>
                        <span className={`${styles.sortLabel} ThaiFont`}>เรียงตาม:</span>
                        <div className={styles.dropdownWrapper}>
                            <button 
                                className={`${styles.sortSelect} ThaiFont`}
                                onClick={() => setIsSortOpen(!isSortOpen)}
                            >
                                <span>{currentSortLabel}</span>
                                <ChevronDown size={16} className={`${styles.chevron} ${isSortOpen ? styles.chevronRotate : ''}`} />
                            </button>
                            
                            {isSortOpen && (
                                <ul className={styles.dropdownMenu}>
                                    {SORT_OPTIONS.map(opt => (
                                        <li key={opt.value}>
                                            <button
                                                className={`${styles.dropdownItem} ${sortBy === opt.value ? styles.active : ''} ThaiFont`}
                                                onClick={() => {
                                                    setSortBy(opt.value);
                                                    setIsSortOpen(false);
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <h2 className={`${styles.resultCount} ThaiFont`}>พบงานทั้งหมด {jobs.length} ตำแหน่ง</h2>
                </div>
            </div>
            
            <div className={styles.jobGrid}>
                {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {/* Pagination removed for now */}
        </section>
    );
}
