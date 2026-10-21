import React, { useState } from 'react';
import './App.css';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { CmsProvider, useCms } from './context/CmsContext';

// Layout Components
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';

// Landing Sections (In ordered storytelling flow)
import Hero from './components/sections/Hero/Hero';
import History from './components/sections/History/History';
import Manifest from './components/sections/Manifest/Manifest';
import Committee from './components/sections/Committee/Committee';
import Convoy from './components/sections/Convoy/Convoy';
import Gallery from './components/sections/Gallery/Gallery';
import Routes from './components/sections/Routes/Routes';
import Rules from './components/sections/Rules/Rules';
import Memorial from './components/sections/Memorial/Memorial';
import Faq from './components/sections/Faq/Faq';
import Contact from './components/sections/Contact/Contact';

// Admin Components (Lazy loaded for optimal landing page performance)
const AdminLogin = React.lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));

// UI
import Toast from './components/ui/Toast';
import { Edit3 } from 'lucide-react';
import { useScrollReveal } from './utils/useScrollReveal';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const { cmsData } = useCms();
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'admin'
  const isLandingView = viewMode === 'landing' || !isAuthenticated;

  // Ensure dark mode is active and clean up any theme-light class
  React.useEffect(() => {
    document.body.classList.remove('theme-light');
    document.documentElement.classList.remove('theme-light');
    localStorage.removeItem('pistones_theme');
  }, []);

  // Reactivate scroll entrance system whenever landing is active
  useScrollReveal(isLandingView);

  // If session is logged out while viewMode is admin, reset viewMode to landing
  React.useEffect(() => {
    if (!isAuthenticated && viewMode === 'admin') {
      setViewMode('landing');
    }
  }, [isAuthenticated, viewMode]);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setViewMode('admin');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleExitAdmin = () => {
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectRoute = (routeTitle) => {
    setSelectedRoute(routeTitle);
    const contactElem = document.getElementById('contacto');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Ruta "${routeTitle}" seleccionada en el formulario`);
  };

  // If in Admin Dashboard mode
  if (viewMode === 'admin' && isAuthenticated) {
    return (
      <React.Suspense fallback={<div className="admin-loading" style={{ height: '100vh', background: '#08080a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Cargando Panel...</div>}>
        <Toast message={toastMessage} />
        <AdminDashboard 
          onExitAdmin={handleExitAdmin} 
          onNotify={showToast} 
        />
      </React.Suspense>
    );
  }

  // Public Landing Page
  return (
    <div className="app-wrapper">
      {/* Toast notifications */}
      <Toast message={toastMessage} />

      {/* Admin Login Modal (Lazy loaded) */}
      {isLoginOpen && (
        <React.Suspense fallback={null}>
          <AdminLogin 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onSuccess={() => {
              setIsLoginOpen(false);
              setViewMode('admin');
              showToast('Bienvenido al Panel de Administración');
            }} 
          />
        </React.Suspense>
      )}

      {/* Main navigation */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

      {/* Main landing content: Ordered Storytelling Flow */}
      <main id="main-content">
        {/* 1. Portada & Cifras en vivo */}
        <Hero />

        {/* 2. Historia & Origen de Los Pistones Rotos */}
        <History />

        {/* 3. Manifiesto & 4 Pilares de Hermandad */}
        <Manifest />

        {/* 4. Comité & Mesa Directiva de Presidentes */}
        <Committee />

        {/* 5. La Manada & Disciplina en Caravana */}
        <Convoy />

        {/* 6. Galería de Fotos & Bitácora en Ruta */}
        <Gallery />

        {/* 7. Calendario de Rodadas Oficiales (Habilitable / Deshabilitable desde Admin) */}
        {cmsData.showRoutes !== false && (
          <Routes onSelectRoute={handleSelectRoute} />
        )}

        {/* 8. Código de Honor & Reglas del Asfalto */}
        <Rules />

        {/* 9. Memorial Asfalto Eterno (Homenaje a Hermanos Fallecidos) */}
        <Memorial onNotify={showToast} />

        {/* 10. Preguntas Frecuentes */}
        <Faq />

        {/* 11. Convocatoria & Contacto */}
        <Contact selectedRoute={selectedRoute} onNotify={showToast} />
      </main>

      {/* Global footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Floating admin badge if authenticated while browsing live site */}
      {isAuthenticated && (
        <div className="floating-admin-bar">
          <span className="floating-admin-text">
            <span className="badge-dot"></span>
            Modo Capitán / Admin
          </span>
          <button 
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setViewMode('admin')}
          >
            <Edit3 size={14} /> Editar Contenido
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CmsProvider>
        <MainApp />
      </CmsProvider>
    </AuthProvider>
  );
}
