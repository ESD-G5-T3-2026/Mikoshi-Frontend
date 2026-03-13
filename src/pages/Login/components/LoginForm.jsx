function LoginForm({ onSubmit, isLoading }) {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" placeholder="you@example.com" required disabled={isLoading} />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" placeholder="Enter your password" required disabled={isLoading} />

      <button type="submit" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
    </form>
  )
}

export default LoginForm
