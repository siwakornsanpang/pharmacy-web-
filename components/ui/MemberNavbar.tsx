"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./MemberNavbar.module.css";

const memberLinks = [
    { name: "หน้าแรก", href: "/home" },
    { name: "ข้อมูลของฉัน", href: "/profile" },
    { name: "e-service", href: "/service" },
    { name: "งานประชุม", href: "/meeting" },
    { name: "การศึกษา", href: "/learning" },
    // { name: "การสมัครงาน", href: "/careers" },
    // { name: "เครื่องมือเภสัชกร", href: "/tools" },
    { name: "สินค้าสภาเภสัชกรรม", href: "/store" },
];

export default function MemberNavbar() {
    const pathname = usePathname();
    const { userName, userId, logout } = useAuth();

    return (
        <nav className={`${styles.navbar} ThaiFont`}>
            {/* Top Banner (Green — same color as public navbar) */}
            <div className={styles.topBanner}>
                <div className={styles.brandArea}>
                    <Image
                        src="/images/public/icon.jpg"
                        alt="Logo"
                        width={40}
                        height={40}
                        className={styles.logo}
                    />
                    <div>
                        <h1 className={styles.brandTitle}>สภาเภสัชกรรม</h1>
                        <p className={styles.brandSubtitle}>The Pharmacy Council of Thailand</p>
                    </div>

                    {/* Divider + System Name */}
                    <div className={styles.navDivider}></div>
                    <h2 className={styles.systemName}>ระบบบริการผู้ประกอบวิชาชีพเภสัชกรรม</h2>
                </div>

                <div className={styles.actionsArea}>
                    {/* Language Switcher */}
                    <div className={styles.langSwitch}>
                        <svg
                            className={styles.langSwitchIcon}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                        </svg>
                        <span className={styles.langSwitchText}>TH</span>
                    </div>

                    {/* User Info & Logout */}
                    <div className={styles.userArea}>
                        <div className={styles.userInfo}>
                            <div className={styles.userDetails}>
                                <span className={styles.userGreeting}>สวัสดี {userName}</span>
                                <span className={styles.userID}>{userId}</span>
                            </div>
                            <div className={styles.avatarWrapper}>
                                <Image
                                    src="/images/public/member/image.png"
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className={styles.userAvatar}
                                />
                            </div>
                        </div>
                        <button className={styles.logoutBtn} onClick={logout} title="ออกจากระบบ">
                            <LogOut size={14} />
                            <span>ออกจากระบบ</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Bottom Nav (White) */}
            <div className={styles.lowerNav}>
                <div className={styles.navContainer}>
                    {memberLinks.map((link) => {
                        const isActive =
                            link.href === "/home"
                                ? pathname === "/" || pathname === "/home"
                                : pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${isActive ? styles.navItemActive : styles.navItem} ThaiFont`}
                            >
                                {link.name}
                                {isActive && <div className={styles.activeIndicator} />}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
