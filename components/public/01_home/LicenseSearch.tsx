'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  ChevronDown,
  ListFilter,
  CheckCircle2,
  GraduationCap,
  Award,
  Calendar,
  Building2,
  Info,
  RotateCcw,
  User,
  Loader2,
} from 'lucide-react';
import { searchPharmacists, PharmacistApiItem } from '@/lib/api';
import MeetingPagination from '@/components/public/05_meeting/MeetingPagination';
import styles from './LicenseSearch.module.css';

const searchOptions = [
  { value: 'license', label: 'เลขที่ใบอนุญาต' },
  { value: 'name', label: 'ชื่อ-นามสกุล' },
];

export interface PharmacistData {
  id?: string | number;
  title?: string;
  name: string;
  licenseNo: string;
  status: string;
  statusType: 'normal' | 'suspended' | 'expired';
  expiryDate?: string;
  replacementInfo?: string;
  image?: string | null;
  qualification?: {
    type: string;
    courseName: string;
    receivedDate: string;
    organization: string;
  };
}

const mockPharmacistsList: PharmacistData[] = [
  {
    id: '13476',
    title: 'ภญ.',
    name: 'วิราภรณ์ วงศ์ประเสริฐ',
    licenseNo: 'ภ. 13476',
    status: 'สถานะใบอนุญาต: ปกติ',
    statusType: 'normal',
    expiryDate: '25 พฤษภาคม 2567',
    replacementInfo: '(ไม่เคยขอใบแทน)',
    image: '/images/public/pharmacist-sample.png',
    qualification: {
      type: 'ประกาศนียบัตร',
      courseName: 'การอบรมเชิงปฏิบัติการ "การสร้างเสริมภูมิคุ้มกันโรคโดยเภสัชกร"',
      receivedDate: '12 มกราคม 2565',
      organization: 'สภาเภสัชกรรม',
    },
  },
  {
    id: '30123',
    title: 'ภก.',
    name: 'สมชาย ใจดีภักดี',
    licenseNo: 'ภ. 30123',
    status: 'สถานะใบอนุญาต: ปกติ',
    statusType: 'normal',
    expiryDate: '15 สิงหาคม 2568',
    replacementInfo: '(ไม่เคยขอใบแทน)',
    image: null,
    qualification: {
      type: 'ประกาศนียบัตร',
      courseName: 'การอบรมการบริบาลทางเภสัชกรรมขั้นสูง',
      receivedDate: '20 พฤศจิกายน 2565',
      organization: 'สภาเภสัชกรรม',
    },
  },
  {
    id: '30456',
    title: 'ภญ.',
    name: 'สุนิสา วงศ์สว่าง',
    licenseNo: 'ภ. 30456',
    status: 'สถานะใบอนุญาต: พักใช้ใบอนุญาต',
    statusType: 'suspended',
    expiryDate: '10 มีนาคม 2569',
    replacementInfo: '(ไม่เคยขอใบแทน)',
    image: null,
  },
  {
    id: '98765',
    title: 'ภก./ภญ.',
    name: 'วินัย ใจดี',
    licenseNo: 'ภ. 98765',
    status: 'สถานะใบอนุญาต: ไม่ใช้งาน',
    statusType: 'suspended',
    expiryDate: '04/04/2029',
    replacementInfo: '(ไม่เคยขอใบแทน)',
    image: null,
  },
  {
    id: '77889',
    title: 'ภก.',
    name: 'ภักดี สุดหล่อ',
    licenseNo: 'ภ. 77889',
    status: 'สถานะใบอนุญาต: ปกติ',
    statusType: 'normal',
    expiryDate: '31 ธันวาคม 2570',
    replacementInfo: '(ไม่เคยขอใบแทน)',
    image: null,
  },
];

