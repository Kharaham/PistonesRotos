import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const BUCKET_NAME = 'pistones-media';

/**
 * Sube una imagen al bucket público de Supabase Storage.
 * @param {File} file - El archivo a subir
 * @param {string} folder - Carpeta dentro del bucket (galeria, directiva, hero, etc.)
 * @returns {Promise<{ url: string | null, error: any }>}
 */
export async function uploadImageToSupabase(file, folder = 'general') {
  if (!supabase) {
    return { url: null, error: new Error('Supabase no está configurado') };
  }

  try {
    // Sanitizar nombre y añadir timestamp único
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo imagen a Supabase:', error);
      return { url: null, error };
    }

    // Obtener URL pública directa
    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: publicData.publicUrl, error: null };
  } catch (err) {
    console.error('Excepción al subir imagen:', err);
    return { url: null, error: err };
  }
}

/**
 * Guarda una postulación en la tabla 'solicitudes' de Supabase
 */
export async function saveSolicitudToSupabase(solicitud) {
  if (!supabase) return { data: null, error: null };

  try {
    const { data, error } = await supabase
      .from('solicitudes')
      .insert([
        {
          nombre: solicitud.nombre,
          telefono: solicitud.telefono,
          participacion: solicitud.participacion,
          moto: solicitud.moto,
          ciudad: solicitud.ciudad,
          mensaje: solicitud.mensaje,
          status: solicitud.status || 'nueva',
          created_at: new Date().toISOString()
        }
      ]);
    return { data, error };
  } catch (err) {
    console.error('Error guardando solicitud en Supabase:', err);
    return { data: null, error: err };
  }
}

/**
 * Sincroniza todo el contenido del CMS con la tabla 'cms_content'
 */
export async function syncCmsToSupabase(cmsData) {
  if (!supabase) return { error: null };

  try {
    const { error } = await supabase
      .from('cms_content')
      .upsert(
        {
          id: 1,
          content: cmsData,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );
    return { error };
  } catch (err) {
    console.error('Error sincronizando CMS en Supabase:', err);
    return { error: err };
  }
}

/**
 * Carga el contenido del CMS desde Supabase
 */
export async function fetchCmsFromSupabase() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('content')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) return null;
    return data.content;
  } catch (err) {
    console.error('Error cargando CMS desde Supabase:', err);
    return null;
  }
}
