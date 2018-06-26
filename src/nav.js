import React from 'react'
import { Link } from 'react-router-dom'

export default class Nav extends React.Component {
  render() {
    return (
      <div className="ui fixed inverted menu">
        <div className="ui container">
          <Link to="/" className="header item">
            <img className="logo" alt="Blog Using AWS AppSync" src="http://via.placeholder.com/35x35" />
            Blog Using AWS Appsync
          </Link>
          <Link to='/' className="item">Posts</Link>
          <Link to='/createPost' className="item">Create Post</Link>
        </div>
      </div>
    )
  }
}
