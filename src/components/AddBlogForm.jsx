import { useState } from 'react'
import PropTypes from 'prop-types'

const AddBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      'title': newTitle,
      'author': newAuthor,
      'url': newUrl
    }
    createBlog(blogObject)
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder='input title'
            id='title'
          />
        </div>
        <div>
          author:
          <input
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            placeholder='input author'
            id='author'
          />
        </div>
        <div>
          url:
          <input
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            placeholder='input url'
            id='url'
          />
        </div>

        <button type="submit" className='submit'>create</button>
      </form>
    </div>
  )
}

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}
export default AddBlogForm