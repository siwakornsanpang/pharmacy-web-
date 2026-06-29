"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera, User, IdCard, Phone, Mail, MapPin, Save } from "lucide-react";
import Swal from "sweetalert2";
import styles from "./EditProfileContent.module.css";

interface EditProfileContentProps {
    userName: string;
    userId: string;
}

export default function EditProfileContent({ userName, userId }: EditProfileContentProps) {
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [firstName, setFirstName] = useState(() => {
        // Split Thai prefix + name
        const parts = userName.split(" ");
        return parts.slice(0, -1).join(" "); // prefix + first name e.g. "ภก. สมชาย"
    });
    const [lastName, setLastName] = useState(() => {
        const parts = userName.split(" ");
        return parts[parts.length - 1]; // last word = last name
    });
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [workplace, setWorkplace] = useState("สภาเภสัชกรรม กระทรวงสาธารณสุข");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        Swal.fire({
            title: "บันทึกข้อมูลสำเร็จ",
            text: "ข้อมูลส่วนตัวของคุณได้รับการอัปเดตเรียบร้อยแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#737300",
        }).then(() => {
            router.push("/profile");
        });
    };

    return (
        <div className={`${styles.pageWrapper} ThaiFont`}>
            {/* Banner */}
            <header className={styles.banner}>
                <div className={styles.bannerOverlay}>
                    <Link href="/profile" className={styles.backBtn}>
                        <ChevronLeft size={20} />
                        <span>ย้อนกลับ</span>
                    </Link>
                    <div className={styles.bannerContent}>
                        <h1 className={`${styles.bannerTitle} ThaiFont`}>จัดการข้อมูลส่วนตัว</h1>
                        <p className={`${styles.bannerSubtitle} ThaiFont`}>แก้ไขข้อมูลเภสัชกรของคุณ</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className={styles.contentBody}>
                <form className={styles.editCard} onSubmit={handleSubmit}>

                    {/* ---- Left: Photo Upload ---- */}
                    <div className={styles.photoSection}>
                        <div className={styles.photoWrapper}>
                            <Image
                                src={previewImage || "/images/public/member/image.png"}
                                alt="Profile Photo"
                                width={220}
                                height={220}
                                className={styles.photoImage}
                            />
                            <button
                                type="button"
                                className={styles.cameraBtn}
                                onClick={() => fileInputRef.current?.click()}
                                aria-label="เปลี่ยนรูปโปรไฟล์"
                            >
                                <Camera size={20} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className={styles.hiddenInput}
                                onChange={handleImageChange}
                            />
                        </div>
                        <p className={styles.photoHint}>คลิกที่กล้องเพื่อเปลี่ยนรูปภาพ</p>
                        <div className={styles.idBadge}>
                            <span className={styles.idLabel}>เลขใบอนุญาต</span>
                            <span className={styles.idValue}>{userId}</span>
                        </div>
                    </div>

                    {/* ---- Right: Form Fields ---- */}
                    <div className={styles.formSection}>
                        <h2 className={styles.formTitle}>ข้อมูลส่วนตัว</h2>

                        {/* Name row */}
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>คำนำหน้า - ชื่อ</label>
                                <div className={styles.inputWrapper}>
                                    <User className={styles.inputIcon} size={18} />
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        placeholder="คำนำหน้า - ชื่อ"
                                        className={styles.inputField}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>นามสกุล</label>
                                <div className={styles.inputWrapper}>
                                    <User className={styles.inputIcon} size={18} />
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        placeholder="นามสกุล"
                                        className={styles.inputField}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* License (readonly) */}
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>เลขใบอนุญาตประกอบวิชาชีพ</label>
                            <div className={styles.inputWrapper}>
                                <IdCard className={styles.inputIcon} size={18} />
                                <input
                                    type="text"
                                    value={userId}
                                    readOnly
                                    className={`${styles.inputField} ${styles.readOnly}`}
                                />
                            </div>
                        </div>

                        {/* Phone & Email row */}
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>เบอร์โทรศัพท์</label>
                                <div className={styles.inputWrapper}>
                                    <Phone className={styles.inputIcon} size={18} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="เบอร์โทรศัพท์"
                                        className={styles.inputField}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>อีเมล</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="อีเมล"
                                        className={styles.inputField}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Workplace */}
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>สถานที่ปฏิบัติงาน</label>
                            <div className={styles.inputWrapper}>
                                <MapPin className={styles.inputIcon} size={18} />
                                <input
                                    type="text"
                                    value={workplace}
                                    onChange={e => setWorkplace(e.target.value)}
                                    placeholder="สถานที่ปฏิบัติงาน"
                                    className={styles.inputField}
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className={styles.actionRow}>
                            <button type="submit" className={styles.saveBtn}>
                                <Save size={18} />
                                บันทึกข้อมูล
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
