export type Earthquake = {
  id: string;
  magnitude: number;
  location: string;
  date: Date;
};

export type EarthquakeInput = {
  magnitude?: number;
  location?: string;
  date?: Date;
};

export type EarthquakeInputVars = {
  input: {
    magnitude: number;
    location: string;
    date: Date;
  }
}

export type EarthquakeData = {
  earthquakes: {
    hasNext: boolean,
    hasPrevious: boolean,
    page: number,
    total: number,
    totalPages: number
    items: Earthquake[]
  }
}
