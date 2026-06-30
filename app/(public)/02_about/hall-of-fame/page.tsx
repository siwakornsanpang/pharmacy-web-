import styles from "../subpage.module.css";
import HalloffameContent from "@/components/public/02_about/hall-of-fame/HalloffameContent";

export default async function HallOfFamePage() {
    return (
        <main className={styles.mainContainer}>
            <h2 className={`${styles.contentTitle} ThaiFont`}>
                เกียรติประวัติ
            </h2>

            <div className={styles.contentWrapper}>
                <HalloffameContent />
            </div>
        </main>
    );
}