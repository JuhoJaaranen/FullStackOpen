import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    newNotification(state, action) {
      const content = action.payload
      return content
    },
    hideNotification() {
      return ''
    }
  }
})

export const { newNotification, hideNotification } = notificationSlice.actions

export const setNotification = (content, duration) => {
  console.log(content)
  const time = duration * 1000
  return async dispatch => {
    dispatch(newNotification(content))
    setTimeout(() => {
      dispatch(hideNotification())
    }, time)
  }
}

export default notificationSlice.reducer