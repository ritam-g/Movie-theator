import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const onSubmit = async (event) => {
    event.preventDefault();
    const action = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(action)) {
      navigate("/");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <h1 className="section-title">Login</h1>
      <form style={{ maxWidth: 380 }} onSubmit={onSubmit}>
        <input
          className="form-control"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <input
          className="form-control"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      {error ? <p className="empty">{error}</p> : null}
      <p className="meta">
        No account? <Link to="/register">Create one</Link>
      </p>
    </section>
  );
}

export default Login;
