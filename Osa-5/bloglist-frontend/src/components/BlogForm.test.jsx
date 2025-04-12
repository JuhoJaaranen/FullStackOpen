import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls onSubmit with right arguments', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm handleCreateBlog={createBlog} />)


  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'blog title')
  await user.type(inputs[1], 'blog author')
  await user.type(inputs[2], 'blog url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('blog title')
  expect(createBlog.mock.calls[0][0].author).toBe('blog author')
  expect(createBlog.mock.calls[0][0].url).toBe('blog url')
})