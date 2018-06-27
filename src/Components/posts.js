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
    <div className="item" key={post.id}>
      <div className="image">
        <img alt="placeholder for post" src="http://via.placeholder.com/175x145" />
      </div>
        <div className="content">
          <Link to={`/update/post/${post.id}`} className="header">
            {post.title}
          </Link>
          <div className="meta">
            <span>Description</span>
          </div>
          <div className="description block-with-text">
            <p>{post.description}</p>
          </div>
          <div className="extra post-footer">
            <span>{`${post.comments.length} comments`}</span>
            <span>
              <Link to={`/view/post/${post.id}`} className="card" >
                Read More
                </Link>
            </span>
          </div>
        </div>
    </div>
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
        <div className="all-posts ui unstackable items">
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
