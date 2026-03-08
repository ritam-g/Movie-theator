/**
 * Register Page Component
 * 
 * Provides a registration form for new users.
 * Features:
 * - Name, email, and password inputs
 * - Form validation (HTML5)
 * - Loading state during registration
 * - Error display
 * - Redirect to home on successful registration
 * - Redirect to home if already authenticated
 */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
// Redux action for registering
import { registerUser } from "../../redux/slices/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Local form state
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  /**
   * Handle form submission
   * Dispatches register action and redirects on success
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    // Dispatch register action
    const action = await dispatch(registerUser(form));
    // Redirect to home if registration was successful
    if (registerUser.fulfilled.match(action)) {
      navigate("/");
    }
  };

  // If already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <h1 className="section-title">Register</h1>

      {/* Registration form */}
      <form style={{ maxWidth: 380 }} onSubmit={onSubmit}>
        {/* Name input */}
        <input
          className="form-control"
          type="text"
          placeholder="Name"
          required
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />

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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Error message */}
      {error ? <p className="empty">{error}</p> : null}

      {/* Link to login page */}
      <p className="meta">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Register;
