import React from "react";
import { graphql, compose, withApollo } from "react-apollo";
import { Link } from "react-router-dom";

import GetPost from "../queries/getPost";
import ListPosts from "../queries/listPosts";
import mutationUpdatePost from "../mutations/updatePost";

class UpdatePost extends React.Component {

  static defaultProps = {
    onUpdate: () => null,
  }

  state = {
    post: {
      id: this.props.post.id,
      title: this.props.post.title,
      description: this.props.post.description,
      createdAt: this.props.post.createdAt
    }
  };

  handleChange(field, { target: { value } }) {
    const { post } = this.state;
    post[field] = value;
    this.setState(() => ({ post }));
  }

  handleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { onUpdate, history } = this.props;
    const { post } = this.state;

    await onUpdate({ ...post });
    history.push('/');
  }

  render() {
    const { post } = this.state;

    return (
      <div className="ui container raised very padded segment">
        <h1 className="ui header">Update an Post</h1>
        <div className="ui form">
            <div className="field required eight wide">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" value={post.title} onChange={this.handleChange.bind(this, 'title')} />
            </div>
            <div className="field required eight wide">
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" rows="10" value={post.description}
                    onChange={this.handleChange.bind(this, 'description')}></textarea>
            </div>
            <div className="ui buttons">
                <Link to="/" className="ui button">Cancel</Link>
                <div className="or"></div>
                <button className="ui positive button" onClick={this.handleSave}>Save</button>
            </div>
        </div>
      </div>
    );
  }
}

export default withApollo(compose(
  graphql(
    GetPost,
    {
      options: ({ match: { params: { id } } }) => ({
        variables: { id },
        fetchPolicy: 'cache-and-network',
      }),
      props: ({ data: { getPost: post, loading} }) => ({
        post,
        loading,
      }),
    },
  ),
  graphql(
    mutationUpdatePost,
    {
      options: props => ({
        update: (proxy, { data: { updatePost } }) => {
          console.log("props is ",props);

          let updatedPost = updatePost;
          updatedPost.comments = props.post.comments;
          const data = proxy.readQuery({ query: ListPosts });
          let updatePosts = data.listPosts.items.map(p => {
            if (p.id === updatedPost.id) {
              return updatedPost;
            }
            return p;
          });
          data.listPosts.items = updatePosts;
          proxy.writeQuery({ query: ListPosts, data });
        }
        // update: (proxy, { data: { commentOnEvent } }) => {
        //   const query = QueryGetEvent;
        //   const variables = { id: commentOnEvent.eventId };
        //   const data = proxy.readQuery({ query, variables });
        //
        //   data.getEvent = {
        //     ...data.getEvent,
        //     comments: {
        //         ...data.getEvent.comments,
        //         items: [
        //             ...data.getEvent.comments.items.filter(c => c.commentId !== commentOnEvent.commentId),
        //             commentOnEvent,
        //         ]
        //     }
        //   };
        //
        //   proxy.writeQuery({ query, data });
        // },
      }),
      props: props => ({
        onUpdate: (post) => {
          return props.mutate({
            variables: post,
            optimisticResponse: {
              __typename: 'Mutation',
              updatePost: { ...post,  __typename: 'Post'}
            },
          });
        }
      })
    }
  )
)(UpdatePost));

//
// const UpdatePostWithData = graphql(
//   GetPost,
//   {
//     options: ({ postId: id }) => ({
//       fetchPolicy: 'cache-and-network',
//       variables: { id }
//     }),
//     props: props => ({
//       post: props.data.getPost,
//       onUpdate: post => props.mutate({
//         variables: post,
//         optimisticResponse: {
//           __typename: 'Mutation',
//           updatePost: { ...post,  __typename: 'Post'}
//         },
//         update: (proxy, { data: { updatePost } }) => {
//           let updatedPost = props.data.getPost;
//           const data = proxy.readQuery({ query: ListPosts });
//           let updatePosts = data.listPosts.items.map(p => {
//             if (p.id === updatedPost.id) {
//               return updatedPost;
//             }
//             return p;
//           });
//           data.listPosts.items = updatePosts;
//           proxy.writeQuery({ query: ListPosts, data });
//         }
//       })
//     }),
//   },
// )(UpdatePost);
//
// export default UpdatePostWithData;
