"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import AcademyBackLink from '@/components/member/learning/AcademyBackLink';
import AcademySkeleton from '@/components/member/learning/AcademySkeleton';
import styles from './mine.module.css';
import {useAcademyRefresh, useAcademyUser} from '@/lib/academy/use-academy-refresh';

type Enrollment = { courseId: number; title: string; status: string; progressPercent: number };
class EnrollmentLoadError extends Error {}

export default function MyAcademyCoursesPage() {
    const userId = useAcademyUser();
    return <MyCoursesContent key={userId} />;
}

function MyCoursesContent() {
    const refreshVersion = useAcademyRefresh();
    const [items, setItems] = useState<Enrollment[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/academy/enrollments', {signal: controller.signal, cache: 'no-store'})
            .then(async response => {
                const data = await response.json();
                if (!response.ok) throw new EnrollmentLoadError(data.message || 'โหลดคอร์สของฉันไม่สำเร็จ');
                if (!Array.isArray(data)) throw new EnrollmentLoadError('ข้อมูลคอร์สยังไม่พร้อมใช้งาน กรุณาลองอีกครั้ง');
                if (!controller.signal.aborted) { setItems(data); setStatus('ready'); }
            }).catch(reason => {
                if (!controller.signal.aborted) {
                    setMessage(reason instanceof EnrollmentLoadError ? reason.message : 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง');
                    setStatus('error');
                }
            });
        return () => controller.abort();
    }, [reloadKey, refreshVersion]);

    return <main className={styles.page}>
        <div className={styles.container}>
            <AcademyBackLink href="/learning" destination="Pharmacy Academy" />
            <header className={styles.heading}>
                <div><h1>คอร์สของฉัน</h1><p>ติดตามคอร์สที่ลงทะเบียนและกลับมาเรียนต่อได้ที่นี่</p></div>
                {status === 'ready' && items.length > 0 && <Link href="/learning/courses" className={styles.secondaryLink}>ค้นหาคอร์สเรียน<ArrowRight size={16} aria-hidden="true" /></Link>}
            </header>
            {status === 'loading' ? <AcademySkeleton label="กำลังโหลดคอร์สของฉัน..." count={3} /> : status === 'error' ?
                <div className={styles.empty} role="alert"><span className={styles.emptyIcon}><AlertCircle size={32} aria-hidden="true" /></span>
                    <h2>โหลดคอร์สไม่สำเร็จ</h2><p>{message}</p>
                    <button className={styles.primaryLink} type="button" onClick={() => {setStatus('loading'); setReloadKey(key => key + 1);}}>ลองอีกครั้ง</button>
                </div> : items.length === 0 ?
                <div className={styles.empty}><span className={styles.emptyIcon}><BookOpen size={32} aria-hidden="true" /></span>
                    <h2>ยังไม่มีคอร์สเรียน</h2><p>เลือกคอร์สที่สนใจและลงทะเบียน เพื่อเริ่มต้นเรียนรู้ไปด้วยกัน</p>
                    <Link href="/learning/courses" className={styles.primaryLink}>ค้นหาคอร์สเรียน<ArrowRight size={18} aria-hidden="true" /></Link>
                </div> : <div className={styles.grid}>
                    {items.map(item => {
                        const progress = Math.min(100, Math.max(0, Number(item.progressPercent) || 0));
                        const cancelled = item.status === 'cancelled';
                        const completed = !cancelled && progress === 100;
                        return <article key={item.courseId} className={styles.card}>
                            <span className={cancelled ? styles.cancelled : styles.badge}>{cancelled ? 'ยกเลิกแล้ว' : completed ? 'เรียนครบแล้ว' : progress > 0 ? 'กำลังเรียน' : 'พร้อมเริ่มเรียน'}</span>
                            <h2>{item.title}</h2>
                            {!cancelled && <div className={styles.progress}>
                                <div className={styles.progressLabel}><span>ความคืบหน้า</span><strong>{progress}%</strong></div>
                                <div className={styles.track} role="progressbar" aria-label={`ความคืบหน้า ${item.title}`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                                    <span style={{width: `${progress}%`}} />
                                </div>
                            </div>}
                            <Link className={styles.primaryLink} href={cancelled ? `/learning/${item.courseId}` : `/learning/${item.courseId}/learn`}>
                                {cancelled ? 'ดูรายละเอียด' : completed ? 'ทบทวนบทเรียน' : progress > 0 ? 'เรียนต่อ' : 'เริ่มเรียน'}<ArrowRight size={16} aria-hidden="true" />
                            </Link>
                            {completed && <p className={styles.completed}><CheckCircle2 size={16} aria-hidden="true" />เรียนครบทุกบทแล้ว</p>}
                        </article>;
                    })}
                </div>}
        </div>
    </main>;
}
