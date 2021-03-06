import React from 'react';

import { Link } from "react-router-dom";

import uuidV4 from 'uuid/v4'
import { graphql } from "react-apollo";
import ListPosts from "../queries/listPosts";
import mutationCreatePost from "../mutations/createPost";
import GetPost from "../queries/getPost";

class CreatePost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: {
        title: '',
        description: '',
        createdAt: null
      }
    };
  }

  static defaultProps = {
    onAdd: () => null,
  }

  handleChange(field, { target: { value } }) {
    const { post } = this.state;
    post[field] = value;
    this.setState(() => ({ post }));
  }

  handleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { onAdd, history } = this.props;
    const { post } = this.state;

    await onAdd({ ...post, createdAt: new Date().toISOString(), id: uuidV4(), comments: [] });
    history.push('/');
  }

  render() {
    const { post } = this.state;

    return (
      <div className="ui container raised very padded segment">
        <h1 className="ui header">Create an Post</h1>
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

export default graphql(mutationCreatePost, {
  props: props => ({
    onAdd: post => props.mutate({
      variables: post,
      optimisticResponse: {
        __typename: 'Mutation',
        createPost: { ...post,  __typename: 'Post'}
      },
      update: (proxy, { data: { createPost } }) => {
        createPost.comments = [];
        const data = proxy.readQuery({ query: ListPosts });
        data.listPosts.items.push(createPost);
        proxy.writeQuery({ query: ListPosts, data });

        // Create cache entry for GetPost
        const query2 = GetPost;
        const variables = { id: createPost.id };
        const data2 = { getPost: { ...createPost } };
        proxy.writeQuery({ query: query2, variables, data: data2 });
      }
    })
  })
})(CreatePost);
