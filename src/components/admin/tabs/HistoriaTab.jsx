import React, { useState, useEffect } from 'react';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function HistoriaTab({ onNotify, onImageUpload }) {
  const { cmsData, updateHistory } = useCms();
  const [historyForm, setHistoryForm] = useState({
    ...cmsData.history,
    story: cmsData.history.story || (Array.isArray(cmsData.history.paragraphs) ? cmsData.history.paragraphs.join(' ') : ''),
    image: cmsData.history.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    showTimeline: cmsData.history.showTimeline !== false,
    milestones: Array.isArray(cmsData.history.milestones) ? [...cmsData.history.milestones] : []
  });

  useEffect(() => {
    setHistoryForm({
      ...cmsData.history,
      story: cmsData.history.story || (Array.isArray(cmsData.history.paragraphs) ? cmsData.history.paragraphs.join(' ') : ''),
      image: cmsData.history.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      showTimeline: cmsData.history.showTimeline !== false,
      milestones: Array.isArray(cmsData.history.milestones) ? [...cmsData.history.milestones] : []
    });
  }, [cmsData.history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateHistory(historyForm);
    if (onNotify) onNotify('Historia y cronología guardadas');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Historia y Origen del Club</h3>
          <p className="admin-panel-desc">Edita el relato fundacional, la fotografía representativa y administra la línea de tiempo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group-full">
            <label className="form-label">Título de la Historia</label>
            <input 
              type="text" 
              className="form-input" 
              value={historyForm.title || ''}
              onChange={(e) => setHistoryForm({ ...historyForm, title: e.target.value })}
            />
          </div>

          <div className="form-group-full">
            <label className="form-label">Bajada / Subtítulo</label>
            <textarea 
              className="form-textarea" 
              style={{ minHeight: '70px' }}
              value={historyForm.subtitle || ''}
              onChange={(e) => setHistoryForm({ ...historyForm, subtitle: e.target.value })}
            />
          </div>

          {/* Single Story Paragraph */}
          <div className="form-group-full">
            <label className="form-label">Relato / Historia del Club (1 Párrafo)</label>
            <textarea 
              className="form-textarea" 
              style={{ minHeight: '140px', lineHeight: '1.6' }}
              placeholder="Escribe el relato histórico de la hermandad..."
              value={historyForm.story || ''}
              onChange={(e) => setHistoryForm({ ...historyForm, story: e.target.value })}
            />
          </div>

          {/* Club Image Field */}
          <div className="form-group-full">
            <label className="form-label">Fotografía Representativa del Club / Historia</label>
            <div className="image-preview-group">
              <img src={historyForm.image || '/convoy.jpg'} alt="Historia" className="image-preview-thumb" />
              <div className="image-preview-controls">
                <input 
                  type="text" 
                  className="form-input" 
                  value={historyForm.image || ''}
                  onChange={(e) => setHistoryForm({ ...historyForm, image: e.target.value })}
                />
                <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <Upload size={14} /> Subir Imagen
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => onImageUpload(e, (url) => setHistoryForm({ ...historyForm, image: url }))}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Timeline Switch and Milestones Manager */}
          <div className="form-group-full" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ color: '#ffffff', margin: 0, fontSize: '1.1rem' }}>Línea de Tiempo (Hitos de la Hermandad)</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Activa o desactiva la visualización de la cronología en la sección Historia.
                </p>
              </div>
              <label className="admin-switch" title="Activar/Desactivar línea de tiempo">
                <input 
                  type="checkbox"
                  checked={!!historyForm.showTimeline}
                  onChange={(e) => setHistoryForm({ ...historyForm, showTimeline: e.target.checked })}
                />
                <span className="admin-switch-slider"></span>
              </label>
            </div>

            {historyForm.showTimeline && (
              <div className="history-milestones-manager" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>
                    Hitos Registrados ({historyForm.milestones?.length || 0})
                  </span>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const newMilestone = {
                        id: Date.now(),
                        year: '2025',
                        title: 'Nuevo Hito',
                        desc: 'Breve descripción del logro o acontecimiento...'
                      };
                      setHistoryForm({
                        ...historyForm,
                        milestones: [...(historyForm.milestones || []), newMilestone]
                      });
                    }}
                  >
                    <Plus size={14} /> Agregar Hito
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {historyForm.milestones?.map((m, idx) => (
                    <div key={m.id || idx} style={{ background: '#121318', border: '1px solid var(--border-medium)', borderRadius: '8px', padding: '1.2rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                        <div style={{ width: '130px' }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Año / Época</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Ej: 2024 o Hoy"
                            value={m.year || ''}
                            onChange={(e) => {
                              const copy = [...historyForm.milestones];
                              copy[idx] = { ...copy[idx], year: e.target.value };
                              setHistoryForm({ ...historyForm, milestones: copy });
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Título del Hito</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Ej: Personería Jurídica"
                            value={m.title || ''}
                            onChange={(e) => {
                              const copy = [...historyForm.milestones];
                              copy[idx] = { ...copy[idx], title: e.target.value };
                              setHistoryForm({ ...historyForm, milestones: copy });
                            }}
                          />
                        </div>
                        <button 
                          type="button" 
                          className="btn-icon btn-danger"
                          style={{ marginTop: '1.4rem' }}
                          title="Eliminar hito"
                          onClick={() => {
                            const copy = historyForm.milestones.filter((_, i) => i !== idx);
                            setHistoryForm({ ...historyForm, milestones: copy });
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Descripción del Hito</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Detalle del hito..."
                          value={m.desc || ''}
                          onChange={(e) => {
                            const copy = [...historyForm.milestones];
                            copy[idx] = { ...copy[idx], desc: e.target.value };
                            setHistoryForm({ ...historyForm, milestones: copy });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.8rem' }}>
          <Save size={18} /> Guardar Historia
        </button>
      </form>
    </div>
  );
}
