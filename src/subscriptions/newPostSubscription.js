import gql from 'graphql-tag'

export default gql`
subscription NewPostSubscription {
  onCreatePost {
    id
    title
    createdAt
    description
  }
}`;
