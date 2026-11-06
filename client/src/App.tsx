import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";

// Portal pages
import Dashboard from "./pages/portal/dashboard/Dashboard";
import Profile from "./pages/portal/profile/Profile";

// Layouts
import PublicWrapper from "./layouts/PublicWrapper/PublicWrapper";
import PrivateWrapper from "./layouts/PrivateWrapper/PrivateWrapper";

import "./App.scss";
import FAQs from "pages/portal/faqs/Faqs";

const App = () => {
  return (
    <div className="app-shell">
      <Routes>
        {/* Public website */}
        <Route
          path="/"
          element={<PublicWrapper component={<Home />} />}
        />

        <Route
          path="/register"
          element={<PublicWrapper component={<Register />} />}
        />

        <Route
          path="/login"
          element={<PublicWrapper component={<Login />} />}
        />

        {/* Customer portal */}
        <Route
          path="/portal"
          element={<PrivateWrapper />}
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="profile"
            element={<Profile />}
          />

          <Route
            path="faqs"
            element={<FAQs />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;