import React, { Component } from "react";
import { graphql } from "react-apollo";

import moment from 'moment';
import GetPost from "../queries/getPost";
import SubsriptionPostComments from "../subscriptions/subsriptionPostComments";

import CreateComment from "./createComment";

class PostComments extends Component {

  subscription;

  componentDidMount() {
    this.subscription = this.props.subscribeToComments();
  }

  componentWillUnmount() {
    this.subscription();
  }

  renderComment = (comment) => {
    return (
      <div className="comment" key={comment.commentId}>
        <div className="avatar"><i className="icon user circular"></i></div>
        <div className="content">
          <div className="text">
            {comment.content}
          </div>
          <div className="metadata">{moment(comment.createdAt).format('LL, LT')}</div>
        </div>
      </div>
    );
  }

  render() {
    const { comments, postId } = this.props;

    return (
        <div className="ui items">
            <div className="item">
                <div className="ui comments">
                    <h4 className="ui dividing header">Comments</h4>
                    {[].concat(comments).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(this.renderComment)}
                    <CreateComment postId={postId} />
                </div>
            </div>
        </div>
    );
  }
}

const PostCommentsWithData = graphql(
  GetPost,
  {
    options: ({ postId: id }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { id }
    }),
    props: props => ({
      comments: props.data.getPost ? props.data.getPost.comments : [],
      subscribeToComments: () => props.data.subscribeToMore({
        document: SubsriptionPostComments,
        variables: {
          postId: props.ownProps.postId,
        },
        updateQuery: (prev, { subscriptionData: { data: { subscribeToPostComments } } }) => {
          const res = {
            ...prev,
            getPost: {
              ...prev.getPost,
              comments: [
                ...prev.getPost.comments.filter(c => c.commentId !== subscribeToPostComments.commentId),
                subscribeToPostComments
              ]
            }
          };

          return res;
        }
      })
    }),
  },
)(PostComments);

export default PostCommentsWithData;
