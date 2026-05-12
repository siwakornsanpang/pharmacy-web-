import LearningBanner from "@/components/member/learning/LearningBanner";
import CourseSearch from "@/components/member/learning/CourseSearch";
import PopularCategories from "@/components/member/learning/PopularCategories";
import styles from "./learning.module.css";

export default function LearningPage() {
    return (
        <div className={styles.page}>
            <LearningBanner />
            
            <div className={styles.container}>
                <CourseSearch />
            </div>

            <PopularCategories />
            
            {/* Future sections could go here */}
            <section className={styles.comingSoon}>
                <div className={styles.inner}>
                    <h2>คอร์สเรียนใหม่ล่าสุด</h2>
                    <p>ระบบกำลังเตรียมข้อมูลหลักสูตรใหม่ๆ ติดตามได้เร็วๆ นี้</p>
                </div>
            </section>
        </div>
    );
}
