import React, { Component } from "react";
import { graphql } from "react-apollo";
import uuidV4 from 'uuid/v4'

import MutationCommentOnPost from "../mutations/commentOnPost";
import GetPost from "../queries/getPost";

class CreateComment extends Component {

  static defaultProps = {
    onAdd: () => null,
  }

  static defaultState = {
    comment: {
      content: '',
    },
    loading: false,
  }

  state = CreateComment.defaultState;

  handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { content } = this.state.comment;
    const { postId, onAdd } = this.props;

    this.setState(() => ({ loading: true }));

    await onAdd({
      postId,
      commentId: uuidV4(),
      content,
      createdAt: new Date().toISOString()
    });

    this.setState(CreateComment.defaultState);
  }

  handleChange = ({ target: { value: content } }) => {
    this.setState(() => ({ comment: { content } }));
  }

  render() {
    const { comment, loading } = this.state;
    return (
      <form className="ui reply form">
        <div className="field">
            <textarea value={comment.content} onChange={this.handleChange} disabled={loading}></textarea>
        </div>
        <button className={`ui blue labeled submit icon button ${loading ? 'loading' : ''}`}
            disabled={loading} onClick={this.handleSubmit}>
            <i className="icon edit"></i>
            Add Comment
        </button>
      </form>
    );
  }
}

const CreateCommentWithData = graphql(
  MutationCommentOnPost,
  {
    options: props => ({
      update: (proxy, { data: { commentOnPost } }) => {
        const query = GetPost;
        const variables = { id: commentOnPost.postId };
        const data = proxy.readQuery({ query, variables });

        data.getPost = {
          ...data.getPost,
          comments: [
            ...data.getPost.comments.filter(c => c.commentId !== commentOnPost.commentId),
            commentOnPost
          ]
        };

        proxy.writeQuery({ query, data });
      },
    }),
    props: props => ({
      onAdd: (comment) => {
        return props.mutate({
          variables: comment,
          optimisticResponse: {
            __typename: 'Mutation',
            commentOnPost: { ...comment,  __typename: 'Comment'}
          },
        });
      }
    })
  }
)(CreateComment);

export default CreateCommentWithData;
