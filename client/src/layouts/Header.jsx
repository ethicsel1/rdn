import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRDN } from '../context/RDNContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useRDN();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('rdn_token');
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-4 space-y-3">
          {/* Title and Slogan */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-secondary">
              RDN – Rinascita Definitiva dai Narcisisti
            </h1>
            <p className="text-sm md:text-base text-primary font-semibold mt-1">
              Qui non si sopravvive. Qui si rinasce
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex gap-2 md:gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive('/')
                  ? 'bg-primary text-white'
                  : 'bg-background text-secondary hover:bg-primary/20'
              }`}
            >
              Benvenuto
            </Link>
            <Link
              to="/goals"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive('/goals')
                  ? 'bg-primary text-white'
                  : 'bg-background text-secondary hover:bg-primary/20'
              }`}
            >
              Obiettivi
            </Link>
            <Link
              to="/tools"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive('/tools')
                  ? 'bg-primary text-white'
                  : 'bg-background text-secondary hover:bg-primary/20'
              }`}
            >
              Strumenti
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-semibold bg-red/10 text-red hover:bg-red hover:text-white transition-all"
            >
              Esci
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
