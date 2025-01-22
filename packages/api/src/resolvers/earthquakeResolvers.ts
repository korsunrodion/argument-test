import { IResolvers } from '@graphql-tools/utils';
import { Earthquake } from '../entities/Earthquake.entity';
import { Equal, MoreThanOrEqual } from 'typeorm';
import moment from 'moment';

// TODO: sorting
export const resolvers: IResolvers = {
  Query: {
    earthquakes: async (_, { page, limit }) => {
      const items = await Earthquake.find({
        skip: limit * (Math.max(1, page) - 1),
        take: limit,
      });

      const count = await Earthquake.count();
      const totalPages = Math.ceil(count / limit);

      return {
        items: items.map((item) => ({
          ...item,
          date: moment(item.date).toISOString()
        })),
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    },
    earthquake: async (_, { id }) => {
      return await Earthquake.findOne({
        where: {
          id: Equal(id)
        }
      })
    },
    earthquakesByMagnitude: async (_, { minMagnitude, page, limit }) => {
      const items = await Earthquake.find({
        where: {
          magnitude: MoreThanOrEqual(minMagnitude)
        },
        order: {
          magnitude: -1
        },
        skip: limit * (Math.max(1, page) - 1),
        take: limit,
      });

      const count = await Earthquake.count();
      const totalPages = Math.ceil(count / limit);

      return {
        items,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    },
    earthquakesByLocation: async (_, { location, page, limit }) => {

      const items = await Earthquake.find({
        where: {
          location: Equal(location)
        },
        skip: limit * (Math.max(1, page) - 1),
        take: limit,
      });

      const count = await Earthquake.count();
      const totalPages = Math.ceil(count / limit);

      return {
        items,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    },
  },
  Mutation: {
    createEarthquake: async (_, { input }: { input: Partial<Earthquake> }) => {
      const entry = Earthquake.create(input);
      await Earthquake.save(entry);
      return entry;
    },
    updateEarthquake: async (_, { id, input }: { id: string, input: Partial<Earthquake> }) => {
      await Earthquake.update(
        id,
        input
      );

      const updatedEarthquake = await Earthquake.findOneBy({ id });
  
      if (!updatedEarthquake) {
        throw new Error(`Earthquake with id ${id} not found`);
      }
      
      return updatedEarthquake;
    },
    deleteEarthquake: async (_, { id }) => {
      const result = await Earthquake.delete(id);
      return !!result;
    },
  },
};