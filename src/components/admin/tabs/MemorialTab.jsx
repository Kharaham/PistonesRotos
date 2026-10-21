import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Upload } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function MemorialTab({ onNotify, onImageUpload, setConfirmDialog }) {
  const { 
    cmsData, 
    addMemorialMember, 
    updateMemorialMember, 
    deleteMemorialMember 
  } = useCms();

  const [isAddingMemorial, setIsAddingMemorial] = useState(false);
  const [editingMemorial, setEditingMemorial] = useState(null);
  const [newMemorial, setNewMemorial] = useState({
    name: '',
    years: '',
    moto: '',
    words: '',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
  });

  const handleCreateMemorial = (e) => {
    e.preventDefault();
    if (!newMemorial.name || !newMemorial.years) return;
    addMemorialMember(newMemorial);
    setNewMemorial({ name: '', years: '', moto: '', words: '', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80' });
    setIsAddingMemorial(false);
    if (onNotify) onNotify('Homenaje agregado al memorial');
  };

  const handleUpdateMemorial = (e) => {
    e.preventDefault();
    if (!editingMemorial || !editingMemorial.name || !editingMemorial.years) return;
    updateMemorialMember(editingMemorial.id, editingMemorial);
    setEditingMemorial(null);
    if (onNotify) onNotify('Homenaje del memorial actualizado con éxito');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Memorial // Asfalto Eterno</h3>
          <p className="admin-panel-desc">Homenaje a los hermanos caídos de la asociación.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={() => {
            setIsAddingMemorial(!isAddingMemorial);
            if (!isAddingMemorial) setEditingMemorial(null);
          }}
        >
          <Plus size={16} /> {isAddingMemorial ? 'Cerrar' : 'Nuevo Homenaje'}
        </button>
      </div>

      {isAddingMemorial && (
        <form onSubmit={handleCreateMemorial} style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ffffff' }}>Agregar Hermano al Memorial</h4>
          <div className="form-grid">
            <div>
              <label className="form-label">Nombre y Apodo en Ruta *</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="Ej: Héctor 'El Cóndor' Navarro"
                value={newMemorial.name}
                onChange={(e) => setNewMemorial({ ...newMemorial, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Años (Ej: 1980 — 2023) *</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                value={newMemorial.years}
                onChange={(e) => setNewMemorial({ ...newMemorial, years: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Moto que rodaba</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Yamaha DragStar 1100"
                value={newMemorial.moto}
                onChange={(e) => setNewMemorial({ ...newMemorial, moto: e.target.value })}
              />
            </div>
            <div className="form-group-full">
              <label className="form-label">Foto de Recuerdo</label>
              <div className="image-preview-group">
                <img 
                  src={newMemorial.image || '/logo.jpg'} 
                  alt="Previsualización" 
                  className="image-preview-thumb" 
                  style={{ filter: 'grayscale(100%)' }}
                />
                <div className="image-preview-controls">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="URL de la imagen"
                    value={newMemorial.image}
                    onChange={(e) => setNewMemorial({ ...newMemorial, image: e.target.value })}
                  />
                  <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    <Upload size={14} /> Subir Imagen
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => onImageUpload(e, (url) => setNewMemorial({ ...newMemorial, image: url }))}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group-full">
              <label className="form-label">Palabras en su memoria / Lema</label>
              <textarea 
                className="form-textarea" 
                placeholder="«El viento no se detiene...»"
                value={newMemorial.words}
                onChange={(e) => setNewMemorial({ ...newMemorial, words: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.2rem' }}>
            <Plus size={16} /> Publicar en Memorial
          </button>
        </form>
      )}

      <div className="admin-items-list">
        {cmsData.memorial?.map((brother) => {
          const isEditing = editingMemorial?.id === brother.id;
          return (
            <div 
              key={brother.id} 
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
                  setEditingMemorial(null);
                } else {
                  setEditingMemorial({ ...brother });
                  setIsAddingMemorial(false);
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={brother.image || '/logo.jpg'} 
                    alt={brother.name} 
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', filter: 'grayscale(100%)', border: '1.5px solid rgba(255,255,255,0.2)' }} 
                  />
                  <div className="admin-item-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="admin-item-title">{brother.name}</span>
                      {isEditing && (
                        <span className="mono" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#ffffff', color: '#000', fontWeight: 700 }}>
                          EDITANDO
                        </span>
                      )}
                    </div>
                    <div className="admin-item-meta mono">
                      <span style={{ color: '#fbbf24' }}>{brother.years}</span>
                      {brother.moto && (
                        <>
                          <span>•</span>
                          <span>{brother.moto}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="admin-item-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn-icon"
                    title={isEditing ? 'Cerrar edición' : 'Editar homenaje'}
                    onClick={() => {
                      if (isEditing) {
                        setEditingMemorial(null);
                      } else {
                        setEditingMemorial({ ...brother });
                        setIsAddingMemorial(false);
                      }
                    }}
                    style={{ color: isEditing ? '#ffffff' : 'var(--text-secondary)' }}
                  >
                    {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                  </button>

                  <button 
                    type="button" 
                    className="btn-icon btn-danger"
                    title="Eliminar homenaje"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: '¿Eliminar Homenaje del Memorial?',
                        message: `¿Estás seguro de que deseas retirar el homenaje a "${brother.name}"?`,
                        confirmText: 'Sí, Eliminar',
                        cancelText: 'Cancelar',
                        variant: 'danger',
                        action: () => {
                          deleteMemorialMember(brother.id);
                          if (editingMemorial?.id === brother.id) setEditingMemorial(null);
                          if (onNotify) onNotify('Homenaje retirado del memorial');
                        }
                      });
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Formulario Inline de Edición cuando se presiona el homenaje */}
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
                  <form onSubmit={handleUpdateMemorial}>
                    <div className="form-grid">
                      <div>
                        <label className="form-label">Nombre y Apodo en Ruta *</label>
                        <input 
                          type="text" 
                          required 
                          className="form-input" 
                          value={editingMemorial.name || ''}
                          onChange={(e) => setEditingMemorial({ ...editingMemorial, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="form-label">Años (Ej: 1980 — 2023) *</label>
                        <input 
                          type="text" 
                          required 
                          className="form-input" 
                          value={editingMemorial.years || ''}
                          onChange={(e) => setEditingMemorial({ ...editingMemorial, years: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="form-label">Moto que rodaba</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: Yamaha DragStar 1100"
                          value={editingMemorial.moto || ''}
                          onChange={(e) => setEditingMemorial({ ...editingMemorial, moto: e.target.value })}
                        />
                      </div>

                      <div className="form-group-full">
                        <label className="form-label">Fotografía del Hermano</label>
                        <div className="image-preview-group">
                          <img 
                            src={editingMemorial.image || '/logo.jpg'} 
                            alt={editingMemorial.name} 
                            className="image-preview-thumb" 
                            style={{ filter: 'grayscale(100%)' }}
                          />
                          <div className="image-preview-controls">
                            <input 
                              type="text" 
                              className="form-input" 
                              value={editingMemorial.image || ''}
                              onChange={(e) => setEditingMemorial({ ...editingMemorial, image: e.target.value })}
                              placeholder="https://... o subir archivo"
                            />
                            <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                              <Upload size={14} /> Subir Imagen
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }}
                                onChange={(e) => onImageUpload(e, (url) => setEditingMemorial({ ...editingMemorial, image: url }))}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="form-group-full">
                        <label className="form-label">Palabras en su memoria / Lema</label>
                        <textarea 
                          rows={3}
                          className="form-textarea" 
                          placeholder="«El viento no se detiene...»"
                          value={editingMemorial.words || ''}
                          onChange={(e) => setEditingMemorial({ ...editingMemorial, words: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingMemorial(null)}
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
