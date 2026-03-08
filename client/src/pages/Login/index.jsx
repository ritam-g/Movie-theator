/**
 * Login Page Component
 * 
 * Provides a login form for existing users.
 * Features:
 * - Email and password inputs
 * - Form validation (HTML5)
 * - Loading state during authentication
 * - Error display
 * - Redirect to home on successful login
 * - Redirect to home if already authenticated
 */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
// Redux action for logging in
import { loginUser } from "../../redux/slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Local form state
  const [form, setForm] = useState({ email: "", password: "" });

  /**
   * Handle form submission
   * Dispatches login action and redirects on success
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    // Dispatch login action
    const action = await dispatch(loginUser(form));
    // Redirect to home if login was successful
    if (loginUser.fulfilled.match(action)) {
      navigate("/");
    }
  };

  // If already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <h1 className="section-title">Login</h1>

      {/* Login form */}
      <form style={{ maxWidth: 380 }} onSubmit={onSubmit}>
        {/* Email input */}
        <input
          className="form-control"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />

        {/* Password input */}
        <input
          className="form-control"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />

        {/* Submit button with loading state */}
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Error message */}
      {error ? <p className="empty">{error}</p> : null}

      {/* Link to registration page */}
      <p className="meta">
        No account? <Link to="/register">Create one</Link>
      </p>
    </section>
  );
}

export default Login;
