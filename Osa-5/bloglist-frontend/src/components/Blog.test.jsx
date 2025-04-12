import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe } from 'vitest'

describe('Blog', () => {
  let container
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 10,
    user: { name : 'john Doe' }
  }
  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} handleBlogLike={mockHandler}/>
    ).container
  })

  test('renders content', () => {
    const div = container.querySelector('.smallBlog')
    expect(div).toHaveTextContent(
      'Test Blog'
    )
  })

  test('at the start bigger version is not displayed', () => {
    const div = container.querySelector('.bigBlog')
    expect(div).toHaveStyle('display: none')
  })

  test('smaller version is not displayed after clicking on view button', async() => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.smallBlog')
    expect(div).toHaveStyle('display: none')
  })

  test('clicking the button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})