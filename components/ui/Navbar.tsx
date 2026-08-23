"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import { getWebSettings } from "@/lib/api";

interface NavLink {
    name: string;
    href: string;
    hasDropdown?: boolean;
}

// --- Navigation Configuration ---
const navLinks: NavLink[] = [
    { name: "หน้าแรก", href: "/" },
    { name: "เกี่ยวกับองค์กร", href: "/about" },
    { name: "หน่วยงาน", href: "/department" },
    { name: "งานบริการ", href: "/service" },
    { name: "งานประชุม", href: "/meeting" },
    { name: "ข่าวสาร", href: "/news" },
    { name: "กฎหมาย", href: "/laws" },
    { name: "ดาวน์โหลด", href: "/other-service" },
    { name: "ติดต่อ", href: "/contact" },
];

export default function Navbar() {
    // --- State & Hooks ---
    const pathname = usePathname();
    const router = useRouter();
    const [lang, setLang] = useState("TH");
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [webSettings, setWebSettings] = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getWebSettings();
                setWebSettings(settings);
            } catch (error) {
                console.error('Error fetching web settings:', error);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className={`${styles.navbar} ThaiFont`}>
            {/* 1. TOP BANNER (Green Section) - Logo, Titles, and Actions */}
            <div className={styles.topBanner}>
                <div className={styles.brandArea}>
                    <Image
                        src={webSettings?.logoPath || "/images/public/icon.jpg"}
                        alt="Pharmacy Council Logo"
                        width={40}
                        height={40}
                        className={styles.logo}
                    />
                    <div>
                        <h1 className={`${styles.brandTitle} ThaiFont`}>
                            {webSettings?.siteNameTh || "สภาเภสัชกรรม"}
                        </h1>
                        <p className={`${styles.brandSubtitle} ThaiFont`}>
                            {webSettings?.siteNameEn || "THE PHARMACY COUNCIL OF THAILAND"}
                        </p>
                    </div>
                    {pathname === "/login" && (
                        <>
                            <div className={styles.navDivider}></div>
                            <h2 className={`${styles.systemName} ThaiFont`}>
                                ระบบบริการผู้ประกอบวิชาชีพเภสัชกรรม
                            </h2>
                        </>
                    )}
                </div>

                <div className={styles.actionsArea}>
                    {/* 1.2 User Actions (Language & Login) */}
                    {/* Language Switcher */}
                    <div className={styles.langDropdownContainer} ref={dropdownRef}>
                        <div
                            className={styles.langSwitch}
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                        >
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
                            <span className={styles.langSwitchText}>{lang}</span>
                            <svg
                                className={`${styles.langSwitchArrow} ${isLangDropdownOpen ? styles.rotate180 : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {isLangDropdownOpen && (
                            <div className={`${styles.langDropdown} ThaiFont`}>
                                <button
                                    className={`${styles.langDropdownItem} ${lang === "TH" ? styles.langDropdownItemActive : ""}`}
                                    onClick={() => {
                                        setLang("TH");
                                        setIsLangDropdownOpen(false);
                                    }}
                                >
                                    <div className={styles.langSelectedText}>
                                        <span>ภาษาไทย</span>
                                        <span className={styles.langEngName}>Thai</span>
                                    </div>
                                    <span>TH</span>
                                </button>
                                <button
                                    className={`${styles.langDropdownItem} ${lang === "EN" ? styles.langDropdownItemActive : ""}`}
                                    onClick={() => {
                                        setLang("EN");
                                        setIsLangDropdownOpen(false);
                                    }}
                                >
                                    <div className={styles.langSelectedText}>
                                        <span>English</span>
                                        <span className={styles.langEngName}>อังกฤษ</span>
                                    </div>
                                    <span>EN</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Login Button - Hide on login page */}
                    {pathname !== "/login" && (
                        <button
                            className={`${styles.loginBtn} ThaiFont`}
                            onClick={() => router.push("/login")}
                        >
                            เข้าสู่ระบบเภสัชกร
                        </button>
                    )}
                </div>
            </div>

            {/* 2. LOWER NAVIGATION (White Section) - Main Menu Links */}
            <div className={styles.lowerNav}>
                <div className={styles.navContainer}>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href === "/" && pathname === "/home");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${isActive ? styles.navItemActive : styles.navItem} ThaiFont`}
                            >
                                {link.name}
                                {link.hasDropdown && (
                                    <svg
                                        className={styles.navIcon}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                                {/* Underline for Active */}
                                {isActive && (
                                    <div className={styles.activeIndicator} />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
