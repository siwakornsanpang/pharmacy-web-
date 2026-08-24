import styles from "./RegistrantsContent.module.css";
import {
  REGISTRANT_NOTES,
  REGISTRANT_ROWS,
  formatCount,
  sumColumn,
} from "./registrantData";

export default function RegistrantsContent() {
  const totals = {
    diploma: sumColumn(REGISTRANT_ROWS, "diploma"),
    approval: sumColumn(REGISTRANT_ROWS, "approval"),
    professionalCert: sumColumn(REGISTRANT_ROWS, "professionalCert"),
    certificate: sumColumn(REGISTRANT_ROWS, "certificate"),
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.intro}>
        <p className={`${styles.introTitle} ThaiFont`}>
          ผู้ประกอบวิชาชีพเภสัชกรรมที่ได้รับคุณวุฒิสาขาความเชี่ยวชาญจากหลักสูตรที่สภาเภสัชกรรมให้การรับรอง
        </p>
        <p className={`${styles.introSubtitle} ThaiFont`}>
          จำแนกตามคุณวุฒิสาขาความเชี่ยวชาญในการประกอบวิชาชีพเภสัชกรรม
        </p>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colIndex}>ลำดับ</th>
              <th className={styles.colSpecialty}>สาขาความเชี่ยวชาญ</th>
              <th>วุฒิบัตร</th>
              <th>หนังสืออนุมัติ</th>
              <th>ประกาศนียบัตรวิชาชีพเภสัชกรรม</th>
              <th>ประกาศนียบัตร</th>
            </tr>
          </thead>
          <tbody>
            {REGISTRANT_ROWS.map((row) => (
              <tr key={row.id}>
                <td className={styles.colIndex}>{row.id}</td>
                <td className={styles.colSpecialty}>{row.specialty}</td>
                <td>{formatCount(row.diploma)}</td>
                <td>{formatCount(row.approval)}</td>
                <td>{formatCount(row.professionalCert)}</td>
                <td>{formatCount(row.certificate)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className={styles.totalLabel}>
                จำนวนรวมทั้งสิ้น
              </td>
              <td>{formatCount(totals.diploma)}</td>
              <td>{formatCount(totals.approval)}</td>
              <td>{formatCount(totals.professionalCert)}</td>
              <td>{formatCount(totals.certificate)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={styles.notes}>
        <p className={`${styles.notesTitle} ThaiFont`}>หมายเหตุ</p>
        <ol className={styles.notesList}>
          {REGISTRANT_NOTES.map((note, index) => (
            <li key={index} className="ThaiFont">
              {note}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
