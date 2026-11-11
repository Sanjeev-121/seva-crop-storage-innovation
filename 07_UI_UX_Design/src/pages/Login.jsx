
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { DEMO_PIN } from "../data/demoAccount.js";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    pin: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.pin.trim()) {
      setError("Please enter your demo PIN.");
      return;
    }

    const result = login(formData.phone, formData.pin);

    if (!result.ok) {
      setError(result.error || "Login failed.");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <>
      <PageHeader
        title="Farmer Login"
        subtitle="Login to access your farmer account."
      />

      <div className="container section">
        <div className="card form-card">
          <h2>Login to Your Account</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Mobile Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pin">Demo PIN</label>
              <input
                id="pin"
                name="pin"
                type="password"
                value={formData.pin}
                onChange={handleChange}
                placeholder="Enter demo PIN"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>

          <p className="form-note">
            Demo PIN: {DEMO_PIN}
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
