// Mock data for different inspection periods
export interface HistoricalRecord {
  date: string
  productType: "tank" | "pipe" | "elbow" | "vessel"
  averageThickness: number
  minThickness: number
  maxThickness: number
  defectCount: number
  corrosionRate: number
  sections: {
    shell: number
    roof: number
    bottom: number
  }
}

export const generateMockHistoricalData = (): HistoricalRecord[] => [
  {
    date: "Jan 2023",
    productType: "tank",
    averageThickness: 12.5,
    minThickness: 10.2,
    maxThickness: 13.8,
    defectCount: 2,
    corrosionRate: 0.5,
    sections: { shell: 12.6, roof: 12.4, bottom: 12.3 },
  },
  {
    date: "Apr 2023",
    productType: "tank",
    averageThickness: 12.1,
    minThickness: 9.8,
    maxThickness: 13.5,
    defectCount: 5,
    corrosionRate: 1.2,
    sections: { shell: 12.2, roof: 12.0, bottom: 12.1 },
  },
  {
    date: "Jul 2023",
    productType: "tank",
    averageThickness: 11.6,
    minThickness: 9.2,
    maxThickness: 13.1,
    defectCount: 8,
    corrosionRate: 2.1,
    sections: { shell: 11.7, roof: 11.5, bottom: 11.6 },
  },
  {
    date: "Oct 2023",
    productType: "tank",
    averageThickness: 11.0,
    minThickness: 8.5,
    maxThickness: 12.6,
    defectCount: 12,
    corrosionRate: 3.4,
    sections: { shell: 11.1, roof: 10.9, bottom: 11.0 },
  },
  {
    date: "Jan 2024",
    productType: "tank",
    averageThickness: 10.3,
    minThickness: 7.8,
    maxThickness: 12.1,
    defectCount: 15,
    corrosionRate: 4.8,
    sections: { shell: 10.4, roof: 10.2, bottom: 10.3 },
  },
  {
    date: "Apr 2024",
    productType: "tank",
    averageThickness: 9.5,
    minThickness: 7.0,
    maxThickness: 11.4,
    defectCount: 19,
    corrosionRate: 6.2,
    sections: { shell: 9.6, roof: 9.4, bottom: 9.5 },
  },
  {
    date: "Jul 2024",
    productType: "tank",
    averageThickness: 8.8,
    minThickness: 6.2,
    maxThickness: 10.8,
    defectCount: 21,
    corrosionRate: 7.5,
    sections: { shell: 8.9, roof: 8.7, bottom: 8.8 },
  },
  {
    date: "Nov 2024",
    productType: "tank",
    averageThickness: 8.1,
    minThickness: 5.5,
    maxThickness: 10.2,
    defectCount: 24,
    corrosionRate: 8.9,
    sections: { shell: 8.2, roof: 8.0, bottom: 8.1 },
  },
]
