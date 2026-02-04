import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store/store";
import Layout from "./components/Layout";
import { PrivateRoute, PublicRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EvidenceList from "./pages/EvidenceList";
import EvidenceDetails from "./pages/EvidenceDetails";
import UploadEvidence from "./pages/UploadEvidence";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/evidence"
              element={
                <PrivateRoute>
                  <Layout>
                    <EvidenceList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/evidence/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <EvidenceDetails />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <Layout>
                    <UploadEvidence />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