function getFormattedThaiDateTime(date: Date = new Date()): string {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

export default function LicenseSearch() {
  const [searchType, setSearchType] = useState('license');
  const [query, setQuery] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PharmacistData[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [searchTime, setSearchTime] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Set current search date/time on mount
  useEffect(() => {
    setSearchTime(getFormattedThaiDateTime());
  }, []);

  const selectedOption = searchOptions.find(o => o.value === searchType)!;

  const handleSearch = async () => {
    let searchTerm = '';

    if (searchType === 'license') {
      searchTerm = query.trim();
    } else if (searchType === 'name') {
      searchTerm = `${firstName.trim()} ${lastName.trim()}`.trim();
    }

    if (!searchTerm) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setImageErrors({});
    setSearchTime(getFormattedThaiDateTime());
    setCurrentPage(1);

    try {
      // 1. Fetch from Backend API
      const apiResults: PharmacistApiItem[] | null = await searchPharmacists(searchTerm);

      if (apiResults !== null) {
        // Filter results based on searchType because the backend `q` parameter searches all fields
        const filteredApiResults = apiResults.filter(item => {
          if (searchType === 'license') {
            return item.registrationId.includes(searchTerm);
          } else if (searchType === 'name') {
            const searchWords = searchTerm.toLowerCase().split(/\s+/);
            const itemName = item.name.toLowerCase();
            return searchWords.every(word => itemName.includes(word));
          }
          return true;
        });

        const mappedResults: PharmacistData[] = filteredApiResults.map((item, idx) => {
          const regId = item.registrationId.startsWith('ภ.') ? item.registrationId : `ภ. ${item.registrationId}`;
          
          let statusText = item.status || 'สถานะใบอนุญาต: ปกติ';
          if (!statusText.includes('สถานะใบอนุญาต:')) {
            statusText = `สถานะใบอนุญาต: ${statusText}`;
          }

          const isInactiveStatus = statusText.includes('พักใช้') || statusText.includes('ไม่ใช้งาน') || statusText.includes('เพิกถอน');

          return {
            id: item.id || idx,
            title: '', // Removed prefix logic as requested
            name: item.name,
            licenseNo: regId,
            status: statusText,
            statusType: isInactiveStatus ? 'suspended' : 'normal',
            expiryDate: item.expiryDate || undefined,
            replacementInfo: '(ไม่เคยขอใบแทน)',
            image: item.imageUrl || null,
          };
        });

        setSearchResults(mappedResults);
      } else {
        // 2. Fallback to Mock dataset search (find ALL matching pharmacists)
        const cleanSearch = searchTerm.replace(/[^0-9a-zA-Zก-๙]/g, '').toLowerCase();
        
        const matches = mockPharmacistsList.filter(item => {
          const cleanLicense = item.licenseNo.replace(/[^0-9a-zA-Zก-๙]/g, '').toLowerCase();
          const cleanName = item.name.toLowerCase();
          return cleanLicense.includes(cleanSearch) || cleanName.includes(cleanSearch);
        });

        setSearchResults(matches);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setQuery('');
    setFirstName('');
    setLastName('');
    setHasSearched(false);
    setSearchResults([]);
    setImageErrors({});
  };

  const isStatusInactive = (statusStr: string) => {
    return statusStr.includes('พักใช้') || statusStr.includes('ไม่ใช้งาน') || statusStr.includes('เพิกถอน');
  };

  return (
    <div className={styles.wrapper}>
      {/* Search Input Box */}
      <div className={styles.searchBoxCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>ค้นหารายชื่อ</h2>
          <span className={styles.subtitle}>ผู้ประกอบวิชาชีพเภสัชกรรม</span>
        </div>

        <div className={styles.searchRow}>
          {/* Dropdown */}
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdownButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <ListFilter size={18} className={styles.dropdownIcon} />
              <span>{selectedOption.label}</span>
              <ChevronDown size={16} className={styles.chevron} />
            </button>
            {dropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {searchOptions.map(opt => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`${styles.dropdownItem} ${opt.value === searchType ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        setSearchType(opt.value);
                        setDropdownOpen(false);
                        setQuery('');
                        setFirstName('');
                        setLastName('');
                        setHasSearched(false);
                        setSearchResults([]);
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search inputs */}
          {searchType === 'name' ? (
            <>
              <div className={styles.inputWrap}>
                <Search size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="ชื่อ"
                  value={firstName}
                  onChange={e => {
                    const val = e.target.value;
                    setFirstName(val);
                    if (!val.trim() && !lastName.trim()) {
                      setHasSearched(false);
                      setSearchResults([]);
                    }
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className={styles.inputWrap}>
                <Search size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="นามสกุล"
                  value={lastName}
                  onChange={e => {
                    const val = e.target.value;
                    setLastName(val);
                    if (!val.trim() && !firstName.trim()) {
                      setHasSearched(false);
                      setSearchResults([]);
                    }
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </>
          ) : (
            <div className={styles.inputWrap}>
              <Search size={18} className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder={selectedOption.label}
                value={query}
                onChange={e => {
                  const val = e.target.value;
                  setQuery(val);
                  if (!val.trim()) {
                    setHasSearched(false);
                    setSearchResults([]);
                  }
                }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
          )}

          {/* Search button */}
          <button
            type="button"
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={18} className={styles.spinner} /> : 'ค้นหา'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className={styles.resultsContainer}>
          <h3 className={styles.resultTitle}>
            ผลการค้นหา {searchResults.length > 0 ? `${searchResults.length} รายการ` : ''}
          </h3>

          {searchResults.length > 0 ? (
            <div className={styles.resultsList}>
              {searchResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((item, index) => (
                <div key={item.id || index} className={styles.resultItemBlock}>
                  {/* Main Pharmacist Profile Card */}
                  <div className={styles.profileCard}>
                    {/* Image with fallback grey placeholder */}
                    <div className={styles.avatarWrapper}>
                      {item.image && !imageErrors[index] ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={140}
                          height={175}
                          className={styles.avatarImage}
                          priority
                          unoptimized={true}
                          onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <User size={56} className={styles.avatarPlaceholderIcon} />
                        </div>
                      )}
                    </div>

                    <div className={styles.profileDetails}>
                      <h4 className={styles.pharmacistName}>
                        {item.title ? `${item.title} ` : ''}{item.name}
                      </h4>

                      <div className={styles.detailRows}>
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>เลขที่ใบอนุญาต</span>
                          <span className={styles.detailValue}>{item.licenseNo}</span>
                        </div>

                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>สถานะ</span>
                          <span className={`${styles.detailValue} ${isStatusInactive(item.status) ? styles.statusInactive : styles.statusNormal}`}>
                            <CheckCircle2 size={16} className={isStatusInactive(item.status) ? styles.statusIconInactive : styles.statusIcon} />
                            {item.status}
                          </span>
                        </div>

                        {item.expiryDate && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>ใบอนุญาตหมดอายุ</span>
                            <span className={styles.detailValue}>{item.expiryDate}</span>
                          </div>
                        )}

                        {item.replacementInfo && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>ใบอนุญาตเป็นผู้ประกอบวิชาชีพเภสัชกรรม</span>
                            <span className={styles.detailValueMuted}>{item.replacementInfo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Qualifications & Training Card */}
                  <div className={styles.qualificationCard}>
                    <div className={styles.qualColumnMain}>
                      <div className={styles.qualHeader}>
                        <GraduationCap size={20} className={styles.qualIcon} />
                        <span>คุณวุฒิและการอบรม</span>
                      </div>
                      <div className={styles.qualContent}>
                        <Award size={18} className={styles.certIcon} />
                        <span className={styles.certText}>
                          <strong>ประกาศนียบัตร:</strong> -
                        </span>
                      </div>
                    </div>

                    <div className={styles.qualDivider} />

                    <div className={styles.qualColumnSub}>
                      <div className={styles.qualHeader}>
                        <Calendar size={18} className={styles.qualIcon} />
                        <span>วันที่ได้รับ</span>
                      </div>
                      <div className={styles.qualSubValue}>
                        -
                      </div>
                    </div>

                    <div className={styles.qualDivider} />

                    <div className={styles.qualColumnSub}>
                      <div className={styles.qualHeader}>
                        <Building2 size={18} className={styles.qualIcon} />
                        <span>หน่วยงานที่จัด</span>
                      </div>
                      <div className={styles.qualSubValue}>
                        -
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {Math.ceil(searchResults.length / ITEMS_PER_PAGE) > 1 && (
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                  <MeetingPagination 
                    currentPage={currentPage}
                    totalPages={Math.ceil(searchResults.length / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Empty Result State */
            <div className={styles.emptyCard}>
              <div className={styles.emptyIllustration}>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Decorative background shape */}
                  <ellipse cx="60" cy="65" rx="45" ry="32" fill="#F0F4E8" />
                  {/* Leaves decoration */}
                  <path d="M22 62C18 55 20 48 24 45C28 48 30 55 26 62Z" fill="#C3D9A4" />
                  <path d="M98 62C102 55 100 48 96 45C92 48 90 55 94 62Z" fill="#C3D9A4" />
                  {/* Document shape */}
                  <rect x="42" y="30" width="36" height="48" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                  <path d="M68 30V40H78" fill="#F1F5F9" />
                  <line x1="48" y1="44" x2="62" y2="44" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                  <line x1="48" y1="50" x2="66" y2="50" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                  <line x1="48" y1="56" x2="60" y2="56" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                  <line x1="48" y1="62" x2="64" y2="62" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                  {/* Magnifying glass with X */}
                  <circle cx="64" cy="58" r="14" fill="white" stroke="#3A4B0F" strokeWidth="3" />
                  <line x1="74" y1="68" x2="84" y2="78" stroke="#3A4B0F" strokeWidth="4" strokeLinecap="round" />
                  {/* X sign */}
                  <path d="M59 53L69 63M69 53L59 63" stroke="#3A4B0F" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <h4 className={styles.emptyTitle}>ไม่พบข้อมูลที่ค้นหา</h4>
              <p className={styles.emptySubtitle}>
                ไม่พบข้อมูลผู้ประกอบวิชาชีพเภสัชกรรมที่ตรงกับคำค้นหา
              </p>

              <button
                type="button"
                className={styles.resetButton}
                onClick={handleResetSearch}
              >
                <RotateCcw size={16} />
                <span>ลองค้นหาใหม่</span>
              </button>
            </div>
          )}

          {/* Timestamp info note */}
          <div className={styles.timestampNote}>
            <Info size={16} className={styles.infoIcon} />
            <span>ข้อมูล ณ วันที่ค้นหา {searchTime}</span>
          </div>
        </div>
      )}
    </div>
  );
}




