import React, { useState } from "react";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";

import client from "./client";
import { SEARCH_REPOSITORIES } from "./graphql";

const INITIAL_STATE = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: "フロントエンドエンジニア",
};

function App() {
  const [paginationArgs, setPaginationArgs] = useState(INITIAL_STATE);

  // classコンポーネントの場合
  // this.handleChange = this.handleChange.bind( this )
  const handleChange = (event) => {
    setPaginationArgs({
      ...INITIAL_STATE,
      query: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const { query, first, last, before, after } = paginationArgs;
  console.log({ query });

  return (
    <ApolloProvider client={client}>
      <div>Hello, GraphQL</div>

      <form onSubmit={handleSubmit}>
        <input value={query} onChange={handleChange} />
      </form>

      <Query query={SEARCH_REPOSITORIES} variables={{ ...paginationArgs }}>
        {({ loading, error, data }) => {
          if (loading) return `Loading...`;
          if (error) return `Error! &{error.message}`;

          console.log({ data });

          return <div></div>;
        }}
      </Query>
    </ApolloProvider>
  );
}

export default App;
