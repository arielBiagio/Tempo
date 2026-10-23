# Tempo

Aplicación web para organizar rutinas de entrenamiento y registrar el progreso diario. Permite seguir ejercicios y series, guardar el avance en la nube y consultar un resumen de la actividad.

[Ver la app](https://gemini-rutina-cele.netlify.app/) · [Repositorio en GitHub](https://github.com/arielBiagio/Tempo)

## Funcionalidades

- Inicio de sesión con correo y contraseña mediante Supabase Auth.
- Selección de rutinas organizadas por días, con ejercicios, series, repeticiones, descansos e indicaciones.
- Registro automático por fecha y semana, sin activar planes ni elegir semanas manualmente.
- Progreso por ejercicio y serie, independiente para cada rutina y usuario.
- Resumen de días y semanas con actividad, sesiones completas, ejercicios, series y minutos estimados.
- Guardado local y sincronización de cambios pendientes al recuperar la conexión, con la sesión y rutina ya cargadas.
- Interfaz adaptada a móviles, saludo personalizado y estado de guardado en la nube.
- Identidad Electric Slate, pantalla de inicio animada y cuadros informativos plegables.
- Consultas de rutinas y estadísticas desde agentes compatibles con MCP y OAuth.

Los minutos del Resumen se calculan a partir de la duración prevista de las sesiones completas; no representan tiempo cronometrado.

## Tecnologías

React, TypeScript, Vite y Tailwind CSS. Supabase Auth y PostgreSQL con políticas RLS para autenticación y persistencia; IndexedDB para caché y cambios pendientes. El servidor MCP se ejecuta en Supabase Edge Functions y el frontend se publica en Netlify.

## Integración con agentes: MCP

Tempo expone cinco herramientas de **solo lectura** mediante un servidor MCP remoto con transporte Streamable HTTP. Permiten consultar la información de la cuenta desde un agente compatible, como Sesame, sin abrir la app.

| Tool | Qué permite consultar |
| --- | --- |
| `mi_perfil` | Nombre, zona horaria e identificador de la rutina seleccionada. |
| `mis_rutinas` | Catálogo de rutinas disponibles, objetivos, nivel y frecuencia. |
| `mi_rutina` | Rutina seleccionada u otra por ID: calendario, ejercicios, series, repeticiones, descansos e indicaciones, con avance semanal. |
| `mi_entrenamiento` | Entrenamiento de hoy, mañana o una fecha: ejercicios pendientes, progreso, descanso y próxima sesión prevista. |
| `mis_estadisticas` | Días y semanas con actividad, sesiones, ejercicios y series completos, y minutos estimados; por histórico, semana, mes o rango de fechas. |

Ejemplos de preguntas: «¿Qué me toca entrenar mañana?», «¿Qué ejercicios me quedan hoy?» o «¿Cuántos días entrené esta semana?».

La conexión usa **OAuth** y requiere autorizar la cuenta. Los permisos del MCP y las políticas RLS limitan el acceso a los datos del usuario autenticado. El agente no puede modificar rutinas, registrar ejercicios ni borrar información. Las estadísticas reflejan únicamente los datos sincronizados; los minutos son estimaciones, no tiempo cronometrado.

En una instalación propia, el endpoint sigue este formato:

```text
https://<tu-proyecto>.supabase.co/functions/v1/glow-mcp
```

La configuración del MCP requiere habilitar el servidor OAuth de Supabase, la pantalla de consentimiento `/oauth/consent` y los permisos incluidos en las migraciones. No se comparten contraseñas ni claves privadas con el agente.

## Decisiones de diseño

- **Rutinas JSON sobre fetch:** los planes están separados de la UI y pueden ampliarse sin reescribir las pantallas.
- **Calendario automático y snapshots:** el avance se registra por fecha y conserva la versión de la rutina utilizada en cada semana, sin alterar el historial cuando cambia el plan.
- **Guardado local y sincronización:** una cola por cuenta permite recuperar cambios pendientes al volver la conexión; los conflictos entre dispositivos requieren una decisión explícita.
- **MCP acotado y de solo lectura:** herramientas específicas para consultas de entrenamiento, con OAuth y permisos mínimos en lugar de acceso genérico a la base.
- **Contexto del agente:** se evaluó [Code Mode](https://blog.cloudflare.com/code-mode/) y se descartó por la escala actual —cinco tools de lectura—; la agregación de estadísticas en SQL cumple el mismo objetivo de no llenar el contexto con el historial bruto, sin añadir un entorno de ejecución de código.

## Desarrollo local

Requiere Node.js y npm. El proyecto se verificó con Node.js 24.

1. Instalá las dependencias:

   ```sh
   npm ci
   ```

2. Copiá `.env.example` a `.env.local` y completá la configuración pública de Supabase:

   ```dotenv
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   Para una instalación nueva, aplicá las [migraciones SQL](supabase/migrations/) en orden y configurá una cuenta con correo y contraseña en Supabase Auth. No vuelvas a ejecutarlas sobre una instalación ya migrada. Usá únicamente la clave pública de cliente: nunca una clave secreta o `service_role`. No subas `.env.local` al repositorio. Sin configuración de Supabase, la app permite una vista previa con guardado local.

3. Iniciá el servidor:

   ```sh
   npm run dev
   ```

## Build y despliegue

```sh
npm run build
npm run preview
```

El build se genera en `dist/` y puede desplegarse en Netlify u otro hosting estático. Las variables de Supabase deben estar configuradas antes de compilar.

## Comprobaciones locales

```sh
npm run typecheck
npm run lint
```

## Personalizar las rutinas

Las rutinas se definen en `public/routines/`. Al personalizarlas, conservá los IDs existentes y aumentá la versión cuando cambies la prescripción para no alterar el historial.

Algunos identificadores conservan el nombre anterior de la app por compatibilidad con los datos y las conexiones existentes.
