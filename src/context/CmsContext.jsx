import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  CLUB_STATS, 
  CLUB_PILLARS, 
  ROAD_RULES, 
  CLUB_INFO, 
  CLUB_HISTORY, 
  COMMITTEE_MEMBERS, 
  GALLERY_PHOTOS, 
  MEMORIAL_MEMBERS 
} from '../data/clubData';
import { ROUTES_DATA } from '../data/routesData';
import { FAQS_DATA } from '../data/faqsData';
import { 
  supabase,
  saveSolicitudToSupabase, 
  syncCmsToSupabase, 
  fetchCmsFromSupabase 
} from '../lib/supabase';

const CmsContext = createContext();

const STORAGE_KEY = 'pistones_cms_content_v2';

const DEFAULT_CMS_DATA = {
  clubInfo: {
    ...CLUB_INFO,
    logoImage: '/logo.jpg'
  },
  hero: {
    badge: 'HERMANDAD DEL ASFALTO',
    title: 'El asfalto no pide perdón, exige hermandad.',
    description: 'Una comunidad forjada en el rugir del motor, la devoción a las dos ruedas y el respeto incondicional en carretera. Sin importar la marca, rodamos unidos.',
    bgImage: '/hero.jpg',
    stats: [...CLUB_STATS]
  },
  history: {
    ...CLUB_HISTORY
  },
  manifest: {
    badge: 'NUESTROS CIMIENTOS',
    title: 'El Código que nos Rige',
    description: 'No somos solo un grupo de motos de fin de semana. Somos una hermandad con valores claros, seguridad en formación y pasión por la libertad.',
    pillars: [...CLUB_PILLARS]
  },
  committee: [...COMMITTEE_MEMBERS],
  convoy: {
    badge: 'EXPERIENCIA EN CARAVANA',
    tag: 'EN FORMACIÓN NOCTURNA',
    title: 'La fuerza de la manada está en cada miembro.',
    quote: '"No importa qué tan rápido seas por tu cuenta; la verdadera maestría del motociclismo se demuestra sincronizado con tus hermanos al compás del asfalto."',
    image: '/convoy.jpg',
    items: [
      'Capitanes de ruta certificados con botiquín y herramientas viales.',
      'Briefing técnico previo a cada encendido de motor.',
      'Paradas calculadas para fotos, hidratación y reabastecimiento.'
    ]
  },
  gallery: [...GALLERY_PHOTOS],
  showRoutes: true,
  routes: [...ROUTES_DATA],
  rules: [...ROAD_RULES],
  memorial: [...MEMORIAL_MEMBERS],
  faqs: [...FAQS_DATA],
  contactSettings: {
    targetEmail: 'contacto@lospistonesrotos.cl',
    whatsappNumber: '+56 9 8765 4321',
    whatsappLink: 'https://wa.me/56987654321?text=Hola%20Los%20Pistones%20Rotos,%20quisiera%20más%20información%20sobre%20el%20grupo%20familiar',
    instagramHandle: '@lospistonesrotos.mc',
    instagramLink: 'https://instagram.com',
    coordinationHours: 'Lunes a Domingo de 10:00 a 20:00 hrs.',
    welcomeTitle: '¿Quieres rodar o conocer a la familia de Los Pistones Rotos?',
    welcomeDesc: 'No somos solo un club de motos: somos un grupo unido de amigos, parejas y familias que disfrutan viajar seguro, compartir y rodar con camaradería. Todos son bienvenidos.'
  },
  contactRequests: [
    {
      id: 1729500000000,
      date: '21/10/2026, 11:30',
      nombre: 'Ignacio Fuentes',
      telefono: '+56 9 8765 4321',
      participacion: 'Tengo moto y quiero rodar en grupo',
      moto: 'Royal Enfield Interceptor 650',
      ciudad: 'Santiago',
      mensaje: 'Hola hermanos, me gusta mucho su enfoque familiar y el respeto en caravana. Quisiera saber cuándo es la próxima salida para sumarme con mi pareja.',
      status: 'nueva',
      routeInterest: ''
    }
  ]
};

