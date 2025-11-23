const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3">RDN</h3>
            <p className="text-sm text-white/80">
              Rinascita Definitiva dai Narcisisti. Ecosistema di crescita personale ed empowerment.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Link Utili</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Termini e Condizioni
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contatti
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-lg font-bold mb-3">Nota Importante</h3>
            <p className="text-sm text-white/80">
              RDN è uno strumento di crescita personale ed empowerment. Non sostituisce supporto
              clinico professionale.
            </p>
            <p className="text-sm text-white/80 mt-2">
              🔴 Emergenze: 112 | 🔵 Telefono Amico: 800 86 00 22
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} RDN. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
