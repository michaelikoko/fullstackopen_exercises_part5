import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import AddBlogForm from './components/AddBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  const [user, setUser] = useState(null)

  //fconst [addBlogVisible, setAddBlogVisible] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      //console.log(exception.response.data.error)
      setErrorMessage(exception.response.data.error)
      setNotificationType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

  const addBlog = async (blogObject) => {
    console.log('add blog', blogObject)

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log(returnedBlog)
        setBlogs(blogs.concat(returnedBlog))

        setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author}`)
        setNotificationType('success')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const likeBlog = (id) => {
    const blog = blogs.find(blog => blog.id === id)
    const changedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    blogService
      .update(id, changedBlog).then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => {
        console.log(error)
        setErrorMessage(
          `Blog '${blog.title}' was already removed from server`
        )
        setNotificationType('error')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== id))
      })
  }

  const deleteBlog = (id) => {
    const blog = blogs.find(blog => blog.id === id)
    if (window.confirm(`Remove blog ${blog.title}! by ${blog.author}`)) {
      blogService
        .deleteBlog(id)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          setBlogs(blogs.filter(b => b.id !== id))
        })

    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} notificationType={notificationType} />

        <form onSubmit={handleLogin}>
          <div>
						username
            <input
              type="text"
              value={username}
              name="Username"
              id='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
						password
            <input
              type="password"
              value={password}
              name="Password"
              id='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id='login-button'>login</button>
        </form>
      </div>
    )
  }

  const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes).reverse()

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} notificationType={notificationType} />

      <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      </div>

      <Togglable buttonLabel="create new blog">
        <AddBlogForm createBlog={addBlog} />
      </Togglable>

      {
        sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            likeBlog={() => likeBlog(blog.id)}
            deleteBlog={() => deleteBlog(blog.id)}
          />
        )
      }
    </div>
  )
}


export default App