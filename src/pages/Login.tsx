// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation (optional)
    if (!username || !password) {
    setError("Username and password are required");
    return;
    }

    try {
        const response = await fetch("https://pubfitnessstudio.pythonanywhere.com/web_login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            username: username,
            password: password
            }),
        });

        const data = await response.json();

        if (data.status === "Login Successful") {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("deviceid", data.deviceid);
            localStorage.setItem("username", username);
            navigate("/");
            window.location.reload();
        } else {
            setError(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred. Please try again later.");
        alert(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
