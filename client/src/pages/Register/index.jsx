function Register() {
  return (
    <section>
      <h1 className="section-title">Register</h1>
      <form style={{ maxWidth: 380 }}>
        <input className="form-control" type="text" placeholder="Name" />
        <input className="form-control" type="email" placeholder="Email" />
        <input className="form-control" type="password" placeholder="Password" />
        <button type="submit" className="primary">
          Create Account
        </button>
      </form>
    </section>
  );
}

export default Register;
