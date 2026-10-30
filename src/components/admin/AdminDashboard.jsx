import React, { useState } from 'react';
import './AdminDashboard.css';
import { 
  Shield, 
  Compass, 
  MapPin, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Eye, 
  EyeOff,
  Menu, 
  Database,
  Users,
  Image as ImageIcon,
  Flame,
  Clock,
  History as HistoryIcon,
  Inbox,
  Cloud,
  CloudUpload,
  RefreshCw,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCms } from '../../context/CmsContext';
import ConfirmModal from '../ui/ConfirmModal';
import { uploadImageToSupabase } from '../../lib/supabase';

// Modular Section Tabs
import IdentidadTab from './tabs/IdentidadTab';
import HeroTab from './tabs/HeroTab';
import HistoriaTab from './tabs/HistoriaTab';
import ManifiestoTab from './tabs/ManifiestoTab';
import DirectivaTab from './tabs/DirectivaTab';
import CaravanaTab from './tabs/CaravanaTab';
import GaleriaTab from './tabs/GaleriaTab';
import RodadasTab from './tabs/RodadasTab';
import ReglasTab from './tabs/ReglasTab';
import MemorialTab from './tabs/MemorialTab';
import FaqsTab from './tabs/FaqsTab';
import DatabaseTab from './tabs/DatabaseTab';
import SolicitudesTab from './tabs/SolicitudesTab';

const TAB_TITLES = {
  identidad: 'Identidad',
  hero: 'Portada',
  historia: 'Historia',
  manifest: 'Manifiesto',
  directiva: 'Directiva',
  convoy: 'Caravana',
  galeria: 'Galería',
  rutas: 'Rodadas',
  reglas: 'Reglas',
  memorial: 'Memorial',
  solicitudes: 'Solicitudes & Contacto',
  faqs: 'Preguntas',
  database: 'Base de Datos'
};

const TAB_SECTION_KEYS = {
  hero: 'hero',
  historia: 'history',
  manifest: 'manifest',
  directiva: 'committee',
  convoy: 'convoy',
  galeria: 'gallery',
  rutas: 'routes',
  reglas: 'rules',
  memorial: 'memorial',
  solicitudes: 'contact',
  faqs: 'faqs'
};

const NAV_GROUPS = [
  {
    group: 'IDENTIDAD & PORTADA',
    items: [
      { id: 'identidad', label: 'Identidad', icon: Settings },
      { id: 'hero', label: 'Portada', icon: Clock, sectionKey: 'hero' },
      { id: 'historia', label: 'Historia', icon: HistoryIcon, sectionKey: 'history' },
    ]
  },
  {
    group: 'HERMANDAD & PILARES',
    items: [
      { id: 'manifest', label: 'Manifiesto', icon: Shield, sectionKey: 'manifest' },
      { id: 'directiva', label: 'Directiva', icon: Users, sectionKey: 'committee' },
      { id: 'convoy', label: 'Caravana', icon: Compass, sectionKey: 'convoy' },
      { id: 'galeria', label: 'Galería', icon: ImageIcon, sectionKey: 'gallery' },
    ]
  },
  {
    group: 'EN RUTA & MEMORIA',
    items: [
      { id: 'rutas', label: 'Rodadas', icon: MapPin, sectionKey: 'routes' },
      { id: 'reglas', label: 'Reglas', icon: BookOpen, sectionKey: 'rules' },
      { id: 'memorial', label: 'Memorial', icon: Flame, sectionKey: 'memorial' },
      { id: 'solicitudes', label: 'Solicitudes', icon: Inbox, sectionKey: 'contact' },
    ]
  },
  {
    group: 'SISTEMA',
    items: [
      { id: 'faqs', label: 'Preguntas', icon: HelpCircle, sectionKey: 'faqs' },
      { id: 'database', label: 'Base de Datos', icon: Database },
    ]
  }
];

