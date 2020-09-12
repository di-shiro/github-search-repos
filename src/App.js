import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Query } from 'react-apollo';

import client from './client';
import { SEARCH_REPOSITORIES } from './graphql';

const StarButton = (props) => {
  const totalCount = props.node.stargazers.totalCount;
  return <button>{totalCount === 1 ? '1 star' : `${totalCount} stars`}</button>;
};

const PER_PAGE = 5;
const INITIAL_STATE = {
  first: PER_PAGE,
  last: null,
  after: null,
  before: null,
  query: 'フロントエンドエンジニア',
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

  // Nextボタンの処理: graphQL の pagiNation に次のpageを要求するパラメータを指定
  const goNext = (search) => {
    setPaginationArgs({
      ...paginationArgs,
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null,
    });
  };

  const goPrevious = (search) => {
    setPaginationArgs({
      ...paginationArgs,
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor,
    });
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
          if (error) return `Error! ${error.message}`;

          const search = data.search;
          const repositoryCount = search.repositoryCount;
          const repositoryUnit =
            repositoryCount === 1 ? `Repository` : `Repositories`;
          const title = `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`;

          return (
            <React.Fragment>
              <h2>{title}</h2>
              <ul>
                {search.edges.map((edge) => {
                  const node = edge.node;
                  return (
                    <li key={node.id}>
                      <a
                        href={node.url}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {node.name}
                      </a>
                      &nbsp;
                      <StarButton node={node} />
                    </li>
                  );
                })}
              </ul>
              {search.pageInfo.hasPreviousPage === true ? (
                <button onClick={(e) => goPrevious(search, e)}>Previous</button>
              ) : null}

              {search.pageInfo.hasNextPage === true ? (
                <button
                  onClick={(e) => goNext(search, e)}
                  // onClick={this.goNext.bind(this, search)}
                >
                  Next
                </button>
              ) : null}
            </React.Fragment>
          );
        }}
      </Query>
    </ApolloProvider>
  );
}

export default App;
