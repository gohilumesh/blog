import gql from 'graphql-tag'

export default gql`
  mutation commentOnPost(
    $postId: ID!,
    $content: String!,
    $createdAt: String!
  ) {
    commentOnPost(input:{
      postId: $postId,
      content: $content,
      createdAt: $createdAt
    }) {
      postId
      commentId
      content
      createdAt
    }
  }
`;
