import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import GetPost from "../queries/getPost";
import PostComments from "./postComments";

class ViewPost extends Component {
  render() {
    const { post, loading } = this.props;

    return (
      <div className={`ui container raised very padded segment ${loading ? 'loading' : ''}`}>
        <Link to="/" className="ui button">Back to Posts</Link>
        <div className="ui items">
          <div className="item">
            {
              post && <div className="content">
                <div className="header">{post.title}</div>
                <div className="description">{post.description}</div>
                <div className="extra">
                    <PostComments postId={post.id} comments={post.comments} />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const ViewPostWithData = graphql(
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
)(ViewPost);


export default ViewPostWithData;
