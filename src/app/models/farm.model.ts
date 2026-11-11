export interface Farm {
  id: string;
  name: string;
  location: string;
  size: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface FarmLocation {
  id: string;
  farmId: string;
  name: string;
  type: string;
  capacity: number;
}

export interface FarmSpecies {
  id: string;
  farmId: string;
  speciesId: string;
  name: string;
  count: number;
}
