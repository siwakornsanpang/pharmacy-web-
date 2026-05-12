'use client';

import { useState } from 'react';
import { Search, ChevronDown, ListFilter } from 'lucide-react';
import styles from './CourseSearch.module.css';

const searchOptions = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'online', label: 'คอร์สออนไลน์' },
    { value: 'onsite', label: 'อบรมสัมมนา' },
    { value: 'cpe', label: 'เก็บคะแนน CPE' },
];

export default function CourseSearch() {
    const [searchType, setSearchType] = useState('all');
    const [query, setQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const selectedOption = searchOptions.find(o => o.value === searchType)!;

    const handleSearch = () => {
        if (!query.trim()) return;
        console.log('Course Search:', searchType, query);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>ค้นหาคอร์สเรียน</h2>
                <span className={styles.subtitle}>ค้นหาหลักสูตรที่คุณสนใจเพื่อพัฒนาวิชาชีพ</span>
            </div>

            <div className={styles.searchRow}>
                {/* Dropdown */}
                <div className={styles.dropdown}>
                    <button
                        type="button"
                        className={styles.dropdownButton}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <ListFilter size={16} className={styles.dropdownIcon} />
                        <span>{selectedOption.label}</span>
                        <ChevronDown size={16} className={`${styles.chevron} ${dropdownOpen ? styles.chevronRotate : ''}`} />
                    </button>
                    {dropdownOpen && (
                        <ul className={styles.dropdownMenu}>
                            {searchOptions.map(opt => (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        className={`${styles.dropdownItem} ${opt.value === searchType ? styles.dropdownItemActive : ''}`}
                                        onClick={() => {
                                            setSearchType(opt.value);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        {opt.label}
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
                        placeholder="ค้นหาชื่อคอร์ส, วิทยากร หรือเนื้อหาที่ต้องการ..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                {/* Search button */}
                <button
                    type="button"
                    className={styles.searchButton}
                    onClick={handleSearch}
                >
                    ค้นหา
                </button>
            </div>
        </div>
    );
}
