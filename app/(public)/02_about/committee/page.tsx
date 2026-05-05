import styles from "../subpage.module.css";
import CommitteeContent from "@/components/public/02_about/committee/CommitteeContent";

export default function CommitteePage() {
    return (
        <>
            <h2 className={`${styles.contentTitle} ThaiFont`}>
                กรรมการสภา
            </h2>

            <CommitteeContent />
        </>
    );
}