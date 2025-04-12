const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'vaara', 'vaara')
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'A new blog', 'mluukkai', 'website')
      await expect(page.getByText('a new blog A new blog by mluukkai added')).toBeVisible()
      await expect(page.getByText('A new blog mluukkai view')).toBeVisible()
    })

    describe('a new blog can be ', () => {

      beforeEach(async ({ page }) => {
        await createBlog(page, 'A test blog', 'mluukkai', 'website')
      })
        
      test('liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('A test blog mluukkai hidewebsitelikes 1 likeMatti Luukkainendelete')).toBeVisible()
      })

      test('deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'delete' }).click()
        await expect(page.getByText('a blog A test blog by mluukkai removed')).toBeVisible()
      })

      test('viewed but not deleted by other user', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Matti Meikalainen',
            username: 'meikalainen',
            password: 'salasana'
          }
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'meikalainen', 'salasana')
        
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('A test blog mluukkai hidewebsitelikes 0 like')).toBeVisible()
      })
    })

    describe('blogs are shown in the right order ', () => {
      test('by likes', async ({ page }) => {
        await createBlog(page, '1 like', 'mluukkai', 'website')
        await expect(page.getByText('1 like mluukkai view')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()

        await page.getByTestId('title').fill('2 likes')
        await page.getByTestId('author').fill('mluukkai')
        await page.getByTestId('url').fill('website')
        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText('2 likes mluukkai view')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByText('1 like mluukkai hidewebsitelikes 0 like')).toBeVisible()
        const blogs = await page.locator('.bigBlog').all()
        await blogs[1].getByRole('button', { name: 'like' }).click()
        await expect(blogs[1].getByText('1 like mluukkai hidewebsitelikes 0 like')).toBeVisible()
      })
    })
  })
})