export function CmsProvider({ children }) {
  const [cmsData, setCmsData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new sections exist in case of older saved states
        return {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          showRoutes: parsed.showRoutes !== undefined ? parsed.showRoutes : true,
          history: {
            ...DEFAULT_CMS_DATA.history,
            ...(parsed.history || {}),
            story: (parsed.history && parsed.history.story) 
              ? parsed.history.story 
              : (parsed.history && Array.isArray(parsed.history.paragraphs) ? parsed.history.paragraphs.join(' ') : DEFAULT_CMS_DATA.history.story),
            image: (parsed.history && parsed.history.image) || DEFAULT_CMS_DATA.history.image,
            showTimeline: (parsed.history && parsed.history.showTimeline !== undefined) ? parsed.history.showTimeline : true,
            milestones: (parsed.history && parsed.history.milestones) || DEFAULT_CMS_DATA.history.milestones
          },
          committee: parsed.committee || DEFAULT_CMS_DATA.committee,
          gallery: parsed.gallery || DEFAULT_CMS_DATA.gallery,
          memorial: parsed.memorial || DEFAULT_CMS_DATA.memorial,
          contactSettings: {
            ...DEFAULT_CMS_DATA.contactSettings,
            ...(parsed.contactSettings || {})
          },
          contactRequests: Array.isArray(parsed.contactRequests) 
            ? parsed.contactRequests 
            : DEFAULT_CMS_DATA.contactRequests
        };
      }
    } catch {
      // Fallback silently
    }
    return DEFAULT_CMS_DATA;
  });

  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'saving' | 'synced' | 'error'
  const isInitialMount = useRef(true);
  const syncTimeoutRef = useRef(null);

  // Guardar en localStorage inmediatamente en cada cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cmsData));
    } catch {
      // Storage fallback
    }

    // Auto-sincronización con Supabase (con debounce para no saturar la red)
    if (isInitialMount.current) {
      return;
    }

    setSyncStatus('saving');
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await syncCmsToSupabase(cmsData);
        if (res?.error) {
          console.warn('Error en auto-sync Supabase:', res.error);
          setSyncStatus('error');
        } else {
          setSyncStatus('synced');
          // Volver a estado normal tras 3 segundos
          setTimeout(() => setSyncStatus('idle'), 3000);
        }
      } catch (err) {
        console.warn('Excepción en auto-sync:', err);
        setSyncStatus('error');
      }
    }, 600);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [cmsData]);

  // Carga inicial desde Supabase y sincronización bidireccional
  useEffect(() => {
    let isMounted = true;

    async function initCloudSync() {
      try {
        const remoteContent = await fetchCmsFromSupabase();
        if (!isMounted) return;

        if (remoteContent && remoteContent.hero && remoteContent.clubInfo) {
          // Si la nube ya tiene datos reales del club, adoptarlos como verdad absoluta
          setCmsData((prev) => ({
            ...prev,
            ...remoteContent
          }));
        } else {
          // Si la nube está vacía o sin inicializar, subir los datos locales actuales para sembrar la base de datos
          syncCmsToSupabase(cmsData);
        }
      } catch (err) {
        console.info('Supabase init notice:', err);
      } finally {
        if (isMounted) {
          isInitialMount.current = false;
        }
      }
    }

    initCloudSync();

    // Suscripción en tiempo real: Si otro dispositivo (ej. PC) actualiza el CMS, el móvil lo recibe al instante
    let channel = null;
    if (supabase) {
      channel = supabase
        .channel('realtime_cms_content')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cms_content', filter: 'id=eq.1' },
          (payload) => {
            if (payload.new && payload.new.content && payload.new.content.hero) {
              setCmsData((prev) => ({
                ...prev,
                ...payload.new.content
              }));
            }
          }
        )
        .subscribe();
    }

    return () => {
      isMounted = false;
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Section updaters
  const updateSection = (sectionKey, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...updatedFields
      }
    }));
  };

  const updateClubInfo = (fields) => updateSection('clubInfo', fields);
  const updateHero = (fields) => updateSection('hero', fields);
  const updateHistory = (fields) => updateSection('history', fields);
  const updateManifest = (fields) => updateSection('manifest', fields);
  const updateConvoy = (fields) => updateSection('convoy', fields);

  // Committee methods
  const addCommitteeMember = (member) => {
    setCmsData((prev) => ({
      ...prev,
      committee: [...prev.committee, { ...member, id: Date.now() }]
    }));
  };

  const updateCommitteeMember = (id, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      committee: prev.committee.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    }));
  };

  const deleteCommitteeMember = (id) => {
    setCmsData((prev) => ({
      ...prev,
      committee: prev.committee.filter((m) => m.id !== id)
    }));
  };

  // Gallery methods
  const addGalleryPhoto = (photo) => {
    setCmsData((prev) => ({
      ...prev,
      gallery: [{ ...photo, id: Date.now() }, ...prev.gallery]
    }));
  };

  const updateGalleryPhoto = (id, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    }));
  };

  const deleteGalleryPhoto = (id) => {
    setCmsData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((p) => p.id !== id)
    }));
  };

  // Memorial methods
  const addMemorialMember = (member) => {
    setCmsData((prev) => ({
      ...prev,
      memorial: [...prev.memorial, { ...member, id: Date.now() }]
    }));
  };

  const updateMemorialMember = (id, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      memorial: prev.memorial.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    }));
  };

  const deleteMemorialMember = (id) => {
    setCmsData((prev) => ({
      ...prev,
      memorial: prev.memorial.filter((m) => m.id !== id)
    }));
  };

  // Routes methods
  const addRoute = (newRoute) => {
    setCmsData((prev) => ({
      ...prev,
      routes: [{ ...newRoute, id: Date.now() }, ...prev.routes]
    }));
  };

  const updateRoute = (id, updatedRoute) => {
    setCmsData((prev) => ({
      ...prev,
      routes: prev.routes.map((r) => (r.id === id ? { ...r, ...updatedRoute } : r))
    }));
  };

  const deleteRoute = (id) => {
    setCmsData((prev) => ({
      ...prev,
      routes: prev.routes.filter((r) => r.id !== id)
    }));
  };

  const updateShowRoutes = (enabled) => {
    setCmsData((prev) => ({
      ...prev,
      showRoutes: enabled
    }));
  };

  // Rules methods
  const updateRule = (index, updatedRule) => {
    setCmsData((prev) => {
      const updatedRules = [...prev.rules];
      updatedRules[index] = { ...updatedRules[index], ...updatedRule };
      return { ...prev, rules: updatedRules };
    });
  };

  // FAQs methods
  const updateFaq = (index, updatedFaq) => {
    setCmsData((prev) => {
      const updatedFaqs = [...prev.faqs];
      updatedFaqs[index] = { ...updatedFaqs[index], ...updatedFaq };
      return { ...prev, faqs: updatedFaqs };
    });
  };

  // Contact Requests & Settings methods
  const addContactRequest = (requestData) => {
    const newRequest = {
      ...requestData,
      id: Date.now(),
      date: new Date().toLocaleString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'nueva'
    };
    setCmsData((prev) => ({
      ...prev,
      contactRequests: [newRequest, ...(prev.contactRequests || [])]
    }));

    // Guardar en la tabla 'solicitudes' de Supabase
    saveSolicitudToSupabase(newRequest).catch((err) => {
      console.info('Aviso Supabase solicitudes:', err);
    });

    return newRequest;
  };

  const updateContactRequestStatus = (id, newStatus) => {
    setCmsData((prev) => ({
      ...prev,
      contactRequests: (prev.contactRequests || []).map((req) => 
        req.id === id ? { ...req, status: newStatus } : req
      )
    }));
  };

  const deleteContactRequest = (id) => {
    setCmsData((prev) => ({
      ...prev,
      contactRequests: (prev.contactRequests || []).filter((req) => req.id !== id)
    }));
  };

  const updateContactSettings = (fields) => {
    setCmsData((prev) => {
      const updatedSettings = {
        ...prev.contactSettings,
        ...fields
      };
      return {
        ...prev,
        contactSettings: updatedSettings,
        clubInfo: {
          ...prev.clubInfo,
          whatsappNumber: updatedSettings.whatsappNumber || prev.clubInfo?.whatsappNumber,
          whatsappLink: updatedSettings.whatsappLink || prev.clubInfo?.whatsappLink,
          instagramHandle: updatedSettings.instagramHandle || prev.clubInfo?.instagramHandle,
          instagramLink: updatedSettings.instagramLink || prev.clubInfo?.instagramLink
        }
      };
    });
  };

  const syncWithCloud = async () => {
    return await syncCmsToSupabase(cmsData);
  };

  const loadFromCloud = async () => {
    const cloudContent = await fetchCmsFromSupabase();
    if (cloudContent && typeof cloudContent === 'object') {
      setCmsData((prev) => ({
        ...prev,
        ...cloudContent
      }));
      return true;
    }
    return false;
  };

  const resetToDefaults = () => {
    setCmsData(DEFAULT_CMS_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CmsContext.Provider
      value={{
        cmsData,
        updateSection,
        updateClubInfo,
        updateHero,
        updateHistory,
        updateManifest,
        updateConvoy,
        addCommitteeMember,
        updateCommitteeMember,
        deleteCommitteeMember,
        addGalleryPhoto,
        updateGalleryPhoto,
        deleteGalleryPhoto,
        addMemorialMember,
        updateMemorialMember,
        deleteMemorialMember,
        addRoute,
        updateRoute,
        deleteRoute,
        updateShowRoutes,
        updateRule,
        updateFaq,
        addContactRequest,
        updateContactRequestStatus,
        deleteContactRequest,
        updateContactSettings,
        syncStatus,
        syncWithCloud,
        loadFromCloud,
        resetToDefaults
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}
