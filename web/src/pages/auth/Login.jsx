import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login is not connected yet.");
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Sign in </h1>
        <p className="login-sub">Enter your username and password.</p>

        <label htmlFor="username">Username </label>
        <div className="login-input">
          <User size={20} />
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="login-input">
          <Lock size={20} />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" className="login-btn">
          Log in
        </button>
      </form>
    </div>
  );
}
