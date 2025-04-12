import { useState } from 'react'

const Blog = ({ blog, handleBlogLike, handleBlogDelete, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  const smallView = { display: blogVisible ? 'none' : '' }
  const bigView = { display: blogVisible ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    handleBlogLike(updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleBlogDelete(blog)
    }
  }

  if (user.username === blog.user.username) {
    return (
      <>
        <div style={smallView} className='smallBlog'>
          <div style={blogStyle}>
            {blog.title} {blog.author} <button onClick={() => setBlogVisible(true)}>view</button>
          </div>
        </div>
        <div style={bigView} className='bigBlog'>
          <div style={blogStyle}>
            {blog.title} {blog.author} <button onClick={() => setBlogVisible(false)}>hide</button><br/>
            {blog.url}<br/>
          likes {blog.likes} <button onClick={handleLike}>like</button><br/>
            {blog.user.name}<br/>
            <button onClick={handleDelete}>delete</button>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div style={smallView} className='smallBlog'>
          <div style={blogStyle}>
            {blog.title} {blog.author} <button onClick={() => setBlogVisible(true)}>view</button>
          </div>
        </div>
        <div style={bigView} className='bigBlog'>
          <div style={blogStyle}>
            {blog.title} {blog.author} <button onClick={() => setBlogVisible(false)}>hide</button><br/>
            {blog.url}<br/>
          likes {blog.likes} <button onClick={handleLike}>like</button><br/>
            {blog.user.name}<br/>
          </div>
        </div>
      </>
    )
  }
}

export default Blog