export default function AdminDashboard({ onExitAdmin, onNotify }) {
  const { logout } = useAuth();
  const { 
    cmsData, 
    syncStatus, 
    syncWithCloud, 
    isSectionVisible, 
    toggleSectionVisibility 
  } = useCms();

  const [activeTab, setActiveTab] = useState('identidad');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeSectionKey = TAB_SECTION_KEYS[activeTab];

  const handleForceSync = async () => {
    if (onNotify) onNotify('Guardando cambios en Supabase...');
    try {
      const res = await syncWithCloud();
      if (res?.error) {
        if (onNotify) onNotify(`Error al sincronizar: ${res.error.message || 'Verifica la conexión'}`);
      } else {
        if (onNotify) onNotify('¡Cambios guardados en la nube con éxito!');
      }
    } catch (err) {
      if (onNotify) onNotify('Error al conectar con Supabase');
    }
  };

  const nuevasCount = (cmsData.contactRequests || []).filter((r) => r.status === 'nueva').length;

  // Custom confirmation modal state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    variant: 'danger',
    action: null
  });

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onNotify) onNotify('Subiendo imagen a la nube (Supabase)...');

    try {
      const { url, error } = await uploadImageToSupabase(file, activeTab);
      if (url && !error) {
        callback(url);
        if (onNotify) onNotify('¡Imagen guardada en Supabase Storage con éxito!');
        return;
      }
      if (error) {
        console.warn('Aviso Supabase Storage:', error);
      }
    } catch (err) {
      console.warn('Error al subir a Supabase:', err);
    }

    // Fallback local en caso de que el bucket aún no esté creado
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
      if (onNotify) onNotify('Imagen cargada localmente (crea el bucket en Supabase para almacenamiento en nube)');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="admin-sidebar-header">
          <img 
            src={cmsData.clubInfo?.logoImage || '/logo.jpg'} 
            alt="Logo" 
            className="admin-sidebar-logo" 
          />
          <div className="admin-sidebar-brand">
            <span className="admin-sidebar-title">{cmsData.clubInfo?.name || 'Los Pistones Rotos'}</span>
            <span className="admin-sidebar-badge mono">PANEL DE CONTROL</span>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_GROUPS.map((group) => (
            <React.Fragment key={group.group}>
              <span className="admin-nav-section-title">{group.group}</span>
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isToggleable = Boolean(item.sectionKey);
                const isVisible = isToggleable ? isSectionVisible(item.sectionKey) : true;
                const isActive = activeTab === item.id;
                const isSolicitudes = item.id === 'solicitudes';

                return (
                  <button 
                    key={item.id}
                    type="button"
                    className={`admin-nav-item ${isActive ? 'active' : ''} ${!isVisible ? 'is-section-hidden' : ''}`}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  >
                    <div className="admin-nav-item-main">
                      <IconComponent size={18} />
                      <span>{item.label}</span>
                      {isSolicitudes && nuevasCount > 0 && (
                        <span className="admin-badge-count">{nuevasCount}</span>
                      )}
                    </div>

                    {isToggleable && (
                      <div 
                        className={`admin-nav-vis-toggle ${isVisible ? 'vis-active' : 'vis-hidden'}`}
                        title={isVisible ? `Sección visible en la landing. Clic para ocultar` : `Sección oculta en la landing. Clic para mostrar`}
                        aria-label={isVisible ? `Ocultar sección ${item.label}` : `Mostrar sección ${item.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionVisibility(item.sectionKey);
                          if (onNotify) {
                            onNotify(isVisible 
                              ? `Sección "${item.label}" ocultada de la landing` 
                              : `Sección "${item.label}" ahora visible en la landing`
                            );
                          }
                        }}
                      >
                        {isVisible ? (
                          <Eye size={15} />
                        ) : (
                          <>
                            <EyeOff size={14} />
                            <span className="admin-hidden-label">Oculta</span>
                          </>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm admin-logout-btn"
            onClick={() => {
              logout();
              if (onExitAdmin) onExitAdmin();
            }}
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              type="button" 
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
            <div className="admin-topbar-title-group">
              <span className="admin-topbar-sub mono">PANEL CAPITÁN // CONFIGURACIÓN</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                <h2 className="admin-section-name">
                  {TAB_TITLES[activeTab] || 'Panel'}
                </h2>
                {activeSectionKey && (
                  <button
                    type="button"
                    className={`admin-topbar-vis-pill ${isSectionVisible(activeSectionKey) ? 'is-visible' : 'is-hidden'}`}
                    onClick={() => {
                      const curVis = isSectionVisible(activeSectionKey);
                      toggleSectionVisibility(activeSectionKey);
                      if (onNotify) {
                        onNotify(curVis 
                          ? `Sección "${TAB_TITLES[activeTab]}" ocultada de la landing` 
                          : `Sección "${TAB_TITLES[activeTab]}" visible en la landing`
                        );
                      }
                    }}
                    title="Alternar si esta sección se muestra en la landing pública"
                  >
                    {isSectionVisible(activeSectionKey) ? (
                      <>
                        <Eye size={13} />
                        <span>Visible en Landing</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={13} />
                        <span>Oculta en Landing</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="admin-topbar-actions">
            {/* Indicador en vivo de estado Supabase */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: syncStatus === 'saving' 
                  ? 'rgba(234, 179, 8, 0.15)' 
                  : syncStatus === 'synced'
                  ? 'rgba(34, 197, 94, 0.15)'
                  : syncStatus === 'error'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: syncStatus === 'saving'
                  ? '#facc15'
                  : syncStatus === 'synced'
                  ? '#4ade80'
                  : syncStatus === 'error'
                  ? '#f87171'
                  : 'var(--text-muted)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {syncStatus === 'saving' && <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />}
              {syncStatus === 'synced' && <Check size={13} style={{ color: '#4ade80' }} />}
              {syncStatus === 'error' && <AlertTriangle size={13} style={{ color: '#f87171' }} />}
              {syncStatus === 'idle' && <Cloud size={13} />}
              <span>
                {syncStatus === 'saving' ? 'Guardando...' : syncStatus === 'synced' ? 'Nube OK' : syncStatus === 'error' ? 'Error Nube' : 'Supabase Conectado'}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleForceSync}
              title="Guardar todos los cambios en Supabase ahora"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              <CloudUpload size={14} />
              <span className="hide-on-mobile">Guardar Nube</span>
            </button>

            <button 
              type="button" 
              className="admin-btn-view-site"
              onClick={onExitAdmin}
              title="Ver Sitio Web"
              aria-label="Ver Sitio Web"
            >
              <Eye size={16} />
              <span className="admin-btn-view-site-text">Ver Sitio</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="admin-body">
          {activeTab === 'identidad' && (
            <IdentidadTab onNotify={onNotify} onImageUpload={handleImageUpload} />
          )}

          {activeTab === 'hero' && (
            <HeroTab onNotify={onNotify} onImageUpload={handleImageUpload} />
          )}

          {activeTab === 'historia' && (
            <HistoriaTab onNotify={onNotify} onImageUpload={handleImageUpload} />
          )}

          {activeTab === 'manifest' && (
            <ManifiestoTab onNotify={onNotify} />
          )}

          {activeTab === 'directiva' && (
            <DirectivaTab 
              onNotify={onNotify} 
              onImageUpload={handleImageUpload} 
              setConfirmDialog={setConfirmDialog} 
            />
          )}

          {activeTab === 'convoy' && (
            <CaravanaTab onNotify={onNotify} onImageUpload={handleImageUpload} />
          )}

          {activeTab === 'galeria' && (
            <GaleriaTab 
              onNotify={onNotify} 
              onImageUpload={handleImageUpload} 
              setConfirmDialog={setConfirmDialog} 
            />
          )}

          {activeTab === 'rutas' && (
            <RodadasTab 
              onNotify={onNotify} 
              setConfirmDialog={setConfirmDialog} 
            />
          )}

          {activeTab === 'reglas' && (
            <ReglasTab onNotify={onNotify} />
          )}

          {activeTab === 'memorial' && (
            <MemorialTab 
              onNotify={onNotify} 
              onImageUpload={handleImageUpload} 
              setConfirmDialog={setConfirmDialog} 
            />
          )}

          {activeTab === 'solicitudes' && (
            <SolicitudesTab 
              onNotify={onNotify} 
              onConfirm={(dialog) => setConfirmDialog({ ...dialog, isOpen: true })} 
            />
          )}

          {activeTab === 'faqs' && (
            <FaqsTab onNotify={onNotify} />
          )}

          {activeTab === 'database' && (
            <DatabaseTab 
              onNotify={onNotify} 
              setConfirmDialog={setConfirmDialog} 
            />
          )}
        </div>
      </main>

      {/* Sleek Stealth Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
        onConfirm={() => {
          if (confirmDialog.action) confirmDialog.action();
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
