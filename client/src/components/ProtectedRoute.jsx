import { Navigate } from 'react-router-dom';
import { useRDN } from '../context/RDNContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useRDN();
  const token = localStorage.getItem('rdn_token');

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
