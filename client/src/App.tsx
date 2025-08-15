import Clients from "./components/Clients";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache,
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <section className="container mx-auto p-8">
          <h1 className="text-3xl font-bold capitalize">project management!</h1>

          <Clients />
        </section>
      </ApolloProvider>
    </>
  );
}

export default App;
