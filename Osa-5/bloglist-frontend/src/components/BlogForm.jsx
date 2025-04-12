import { useState } from 'react'

const BlogForm = ({ handleCreateBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handleCreateBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
        title:
          <input
            data-testid='title'
            type="text"
            value={blogTitle}
            name="title"
            onChange={event => setBlogTitle(event.target.value)}
          />
        </div>
        <div>
        author:
          <input
            data-testid='author'
            type="text"
            value={blogAuthor}
            name="author"
            onChange={event => setBlogAuthor(event.target.value)}
          />
        </div>
        <div>
        url:
          <input
            data-testid='url'
            type="text"
            value={blogUrl}
            name="url"
            onChange={event => setBlogUrl(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm
