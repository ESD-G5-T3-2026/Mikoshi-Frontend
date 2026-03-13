function DashboardContent({ onLogout, user }) {
  return (
    <section className="dashboard-card" aria-label="Dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard.</p>
      <p>{user?.email ? `Logged in as ${user.email}` : 'No user data found.'}</p>
      <button type="button" onClick={onLogout}>
        Log Out
      </button>
    </section>
  )
}

export default DashboardContent
