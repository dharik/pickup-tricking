export type ActionTypes =
  | { type: 'MAP_DRAGGED'; payload: { lng: number; lat: number } }
  | { type: 'MAP_CLICKED'; payload: { spot: any } };
