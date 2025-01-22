export default `#graphql
  type Earthquake {
    id: ID!
    magnitude: Float
    location: String!
    date: String!
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedEarthquakes {
    items: [Earthquake!]!
    total: Int!
    page: Int!
    totalPages: Int!
    hasNext: Boolean!
    hasPrevious: Boolean!
  }

  type Query {
    earthquakes(page: Int! = 1, limit: Int = 10): PaginatedEarthquakes!
    earthquake(id: ID!): Earthquake
    earthquakesByMagnitude(page: Int! = 1, limit: Int = 10, minMagnitude: Float!): PaginatedEarthquakes!
    earthquakesByLocation(page: Int! = 1, limit: Int = 10, location: String!): PaginatedEarthquakes!
  }

  input CreateEarthquakeInput {
    magnitude: Float!
    location: String!
    date: String!
  }

  input UpdateEarthquakeInput {
    magnitude: Float
    location: String
    date: String
  }

  type Mutation {
    createEarthquake(input: CreateEarthquakeInput!): Earthquake!
    updateEarthquake(id: ID!, input: UpdateEarthquakeInput!): Earthquake!
    deleteEarthquake(id: ID!): Boolean!
  }
`;