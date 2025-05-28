export interface ChemicalSubstance {
  cas: string;
  chemicalName: string;
  value: number;
  type: string;
  unit: string;
  synonyms: string;
  remark: string;
  listedUnder: string;
  reference: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}
