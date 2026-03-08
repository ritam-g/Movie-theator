import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/slices/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onSubmit = async (event) => {
    event.preventDefault();
    const action = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(action)) {
      navigate("/");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <h1 className="section-title">Register</h1>
      <form style={{ maxWidth: 380 }} onSubmit={onSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Name"
          required
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      {error ? <p className="empty">{error}</p> : null}
      <p className="meta">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Register;
