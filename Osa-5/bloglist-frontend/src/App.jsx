import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [error, setError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleNotification = (message, type) => {
    if (type === 'error') {
      setError(true)
    }
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
      setError(false)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      handleNotification(`Welcome ${user.name}!`)
      blogService.setToken(user.token)
    } catch (exception) {
      handleNotification('wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => {
    if (user === null) {
      return (
        <div>
          <h2>Log in to application</h2>
          <Notification message={notificationMessage} error={error}/>
          <form onSubmit={handleLogin}>
            <div>
            username
              <input
                data-testid='username'
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
            password
              <input
                data-testid='password'
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      )
    }

    return (
      <div>
        <h2>blogs</h2>
        <Notification message={notificationMessage} error={error}/>
        <p>{user.name} logged in
          <button onClick={() => handleLogout()}>logout</button>
        </p>
      </div>
    )
  }

  const handleCreateBlog = async (blog) => {
    try {
      const newBlog = await blogService.createNew(blog)
      const finishedBlog = { ...newBlog, user: user }
      setBlogs(blogs.concat(finishedBlog))
      handleNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)

    } catch (exception) {
      handleNotification('error', 'error')
    }
  }

  const handleBlogLike = async (blog) => {
    const putBlog = { ...blog, user: blog.user.id }
    try {
      const updateBlog = await blogService.updateBlog(putBlog)
      setBlogs(blogs.map(oldBlog => oldBlog.id === blog.id ? blog : oldBlog))
    } catch (exception) {
      handleNotification('Something went wrong', 'error')
    }
  }

  const handleBlogDelete = async (blog) => {
    try {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(singleBlog => singleBlog.id !== blog.id))
      handleNotification(`a blog ${blog.title} by ${blog.author} removed`)
    } catch (exception) {
      console.log(exception)
      handleNotification('Something went wrong', 'error')
    }
  }

  const showBlogs = () => {
    blogs.sort((a, b) => a.likes > b.likes ? -1 : 0)
    return (
      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleBlogLike={handleBlogLike}
            handleBlogDelete={handleBlogDelete}
            user={user}
          />
        )}
      </div>
    )}

  return (
    <div>
      {loginForm()}
      {user &&
      <Togglable buttonLabel="New Blog">
        <BlogForm handleCreateBlog={handleCreateBlog}/>
      </Togglable>
      }
      {user && showBlogs()}
    </div>
  )
}

export default App