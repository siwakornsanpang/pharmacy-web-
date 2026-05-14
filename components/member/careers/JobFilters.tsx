"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
    DollarSign, 
    GraduationCap, 
    Briefcase, 
    Clock, 
    ChevronDown, 
    X 
} from 'lucide-react';
import styles from './JobFilters.module.css';

interface JobFiltersProps {
    filters: {
        salary: string;
        experience: string;
        type: string;
        format: string;
    };
    onChange: (name: string, value: string) => void;
    onClear: () => void;
}

const SALARY_OPTIONS = [
    { value: '30000', label: 'น้อยกว่า 30,000' },
    { value: '50000', label: '30,000 - 50,000' },
    { value: '80000', label: '50,000 - 80,000' },
    { value: '80001', label: '80,000 ขึ้นไป' },
];

const EXP_OPTIONS = [
    { value: 'entry', label: 'เด็กจบใหม่' },
    { value: '1-3', label: '1 - 3 ปี' },
    { value: '3-5', label: '3 - 5 ปี' },
    { value: '5+', label: '5 ปีขึ้นไป' },
];

const TYPE_OPTIONS = [
    { value: 'งานประจำ', label: 'งานประจำ' },
    { value: 'งานพาร์ทไทม์', label: 'งานพาร์ทไทม์' },
    { value: 'งานสัญญาจ้าง', label: 'งานสัญญาจ้าง' },
];

const FORMAT_OPTIONS = [
    { value: 'On-site', label: 'On-site' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' },
];

export default function JobFilters({ filters, onChange, onClear }: JobFiltersProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const renderDropdown = (
        name: string, 
        label: string, 
        icon: React.ReactNode, 
        options: { value: string, label: string }[],
        currentValue: string
    ) => {
        const isOpen = activeDropdown === name;
        const selectedLabel = options.find(opt => opt.value === currentValue)?.label || label;

        return (
            <div className={styles.filterContainer}>
                <button 
                    className={`${styles.filterWrapper} ${currentValue ? styles.hasValue : ''}`}
                    onClick={() => toggleDropdown(name)}
                >
                    <span className={styles.icon}>{icon}</span>
                    <span className={`${styles.label} ThaiFont`}>{selectedLabel}</span>
                    <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.chevronRotate : ''}`} />
                </button>
                
                {isOpen && (
                    <ul className={styles.dropdownMenu}>
                        <li className={styles.menuHeader}>{label}</li>
                        {options.map(opt => (
                            <li key={opt.value}>
                                <button
                                    className={`${styles.dropdownItem} ${currentValue === opt.value ? styles.active : ''} ThaiFont`}
                                    onClick={() => {
                                        onChange(name, opt.value);
                                        setActiveDropdown(null);
                                    }}
                                >
                                    {opt.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <div className={styles.filterBar} ref={dropdownRef}>
            {renderDropdown('salary', 'เงินเดือน', <DollarSign size={18} />, SALARY_OPTIONS, filters.salary)}
            {renderDropdown('experience', 'ประสบการณ์', <GraduationCap size={18} />, EXP_OPTIONS, filters.experience)}
            {renderDropdown('type', 'ประเภทงาน', <Briefcase size={18} />, TYPE_OPTIONS, filters.type)}
            {renderDropdown('format', 'รูปแบบการทำงาน', <Clock size={18} />, FORMAT_OPTIONS, filters.format)}
            
            <div className={styles.divider}></div>
            
            <button className={`${styles.clearBtn} ThaiFont`} onClick={onClear}>
                ล้างค่าทั้งหมด
            </button>
        </div>
    );
}
