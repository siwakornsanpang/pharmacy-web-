"use client";

import React from 'react';
import { Building2, MapPin, Clock, DollarSign, Calendar, Briefcase } from 'lucide-react';
import styles from './JobCard.module.css';

interface JobCardProps {
    job: {
        id: number;
        title: string;
        company: string;
        location: string;
        salary: string;
        type: string;
        workFormat: string;
        description: string;
        postedAt: string;
        deadline: string;
        tags: string[];
    };
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.logoSection}>
                    <div className={styles.companyLogo}>
                        <Building2 size={24} />
                    </div>
                </div>
                <div className={styles.titleInfo}>
                    <a href="#" className={styles.titleLink}>
                        <h3 className={`${styles.title} ThaiFont`}>{job.title}</h3>
                    </a>
                    <a href="#" className={styles.companyLink}>
                        <div className={`${styles.companyName} ThaiFont`}>{job.company}</div>
                    </a>
                </div>
                <div className={styles.salaryBadge}>
                    <DollarSign size={14} />
                    <span>{job.salary}</span>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <MapPin size={16} />
                    <span>{job.location}</span>
                </div>
                <div className={styles.detailItem}>
                    <Briefcase size={16} />
                    <span>{job.type}</span>
                </div>
                <div className={styles.detailItem}>
                    <Clock size={16} />
                    <span>{job.workFormat}</span>
                </div>
            </div>

            <p className={styles.description}>{job.description}</p>

            <div className={styles.footer}>
                <div className={styles.tags}>
                    {job.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                </div>
                <div className={styles.dates}>
                    <div className={styles.dateItem}>
                        <Calendar size={14} />
                        <span>หมดเขต: {job.deadline}</span>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.viewBtn}>ดูรายละเอียด</button>
                <button className={styles.applyBtn}>สมัครงาน</button>
            </div>
        </div>
    );
}
