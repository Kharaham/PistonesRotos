import React, { useState } from 'react';
import { 
  Inbox, 
  Settings, 
  MessageSquare, 
  Mail, 
  Save, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Phone, 
  MapPin, 
  Compass, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function SolicitudesTab({ onNotify, onConfirm }) {
  const { 
    cmsData, 
    updateContactSettings, 
    updateContactRequestStatus, 
    deleteContactRequest 
  } = useCms();

  const [subTab, setSubTab] = useState('solicitudes'); // 'solicitudes' | 'config'
  const [filter, setFilter] = useState('todas'); // 'todas' | 'nueva' | 'contactado'

  const requests = cmsData.contactRequests || [];
  const settings = cmsData.contactSettings || {};

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    targetEmail: settings.targetEmail || 'contacto@lospistonesrotos.cl',
    whatsappNumber: settings.whatsappNumber || '+56 9 8765 4321',
    whatsappLink: settings.whatsappLink || 'https://wa.me/56987654321',
    instagramHandle: settings.instagramHandle || '@lospistonesrotos.mc',
    instagramLink: settings.instagramLink || 'https://instagram.com',
    coordinationHours: settings.coordinationHours || 'Lunes a Domingo de 10:00 a 20:00 hrs.',
    welcomeTitle: settings.welcomeTitle || '¿Quieres rodar o conocer a la familia de Los Pistones Rotos?',
    welcomeDesc: settings.welcomeDesc || 'No somos solo un club de motos: somos un grupo unido de amigos, parejas y familias que disfrutan viajar seguro, compartir y rodar con camaradería. Todos son bienvenidos.'
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateContactSettings(settingsForm);
    if (onNotify) onNotify('Configuración de contacto guardada con éxito');
  };

  const handleToggleStatus = (req) => {
    const nextStatus = req.status === 'nueva' ? 'contactado' : 'nueva';
    updateContactRequestStatus(req.id, nextStatus);
    if (onNotify) {
      onNotify(nextStatus === 'contactado' ? 'Solicitud marcada como contactada' : 'Solicitud marcada como nueva');
    }
  };

  const handleDelete = (req) => {
    if (onConfirm) {
      onConfirm({
        title: 'Eliminar Solicitud',
        message: `¿Estás seguro de que deseas eliminar la solicitud de "${req.nombre}"?`,
        confirmText: 'Sí, eliminar',
        action: () => {
          deleteContactRequest(req.id);
          if (onNotify) onNotify('Solicitud eliminada');
        }
      });
    } else {
      deleteContactRequest(req.id);
      if (onNotify) onNotify('Solicitud eliminada');
    }
  };

  const handleOpenWhatsApp = (req) => {
    const cleanNumber = (req.telefono || '').replace(/[^0-9]/g, '');
    const text = `¡Hola ${req.nombre}! Te escribimos desde la directiva de Los Pistones Rotos. Vimos tu consulta en nuestro sitio web sobre "${req.participacion || 'el grupo'}" y nos gustaría contarte cómo son nuestras salidas familiares.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const nuevasCount = requests.filter((r) => r.status === 'nueva').length;
  const contactadosCount = requests.filter((r) => r.status === 'contactado').length;

  const filteredRequests = requests.filter((r) => {
    if (filter === 'nueva') return r.status === 'nueva';
    if (filter === 'contactado') return r.status === 'contactado';
    return true;
  });

  return (
    <div className="admin-panel">
      {/* Panel Top Header */}
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Bandeja de Solicitudes & Canales de Contacto</h3>
          <p className="admin-panel-desc">
            Gestiona los mensajes de las personas interesadas en sumarse y configura los canales oficiales del club.
          </p>
        </div>

        {/* Sub-nav switcher */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${subTab === 'solicitudes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubTab('solicitudes')}
          >
            <Inbox size={15} />
            <span>Solicitudes Recibidas</span>
            {nuevasCount > 0 && (
              <span style={{
                background: '#f59e0b',
                color: '#08080a',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                marginLeft: '0.3rem'
              }}>
                {nuevasCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`btn btn-sm ${subTab === 'config' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubTab('config')}
          >
            <Settings size={15} />
            <span>Configuración Canales & Correo</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          SUB-TAB 1: SOLICITUDES RECIBIDAS (INBOX)
          ==================================================================== */}
      {subTab === 'solicitudes' && (
        <div>
          {/* Stats bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.8rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Inbox size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{requests.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Solicitudes</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{nuevasCount}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nuevas por Contactar</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e' }}>{contactadosCount}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Personas Contactadas</div>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.4rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'todas' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('todas')}
            >
              Todas ({requests.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'nueva' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('nueva')}
            >
              Nuevas ({nuevasCount})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'contactado' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('contactado')}
            >
              Contactadas ({contactadosCount})
            </button>
          </div>

          {/* List of Requests */}
          {filteredRequests.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              <Inbox size={42} style={{ color: 'var(--text-muted)', marginBottom: '0.8rem' }} />
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.1rem' }}>No hay solicitudes en esta vista</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem' }}>
                Cuando los interesados envíen el formulario de contacto en la web, aparecerán aquí con sus datos y botón de WhatsApp directo.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredRequests.map((req) => {
                const isNew = req.status === 'nueva';
                return (
                  <div 
                    key={req.id} 
                    style={{
                      background: isNew ? 'rgba(245, 158, 11, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      border: isNew ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {/* Header Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: isNew ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: isNew ? '#f59e0b' : '#22c55e',
                          border: isNew ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(34, 197, 94, 0.4)'
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: isNew ? '#f59e0b' : '#22c55e'
                          }}></span>
                          {isNew ? 'NUEVA SOLICITUD' : 'CONTACTADO'}
                        </span>

                        <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          📅 {req.date}
                        </span>
                      </div>

                      {req.routeInterest && (
                        <span style={{
                          fontSize: '0.78rem',
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.1)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(56, 189, 248, 0.3)'
                        }}>
                          📍 Ruta de Interés: {req.routeInterest}
                        </span>
                      )}
                    </div>

                    {/* Middle Info Row */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interesado / Contacto</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>{req.nombre}</div>
                        <a 
                          href={`tel:${req.telefono}`} 
                          style={{
                            fontSize: '0.9rem',
                            color: '#38bdf8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            textDecoration: 'none',
                            marginTop: '0.2rem'
                          }}
                        >
                          <Phone size={14} />
                          {req.telefono}
                        </a>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interés & Modalidad</div>
                        <div style={{ fontSize: '0.92rem', color: '#f1f5f9', fontWeight: 600, marginTop: '0.2rem' }}>{req.participacion}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          🏍️ Moto: {req.moto || 'No especificada'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ubicación</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={14} />
                          {req.ciudad || 'No especificada'}
                        </div>
                      </div>
                    </div>

                    {/* Message Text Block */}
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1rem',
                      fontSize: '0.92rem',
                      lineHeight: '1.6',
                      color: '#e2e8f0',
                      fontStyle: 'italic'
                    }}>
                      "{req.mensaje}"
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.8rem',
                      marginTop: '0.4rem'
                    }}>
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{
                          background: '#25d366',
                          color: '#08080a',
                          border: '1px solid #22c55e',
                          fontWeight: 700
                        }}
                        onClick={() => handleOpenWhatsApp(req)}
                        title="Abrir chat en WhatsApp Web"
                      >
                        <MessageSquare size={16} />
                        <span>Escribir por WhatsApp a {req.nombre.split(' ')[0]}</span>
                        <ExternalLink size={13} style={{ opacity: 0.7 }} />
                      </button>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleToggleStatus(req)}
                        >
                          <CheckCircle size={15} />
                          <span>{isNew ? 'Marcar como Contactado' : 'Marcar como Pendiente'}</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(req)}
                          title="Eliminar solicitud"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          SUB-TAB 2: CONFIGURACIÓN DE CANALES & CORREO
          ==================================================================== */}
      {subTab === 'config' && (
        <form onSubmit={handleSaveSettings}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}>
            <Mail size={22} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                Destino de Solicitudes y Enlaces de Atención
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '0.2rem', lineHeight: '1.5' }}>
                Aquí defines a qué correo oficial se dirigen las consultas de la gente que llena el formulario,
                y configuras los botones directos de WhatsApp e Instagram que ven los visitantes.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Correo Receptor */}
            <div>
              <label className="form-label">Correo Oficial de Recepción *</label>
              <input 
                type="email" 
                required
                className="form-input" 
                placeholder="contacto@lospistonesrotos.cl"
                value={settingsForm.targetEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, targetEmail: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                Aparece en la página web y en los avisos de confirmación.
              </span>
            </div>

            {/* Teléfono / WhatsApp */}
            <div>
              <label className="form-label">Número de WhatsApp Oficial *</label>
              <input 
                type="text" 
                required
                className="form-input" 
                placeholder="+56 9 8765 4321"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                Visible en el botón de WhatsApp directo.
              </span>
            </div>

            {/* Enlace WhatsApp Completo */}
            <div className="form-group-full">
              <label className="form-label">Enlace Directo de WhatsApp (wa.me)</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://wa.me/56987654321?text=..."
                value={settingsForm.whatsappLink}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappLink: e.target.value })}
              />
            </div>

            {/* Instagram Handle */}
            <div>
              <label className="form-label">Usuario de Instagram Oficial</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="@lospistonesrotos.mc"
                value={settingsForm.instagramHandle}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
              />
            </div>

            {/* Enlace Instagram */}
            <div>
              <label className="form-label">Enlace URL de Instagram</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://instagram.com/lospistonesrotos.mc"
                value={settingsForm.instagramLink}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagramLink: e.target.value })}
              />
            </div>

            {/* Horario de Atención */}
            <div className="form-group-full">
              <label className="form-label">Horario de Atención y Coordinación</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Lunes a Domingo de 10:00 a 20:00 hrs."
                value={settingsForm.coordinationHours}
                onChange={(e) => setSettingsForm({ ...settingsForm, coordinationHours: e.target.value })}
              />
            </div>

            {/* Título de Bienvenida en la Web */}
            <div className="form-group-full">
              <label className="form-label">Título de Bienvenida en la Sección de Contacto</label>
              <input 
                type="text" 
                className="form-input" 
                value={settingsForm.welcomeTitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, welcomeTitle: e.target.value })}
              />
            </div>

            {/* Mensaje de Filosofía Familiar */}
            <div className="form-group-full">
              <label className="form-label">Mensaje de Filosofía Familiar & Convivencia</label>
              <textarea 
                className="form-textarea" 
                rows="3"
                value={settingsForm.welcomeDesc}
                onChange={(e) => setSettingsForm({ ...settingsForm, welcomeDesc: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Guardar Configuración de Canales
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
