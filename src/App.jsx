import { useEffect } from "react";
import { useAtom } from "jotai";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error from "./pages/Error";

import { firebaseAuth } from "../firebase";
import { authUserAtom } from "../firebase/auth";

const ProtectedRoute = ({ children }) => {
  const [authUser] = useAtom(authUserAtom);
  if (!authUser) {
    console.log(
      `🛑🤚🛑 Protected routes can only be visited by Authenticated Users!`
    );
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [_, setAuthUser] = useAtom(authUserAtom);

  // Sets up an auth-observer as soon as app mounts to track the auth-state in realtime
  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setAuthUser(user);
      if (user) {
        console.log(`${user.displayName} (User) is now  authenticated!`);
      } else console.log(`User is not authenticated!`);
    });
    return () => unsub();
  }, []);

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
