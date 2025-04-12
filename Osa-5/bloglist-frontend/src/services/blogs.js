import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createNew = async (blog) => {
  const header = { 'Authorization': token }
  const response = await axios.post(baseUrl, blog, { headers: header })
  return response.data
}

const updateBlog = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  return response.data
}

const deleteBlog = async (blogId) => {
  const header = { 'Authorization': token }
  const response = await axios.delete(`${baseUrl}/${blogId}`, { headers: header })
  return response.data
}

export default { getAll, setToken, createNew, updateBlog, deleteBlog }