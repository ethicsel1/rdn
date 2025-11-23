import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './layouts/Layout';
import Welcome from './pages/Welcome';
import Goals from './pages/Goals';
import Tools from './pages/Tools';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { RDNProvider } from './context/RDNContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RDNProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Welcome />} />
              <Route path="goals" element={<Goals />} />
              <Route path="tools" element={<Tools />} />
            </Route>
          </Routes>
        </Router>
      </RDNProvider>
    </QueryClientProvider>
  );
}

export default App;
