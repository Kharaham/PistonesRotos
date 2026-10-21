import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function RodadasTab({ onNotify, setConfirmDialog }) {
  const { 
    cmsData, 
    addRoute, 
    updateRoute, 
    deleteRoute, 
    updateShowRoutes 
  } = useCms();

  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [newRoute, setNewRoute] = useState({
    title: '',
    category: 'montana',
    categoryLabel: 'Alta Montaña',
    distance: '',
    difficulty: 'Intermedia',
    date: '',
    time: '08:00 AM',
    meetingPoint: '',
    description: ''
  });

  const handleCreateRoute = (e) => {
    e.preventDefault();
    if (!newRoute.title || !newRoute.distance) return;
    const catLabels = { montana: 'Alta Montaña', costa: 'Carretera & Valles', nocturna: 'Nocturna' };
    addRoute({ ...newRoute, categoryLabel: catLabels[newRoute.category] || 'General' });
    setNewRoute({ title: '', category: 'montana', categoryLabel: 'Alta Montaña', distance: '', difficulty: 'Intermedia', date: '', time: '08:00 AM', meetingPoint: '', description: '' });
    setIsAddingRoute(false);
    if (onNotify) onNotify('Nueva rodada agregada');
  };

  const handleUpdateRoute = (e) => {
    e.preventDefault();
    if (!editingRoute || !editingRoute.title || !editingRoute.distance) return;
    const catLabels = { montana: 'Alta Montaña', costa: 'Carretera & Valles', nocturna: 'Nocturna' };
    const categoryLabel = catLabels[editingRoute.category] || editingRoute.categoryLabel || 'General';
    updateRoute(editingRoute.id, { ...editingRoute, categoryLabel });
    setEditingRoute(null);
    if (onNotify) onNotify('Rodada actualizada con éxito');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Calendario de Rodadas</h3>
          <p className="admin-panel-desc">Publica y programa salidas oficiales del club.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={() => {
            setIsAddingRoute(!isAddingRoute);
            if (!isAddingRoute) setEditingRoute(null);
          }}
        >
          <Plus size={16} /> {isAddingRoute ? 'Cerrar' : 'Nueva Rodada'}
        </button>
      </div>

      {/* Interruptor de Visibilidad de la Sección en la Landing */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: cmsData.showRoutes !== false ? 'rgba(255, 255, 255, 0.02)' : 'rgba(239, 68, 68, 0.06)',
        border: `1px solid ${cmsData.showRoutes !== false ? 'var(--border-subtle)' : 'rgba(239, 68, 68, 0.25)'}`,
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.8rem',
        flexWrap: 'wrap',
        gap: '1rem',
        transition: 'all var(--transition-normal)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h4 style={{ color: '#ffffff', margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
              Mostrar Sección en la Landing
            </h4>
            <span style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              background: cmsData.showRoutes !== false ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: cmsData.showRoutes !== false ? '#4ade80' : '#f87171',
              border: `1px solid ${cmsData.showRoutes !== false ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              letterSpacing: '0.05em'
            }}>
              {cmsData.showRoutes !== false ? 'HABILITADA' : 'DESHABILITADA'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
            {cmsData.showRoutes !== false
              ? 'La sección "Próximas Rodadas Oficiales" está visible en la página principal y en el menú de navegación.'
              : 'La sección de Rodadas está oculta para el público en la landing page y en los menús de navegación.'}
          </p>
        </div>

        <label className="admin-switch" title="Habilitar o Deshabilitar sección de Rodadas">
          <input
            type="checkbox"
            checked={cmsData.showRoutes !== false}
            onChange={(e) => {
              const enabled = e.target.checked;
              updateShowRoutes(enabled);
              if (onNotify) onNotify(enabled ? 'Sección Rodadas habilitada en la landing' : 'Sección Rodadas deshabilitada en la landing');
            }}
          />
          <span className="admin-switch-slider"></span>
        </label>
      </div>

      {isAddingRoute && (
        <form onSubmit={handleCreateRoute} style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ffffff' }}>Programar Nueva Rodada</h4>
          <div className="form-grid">
            <div>
              <label className="form-label">Destino / Nombre *</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="Ej: Valle del Elqui"
                value={newRoute.title}
                onChange={(e) => setNewRoute({ ...newRoute, title: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Categoría</label>
              <select 
                className="form-select"
                value={newRoute.category}
                onChange={(e) => setNewRoute({ ...newRoute, category: e.target.value })}
              >
                <option value="montana">Alta Montaña</option>
                <option value="costa">Carretera & Valles</option>
                <option value="nocturna">Nocturna</option>
              </select>
            </div>
            <div>
              <label className="form-label">Distancia Total *</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="Ej: 340 KM"
                value={newRoute.distance}
                onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Dificultad</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Intermedia - Alta"
                value={newRoute.difficulty}
                onChange={(e) => setNewRoute({ ...newRoute, difficulty: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Fecha</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Sábado 18 de Enero"
                value={newRoute.date}
                onChange={(e) => setNewRoute({ ...newRoute, date: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Horario / Convocatoria</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: 07:30 AM (Briefing 08:00 AM)"
                value={newRoute.time}
                onChange={(e) => setNewRoute({ ...newRoute, time: e.target.value })}
              />
            </div>
            <div className="form-group-full">
              <label className="form-label">Punto de Encuentro</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Shell Km 20 Autopista Central"
                value={newRoute.meetingPoint}
                onChange={(e) => setNewRoute({ ...newRoute, meetingPoint: e.target.value })}
              />
            </div>
            <div className="form-group-full">
              <label className="form-label">Descripción & Recomendaciones de Ruta</label>
              <textarea 
                rows={3}
                className="form-textarea" 
                placeholder="Detalla paradas, curvas, requisitos de equipo..."
                value={newRoute.description}
                onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.2rem' }}>
            <Plus size={16} /> Publicar Rodada
          </button>
        </form>
      )}

      <div className="admin-items-list">
        {cmsData.routes?.map((route) => {
          const isEditing = editingRoute?.id === route.id;
          return (
            <div 
              key={route.id} 
              className={`admin-item-row ${isEditing ? 'admin-item-row-editing' : ''}`}
              style={{
                flexDirection: 'column',
                alignItems: 'stretch',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isEditing ? '1px solid rgba(255, 255, 255, 0.4)' : undefined,
                background: isEditing ? 'rgba(255, 255, 255, 0.04)' : undefined
              }}
              onClick={() => {
                if (isEditing) {
                  setEditingRoute(null);
                } else {
                  setEditingRoute({ ...route });
                  setIsAddingRoute(false);
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div className="admin-item-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="admin-item-title">{route.title}</span>
                    {isEditing && (
                      <span className="mono" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#ffffff', color: '#000', fontWeight: 700 }}>
                        EDITANDO
                      </span>
                    )}
                  </div>
                  <div className="admin-item-meta mono">
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{route.categoryLabel || route.category}</span>
                    <span>•</span>
                    <span>{route.distance}</span>
                    {route.difficulty && (
                      <>
                        <span>•</span>
                        <span style={{ color: '#94a3b8' }}>{route.difficulty}</span>
                      </>
                    )}
                    {route.date && (
                      <>
                        <span>•</span>
                        <span>{route.date}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="admin-item-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn-icon"
                    title={isEditing ? 'Cerrar edición' : 'Editar rodada'}
                    onClick={() => {
                      if (isEditing) {
                        setEditingRoute(null);
                      } else {
                        setEditingRoute({ ...route });
                        setIsAddingRoute(false);
                      }
                    }}
                    style={{ color: isEditing ? '#ffffff' : 'var(--text-secondary)' }}
                  >
                    {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                  </button>

                  <button 
                    type="button" 
                    className="btn-icon btn-danger"
                    title="Eliminar rodada"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: '¿Eliminar Rodada?',
                        message: `¿Estás seguro de que deseas eliminar permanentemente la ruta "${route.title}" del calendario?`,
                        confirmText: 'Sí, Eliminar',
                        cancelText: 'Cancelar',
                        variant: 'danger',
                        action: () => {
                          deleteRoute(route.id);
                          if (editingRoute?.id === route.id) setEditingRoute(null);
                          if (onNotify) onNotify('Rodada eliminada con éxito');
                        }
                      });
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Formulario Inline de Edición cuando se presiona la ruta */}
              {isEditing && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  style={{ 
                    marginTop: '1.2rem', 
                    paddingTop: '1.2rem', 
                    borderTop: '1px solid var(--border-subtle)',
                    cursor: 'default'
                  }}
                >
                  <form onSubmit={handleUpdateRoute}>
                    <div className="form-grid">
                      <div>
                        <label className="form-label">Destino / Nombre *</label>
                        <input 
                          type="text" 
                          required 
                          className="form-input" 
                          value={editingRoute.title || ''}
                          onChange={(e) => setEditingRoute({ ...editingRoute, title: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="form-label">Categoría</label>
                        <select 
                          className="form-select"
                          value={editingRoute.category || 'montana'}
                          onChange={(e) => setEditingRoute({ ...editingRoute, category: e.target.value })}
                        >
                          <option value="montana">Alta Montaña</option>
                          <option value="costa">Carretera & Valles</option>
                          <option value="nocturna">Nocturna</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Distancia Total *</label>
                        <input 
                          type="text" 
                          required 
                          className="form-input" 
                          value={editingRoute.distance || ''}
                          onChange={(e) => setEditingRoute({ ...editingRoute, distance: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="form-label">Dificultad</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: Intermedia - Alta"
                          value={editingRoute.difficulty || ''}
                          onChange={(e) => setEditingRoute({ ...editingRoute, difficulty: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="form-label">Fecha</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: Sábado 15 de Noviembre"
                          value={editingRoute.date || ''}
                          onChange={(e) => setEditingRoute({ ...editingRoute, date: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="form-label">Horario / Convocatoria</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: 07:30 AM (Briefing 08:00 AM)"
                          value={editingRoute.time || ''}
                          onChange={(e) => setEditingRoute({ ...editingRoute, time: e.target.value })}
                        />
                      </div>

                      <div className="form-group-full">
                        <label className="form-label">Punto de Encuentro</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: Shell Km 20 Autopista Central"
                          value={editingRoute.meetingPoint || ''}
                          onChange={(e) => setEditingRoute({ ...editingRoute, meetingPoint: e.target.value })}
                        />
                      </div>

                      <div className="form-group-full">
                        <label className="form-label">Descripción & Recomendaciones de Ruta</label>
                        <textarea 
                          rows={3}
                          className="form-textarea" 
                          placeholder="Detalla paradas, curvas, requisitos de equipo..."
                          value={editingRoute.description || ''}
                          onChange={(e) => setEditingRoute({ ...editingRoute, description: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingRoute(null)}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-sm"
                      >
                        <Save size={15} /> Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
