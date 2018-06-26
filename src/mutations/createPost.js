import gql from 'graphql-tag'

export default gql`
  mutation createPost(
    $title: String!,
    $description: String!,
    $createdAt: String!
  ) {
    createPost(input: {
      title: $title,
      description: $description,
      createdAt: $createdAt
    }) {
      id
      title
      description
      createdAt
    }
  }
`
