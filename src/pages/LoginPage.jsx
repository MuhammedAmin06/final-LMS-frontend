import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const navigate = useNavigate();
  const userCredentials = JSON.parse(
    localStorage.getItem("users") ?? "[]"
  );
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleLoginCredentials = () => {
    // Handle login credentials logic here
    for (const login of userCredentials) {
      console.log(login.email, login.password);
      if (login.email === newEmail && login.password === newPassword) {
        // Login successful
        setIsLoggedIn(true);
        setShowError(false);
        return;
      }
    }
    setShowError(true);
    setNewEmail("");
    setNewPassword("");
  };

  

  return (
    <>
      <div>
        {showError && (
          <p style={{ color: "red" }}>Invalid email or password.</p>
        )}
        
      </div>
      <form>
        <h1>Login Page</h1>
        <div>
          <label>Email: </label>
          <input
            type="text"
            placeholder="Email"
            value={newEmail}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="button" onClick={handleLoginCredentials}>
          Login
        </button>
      </form>
    </>
  );
};

export default LoginPage;
