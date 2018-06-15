import React from 'react';
import gql from 'graphql-tag';
import { Query, ApolloConsumer } from 'react-apollo';

import './App.css';

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  {
    organization(login: "the-road-to-learn-react") {
      repositories(first: 20) {
        edges {
          node {
            id
            name
            url
            viewerHasStarred
          }
        }
      }
    }
  }
`;

class App extends React.Component {
  state = {
    showRepositories: false,
  };

  onShowRepositories = () => {
    this.setState({ showRepositories: true });
  };

  render() {
    if (!this.state.showRepositories) {
      return (
        <div>
          <p>The button queries all repositories on hover.</p>
          <p>
            If you hover and click the button not immediately
            afterward, there shouldn't be a loading indicator when
            clicking the button eventually.
          </p>
          <p>
            If you hover and click the button immediately afterward,
            there may be still a loading indicator, because the
            prefetching of the data wasn't completed.
          </p>

          <ShowRepositoriesButton
            onShowRepositories={this.onShowRepositories}
          >
            Show Repositories (Queries on Hover)
          </ShowRepositoriesButton>
        </div>
      );
    }

    return (
      <Query query={GET_REPOSITORIES_OF_ORGANIZATION}>
        {({ data: { organization }, loading }) => {
          if (loading || !organization) {
            return <div>Loading ...</div>;
          }

          return (
            <Repositories repositories={organization.repositories} />
          );
        }}
      </Query>
    );
  }
}

const ShowRepositoriesButton = ({ onShowRepositories }) => (
  <ApolloConsumer>
    {client => (
      <button
        type="button"
        onClick={onShowRepositories}
        onMouseOver={() =>
          client.query({
            query: GET_REPOSITORIES_OF_ORGANIZATION,
          })
        }
      >
        Show Repositories
      </button>
    )}
  </ApolloConsumer>
);

const Repositories = ({ repositories }) => (
  <ul>
    {repositories.edges.map(({ node }) => (
      <li key={node.id}>
        <a href={node.url}>{node.name}</a>
      </li>
    ))}
  </ul>
);

export default App;
