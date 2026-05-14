'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, ListFilter, LayoutGrid } from 'lucide-react';
import styles from './CourseFilters.module.css';

interface CourseFiltersProps {
    categories: string[];
    courseTypes: { value: string; label: string }[];
    selectedCategory: string;
    selectedType: string;
    searchTerm: string;
    onCategoryChange: (category: string) => void;
    onTypeChange: (type: string) => void;
    onSearchChange: (term: string) => void;
}

export default function CourseFilters({
    categories,
    courseTypes,
    selectedCategory,
    selectedType,
    searchTerm,
    onCategoryChange,
    onTypeChange,
    onSearchChange
}: CourseFiltersProps) {
    const [catDropdownOpen, setCatDropdownOpen] = useState(false);
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>ค้นหาคอร์สเรียน</h2>
                <span className={styles.subtitle}>ค้นหาหลักสูตรที่คุณสนใจเพื่อพัฒนาวิชาชีพ</span>
            </div>

            <div className={styles.searchRow}>
                {/* Category Dropdown */}
                <div className={styles.dropdown}>
                    <button
                        type="button"
                        className={styles.dropdownButton}
                        onClick={() => {
                            setCatDropdownOpen(!catDropdownOpen);
                            setTypeDropdownOpen(false);
                        }}
                    >
                        <ListFilter size={16} className={styles.dropdownIcon} />
                        <span>{selectedCategory}</span>
                        <ChevronDown size={16} className={`${styles.chevron} ${catDropdownOpen ? styles.chevronRotate : ''}`} />
                    </button>
                    {catDropdownOpen && (
                        <ul className={styles.dropdownMenu}>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button
                                        type="button"
                                        className={`${styles.dropdownItem} ${cat === selectedCategory ? styles.dropdownItemActive : ''}`}
                                        onClick={() => {
                                            onCategoryChange(cat);
                                            setCatDropdownOpen(false);
                                        }}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Type Dropdown */}
                <div className={styles.dropdown}>
                    <button
                        type="button"
                        className={styles.dropdownButton}
                        onClick={() => {
                            setTypeDropdownOpen(!typeDropdownOpen);
                            setCatDropdownOpen(false);
                        }}
                    >
                        <LayoutGrid size={16} className={styles.dropdownIcon} />
                        <span>{courseTypes.find(t => t.value === selectedType)?.label}</span>
                        <ChevronDown size={16} className={`${styles.chevron} ${typeDropdownOpen ? styles.chevronRotate : ''}`} />
                    </button>
                    {typeDropdownOpen && (
                        <ul className={styles.dropdownMenu}>
                            {courseTypes.map(type => (
                                <li key={type.value}>
                                    <button
                                        type="button"
                                        className={`${styles.dropdownItem} ${type.value === selectedType ? styles.dropdownItemActive : ''}`}
                                        onClick={() => {
                                            onTypeChange(type.value);
                                            setTypeDropdownOpen(false);
                                        }}
                                    >
                                        {type.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Search input */}
                <div className={styles.inputWrap}>
                    <Search size={18} className={styles.inputIcon} />
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="ชื่อคอร์ส, วิทยากร หรือเนื้อหา..."
                        value={searchTerm}
                        onChange={e => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Search button */}
                <button
                    type="button"
                    className={styles.searchButton}
                >
                    ค้นหา
                </button>
            </div>
        </div>
    );
}
