import gql from 'graphql-tag';

export default gql`
  query listPosts {
    listPosts {
      items {
        id
        title
        description
        createdAt
        comments {
          commentId
          postId
        }
      }
    }
  }
`;
