# Identidad Tempo

La app anteriormente llamada GLOW usa la paleta Electric Slate:

| Uso | Color |
| --- | --- |
| Acentos y acciones principales | Electric Lime `#C7F464` |
| Fondo de la aplicación | Deep Charcoal `#121619` |
| Tarjetas | Slate `#25323D` |
| Texto principal | `#F2F5ED` |

Los tokens están en `src/index.css`. Se conservan los alias de clases `plasma`
y `graphite` para no duplicar estilos. El acento de la interfaz es independiente
del color incluido en las rutinas y sus snapshots históricos.

## Logo y fuentes

- Original aportado por el usuario: `assets/brand/tempo-original.png`.
- Archivo servido: `public/brand/tempo-logo.webp`, recodificado sin pérdida.
- `TempoLogo` presenta el mismo dibujo y palabra, sin reescribir el logotipo.
  Los viewports/recortes SVG permiten una versión apilada y otra horizontal;
  un filtro de presentación elimina el fondo y aplica el lima de la paleta.
- El favicon y los iconos instalables usan una adaptación simplificada del símbolo
  en `public/tempo-icon.svg`, legible en tamaños pequeños.
- Títulos y cifras: **Exo 2, 800 cursiva**, una aproximación deportiva/geometrizada,
  no la identificación de la tipografía exacta del logo. Texto: Sora; datos: Fira Code.
  Las fuentes se sirven localmente. La licencia de Exo 2 se distribuye en
  `public/brand/exo-2-OFL.txt`.

## Pantalla de entrada

`StartupScreen` aparece una vez por montaje de la app (recarga/documento nuevo),
no al navegar entre días ni al iniciar sesión. La aplicación carga en paralelo.
La salida comienza a los 1,6 s y termina a los 2 s, con fundido y escala suave.
El logo mide como máximo 180 px y la pantalla no incluye barra de progreso.
Con `prefers-reduced-motion`, no se anima y se retira a los 200 ms.
Mientras aparece, el contenido de abajo está `inert` y oculto a lectores de pantalla.
Su cierre no depende de una respuesta de Supabase ni de la descarga del logo.

## Compatibilidad y despliegue

El nombre visible, metadata, iconos, manifest y paquete npm pasan a Tempo.
No se renombran las claves de caché `glow-*`, tablas, RPCs, permisos ni endpoint
`glow-mcp`: hacerlo rompería datos y conexiones existentes. El repositorio se
renombró a [Tempo](https://github.com/arielBiagio/Tempo) por pedido del usuario;
el sitio de Netlify y su URL no se renombran.
No hay migración SQL ni despliegue del MCP para esta actualización visual.
El nuevo frontend se publica compilando y subiendo `dist/` como de costumbre.

### Presentación instalada en iOS

La barra de estado usa `black`, en lugar de `black-translucent`, y el encabezado
es opaco, sin `backdrop-filter` ni resplandor superior detrás del logo.
Se conservan los insets seguros; la navbar usa el inset inferior + 16 px en navegador.
En modo instalado/fullscreen el margen es 16 px (12 px más que el ajuste anterior).
También se reconoce `navigator.standalone` para instalaciones iOS en las que
la consulta CSS de display-mode no se aplique. No hay desplazamientos negativos.

Es una mitigación de presentación: no confirma la causa del desenfoque observado
en el iPhone. La [documentación de Apple](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)
distingue el dibujo debajo de la barra de estado en modo translúcido. La geometría
y composición reales del sistema requieren probar el build en el teléfono.

En iOS, el nombre/icono de una instalación anterior podría conservarse hasta
quitar y volver a agregar el acceso a inicio. Antes de borrar datos del navegador,
asegurarse de que no existan cambios locales pendientes de sincronización.
