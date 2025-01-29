import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import typeDefs from './schemas/schema';
import { resolvers } from './resolvers/earthquakeResolvers';
import { AppDataSource } from './data-source';

dotenv.config();

async function startServer() {
  try {
    await AppDataSource.initialize();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        
        return {
          message: error.message,
          path: error.path,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        };
      },
    });

    const { url } = await startStandaloneServer(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        
        return {
          token,
        };
      },
      listen: { 
        port: parseInt(process.env.PORT || '9258') 
      },
    });

    console.log(`🚀 Server ready at ${url}`);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();