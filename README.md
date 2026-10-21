# 🏍️ Los Pistones Rotos - Landing Page & Gestor de Contenidos (CMS)

Sitio web informativo oficial y panel de administración para la asociación de motoqueros **Los Pistones Rotos**, desarrollado con **React + Vite** bajo una estética **Stealth / Minimalista**.

---

## 🚀 Cómo Ejecutar en Localhost

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre tu navegador en: [http://localhost:5174/](http://localhost:5174/)

3. **Construir para producción**:
   ```bash
   npm run build
   ```

---

## 🗺️ Estructura de la Landing Page (Flujo Narrativo)

A medida que el usuario hace scroll, la página cuenta la historia y vida del club:

1. **Portada & Métricas (Hero)**: Título con personalidad, lema, rugido de motor interactivo y estadísticas en vivo.
2. **Historia & Origen**: El rescate cordillerano donde nació el nombre *Los Pistones Rotos* y la línea de tiempo de hitos.
3. **Manifiesto & 4 Pilares**: *Hermandad Absoluta*, *Disciplina en Ruta*, *Pasión Mecánica* y *Respeto & Solidaridad*.
4. **Comité & Mesa Directiva**: Presidente, Vicepresidente, Capitán de Ruta y Sargento de Armas con sus motos y biografías.
5. **Caravana & La Manada**: Fotografía nocturna de formación y estándares de rodada en grupo.
6. **Galería de la Manada**: Cuadrícula de fotos en ruta, talleres y asados con visor Lightbox en pantalla completa.
7. **Calendario de Rodadas**: Rutas con filtros dinámicos (*Alta Montaña*, *Carretera & Costa*, *Nocturnas*) y botón para anotarse.
8. **Código de Honor & Reglas**: Normas de seguridad vial, equipo obligatorio y tolerancia cero.
9. **Memorial (Asfalto Eterno)**: Solemne homenaje a los hermanos caídos con velas interactivas en su memoria.
10. **Preguntas Frecuentes**: Respuestas a cilindrada mínima, costos y parches.
11. **Convocatoria & Contacto**: Formulario para nuevos aspirantes y enlace directo al WhatsApp e Instagram oficiales.
12. **Footer**: Enlaces de navegación rápida, derechos y acceso al panel.

---

## 🔐 Panel de Administración & CMS

- **Acceso**: Botón **[ ⊞ Panel ]** en la esquina superior derecha o enlace "Admin" al pie de página.
- **Usuario**: `admin`
- **Contraseña**: `admin`
- **12 Secciones editables**: Identidad, Portada, Historia, Manifiesto, Directiva, Caravana, Galería, Rodadas, Reglas, Memorial, Preguntas y Base de Datos.
- **Sincronización**: Guarda en `localStorage` al instante, listo para conectar con Supabase al desplegar.
