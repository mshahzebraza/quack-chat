import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error from "./pages/Error";

const ProtectedRoute = ({ children }) => {
  const authenticated = false; // TODO: temporarily
  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" errorElement={<Error />}>
          {/* Index Route */}
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* Login Route */}
          <Route path="login" element={<Login />} />
          {/* Register Route */}
          <Route path="register" element={<Register />} />
          {/* Error Route */}
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
