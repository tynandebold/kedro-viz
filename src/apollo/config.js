import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const link = createHttpLink({
  /** our graphql endpoint */
  uri: 'localhost:4142/graphql',
  fetch,
});

export const client = new ApolloClient({
  connectToDevTools: true,
  uri: 'http://localhost:4142/graphql',
  // link,
  cache: new InMemoryCache(),
  credentials: 'include',
  resolvers: {},
  defaultOptions: {
    query: {
      errorPolicy: 'all',
    },
  },
});
