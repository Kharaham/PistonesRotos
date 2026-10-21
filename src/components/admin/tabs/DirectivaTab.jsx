import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Upload } from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function DirectivaTab({ onNotify, onImageUpload, setConfirmDialog }) {
  const { 
    cmsData, 
    addCommitteeMember, 
    updateCommitteeMember, 
    deleteCommitteeMember 
  } = useCms();

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    role: 'Capitán',
    name: '',
    moto: '',
    years: '5 años en ruta',
    bio: '',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  });

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;
    addCommitteeMember(newMember);
    setNewMember({ role: 'Capitán', name: '', moto: '', years: '5 años en ruta', bio: '', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' });
    setIsAddingMember(false);
    if (onNotify) onNotify('Nuevo integrante de directiva agregado');
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name || !editingMember.role) return;
    updateCommitteeMember(editingMember.id, editingMember);
    setEditingMember(null);
    if (onNotify) onNotify('Integrante de la directiva actualizado');
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">Comité de Presidentes & Directiva</h3>
          <p className="admin-panel-desc">Gestiona los miembros a cargo de la asociación.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={() => {
            setIsAddingMember(!isAddingMember);
            if (!isAddingMember) setEditingMember(null);
          }}
        >
          <Plus size={16} /> {isAddingMember ? 'Cerrar' : 'Agregar Integrante'}
        </button>
      </div>

      {isAddingMember && (
        <form onSubmit={handleCreateMember} style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ffffff' }}>Nuevo Integrante de Mesa Directiva</h4>
          <div className="form-grid">
            <div>
              <label className="form-label">Cargo (Ej: Presidente, Tesorero)</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Nombre y Apodo en Ruta</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="Ej: Marcelo 'Halcón' Silva"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Modelo de Moto</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ej: Harley Davidson Road King"
                value={newMember.moto}
                onChange={(e) => setNewMember({ ...newMember, moto: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Foto (URL o Subir)</label>
              <div className="image-preview-group">
                <img src={newMember.image || '/logo.jpg'} alt="Previsualización" className="image-preview-thumb" />
                <div className="image-preview-controls">
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newMember.image}
                    onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
                  />
                  <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    <Upload size={14} /> Subir Foto
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => onImageUpload(e, (url) => setNewMember({ ...newMember, image: url }))}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group-full">
              <label className="form-label">Responsabilidad / Biografía</label>
              <textarea 
                className="form-textarea" 
                placeholder="Breve reseña sobre su labor en el club..."
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.2rem' }}>
            <Plus size={16} /> Guardar Integrante
          </button>
        </form>
      )}

      <div className="admin-items-list">
        {cmsData.committee?.map((member) => {
          const isEditing = editingMember?.id === member.id;
          return (
            <div 
              key={member.id} 
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
                  setEditingMember(null);
                } else {
                  setEditingMember({ ...member });
                  setIsAddingMember(false);
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={member.image || '/logo.jpg'} 
                    alt={member.name} 
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.2)' }} 
                  />
                  <div className="admin-item-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="admin-item-title">{member.name}</span>
                      {isEditing && (
                        <span className="mono" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#ffffff', color: '#000', fontWeight: 700 }}>
                          EDITANDO
                        </span>
                      )}
                    </div>
                    <div className="admin-item-meta mono">
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{member.role}</span>
                      <span>•</span>
                      <span>{member.moto}</span>
                      {member.years && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#94a3b8' }}>{member.years}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="admin-item-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn-icon"
                    title={isEditing ? 'Cerrar edición' : 'Editar integrante'}
                    onClick={() => {
                      if (isEditing) {
                        setEditingMember(null);
                      } else {
                        setEditingMember({ ...member });
                        setIsAddingMember(false);
                      }
                    }}
                    style={{ color: isEditing ? '#ffffff' : 'var(--text-secondary)' }}
                  >
                    {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                  </button>

                  <button 
                    type="button" 
                    className="btn-icon btn-danger"
                    title="Eliminar de la directiva"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: '¿Retirar de la Directiva?',
                        message: `¿Estás seguro de que deseas retirar a "${member.name}" (${member.role}) de la mesa directiva?`,
                        confirmText: 'Sí, Retirar',
                        cancelText: 'Cancelar',
                        variant: 'danger',
                        action: () => {
                          deleteCommitteeMember(member.id);
                          if (editingMember?.id === member.id) setEditingMember(null);
                          if (onNotify) onNotify('Miembro retirado de la directiva');
                        }
                      });
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Inline Edit Form when member is clicked */}
              {isEditing && (
                <form 
                  onSubmit={handleUpdateMember}
                  onClick={(e) => e.stopPropagation()}
                  style={{ 
                    marginTop: '1.2rem', 
                    paddingTop: '1.2rem', 
                    borderTop: '1px solid var(--border-medium)',
                    cursor: 'default'
                  }}
                >
                  <div className="form-grid">
                    <div>
                      <label className="form-label">Cargo (Ej: Presidente, Tesorero)</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={editingMember.role || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Nombre y Apodo en Ruta</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={editingMember.name || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Modelo de Moto</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingMember.moto || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, moto: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="form-label">Años de Trayectoria</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ej: 15 años en ruta"
                        value={editingMember.years || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, years: e.target.value })}
                      />
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Fotografía del Integrante</label>
                      <div className="image-preview-group">
                        <img src={editingMember.image || '/logo.jpg'} alt={editingMember.name} className="image-preview-thumb" />
                        <div className="image-preview-controls">
                          <input 
                            type="text" 
                            className="form-input" 
                            value={editingMember.image || ''}
                            onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                          />
                          <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                            <Upload size={14} /> Subir Imagen
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={(e) => onImageUpload(e, (url) => setEditingMember({ ...editingMember, image: url }))}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Responsabilidad / Biografía</label>
                      <textarea 
                        className="form-textarea" 
                        style={{ minHeight: '85px' }}
                        value={editingMember.bio || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem' }}>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Save size={15} /> Guardar Cambios
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingMember(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
