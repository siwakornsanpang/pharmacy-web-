import styles from "../subpage.module.css";
import HalloffameContent from "@/components/public/02_about/hall-of-fame/HalloffameContent";
import { getHonorRecipients } from "@/lib/api";

export default async function HallOfFamePage() {
    const honorData = await getHonorRecipients();

    return (
        <main className={styles.mainContainer}>
            <h2 className={`${styles.contentTitle} ThaiFont`}>
                เกียรติประวัติ
            </h2>

            <div className={styles.contentWrapper}>
                <HalloffameContent initialData={honorData} />
            </div>
        </main>
    );
}