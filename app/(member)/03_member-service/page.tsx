import ServiceBanner from "@/components/public/04_service/ServiceBanner";
import PopularServices from "@/components/member/service/PopularServices";
import ServiceList from "@/components/member/service/ServiceList";
import { getServices, getPopularServices } from "@/lib/api";
import styles from "./member-service.module.css";

export const dynamic = 'force-dynamic';

export default async function MemberServicesPage() {
    const [services, popularServices] = await Promise.all([
        getServices(),
        getPopularServices(),
    ]);

    return (
        <div className={styles.pageWrapper}>
            <ServiceBanner />
            <PopularServices
                services={popularServices}
                viewAllHref="/service/e-service/sap-33/history"
                viewAllText="ประวัติการยื่นคำขอ"
            />
            <ServiceList services={services} />
        </div>
    );
}
