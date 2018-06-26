import gql from "graphql-tag";

export default gql(`
subscription($postId: ID!) {
  subscribeToPostComments(postId: $postId) {
    postId
    commentId
    content
    createdAt
  }
}`);
