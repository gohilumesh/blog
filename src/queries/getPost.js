import gql from "graphql-tag";

export default gql(`
query($id: ID!) {
  getPost(id: $id) {
    id
    title
    description
    createdAt
    comments {
      postId
      commentId
      content
      createdAt
    }
  }
}`);
