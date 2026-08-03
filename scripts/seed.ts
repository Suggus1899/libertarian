/**
 * Seed script: imports static essays into the DB + creates 10 new articles
 * (5 essays about Devin Desktop/CLI, 5 opinion articles about Claude Code).
 *
 * Run: npx tsx scripts/seed.ts
 */

import postgres from 'postgres';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually load .env.local (tsx doesn't get Next.js's automatic env loading)
const envPath = resolve(process.cwd(), '.env.local');
const envFile = readFileSync(envPath, 'utf-8');
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (key && !process.env[key]) {
    process.env[key] = val;
  }
}

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not found in .env.local');
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL!;
const isLocal = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1');
const sql = postgres(DATABASE_URL, {
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

type StaticEssay = {
  slug: string;
  category: string;
  title: string;
  description: string;
  author: string;
  full: string[];
};

// ─── Static essays (from messages/es.json + en.json) ───
const staticEssaysEs: StaticEssay[] = [
  {
    slug: 'individuo-estado',
    category: 'Filosofía Política',
    title: 'El individuo frente al Estado: fundamentos de la libertad moderna',
    description: 'Un análisis sobre los principios filosóficos que sustentan la tradición libertaria y su vigencia en el siglo XXI.',
    author: 'Dr. Alejandro Ríos',
    full: [
      'La pregunta fundamental de la filosofía política libertaria es simple pero profunda: ¿quién es dueño de la vida de cada persona? La respuesta, sostenida desde Locke hasta Nozick, es que cada individuo es soberano de sí mismo.',
      'El Estado, en esta tradición, no es un ente que otorga derechos, sino un mecanismo que debe protegerlos. Su legitimidad deriva del consentimiento y su función está limitada a la protección de la vida, la propiedad y la libertad.',
      'En el siglo XXI, este principio sigue siendo vigente. Frente al crecimiento estatal, el autoritarismo tecnocrático y la erosión de las libertades individuales, recuperar el lenguaje de la soberanía personal es una tarea intelectual y política.',
      'Este ensayo repasa los fundamentos filosóficos de la libertad individual, examina los principales objeciones y propone un marco para defenderla en el debate público contemporáneo.',
    ],
  },
  {
    slug: 'mercados-prosperidad',
    category: 'Economía',
    title: 'Mercados libres y prosperidad: evidencia y argumentos',
    description: 'Por qué la libertad económica es la base material del progreso humano, con datos y análisis comparativo.',
    author: 'Mariana Gómez',
    full: [
      'La evidencia empírica es clara: los países con mayor libertad económica crecen más, generan más empleo y reducen la pobreza con mayor velocidad. No se trata de una opinión ideológica, sino de un patrón observable durante décadas.',
      'Los mercados libres no son sinónimo de ausencia de reglas, sino de un sistema de precios, propiedad y competencia que coordina el conocimiento disperso de millones de personas.',
      'En este análisis revisamos índices de libertad económica, estudios comparados de países latinoamericanos y los mecanismos por los cuales la apertura comercial y la reducción regulatoria impulsan el bienestar.',
      'La conclusión es contundente: defender el libre mercado no es defender privilegios, es defender la posibilidad real de prosperidad para la mayoría.',
    ],
  },
  {
    slug: 'movimiento-desde-cero',
    category: 'Estrategia Política',
    title: 'Construir un movimiento libertario desde cero: lecciones y metodología',
    description: 'Guía práctica para organizar partidos y movimientos libertarios exitosos en contextos democráticos y no democráticos.',
    author: 'Julián Vargas',
    full: [
      'Construir un movimiento libertario es un desafío distinto a construir cualquier otra fuerza política. Parte de una minoría de ideas, enfrenta a los medios tradicionales y debe articular principios abstractos con demandas concretas.',
      'Este ensayo sistematiza lecciones de casos latinoamericanos y europeos. Analiza la formación de dirigentes, la captación de militantes, la construcción de discurso, el uso de redes sociales y la organización institucional.',
      'Proponemos una metodología de etapas: definición de principios, formación de núcleo, comunicación pública, crecimiento territorial y participación electoral estratégica.',
      'El objetivo no es imitar fórmulas ajenas, sino ofrecer un marco replicable que cada organización adapte a su contexto cultural e institucional.',
    ],
  },
  {
    slug: 'latinoamerica-resurgimiento',
    category: 'América Latina',
    title: 'El resurgimiento libertario en Latinoamérica: contexto y perspectivas',
    description: 'Análisis del crecimiento de los movimientos libertarios en América Latina, sus causas y perspectivas de consolidación.',
    author: 'Lucía Fernández',
    full: [
      'En los últimos años, América Latina ha sido testigo de un fenómeno inesperado: el surgimiento de movimientos políticos abiertamente libertarios que lograron posicionarse en el debate público.',
      'Este ensayo examina las causas del fenómeno: el fracaso de modelos económicos estatistas, la crisis de representación de los partidos tradicionales, la digitalización de la política y la aparición de una nueva generación de ciudadanos escépticos del Estado.',
      'También analiza los riesgos: la tensión entre pureza ideológica y viabilidad electoral, la exposición mediática y la necesidad de construir equipos sólidos más allá de figuras individuales.',
      'Las perspectivas son alentadoras pero exigen trabajo institucional, formación y paciencia estratégica. El resurgimiento es real; la consolidación depende de nosotros.',
    ],
  },
];

const staticEssaysEn: StaticEssay[] = [
  {
    slug: 'individuo-estado',
    category: 'Political Philosophy',
    title: 'The Individual vs. the State: Foundations of Modern Freedom',
    description: 'An analysis of the philosophical principles underpinning the libertarian tradition and their relevance in the 21st century.',
    author: 'Dr. Alejandro Ríos',
    full: [
      'The fundamental question of libertarian political philosophy is simple yet profound: who owns each person\'s life? The answer, held from Locke to Nozick, is that every individual is sovereign over themselves.',
      'The State, in this tradition, is not an entity that grants rights, but a mechanism that must protect them. Its legitimacy derives from consent, and its function is limited to safeguarding life, property and liberty.',
      'In the 21st century, this principle remains relevant. Faced with the growth of the state, technocratic authoritarianism and the erosion of individual liberties, recovering the language of personal sovereignty is both an intellectual and a political task.',
      'This essay reviews the philosophical foundations of individual freedom, examines the main objections and proposes a framework for defending it in contemporary public debate.',
    ],
  },
  {
    slug: 'mercados-prosperidad',
    category: 'Economics',
    title: 'Free Markets and Prosperity: Evidence and Arguments',
    description: 'Why economic freedom is the material foundation of human progress — with data and comparative analysis across political systems.',
    author: 'Mariana Gómez',
    full: [
      'Empirical evidence is clear: countries with greater economic freedom grow faster, create more jobs and reduce poverty more quickly. This is not an ideological opinion, but an observable pattern over decades.',
      'Free markets are not synonymous with the absence of rules, but with a system of prices, property and competition that coordinates the dispersed knowledge of millions of people.',
      'In this analysis we review economic freedom indices, comparative studies of Latin American countries and the mechanisms by which trade openness and regulatory reduction drive well-being.',
      'The conclusion is blunt: defending free markets is not defending privilege, it is defending the real possibility of prosperity for the majority.',
    ],
  },
  {
    slug: 'movimiento-desde-cero',
    category: 'Political Strategy',
    title: 'Building a Libertarian Movement from Scratch',
    description: 'A practical guide to organizing successful libertarian parties and movements in both democratic and non-democratic contexts.',
    author: 'Julián Vargas',
    full: [
      'Building a libertarian movement is a different challenge than building any other political force. It starts from a minority of ideas, faces traditional media and must articulate abstract principles with concrete demands.',
      'This essay systematizes lessons from Latin American and European cases. It analyzes leadership training, member recruitment, discourse construction, social media use and institutional organization.',
      'We propose a staged methodology: definition of principles, core formation, public communication, territorial growth and strategic electoral participation.',
      'The goal is not to imitate foreign formulas, but to offer a replicable framework that each organization adapts to its cultural and institutional context.',
    ],
  },
  {
    slug: 'latinoamerica-resurgimiento',
    category: 'Latin America',
    title: 'The Libertarian Resurgence in Latin America: Context and Perspectives',
    description: 'Analysis of the growth of libertarian movements in Latin America, their causes and prospects for consolidation as a relevant political force.',
    author: 'Lucía Fernández',
    full: [
      'In recent years, Latin America has witnessed an unexpected phenomenon: the emergence of openly libertarian political movements that have managed to position themselves in the public debate.',
      'This essay examines the causes of the phenomenon: the failure of statist economic models, the crisis of representation of traditional parties, the digitalization of politics and the appearance of a new generation of citizens skeptical of the State.',
      'It also analyzes the risks: the tension between ideological purity and electoral viability, media exposure and the need to build solid teams beyond individual figures.',
      'The outlook is encouraging but requires institutional work, training and strategic patience. The resurgence is real; consolidation depends on us.',
    ],
  },
];

// ─── 5 Essays about Devin Desktop & Devin CLI ───
const devinEssaysEs = [
  {
    slug: 'devin-desktop-ia-colaborador',
    category: 'Inteligencia Artificial',
    title: 'Devin Desktop: el colaborador de IA que vive en tu escritorio',
    description: 'Una revisión de Devin Desktop, la aplicación de Cognition que trae un agente de IA autónomo directamente a tu entorno de trabajo local.',
    author: 'Equipo Editorial',
    content: `<h2>Devin Desktop: autonomía real, no solo autocompletado</h2><p>Devin Desktop, desarrollado por Cognition, representa un salto cualitativo en la forma en que interactuamos con la inteligencia artificial para el desarrollo de software. A diferencia de los asistentes de código tradicionales que sugieren líneas o funciones, Devin Desktop opera como un colaborador completo: lee tu codebase, entiende el contexto del proyecto, ejecuta comandos y entrega resultados verificables.</p><p>La aplicación se ejecuta localmente en tu máquina, lo que significa que tiene acceso directo a tus archivos, tu terminal y tu entorno de desarrollo. Esto elimina la fricción de copiar y pegar contexto entre un navegador y tu editor.</p><h2>Capacidades clave</h2><p>Devin Desktop puede: navegar y explorar codebases completos, ejecutar comandos en la terminal, crear y editar archivos, hacer commits en git, abrir previews de navegador para verificar cambios visuales, y manejar tareas multi-paso que requieren planificación y ejecución secuencial.</p><p>Lo más impresionante es su capacidad de mantener contexto a lo largo de una sesión de trabajo larga. Puedes pedirle que implemente una feature completa —con tests, documentación y migraciones de base de datos— y Devin orquestará cada paso.</p><h2>Limitaciones y consideraciones</h2><p>Como cualquier herramienta de IA, Devin Desktop no es perfecto. Las tareas muy específicas o que requieren conocimiento de dominio profundo pueden necesitar supervisión humana. Sin embargo, el modelo de colaboración humano-IA que propone es el futuro del desarrollo de software.</p>`,
  },
  {
    slug: 'devin-cli-terminal-inteligente',
    category: 'Inteligencia Artificial',
    title: 'Devin CLI: tu terminal ahora piensa contigo',
    description: 'Cómo la interfaz de línea de comandos de Devin transforma la forma de interactuar con el código desde la terminal.',
    author: 'Equipo Editorial',
    content: `<h2>La terminal como interfaz natural para la IA</h2><p>Devin CLI es la versión de línea de comandos del agente de IA de Cognition. Para desarrolladores que viven en la terminal, esto es un cambio de juego: en lugar de cambiar de contexto entre tu editor, tu navegador y un chat de IA, todo ocurre donde ya estás trabajando.</p><p>La CLI se instala con un simple comando y se integra con tu shell existente. No requiere configuración compleja: detecta automáticamente tu proyecto, tus dependencias y tu estructura de archivos.</p><h2>Flujo de trabajo real</h2><p>Un caso de uso típico: estás trabajando en un bug y no encuentras el origen. Le describes el síntoma a Devin CLI, y este explora el codebase, traza el flujo de ejecución, identifica el root cause y propone un fix. Todo desde la terminal, sin abandonar tu flujo.</p><p>Otro escenario: necesitas refactorizar un módulo grande. Devin CLI puede planificar los pasos, ejecutarlos uno por uno, correr los tests después de cada cambio y hacer commits atómicos por cada paso del refactor.</p><h2>Por qué la CLI importa</h2><p>La terminal nunca va a desaparecer. Es la interfaz más eficiente para quien la domina. Devin CLI no reemplaza esa eficiencia — la amplifica. Combina la velocidad de la línea de comandos con la comprensión contextual de un modelo de lenguaje grande.</p>`,
  },
  {
    slug: 'devin-cognition-futuro-desarrollo',
    category: 'Inteligencia Artificial',
    title: 'Cognition y el futuro del desarrollo con IA: más allá del copilot',
    description: 'Un análisis del enfoque de Cognition Labs sobre agentes de IA autónomos y cómo difiere de los asistentes de código tradicionales.',
    author: 'Equipo Editorial',
    content: `<h2>De Copilot a agente: el cambio de paradigma</h2><p>GitHub Copilot y similares funcionan como autocompletado inteligente: sugieren código basándose en el contexto inmediato. Cognition, con Devin, propone algo fundamentalmente distinto: un agente que recibe un objetivo, planifica cómo alcanzarlo y ejecuta el plan de forma autónoma.</p><p>La diferencia no es de grado, sino de tipo. Un Copilot te ayuda a escribir código que ya sabes que quieres escribir. Devin te ayuda a resolver problemas que no sabes exactamente cómo resolver.</p><h2>El modelo de Cognition</h2><p>Cognition Labs ha construido Devin sobre un modelo de lenguaje grande con capacidades de razonamiento de larga cadena. Esto le permite mantener un plan complejo en memoria, adaptarse cuando algo falla y aprender del contexto del proyecto en tiempo real.</p><p>El resultado es un agente que puede tomar tareas como "implementa autenticación con JWT para esta API" y entregar código funcional, con tests, documentación y manejo de errores — no un snippet, sino una feature completa.</p><h2>Implicaciones para el desarrollo</h2><p>El desarrollador del futuro no es alguien que escribe cada línea de código, sino alguien que dirige, revisa y valida el trabajo de agentes de IA. Esto no elimina la necesidad de expertise técnico — la amplifica. Necesitas saber qué pedir, cómo verificar y cuándo intervenir.</p>`,
  },
  {
    slug: 'devin-desktop-workflow-real',
    category: 'Inteligencia Artificial',
    title: 'Workflow real con Devin Desktop: del ticket al deploy',
    description: 'Un caso de estudio práctico de cómo usar Devin Desktop para implementar una feature completa, desde el análisis hasta el deploy.',
    author: 'Equipo Editorial',
    content: `<h2>El escenario</h2><p>Imagina que recibes un ticket: "añadir panel de administración con CRUD de artículos". Con Devin Desktop, el flujo es radicalmente distinto a programar todo a mano.</p><h2>Paso 1: Exploración</h2><p>Le pides a Devin que explore el codebase y entienda la arquitectura existente. Devin lee los archivos, identifica los patrones (App Router, server components, server actions) y resume lo que encuentra. En minutos, tienes un mapa mental del proyecto sin haber abierto un solo archivo.</p><h2>Paso 2: Planificación</h2><p>Le describes la feature. Devin propone un plan: schema de base de datos, server actions, componentes del admin, rutas. Puedes ajustar el plan antes de que empiece a ejecutar.</p><h2>Paso 3: Ejecución</h2><p>Devin ejecuta el plan paso a paso. Cada paso incluye: crear archivos, escribir código, correr el build, corregir errores de tipo, hacer lint. Si algo falla, Devin lo identifica y lo arregla sin tu intervención.</p><h2>Paso 4: Verificación</h2><p>Devin abre un preview del navegador, navega la nueva feature y verifica que funciona. Si encuentra un bug visual, lo arregla. Cuando todo pasa, hace el commit.</p><h2>El resultado</h2><p>Lo que habría tomado un día completo de trabajo se completa en una hora de supervisión. No es magia — es un flujo de trabajo donde la IA hace el trabajo pesado y tú haces las decisiones.</p>`,
  },
  {
    slug: 'devin-cli-skills-configuracion',
    category: 'Inteligencia Artificial',
    title: 'Devin CLI Skills: extendiendo la IA con conocimiento de dominio',
    description: 'Cómo las skills de Devin CLI permiten encapsular patrones, convenciones y conocimiento del proyecto para que el agente trabaje mejor.',
    author: 'Equipo Editorial',
    content: `<h2>¿Qué son las Skills?</h2><p>Las Skills en Devin CLI son archivos markdown que encapsulan instrucciones, patrones y convenciones de un proyecto. Funcionan como un sistema de conocimiento que el agente carga bajo demanda, permitiéndole trabajar de forma más precisa sin que tengas que repetir el contexto cada vez.</p><h2>Estructura de una Skill</h2><p>Una skill típica incluye: un nombre descriptivo, un trigger (cuándo debe activarse), el contenido (instrucciones, ejemplos, reglas) y opcionalmente permisos de herramientas. Se guardan en <code>.devin/skills/</code> dentro del proyecto.</p><p>Por ejemplo, una skill de "commits atómicos" puede definir: qué constituye un work unit, cómo estructurar el mensaje de commit, qué archivos incluir juntos y cuándo separar. Devin la carga automáticamente cuando detecta que estás trabajando en commits.</p><h2>Skills vs. AGENTS.md</h2><p>AGENTS.md es el archivo de instrucciones globales del proyecto — siempre activo. Las Skills son modulares: se cargan bajo demanda según el contexto. Esto evita saturar el contexto del modelo con instrucciones que no son relevantes para la tarea actual.</p><h2>El futuro: conocimiento compartido</h2><p>Las skills abren la posibilidad de compartir conocimiento entre equipos y proyectos. Una skill bien escrita encapsula meses de experiencia en un archivo que cualquier miembro del equipo (humano o IA) puede usar. Es el equivalente a la documentación viva del proyecto.</p>`,
  },
];

// ─── 5 Opinion articles about Claude Code ───
const claudeOpinionEs = [
  {
    slug: 'claude-code-terminal-revolucion',
    category: 'Inteligencia Artificial',
    title: 'Claude Code: la terminal como interfaz para la IA',
    description: 'Opinión sobre cómo Anthropic transformó la línea de comandos en un espacio de colaboración con IA.',
    author: 'Equipo Editorial',
    content: `<h2>Una apuesta distinta</h2><p>Mientras otros construyen IDEs con paneles de chat, Anthropic eligió la terminal. Claude Code es un CLI puro — sin UI gráfica, sin botones, sin paneles. Solo texto, comandos y contexto. Y funciona sorprendentemente bien.</p><p>La terminal ya es el hogar natural del desarrollador. Claude Code no te pide que cambies de entorno; te pide que le hables en el lenguaje que ya hablas: comandos, archivos y código.</p><h2>Lo que lo hace diferente</h2><p>Claude Code no es un chatbot en la terminal. Es un agente que puede leer archivos, ejecutar comandos, hacer diffs y proponer cambios. La integración con git es nativa: puedes pedirle que revise un PR, que explique un commit o que sugiera un mensaje de commit basándose en el diff.</p><p>El modelo Claude Sonnet 4 que lo potencia tiene un razonamiento notable para tareas de código. No siempre acierta, pero cuando lo hace, la calidad del output rivaliza con la de un desarrollador junior competente.</p>`,
  },
  {
    slug: 'claude-code-vs-devin-comparacion',
    category: 'Inteligencia Artificial',
    title: 'Claude Code vs. Devin: dos filosofías de IA para desarrolladores',
    description: 'Un análisis comparativo de los enfoques de Anthropic y Cognition para asistir el desarrollo de software.',
    author: 'Equipo Editorial',
    content: `<h2>Dos caminos, mismo destino</h2><p>Claude Code (Anthropic) y Devin (Cognition) comparten un objetivo: usar IA para hacer el desarrollo más eficiente. Pero sus filosofías son casi opuestas.</p><h2>Claude Code: el asistente conversacional</h2><p>Claude Code funciona como una conversación. Le describes lo que necesitas, te propone cambios, tú revisas y aceptas. Es un modelo colaborativo donde el humano mantiene el control en cada paso. Es ideal para desarrolladores que quieren supervisar cada cambio.</p><h2>Devin: el agente autónomo</h2><p>Devin funciona como un delegado. Le das un objetivo, planifica y ejecuta de forma autónoma. Puede hacer commits, abrir PRs y resolver errores sin intervención. Es ideal para tareas repetitivas o cuando confías en el agente para entregar resultados.</p><h2>¿Cuál es mejor?</h2><p>La respuesta es: depende. Para tareas que requieren precisión y donde el costo de un error es alto, Claude Code es más seguro. Para tareas de bajo riesgo o alta repetitividad, Devin es más eficiente. Lo ideal sería tener ambos y elegir según la tarea.</p>`,
  },
  {
    slug: 'claude-code-productividad-real',
    category: 'Inteligencia Artificial',
    title: 'Claude Code en producción: ¿realmente mejora la productividad?',
    description: 'Una evaluación honesta del impacto de Claude Code en el día a día del desarrollo, más allá del hype.',
    author: 'Equipo Editorial',
    content: `<h2>El hype vs. la realidad</h2><p>Las demos de Claude Code son impresionantes: "construye una app completa en 5 minutos". Pero en producción, con codebases reales, dependencias complejas y requisitos ambiguos, la historia es más matizada.</p><h2>Donde brilla</h2><p>Claude Code es excepcional en: escribir tests (especialmente unit tests), generar boilerplate, explicar código heredado, refactorizar funciones pequeñas, encontrar bugs en lógica simple y escribir documentación. En estas tareas, el ahorro de tiempo es real y significativo.</p><h2>Donde lucha</h2><p>Lucha con: arquitectura de sistemas completos, decisiones de diseño que requieren contexto de negocio, debugging de problemas de concurrencia, y cualquier cosa que requiera entender el "por qué" detrás de un diseño. En estos casos, la IA puede generar código que parece correcto pero que introduce bugs sutiles.</p><h2>El veredicto</h2><p>Claude Code no reemplaza al desarrollador. Lo amplifica. Usado bien, puede reducir el tiempo de tareas mecánicas en un 50-70%. Usado mal, puede generar deuda técnica rápidamente. La clave es saber cuándo delegar y cuándo mantener el control.</p>`,
  },
  {
    slug: 'claude-code-contexto-limites',
    category: 'Inteligencia Artificial',
    title: 'El problema del contexto en Claude Code: ventanas finitas, codebases infinitos',
    description: 'Una reflexión sobre cómo el límite de contexto afecta la utilidad de los agentes de IA en proyectos grandes.',
    author: 'Equipo Editorial',
    content: `<h2>El cuello de botella</h2><p>Todos los modelos de lenguaje tienen un límite de contexto: cuántos tokens pueden procesar a la vez. Claude Code, incluso con ventanas de 200K tokens, no puede cargar un codebase de 500 archivos completos. Y aquí está el problema fundamental.</p><h2>El desafío de la relevancia</h2><p>En un proyecto grande, cuando pides "arregla el bug de login", Claude Code necesita saber: qué archivo maneja login, qué schema usa la DB, qué convenciones sigue el proyecto, qué tests existen. Todo eso es contexto. Y no todo cabe en la ventana.</p><h2>Estrategias de mitigación</h2><p>Los desarrolladores han encontrado formas de lidiar con esto: dar contexto explícito ("el login está en auth/login.ts"), referenciar archivos específicos, dividir tareas grandes en subtareas pequeñas, y usar AGENTS.md para dar contexto global del proyecto.</p><h2>El futuro</h2><p>El problema del contexto no se resuelve solo con ventanas más grandes. Se resuelve con mejor recuperación de información, indexación semántica del codebase y arquitecturas que separan el razonamiento del recuerdo. Mientras tanto, el desarrollador sigue siendo el índice del proyecto.</p>`,
  },
  {
    slug: 'claude-code-herramienta-no-reemplazo',
    category: 'Inteligencia Artificial',
    title: 'Claude Code es una herramienta, no un reemplazo: lección para desarrolladores',
    description: 'Por qué la narrativa de "la IA reemplazará a los desarrolladores" equivoca el punto y qué significa realmente para la profesión.',
    author: 'Equipo Editorial',
    content: `<h2>El mito del reemplazo</h2><p>Cada vez que una nueva herramienta de IA para código aparece, resurge la narrativa: "los desarrolladores serán reemplazados". Claude Code no es la excepción. Pero esta narrativa equivoca el punto fundamental.</p><h2>Lo que la IA hace bien</h2><p>Claude Code y herramientas similares son excelentes en tareas mecánicas: escribir código repetitivo, generar tests, formatear, refactorizar patrones conocidos. En estas tareas, la IA es más rápida y a veces más precisa que un humano.</p><h2>Lo que la IA no hace</h2><p>La IA no entiende el negocio. No sabe por qué un cliente necesita una feature específica. No puede negociar requisitos con stakeholders. No puede decidir entre dos arquitecturas con tradeoffs distintos. No puede mentorizar a un desarrollador junior. No puede tomar responsabilidad por una decisión de diseño.</p><h2>El nuevo rol</h2><p>El desarrollador del futuro no es un mecanógrafo que escribe código. Es un arquitecto que dirige a agentes de IA, un revisor que valida su output, un traductor entre necesidades de negocio y capacidades técnicas. La habilidad más valiosa no será escribir código rápido — será saber qué código pedir, cómo verificarlo y cuándo no confiar en la máquina.</p><p>Claude Code es una herramienta poderosa. Usala como tal. No la confundas con un colega.</p>`,
  },
];

async function retry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`  Retry ${i + 1}/${retries}...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error('unreachable');
}

async function seed() {
  console.log('Seeding database...');
  console.log(`  DB: ${DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);

  // 1. Insert static essays (es + en)
  for (const essay of staticEssaysEs) {
    const content = essay.full.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    await retry(() =>
      sql`
        INSERT INTO articles (slug, locale, type, category, title, description, author, content, published)
        VALUES (${essay.slug}, 'es', 'ensayo', ${essay.category}, ${essay.title}, ${essay.description}, ${essay.author}, ${content}, true)
        ON CONFLICT (slug) DO NOTHING
      `
    );
    console.log(`  [es] ${essay.slug}`);
  }

  for (const essay of staticEssaysEn) {
    const content = essay.full.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    await retry(() =>
      sql`
        INSERT INTO articles (slug, locale, type, category, title, description, author, content, published)
        VALUES (${essay.slug}, 'en', 'ensayo', ${essay.category}, ${essay.title}, ${essay.description}, ${essay.author}, ${content}, true)
        ON CONFLICT (slug) DO NOTHING
      `
    );
    console.log(`  [en] ${essay.slug}`);
  }

  // 2. Insert Devin essays (es only)
  for (const essay of devinEssaysEs) {
    await retry(() =>
      sql`
        INSERT INTO articles (slug, locale, type, category, title, description, author, content, published)
        VALUES (${essay.slug}, 'es', 'ensayo', ${essay.category}, ${essay.title}, ${essay.description}, ${essay.author}, ${essay.content}, true)
        ON CONFLICT (slug) DO NOTHING
      `
    );
    console.log(`  [devin/es] ${essay.slug}`);
  }

  // 3. Insert Claude Code opinion articles (es only)
  for (const article of claudeOpinionEs) {
    await retry(() =>
      sql`
        INSERT INTO articles (slug, locale, type, category, title, description, author, content, published)
        VALUES (${article.slug}, 'es', 'opinion', ${article.category}, ${article.title}, ${article.description}, ${article.author}, ${article.content}, true)
        ON CONFLICT (slug) DO NOTHING
      `
    );
    console.log(`  [claude/es] ${article.slug}`);
  }

  console.log('Done!');
  await sql.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
