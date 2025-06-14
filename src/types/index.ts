export interface Producer {
  id: number;
  document: string; // CPF ou CNPJ
  name: string;
  createdAt: string;
}

export interface Farm {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  totalArea: number; // em hectares
  cultivatedArea: number; // em hectares
  vegetationArea: number; // em hectares
  producerId: number;
  producer: Producer;
  createdAt: string;
}

export interface Harvest {
  id: number;
  baseYear: number;
  name: string; // ex: "Safra 2024"
  farmId: number;
  crops: Crop[];
  createdAt: Date;
}

export interface Crop {
  id: number;
  name: string;
  code: string;
}

export interface DashboardData {
  totalFarms: number;
  totalHectares: number;
  farmsByState: { state: string; count: number }[];
  cropsGrouped: { cropName: string; count: number; cropId: number }[];
  landUse: {
    arable: number;
    vegetation: number;
  };
}

export type DocumentType = "CPF" | "CNPJ";

export interface FormErrors {
  [key: string]: string;
}
