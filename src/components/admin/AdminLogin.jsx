import React, { useState } from 'react';
import './AdminLogin.css';
import { Lock, X, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCms } from '../../context/CmsContext';

export default function AdminLogin({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const { cmsData } = useCms();
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = login(email, password);
    setLoading(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } else {
      setError(res.error || 'Credenciales no válidas');
    }
  };

  return (
    <div className="admin-login-overlay" role="dialog" aria-modal="true">
      <div className="admin-login-card">
        <button 
          className="admin-close-btn" 
          onClick={onClose}
          aria-label="Cerrar modal de ingreso"
        >
          <X size={20} />
        </button>

        <div className="admin-login-header">
          <img 
            src={cmsData.clubInfo.logoImage || '/logo.jpg'} 
            alt="Emblema del club" 
            className="admin-login-logo" 
          />
          <h2 className="admin-login-title">Acceso Capitán / Admin</h2>
          <p className="admin-login-desc">Ingresa para editar el contenido del sitio web</p>
        </div>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div>
            <label className="form-label">Usuario o Email</label>
            <input 
              type="text" 
              required
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div>
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              required
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Accediendo...' : 'Ingresar al Gestor de Contenidos'}
          </button>
        </form>

        <div className="admin-login-hint">
          <span><strong>Credenciales de prueba:</strong></span>
          <span>Usuario: <code>admin</code></span>
          <span>Contraseña: <code>admin</code></span>
        </div>
      </div>
    </div>
  );
}
