export enum SpeciesType {
  CROP = 'CROP',
  ANIMAL = 'ANIMAL'
}

export interface SpeciesResponseModel {
  id: string;
  scientificName: string;
  commonName: string;
  type: SpeciesType;
  genus: string;
  family: string;
  speciesSpecificData: Record<string, any>;
  speciesConfigData: Record<string, any>;
}

export interface BreedResponseModel {
  scientificName: string;
  commonName: string;
  breedSpecificData: Record<string, any>;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  total: number;
  pages: number;
}
