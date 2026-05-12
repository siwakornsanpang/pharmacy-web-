import styles from "../subpage.module.css";
import CouncildirectoryContent from "@/components/public/02_about/council-directory/CouncildirectoryContent";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://pharmacy-api-6w5d.onrender.com";

export default async function CouncilDirectoryPage() {
    let historyData = [];

    // MOCK DATA for terms 1-10
    const mockData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        term: (i + 1).toString(),
        start_year: (2537 + (i * 3)).toString(), // Just dummy years
        end_year: (2540 + (i * 3)).toString(),
        president_name: `นายกสภา วาระที่ ${i + 1}`,
        president_image: "",
        secretary_name: `เลขาธิการ วาระที่ ${i + 1}`,
        secretary_image: "",
    })).reverse(); // Show latest first in the list if needed, or keep 1-10

    try {
        const cleanApiUrl = API_URL.replace(/\/$/, "");
        const res = await fetch(`${cleanApiUrl}/about/history`, {
            next: { revalidate: 60 },
        });

        if (res.ok) {
            const json = await res.json();
            historyData = Array.isArray(json)
                ? json
                : Array.isArray(json.data)
                    ? json.data
                    : [];
        }
    } catch (error) {
        console.error("Failed to fetch council history:", error);
    }

    // Use mock data if API returns nothing
    const finalData = historyData.length > 0 ? historyData : mockData;

    return (
        <main className={styles.mainContainer}>
            <h2 className={`${styles.contentTitle} ThaiFont`}>
                ทำเนียบสภา
            </h2>

            <div className={styles.contentWrapper}>
                <CouncildirectoryContent initialData={finalData} />
            </div>
        </main>
    );
}
