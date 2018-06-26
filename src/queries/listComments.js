import gql from 'graphql-tag';

export default gql`
  query listComments {
    listComments {
      items {
        postId
        commentId
        content
        createdAt
      }
    }
  }
`;
