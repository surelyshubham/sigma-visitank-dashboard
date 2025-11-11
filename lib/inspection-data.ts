// Store for sharing uploaded inspection data across pages
export interface InspectionData {
  id: string
  productType: "tank" | "pipe" | "elbow" | "vessel"
  fileName: string
  data: Record<string, any>[]
  headers: string[]
  metadata?: {
    clientName?: string
    uploadedBy?: string
    uploadDate?: Date
  }
}

let inspectionDataStore: InspectionData | null = null

export function setInspectionData(data: InspectionData) {
  inspectionDataStore = data
}

export function getInspectionData(): InspectionData | null {
  return inspectionDataStore
}

export function clearInspectionData() {
  inspectionDataStore = null
}
