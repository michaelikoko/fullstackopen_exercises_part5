import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'

test('<AddBlogForm /> calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()
  const { container } = render(<AddBlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('input title')
  const authorInput = screen.getByPlaceholderText('input author')
  const urlInput = screen.getByPlaceholderText('input url')
  const submitButton = container.querySelector('.submit')

  await user.type(titleInput, 'Test Blog Article')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'www.someurl.com')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    'title': 'Test Blog Article',
    'author': 'John Doe',
    'url': 'www.someurl.com'
  })

})