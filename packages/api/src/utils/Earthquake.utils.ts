export const formatCoordinates = (lat: number, long: number): string => {
  return `${lat.toFixed(6)}, ${long.toFixed(6)}`;
}