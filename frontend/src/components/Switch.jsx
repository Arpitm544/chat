import { Link } from 'react-router-dom'

const Switch = ({ type }) => {
  return (
    <div className="auth-switch">
      {type === "login" ? (
        <Link to="/signup">
          Don't have an account? Create one
        </Link>
      ) : (
        <Link to="/login">
          Already have an account? Sign in
        </Link>
      )}
    </div>
  )
}

export default Switch
