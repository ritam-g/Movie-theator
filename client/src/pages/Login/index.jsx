function Login() {
  return (
    <section>
      <h1 className="section-title">Login</h1>
      <form style={{ maxWidth: 380 }}>
        <input className="form-control" type="email" placeholder="Email" />
        <input className="form-control" type="password" placeholder="Password" />
        <button type="submit" className="primary">
          Sign In
        </button>
      </form>
    </section>
  );
}

export default Login;
