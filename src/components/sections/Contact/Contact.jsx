import React, { useState, useEffect, useRef } from 'react';
import './Contact.css';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  Users, 
  CheckCircle2, 
  HeartHandshake, 
  ArrowRight, 
  FileText, 
  X, 
  ShieldCheck, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useCms } from '../../../context/CmsContext';

export default function Contact({ selectedRoute, onNotify }) {
  const { cmsData, addContactRequest } = useCms();
  const { clubInfo, contactSettings } = cmsData;

  const targetEmail = contactSettings?.targetEmail || 'contacto@lospistonesrotos.cl';
  const whatsappNumber = contactSettings?.whatsappNumber || clubInfo?.whatsappNumber || '+56 9 8765 4321';
  const whatsappLink = contactSettings?.whatsappLink || clubInfo?.whatsappLink || 'https://wa.me/56987654321';
  const instagramHandle = contactSettings?.instagramHandle || clubInfo?.instagramHandle || '@lospistonesrotos.mc';
  const instagramLink = contactSettings?.instagramLink || clubInfo?.instagramLink || 'https://instagram.com';
  const coordinationHours = contactSettings?.coordinationHours || 'Lunes a Domingo de 10:00 a 20:00 hrs.';

  // Form visibility state: defaults to closed for a clean, spacious community layout
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef(null);

  // Auto-open form if user clicked a specific route from the Routes section
  useEffect(() => {
    if (selectedRoute) {
      setIsFormOpen(true);
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [selectedRoute]);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    participacion: 'Tengo moto y quiero unirme a rodar',
    moto: '',
    ciudad: '',
    mensaje: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.mensaje.trim()) {
      if (onNotify) onNotify('Por favor completa los campos obligatorios (*)');
      return;
    }

    // Save request to CMS Context (stored in localStorage & visible in Admin Dashboard)
    addContactRequest({
      nombre: formData.nombre.trim(),
      telefono: formData.telefono.trim(),
      participacion: formData.participacion,
      moto: formData.moto.trim() || 'No especificada',
      ciudad: formData.ciudad.trim() || 'No especificada',
      mensaje: formData.mensaje.trim(),
      routeInterest: selectedRoute || ''
    });

    setSubmittedName(formData.nombre.trim());
    setIsSubmitted(true);

    if (onNotify) {
      onNotify('¡Solicitud registrada con éxito! La directiva ha sido notificada.');
    }

    // Reset fields
    setFormData({
      nombre: '',
      telefono: '',
      participacion: 'Tengo moto y quiero unirme a rodar',
      moto: '',
      ciudad: '',
      mensaje: ''
    });
  };

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const directWhatsAppChatUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `¡Hola Los Pistones Rotos! Acabo de enviar una consulta en su página web. Mi nombre es ${submittedName || 'un interesado'}.`
  )}`;

  return (
    <section id="contacto" className="section contact-section">
      <div className="container">
        {/* Main Spacious Community Hub Presentation */}
        <div className="contact-hub-header reveal">
          <div className="badge contact-family-badge">
            <HeartHandshake size={14} />
            <span>COMUNIDAD & FAMILIA EN RUTA</span>
          </div>

          <h2 className="section-title contact-main-title">
            {contactSettings?.welcomeTitle || `¿Quieres rodar o conocer a la familia de ${clubInfo?.name || 'Los Pistones Rotos'}?`}
          </h2>

          <p className="section-desc contact-main-desc">
            {contactSettings?.welcomeDesc || 
              'No somos un club cerrado ni militarizado: somos una gran familia de amigos, parejas y entusiastas que disfrutan de la ruta segura, el respeto mutuo y las buenas historias. Tengas la moto que tengas o si estás recién conociendo este mundo, todos son bienvenidos.'}
          </p>

          <div className="contact-values-row">
            <span className="contact-value-pill">
              <ShieldCheck size={14} /> Ambiente 100% familiar y de respeto
            </span>
            <span className="contact-value-pill">
              <Sparkles size={14} /> Todas las marcas y cilindradas
            </span>
            <span className="contact-value-pill">
              <Users size={14} /> Rutas seguras y organizadas
            </span>
          </div>
        </div>

        {/* 3 Direct Communication Channels in Spacious Grid */}
        <div className="contact-channels-grid reveal">
          {/* WhatsApp */}
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-channel-card whatsapp-channel"
            title="Abrir chat de WhatsApp"
          >
            <div className="channel-icon-box whatsapp-box">
              <MessageSquare size={24} />
            </div>
            <div className="channel-card-body">
              <span className="channel-tag">ATENCIÓN DIRECTA</span>
              <h3 className="channel-title">WhatsApp Oficial</h3>
              <p className="channel-detail">{whatsappNumber}</p>
              <p className="channel-hint">Respuesta rápida con los capitanes y directiva</p>
            </div>
            <div className="channel-action-row">
              <span>Chatear ahora</span>
              <ArrowRight size={16} />
            </div>
          </a>

          {/* Email */}
          <a 
            href={`mailto:${targetEmail}?subject=Consulta%20desde%20sitio%20web%20Los%20Pistones%20Rotos`} 
            className="contact-channel-card email-channel"
            title="Enviar correo directo"
          >
            <div className="channel-icon-box email-box">
              <Mail size={24} />
            </div>
            <div className="channel-card-body">
              <span className="channel-tag">BUZÓN DIRECTIVA</span>
              <h3 className="channel-title">Correo Electrónico</h3>
              <p className="channel-detail">{targetEmail}</p>
              <p className="channel-hint">Horario de coordinación: {coordinationHours}</p>
            </div>
            <div className="channel-action-row">
              <span>Enviar correo</span>
              <ArrowRight size={16} />
            </div>
          </a>

          {/* Instagram */}
          <a 
            href={instagramLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="contact-channel-card instagram-channel"
            title="Ver Instagram oficial"
          >
            <div className="channel-icon-box instagram-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <div className="channel-card-body">
              <span className="channel-tag">COMUNIDAD & FOTOS</span>
              <h3 className="channel-title">Instagram Oficial</h3>
              <p className="channel-detail">{instagramHandle}</p>
              <p className="channel-hint">Fotos, reels, bitácoras de ruta y salidas familiares</p>
            </div>
            <div className="channel-action-row">
              <span>Seguir en Instagram</span>
              <ArrowRight size={16} />
            </div>
          </a>
        </div>

        {/* Action Banner / Expandable Form Switch */}
        {!isFormOpen ? (
          <div className="contact-cta-banner reveal">
            <div className="contact-cta-left">
              <div className="contact-cta-icon-badge">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="contact-cta-title">
                  ¿Prefieres dejarnos tus datos o tienes dudas específicas?
                </h3>
                <p className="contact-cta-desc">
                  Completa nuestro formulario de contacto si buscas sumarte a una salida de prueba, consultar sobre próximas rutas o saber cómo participar junto a tu familia.
                </p>
              </div>
            </div>
            <div className="contact-cta-right">
              <button 
                type="button" 
                className="btn btn-primary contact-cta-btn"
                onClick={handleOpenForm}
              >
                <Users size={18} />
                <span>Quiero más información / Formulario</span>
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        ) : (
          /* Focused, Centered, Spacious Form Container */
          <div ref={formRef} className="contact-expanded-form-wrapper">
            <div className="stealth-card form-container-expanded">
              {/* Form Card Header with Close button */}
              <div className="form-expanded-header">
                <div className="form-top-bar">
                  <div className="form-header-badge">
                    <Users size={14} />
                    <span>SOLICITUD / CONSULTA</span>
                  </div>

                  <button 
                    type="button" 
                    className="btn-close-form" 
                    onClick={handleCloseForm}
                    title="Cerrar formulario y volver a canales"
                    aria-label="Cerrar formulario"
                  >
                    <X size={15} />
                    <span>Cerrar</span>
                  </button>
                </div>

                <h3 className="form-header-title">Quiero más información / Conocer el grupo</h3>
                <p className="form-header-desc">
                  Déjanos tus datos o cualquier consulta y te responderemos a la brevedad.
                </p>
              </div>

              {selectedRoute && (
                <div className="route-selected-banner">
                  <span className="mono">RUTA DE INTERÉS SELECCIONADA:</span>
                  <strong>{selectedRoute}</strong>
                </div>
              )}

              {isSubmitted ? (
                <div className="contact-success-state">
                  <div className="contact-success-icon">
                    <CheckCircle2 size={46} />
                  </div>
                  <h3 className="contact-success-title">
                    ¡Muchas gracias, {submittedName}!
                  </h3>
                  <p className="contact-success-desc">
                    Tu mensaje ha sido recibido con éxito y registrado en la bandeja de la directiva ({targetEmail}).
                    Un capitán o coordinador se pondrá en contacto contigo a la brevedad para orientarte y darte la bienvenida.
                  </p>

                  <div className="contact-success-actions">
                    <a 
                      href={directWhatsAppChatUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-whatsapp-direct"
                    >
                      <MessageSquare size={18} />
                      Chatear por WhatsApp ahora
                    </a>

                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setIsSubmitted(false)}
                    >
                      Enviar otra consulta
                    </button>

                    <button 
                      type="button" 
                      className="btn btn-text-subtle" 
                      onClick={handleCloseForm}
                    >
                      Volver a canales principales
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="form-grid">
                  <div>
                    <label className="form-label">Nombre y Apellido *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">WhatsApp o Teléfono *</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-input" 
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>

                  <div className="form-group-full">
                    <label className="form-label">¿Cómo te gustaría participar?</label>
                    <select 
                      className="form-select"
                      value={formData.participacion}
                      onChange={(e) => setFormData({ ...formData, participacion: e.target.value })}
                    >
                      <option value="Tengo moto y quiero unirme a rodar">Tengo moto y quiero unirme a rodar en grupo</option>
                      <option value="Quiero participar en una salida familiar de prueba">Quiero participar en una salida familiar de prueba</option>
                      <option value="Voy con acompañante / pareja y busco grupo tranquilo">Voy con acompañante / pareja y busco grupo tranquilo y seguro</option>
                      <option value="Tengo dudas sobre mi moto o cilindrada">Tengo dudas sobre si mi moto o cilindrada es apta</option>
                      <option value="Solo quiero información general">Solo quiero información general sobre el club</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Tu Moto / Modelo (Opcional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.moto}
                      onChange={(e) => setFormData({ ...formData, moto: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Ciudad o Comuna (Opcional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    />
                  </div>

                  <div className="form-group-full">
                    <label className="form-label">¿Qué te gustaría saber o consultar? *</label>
                    <textarea 
                      required
                      className="form-textarea" 
                      rows={4}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-group-full form-actions-bottom">
                    <button type="submit" className="btn btn-primary form-submit-btn">
                      <Send size={18} />
                      <span>Enviar Consulta a la Directiva</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-cancel-form"
                      onClick={handleCloseForm}
                    >
                      Cancelar y Volver
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
