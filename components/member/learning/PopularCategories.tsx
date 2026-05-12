import { ChevronRight, Pill, FlaskConical, Stethoscope, Briefcase } from 'lucide-react';
import styles from './PopularCategories.module.css';

const categories = [
    {
        id: 1,
        title: 'เภสัชกรรมชุมชน',
        count: 124,
        icon: <Pill size={32} />,
        color: '#4e73df'
    },
    {
        id: 2,
        title: 'เภสัชกรรมโรงพยาบาล',
        count: 85,
        icon: <Stethoscope size={32} />,
        color: '#1cc88a'
    },
    {
        id: 3,
        title: 'การผลิตและควบคุมคุณภาพ',
        count: 42,
        icon: <FlaskConical size={32} />,
        color: '#f6c23e'
    },
    {
        id: 4,
        title: 'กฎหมายและจริยธรรม',
        count: 56,
        icon: <Briefcase size={32} />,
        color: '#e74a3b'
    }
];

import SectionHeader from '@/components/ui/SectionHeader';

export default function PopularCategories() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <SectionHeader title="หมวดหมู่ยอดนิยม" viewAllHref="/learning/categories" />

                <div className={styles.grid}>
                    {categories.map(cat => (
                        <div key={cat.id} className={styles.card} style={{ '--hover-color': cat.color } as any}>
                            <div className={styles.iconWrapper} style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                {cat.icon}
                            </div>
                            <h3 className={styles.catTitle}>{cat.title}</h3>
                            <p className={styles.catCount}>{cat.count} คอร์สเรียน</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
