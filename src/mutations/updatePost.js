import gql from 'graphql-tag'

export default gql`
  mutation updatePost(
    $id: ID!,
    $title: String,
    $description: String,
    $createdAt: String
  ) {
    updatePost(input: {
      id: $id,
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
