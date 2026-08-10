/**
 * One-shot seed script — inserts the OpenCode essay into the DB.
 * Run on the VPS: node scripts/seed-opencode.mjs
 *
 * To use a different MoureDev video, replace the YouTube video ID in the
 * <iframe src="..."> tag inside the `content` variable below.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function readEnvLocal() {
  const raw = readFileSync(join(root, '.env.local'), 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^([^=#][^=]*)=(.*)/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return env;
}

const env = readEnvLocal();

// Use postgres package (already installed)
const postgresPath = join(root, 'node_modules/.pnpm/postgres@3.4.9/node_modules/postgres/src/index.js');
const { default: postgres } = await import(postgresPath);
const sql = postgres(env.DATABASE_URL);

const slug = 'opencode-asistente-ia-terminal';
const locale = 'es';

const content = `<h2>Cuando la IA del código se centraliza, el desarrollador pierde</h2>
<p>Durante los últimos años, las herramientas de inteligencia artificial para programadores han seguido un patrón preocupante: crecen rápido, se vuelven indispensables y, tarde o temprano, los mueven detrás de un muro de pago o de políticas que el usuario no controla. GitHub Copilot, Cursor, Replit AI — todas excelentes, todas con el código de tus proyectos viajando a servidores que no son los tuyos.</p>
<p>OpenCode elige el camino opuesto.</p>

<figure data-figure-image="" data-width="100%" data-align="center" style="width:100%;margin-left:0;margin-right:0;"><img src="https://opengraph.githubassets.com/1/opencode-ai/opencode" alt="OpenCode - AI coding agent para la terminal" style="width:100%;display:block;"><figcaption style="text-align:center;font-size:0.8rem;color:#8a8a8a;margin-top:6px;">OpenCode en GitHub — más de 26.000 estrellas en pocos meses</figcaption></figure>

<h2>¿Qué es OpenCode?</h2>
<p>OpenCode es un agente de programación con inteligencia artificial que funciona directamente desde la terminal. Fue creado por el equipo detrás de SST (Serverless Stack), ahora llamado Anomaly Innovations, y está disponible como software completamente libre y de código abierto bajo licencia MIT.</p>
<p>A diferencia de los asistentes integrados en IDEs, OpenCode vive en tu terminal. Funciona con cualquier editor —VS Code, Neovim, JetBrains, o ninguno— y se adapta al flujo de trabajo que ya tenés, no al revés.</p>
<p>En menos de dos meses de existencia acumuló más de 26.000 estrellas en GitHub, lo que lo convierte en uno de los proyectos de IA para desarrolladores con mayor adopción en la historia del ecosistema open source.</p>

<h2>La filosofía: tu código, tus reglas</h2>
<p>El punto diferenciador de OpenCode no es técnico, es filosófico. El proyecto parte de una premisa simple: <strong>el código que escribís es tuyo</strong>, y ninguna herramienta debería enviarlo a la nube sin tu consentimiento explícito.</p>
<p>Con OpenCode podés conectarte a más de 75 proveedores de IA —Anthropic, OpenAI, Google, Mistral— o correr modelos locales completamente offline con Ollama. Vos elegís qué proveedor procesa tu código, cuánto pagás y qué datos comparés.</p>
<p>Esta arquitectura refleja un principio que los libertarios conocen bien: la descentralización no es solo una ventaja técnica, es una garantía de que nadie puede cortarte el acceso cuando sea conveniente para sus intereses comerciales.</p>

<h2>Características principales</h2>
<h3>Interfaz de terminal nativa (TUI)</h3>
<p>OpenCode presenta una interfaz de usuario de terminal (TUI) completamente funcional, responsive y personalizable. No es un plugin de ningún editor: es una aplicación independiente que iniciás con el comando <code>opencode</code> desde cualquier repositorio.</p>

<h3>Soporte de LSP integrado</h3>
<p>OpenCode carga automáticamente los Language Server Protocols correspondientes al proyecto que estás trabajando. Esto significa que el modelo de IA tiene contexto semántico real del código —tipos, definiciones, errores— no solo texto plano.</p>

<h3>Multi-sesión y agentes paralelos</h3>
<p>Podés correr múltiples agentes en simultáneo sobre el mismo proyecto. ¿Necesitás que un agente refactorice el módulo de autenticación mientras otro escribe los tests? OpenCode lo soporta nativamente.</p>

<h3>Links compartibles</h3>
<p>Cada sesión genera un link permanente que podés compartir con tu equipo para revisar el contexto, los cambios propuestos y el razonamiento del modelo. Ideal para auditorías y code reviews colaborativos.</p>

<h3>Análisis automático del repositorio</h3>
<p>Al ejecutar <code>/init</code>, OpenCode analiza toda la estructura del proyecto y genera un archivo <code>agents.md</code> con el contexto que el modelo necesita para trabajar con inteligencia en tu codebase específico.</p>

<figure data-figure-image="" data-width="100%" data-align="center" style="width:100%;margin-left:0;margin-right:0;"><img src="https://raw.githubusercontent.com/opencode-ai/opencode/main/.github/screenshot.png" alt="OpenCode en la terminal" style="width:100%;display:block;"><figcaption style="text-align:center;font-size:0.8rem;color:#8a8a8a;margin-top:6px;">La TUI de OpenCode — un entorno completo de IA directamente en la terminal</figcaption></figure>

<h2>Instalación en 60 segundos</h2>
<p>La instalación es una sola línea:</p>
<pre><code>curl -fsSL https://opencode.ai/install | bash</code></pre>
<p>Una vez instalado, navegás a cualquier repositorio y ejecutás:</p>
<pre><code>opencode</code></pre>
<p>Para que el agente entienda tu proyecto en profundidad, ejecutá el comando de inicialización dentro de la sesión:</p>
<pre><code>/init</code></pre>
<p>OpenCode escaneará el proyecto, detectará el stack tecnológico y generará el contexto base. A partir de ahí, podés pedirle cualquier cosa en lenguaje natural: agregar un endpoint, refactorizar una función, escribir tests, revisar un PR.</p>

<h2>Casos de uso reales</h2>
<p>Los desarrolladores están usando OpenCode para:</p>
<ul><li><strong>Backend</strong>: generar rutas de API en Express, FastAPI, Go, etc.</li><li><strong>Frontend</strong>: corregir errores de TypeScript, refactorizar componentes React</li><li><strong>DevOps</strong>: escribir Dockerfiles, configuraciones de Terraform, pipelines de CI</li><li><strong>Exploración de código</strong>: entender codebases complejos o heredados a través de preguntas en lenguaje natural</li><li><strong>Code review</strong>: revisar cambios antes de hacer commit con contexto semántico completo</li></ul>

<h2>Tutorial completo en español</h2>
<p>El siguiente video cubre la instalación, configuración con modelos gratuitos, uso de agentes y comandos avanzados de OpenCode:</p>

<div data-youtube-video=""><iframe src="https://www.youtube.com/embed/1JqV70uuP-Q?rel=0" frameborder="0" allowfullscreen="true" allow="autoplay; fullscreen; picture-in-picture" width="640" height="360"></iframe></div>

<h2>OpenCode en el contexto libertario</h2>
<p>Existe una tensión permanente en el ecosistema tecnológico: las herramientas que aumentan la productividad tienden a crear dependencias. Cada SaaS que adoptás es un nodo más de control que no pertenece al desarrollador.</p>
<p>OpenCode representa algo diferente. Es software que podés auditar, modificar y correr en tu propia infraestructura. El modelo de IA que procesa tu código puede ser uno que vos controlás localmente. Los datos no tienen que salir de tu máquina si no querés.</p>
<p>En un mercado donde las empresas de IA compiten por hacer sus herramientas lo más adictivas y lo más difíciles de reemplazar posible, un proyecto open source que pone el control en manos del desarrollador es, en sí mismo, un argumento político.</p>
<p>El código libre no es solo una cuestión de licencias. Es una forma de preservar la autonomía en un mundo donde la infraestructura digital se concentra cada vez más.</p>`;

try {
  await sql`
    INSERT INTO articles
      (slug, locale, type, category, title, description, author, content, published)
    VALUES (
      ${slug},
      ${locale},
      'ensayo',
      'Tecnología',
      'OpenCode: el asistente de IA que respeta tu libertad como desarrollador',
      'Cuando la IA del código se centraliza en servidores de Silicon Valley, OpenCode elige el camino opuesto: open source, terminal, y tus reglas.',
      'Equipo Editorial',
      ${content},
      true
    )
    ON CONFLICT (slug, locale) DO UPDATE SET
      content     = EXCLUDED.content,
      title       = EXCLUDED.title,
      description = EXCLUDED.description,
      updated_at  = NOW()
  `;
  console.log('✓ Artículo insertado/actualizado correctamente.');
} finally {
  await sql.end();
}
