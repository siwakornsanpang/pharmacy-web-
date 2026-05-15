"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, ListFilter } from 'lucide-react';
import styles from './StoreSearch.module.css';

interface StoreSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    categories: string[];
}

export default function StoreSearch({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories
}: StoreSearchProps) {
    const [catDropdownOpen, setCatDropdownOpen] = useState(false);

    return (
        <div className={styles.filterCard}>
            <div className={styles.filterHeader}>
                <h2 className={`${styles.filterTitle} ThaiFont`}>ค้นหาสินค้า</h2>
                <span className={`${styles.filterSubtitle} ThaiFont`}>ค้นหาสินค้าที่คุณสนใจ เช่น ตำรา, อุปกรณ์, หรือเครื่องแบบ</span>
            </div>
            
            <div className={styles.filterRow}>
                {/* Category Dropdown */}
                <div className={styles.dropdown}>
                    <button
                        type="button"
                        className={`${styles.dropdownButton} ThaiFont`}
                        onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                    >
                        <ListFilter size={16} className={styles.dropdownIcon} />
                        <span>{selectedCategory}</span>
                        <ChevronDown size={16} className={`${styles.chevron} ${catDropdownOpen ? styles.chevronRotate : ''}`} />
                    </button>
                    {catDropdownOpen && (
                        <ul className={styles.dropdownMenu}>
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        type="button"
                                        className={`${styles.dropdownItem} ThaiFont ${cat === selectedCategory ? styles.dropdownItemActive : ''}`}
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

                {/* Search Input */}
                <div className={styles.inputWrap}>
                    <Search size={18} className={styles.inputIcon} />
                    <input
                        type="text"
                        className={`${styles.input} ThaiFont`}
                        placeholder="ชื่อสินค้า, หมวดหมู่..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Search Button */}
                <button type="button" className={`${styles.searchButton} ThaiFont`}>
                    ค้นหา
                </button>
            </div>
        </div>
    );
}
