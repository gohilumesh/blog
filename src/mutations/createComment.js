import gql from 'graphql-tag'

export default gql`
  mutation createComment(
    $postId: ID!,
    $content: String!,
    $createdAt: String!
  ) {
    createComment(input:{
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
