export interface PharmacistData {
  id?: string | number;
  title?: string;
  name: string;
  licenseNo: string;
  status: string;
  statusType: "normal" | "suspended" | "expired";
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

export const searchOptions = [
  { value: "license", label: "เลขที่ใบอนุญาต" },
  { value: "name", label: "ชื่อ-นามสกุล" },
] as const;

export type SearchType = "license" | "name";

export const mockPharmacistsList: PharmacistData[] = [
  {
    id: "13476",
    title: "ภญ.",
    name: "วิราภรณ์ วงศ์ประเสริฐ",
    licenseNo: "ภ. 13476",
    status: "ปกติ",
    statusType: "normal",
    expiryDate: "25 พฤษภาคม 2567",
    replacementInfo: "(ไม่เคยขอใบแทน)",
    image: "/images/public/pharmacist-sample.png",
    qualification: {
      type: "ประกาศนียบัตร",
      courseName: 'การอบรมเชิงปฏิบัติการ "การสร้างเสริมภูมิคุ้มกันโรคโดยเภสัชกร"',
      receivedDate: "12 มกราคม 2565",
      organization: "สภาเภสัชกรรม",
    },
  },
  {
    id: "30123",
    title: "ภก.",
    name: "สมชาย ใจดีภักดี",
    licenseNo: "ภ. 30123",
    status: "ปกติ",
    statusType: "normal",
    expiryDate: "15 สิงหาคม 2568",
    replacementInfo: "(ไม่เคยขอใบแทน)",
    image: null,
  },
  {
    id: "30456",
    title: "ภญ.",
    name: "สุนิสา วงศ์สว่าง",
    licenseNo: "ภ. 30456",
    status: "พักใช้ใบอนุญาต",
    statusType: "suspended",
    expiryDate: "10 มีนาคม 2569",
    replacementInfo: "(ไม่เคยขอใบแทน)",
    image: null,
  },
];

export function getFormattedThaiDateTime(date: Date = new Date()): string {
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

export function buildLicenseSearchPath(params: {
  type: SearchType;
  query?: string;
  firstName?: string;
  lastName?: string;
}): string | null {
  const searchParams = new URLSearchParams();
  searchParams.set("type", params.type);

  if (params.type === "license") {
    const q = (params.query || "").trim();
    if (!q) return null;
    searchParams.set("q", q);
  } else {
    const first = (params.firstName || "").trim();
    const last = (params.lastName || "").trim();
    if (!first && !last) return null;
    if (first) searchParams.set("first", first);
    if (last) searchParams.set("last", last);
  }

  return `/license-search?${searchParams.toString()}`;
}
