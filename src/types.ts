export interface Spot {
  created: number;
  description: string;
  frequency: 'weekly' | 'other';
  hasCrashPads: boolean;
  isFree: boolean;
  isGrass: boolean;
  isSpringFloor: boolean;
  selectedLocation: Coordinates;
  title: string;
  uid: string;
  url: string;
  weekly_days: string[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}
