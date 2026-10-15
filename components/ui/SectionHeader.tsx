import styles from "./UIContent.module.css";
import ViewAllLink from './ViewAllLink';

interface SectionHeaderProps {
    title: string;
    viewAllHref?: string;
    viewAllText?: string;
    className?: string;
    children?: React.ReactNode;
}

export default function SectionHeader({ title, viewAllHref, viewAllText = "ดูทั้งหมด", className = "", children }: SectionHeaderProps) {
    return (
        <div className={`${styles.sectionHeader} ${className}`}>
            <h2 className={styles.title}>{title}</h2>
            {viewAllHref && (
                <ViewAllLink href={viewAllHref}>{viewAllText}</ViewAllLink>
            )}
            {children}
        </div>
    );
}
