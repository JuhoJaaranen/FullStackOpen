const Notification = ({ message, error }) => {
  if (!message) {
    return null
  } else if (error) {
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  return (
    <div className="notification">
      {message}
    </div>
  )
}

export default Notification