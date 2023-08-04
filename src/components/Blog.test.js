import '@testing-library/jest-dom/extend-expect'
// eslint-disable-next-line no-unused-vars
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  const blog = {
    'title': 'Test Blog Article',
    'author': 'John Doe',
    'url': 'www.someurl.com',
    'likes': 72,
    'user': {
      'username': 'janeroe',
      'name': 'Jane Roe',
      'id': '64a95672a76782e32e79ecea'
    },
    'id': '64a992aec6aaf0d06343eb62'
  }
  const likeBlog = jest.fn()
  const deleteBlog = jest.fn()
  const userObj = {
    'token': 'sometoken123',
    'username': 'johndoe',
    'name': 'John Doe'
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user={userObj} />
    ).container
  })

  test('Blog\'s URl and number of likes are shown when the view button in clicked', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.toggle')
    await user.click(button)
    //screen.debug(button)

    const contentDiv = container.querySelector('.toggleContent')
    //screen.debug(contentDiv)

    expect(contentDiv).not.toHaveStyle('display: none')

  })

  test('If like button is clicked twice, the event handler recieved as props is called twice', async () => {
    const user = userEvent.setup()
    const likeButton = container.querySelector('.likeButton')
    await user.click(likeButton)
    await user.click(likeButton)
    //screen.debug(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})

