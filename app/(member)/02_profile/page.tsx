"use client";

import styles from "./profile.module.css";
import { useAuth } from "@/context/AuthContext";
import ProfileBanner from "@/components/member/profile/ProfileBanner";
import PharmacistInfoCard from "@/components/member/profile/PharmacistInfoCard";
import CreditSection from "@/components/member/profile/CreditSection";
import CertificateSection from "@/components/member/profile/CertificateSection";
import MeetingSection from "@/components/member/profile/MeetingSection";
import CourseSection from "@/components/member/profile/CourseSection";

export default function ProfilePage() {
    const { userName, userId } = useAuth();

    // Use placeholder data if auth is not available
    const displayUserName = userName || "ภก. สมชาย รักชาติ";
    const displayUserId = userId || "ภ.12345";

    return (
        <div className={`${styles.pageWrapper} ThaiFont`}>
            <ProfileBanner />

            <main className={styles.contentBody}>
                <PharmacistInfoCard userName={displayUserName} userId={displayUserId} />
                <CreditSection />
                <CertificateSection />
                <MeetingSection />
                <CourseSection />
            </main>
        </div>
    );
}
