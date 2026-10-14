import Link from "next/link";
import { ChevronRight, MoveRight } from "lucide-react";
import styles from "./UIContent.module.css";

interface SectionHeaderProps {
    title: string;
    viewAllHref?: string;
    viewAllText?: string;
    children?: React.ReactNode;
}

export default function SectionHeader({ title, viewAllHref, viewAllText = "ดูทั้งหมด", children }: SectionHeaderProps) {
    return (
        <div className={styles.sectionHeader}>
            <h2 className={styles.title}>{title}</h2>
            {viewAllHref && (
                <Link href={viewAllHref} className={styles.viewAll}>
                    {viewAllText} <MoveRight size={20} />
                </Link>
            )}
            {children}
        </div>
    );
}
