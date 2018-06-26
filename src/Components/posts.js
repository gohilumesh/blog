import React, { Component } from "react";
import { Link } from "react-router-dom";

import { graphql, compose, withApollo } from "react-apollo";
import ListPosts from "../queries/listPosts";

class Posts extends Component {

  state = {
    busy: false,
  }

  static defaultProps = {
    posts: []
  }

  handleSync = async () => {
    const { client } = this.props;
    const query = ListPosts;

    this.setState({ busy: true });

    await client.query({
      query,
      fetchPolicy: 'network-only',
    });

    this.setState({ busy: false });
  }

  renderPost = (post) => (
    <Link to={`/post/${post.id}`} className="card" key={post.id}>
      <div className="content">
        <div className="header">{post.title}</div>
      </div>
      <div className="content">
          <div className="description"><i className="icon info circle"></i>{post.description}</div>
      </div>
      <div className="extra content">
          <i className="icon comment"></i> {post.comments.length} comments
      </div>
    </Link>
  )


  render() {
    const { busy } = this.state;
    const { posts } = this.props;

    return (
      <div>
        <div className="ui clearing basic segment marginTop">
          <h1 className="ui header left floated">All Posts</h1>
          <button className="ui icon left basic button" onClick={this.handleSync} disabled={busy}>
            <i aria-hidden="true" className={`refresh icon ${busy && "loading"}`}></i>
            Sync with Server
          </button>
        </div>
        <div className="ui link cards">
          <div className="card blue">
            <Link to="/createPost" className="new-post content center aligned">
              <i className="icon add massive"></i>
              <p>Create new post</p>
            </Link>
          </div>
          {[].concat(posts).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(this.renderPost)}
        </div>
      </div>
    );
  }
}

export default withApollo(compose(
  graphql(
    ListPosts,
    {
      options: {
        fetchPolicy: 'cache-first',
      },
      props: ({ data: { listPosts = { items: [] } } }) => ({
        posts: listPosts.items
      })
    }
  )
)(Posts));
