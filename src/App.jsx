import { Suspense, lazy, useEffect } from "react";
import { useAtom } from "jotai";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { firebaseAuth } from "../firebase";
import { atom } from "jotai";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Error = lazy(() => import("./pages/Error"));

export const activeChatUserAtom = atom(null);
export const authUserAtom = atom(false);

const ProtectedRoute = ({ children }) => {
  const [authUser] = useAtom(authUserAtom);
  if (!authUser) {
    console.log(
      "🛑🤚🛑 Protected routes can only be visited by Authenticated Users!"
    );
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [authUser, setAuthUser] = useAtom(authUserAtom);

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
      <Suspense fallback={<div>Suspense Loading...</div>}>
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
          </Route>
          {/* Catch All/Error Route */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
