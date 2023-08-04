import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailsVisible, setDetailsVisible] = useState(false)
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }

  const toggleDetailsVisible = () => {
    setDetailsVisible(!detailsVisible)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <span>{blog.title}</span>
        <span>&nbsp;<button onClick={ toggleDetailsVisible} className='toggle'>{ detailsVisible ? 'hide' : 'view' }</button></span>
      </div>
      <div style={showWhenVisible} className='toggleContent'>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={likeBlog} className='likeButton'>like</button></div>
        <div>{blog.user.name}</div>
        <div>
          {
            blog.user.username === user.username &&
                        <button onClick={deleteBlog} className='removeButton'>remove</button>
          }
        </div>
      </div>

    </div >
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired ,
  user: PropTypes.object.isRequired
}
export default Blog