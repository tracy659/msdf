export interface ServiceModelItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  category: string;
  basePrice: number;
  estimatedDays: number;
  requiredDocuments: string[];
}

export class ServiceModel {
  private _service: ServiceModelItem;

  constructor(service: ServiceModelItem) {
    this._service = service;
  }

  toJSON(): ServiceModelItem {
    return { ...this._service };
  }
}
