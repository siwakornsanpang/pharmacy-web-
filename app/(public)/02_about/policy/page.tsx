import React from "react";
import styles from "../subpage.module.css";
import PolicyContent from "@/components/public/02_about/policy/PolicyContent";

export const metadata = {
    title: "นโยบายสภาเภสัชกรรม | Pharmacy Council",
    description: "ข้อมูลนโยบายและแผนการดำเนินงานของสภาเภสัชกรรม",
};

export default function PolicyPage() {
    return (
        <div className="ThaiFont">
            <h2 className={styles.contentTitle}>นโยบายสภาเภสัชกรรม</h2>
            <div className="py-6">
                <PolicyContent />
            </div>
        </div>
    );
}
