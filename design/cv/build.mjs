// Genera los dos HTML del CV (ES y EN) a partir de los textos de abajo: un solo lugar donde editar el contenido.
// Uso: node design/cv/build.mjs  y después exportar a PDF con Chrome (ver README.md).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const CSS = `
@page { size: A4; margin: 17mm 19mm 16mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; color: #000; background: #fff; font: 10.6pt/1.27 Georgia, Cambria, Caladea, 'Liberation Serif', 'Times New Roman', serif; }
h1 { margin: 0; text-align: center; font-size: 15pt; line-height: 1.2; font-weight: 700; }
.role { margin: 3pt 0 0; text-align: center; }
.contact { margin: 2pt 0 0; text-align: center; padding-bottom: 6pt; border-bottom: 1px solid #000; }
h2 { margin: 11pt 0 0; padding-bottom: 3pt; border-bottom: 1px solid #000; text-align: center; font-size: 11.2pt; font-weight: 700; }
.about { margin: 6pt 0 0; }
.job { margin-top: 7pt; }
.job:first-of-type { margin-top: 6pt; }
.job h3 { margin: 0; font-size: 10.6pt; font-weight: 700; }
.where, .when { font-style: italic; }
.meta { display: flex; justify-content: space-between; gap: 12pt; }
ul { margin: 4pt 0 0; padding-left: 15pt; }
li { margin: 0 0 3.5pt; }
li:last-child { margin-bottom: 0; }
.break { break-before: page; }
.skills h3 { margin: 7pt 0 0; font-size: 10.6pt; font-weight: 700; }
.skills h3:first-of-type { margin-top: 6pt; }
.skills ul { margin-top: 2pt; }
.edu .t { margin: 6pt 0 0; font-weight: 700; }
`;

const ES = {
  lang: 'es',
  title: 'Santiago Lucas Da Ros · CV',
  name: 'Santiago Lucas Da Ros',
  role: 'Cloud Engineer | Azure (AZ-700, SC-300, AZ-400, AZ-305, AZ-800/801, AZ-104) | Infraestructura, Networking e Identidad',
  contact: 'GBA, Argentina | santiagolucasdaros@gmail.com | linkedin.com/in/santiagodaros',
  aboutH: 'Sobre mí',
  about:
    'Cloud Engineer especializado en Microsoft Azure, con experiencia en consultoría para clientes corporativos de distintas industrias en entornos híbridos y nativos de nube. Trabajo sobre infraestructura, networking, identidad y seguridad, disaster recovery con Azure Site Recovery y gobernanza bajo Cloud Adoption Framework, desde el relevamiento inicial hasta la implementación y la operación. Además de operar cuentas, diseño y construyo herramientas internas (portales sobre Azure, automatizaciones en PowerShell y Azure Automation, dashboards en tiempo real) que hacen el trabajo del equipo más rápido, repetible y medible. Me interesa bajar la complejidad técnica a decisiones concretas: convierto assessments en planes de trabajo priorizados, documento con precisión y detecto oportunidades de mejora que se traducen en nuevos proyectos. Cuento con seis certificaciones de Microsoft de nivel Associate y Expert, entre ellas AZ-700, SC-300 y AZ-305, y curso la Licenciatura en Ciencias de la Computación en la UBA.',
  expH: 'Experiencia',
  jobs: [
    {
      title: 'Cloud Engineer',
      where: 'Readymind',
      when: 'Octubre 2025 – Presente',
      items: [
        'Diseñé y construí el portal de operación del negocio CSP de la compañía sobre Azure (Container Apps, PostgreSQL Flexible Server, Static Web Apps, Entra ID), integrado con Partner Center, Microsoft Graph y Azure Resource Manager. Centraliza en un solo lugar la cartera de más de 200 clientes en más de 5 países: segmenta por consumo de Azure, licencias y planes sin uso, y reúne facturación, licencias de Microsoft 365, optimización de costos, estado de seguridad y permisos, y aprobación de compras con doble control.',
        'Desarrollé un framework de automatización de Test Failover en Azure Site Recovery (PowerShell, Azure Automation, Managed Identity) para decenas de servidores: test failover, actualización de DNS y replicación de Active Directory, validación de puertos críticos y reporte auditable. Redujo el tiempo de validación un 62% (de 2 h a 45 min).',
        'Construí DR Live, un dashboard en tiempo real para el mismo cliente (Next.js, PostgreSQL, Container Apps, Azure Monitor): sigue cada fase del test failover, mide RPO/RTO y costo por minuto de caída, y un motor de reglas diagnostica fallas de replicación por hipótesis. Presentado en un webinar público con demo en vivo; en implementación.',
        'Diseñé la estrategia de recuperación en Azure para servidores Ubuntu críticos cuyo kernel quedaba fuera de la matriz de soporte del Mobility Service de ASR, ante un escenario de pérdida total del sitio. Evalué alternativas basadas en Veeam y lo resolví con Azure Site Recovery: ajuste de los kernel headers e instalación del Mobility Agent en dos etapas sobre un kernel compatible.',
        'Desarrollé una herramienta de assessment en PowerShell, de solo lectura sobre Azure, Entra ID y Microsoft 365, que evalúa identidad (MFA, Conditional Access, PIM, autenticación legacy, roles privilegiados), seguridad y gobernanza, y genera un backlog priorizado de remediaciones. Con ella realicé auditorías integrales de seguridad y armé los planes de trabajo de varias cuentas corporativas, con remediación progresiva y nuevas corridas para medir el avance.',
        'Implementé Azure Arc para servidores on-premises, Azure Policies personalizadas y etiquetado masivo para la auditoría de costos (FinOps).',
        'Planifiqué y ejecuté migraciones de Exchange Server a Exchange Online, con identidad híbrida y gestión de dispositivos con Microsoft Intune.',
        'Operé cuentas corporativas con 98% de resolución autónoma de tickets; acompañé la incorporación de un perfil trainee.',
      ],
    },
    {
      title: 'Programa de formación Cloud',
      where: 'Readymind',
      when: 'Mayo 2025 – Octubre 2025',
      break: true,
      lead: 'Trabajo en proyectos prácticos con herramientas de cloud, low-code y datos, adquiriendo una base sólida del ecosistema Microsoft.',
      items: [
        'Aprendizaje técnico enfocado en los servicios fundamentales de Microsoft Azure.',
        'Aplicación de conceptos de infraestructura cloud, operación y buenas prácticas como base para la especialización en Azure.',
      ],
    },
  ],
  eduH: 'Educación',
  edu: [{ title: 'Licenciatura en Ciencias de la Computación', where: 'UBA', when: 'Marzo 2023 – Presente' }],
  skillsH: 'Habilidades',
  skills: [
    {
      h: 'Habilidades técnicas',
      t: 'Microsoft Azure, Azure Site Recovery, Azure Backup, Azure Migrate, Azure Arc, Azure Policy, Azure Monitor, Azure Automation, Virtual Network, Private Endpoints, Container Apps, Entra ID, Conditional Access, PIM, Active Directory, Microsoft 365, Exchange Online, Intune, Cloud Adoption Framework, FinOps, PowerShell, Hyper-V, Windows Server, Linux, Docker, Git, GitHub, Azure DevOps, Python, SQL, TypeScript.',
    },
    { h: 'Habilidades blandas', t: 'Trabajo en equipo, planificación, comunicación con clientes, documentación técnica y adaptabilidad.' },
    { h: 'Idiomas', t: 'Español (nativo), Inglés (B2).' },
  ],
};

const EN = {
  lang: 'en',
  title: 'Santiago Lucas Da Ros · Resume',
  name: 'Santiago Lucas Da Ros',
  role: 'Cloud Engineer | Azure (AZ-700, SC-300, AZ-400, AZ-305, AZ-800/801, AZ-104) | Infrastructure, Networking & Identity',
  contact: 'GBA, Argentina | santiagolucasdaros@gmail.com | linkedin.com/in/santiagodaros',
  aboutH: 'About me',
  about:
    "Cloud Engineer specialized in Microsoft Azure, with consulting experience for corporate clients across industries in hybrid and cloud-native environments. I work across infrastructure, networking, identity and security, disaster recovery with Azure Site Recovery, and governance under the Cloud Adoption Framework, from the initial assessment through implementation and operations. Beyond running client accounts, I design and build internal tools (portals on Azure, PowerShell and Azure Automation workflows, real-time dashboards) that make the team's work faster, repeatable and measurable. I focus on turning technical complexity into concrete decisions: I convert assessments into prioritized work plans, document with precision and spot improvement opportunities that become new projects. I hold six Microsoft Associate and Expert certifications, including AZ-700, SC-300 and AZ-305, and I am pursuing a degree in Computer Science at the University of Buenos Aires.",
  expH: 'Experience',
  jobs: [
    {
      title: 'Cloud Engineer',
      where: 'Readymind',
      when: 'October 2025 – Present',
      items: [
        "Designed and built the company's CSP business operations portal on Azure (Container Apps, PostgreSQL Flexible Server, Static Web Apps, Entra ID), integrated with Partner Center, Microsoft Graph and Azure Resource Manager. It centralizes a portfolio of more than 200 clients across more than 5 countries: segments by Azure consumption, licenses and unused plans, and brings together billing, Microsoft 365 licensing, cost optimization, security and permissions posture, and purchase approvals with dual control.",
        'Built a Test Failover automation framework for Azure Site Recovery (PowerShell, Azure Automation, Managed Identity) covering dozens of servers: test failover, DNS update and Active Directory replication, critical port validation and an auditable report. Cut validation time by 62% (from 2 h to 45 min).',
        'Built DR Live, a real-time dashboard for the same client (Next.js, PostgreSQL, Container Apps, Azure Monitor): it tracks every test failover phase, measures RPO/RTO and cost per minute of downtime, and a rules engine diagnoses replication failures by hypothesis. Presented in a public webinar with a live demo; currently being implemented.',
        'Designed the Azure recovery strategy for critical Ubuntu servers whose kernel fell outside the ASR Mobility Service support matrix, for a full site-loss scenario. Evaluated Veeam-based alternatives and solved it with Azure Site Recovery: kernel header adjustments and a two-stage Mobility Agent installation on a compatible kernel.',
        'Developed a read-only PowerShell assessment tool for Azure, Entra ID and Microsoft 365 that evaluates identity (MFA, Conditional Access, PIM, legacy authentication, privileged roles), security and governance, and produces a prioritized remediation backlog. Used it to run full security audits and build the work plans for several corporate accounts, with phased remediation and follow-up runs to measure progress.',
        'Implemented Azure Arc for on-premises servers, custom Azure Policies and bulk tagging for cost auditing (FinOps).',
        'Planned and executed Exchange Server to Exchange Online migrations, with hybrid identity and device management through Microsoft Intune.',
        'Managed corporate accounts with a 98% autonomous ticket resolution rate; onboarded and mentored a trainee.',
      ],
    },
    {
      title: 'Cloud Training Program',
      where: 'Readymind',
      when: 'May 2025 – October 2025',
      break: true,
      lead: 'Hands-on projects with cloud, low-code and data tools, building a solid foundation in the Microsoft ecosystem.',
      items: [
        'Technical learning focused on core Microsoft Azure services.',
        'Applied cloud infrastructure, operations and best-practice concepts as the foundation for specializing in Azure.',
      ],
    },
  ],
  eduH: 'Education',
  edu: [{ title: 'Licentiate Degree in Computer Science (5-year program)', where: 'UBA - University of Buenos Aires', when: 'March 2023 – Present' }],
  skillsH: 'Skills',
  skills: [
    {
      h: 'Technical skills',
      t: 'Microsoft Azure, Azure Site Recovery, Azure Backup, Azure Migrate, Azure Arc, Azure Policy, Azure Monitor, Azure Automation, Virtual Network, Private Endpoints, Container Apps, Entra ID, Conditional Access, PIM, Active Directory, Microsoft 365, Exchange Online, Intune, Cloud Adoption Framework, FinOps, PowerShell, Hyper-V, Windows Server, Linux, Docker, Git, GitHub, Azure DevOps, Python, SQL, TypeScript.',
    },
    { h: 'Soft skills', t: 'Teamwork, planning, client communication, technical documentation and adaptability.' },
    { h: 'Languages', t: 'Spanish (native), English (B2).' },
  ],
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function html(d) {
  const jobs = d.jobs
    .map(
      (j) => `
  <div class="job${j.break ? ' break' : ''}">
    <h3>${esc(j.title)}</h3>
    <div class="meta"><span class="where">${esc(j.where)}</span><span class="when">${esc(j.when)}</span></div>
    ${j.lead ? `<p style="margin:4pt 0 0">${esc(j.lead)}</p>` : ''}
    <ul>${j.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>`
    )
    .join('');
  const edu = d.edu
    .map((e) => `<p class="t">${esc(e.title)}</p><div class="meta"><span class="where">${esc(e.where)}</span><span class="when">${esc(e.when)}</span></div>`)
    .join('');
  const skills = d.skills.map((s) => `<h3>${esc(s.h)}</h3><ul><li>${esc(s.t)}</li></ul>`).join('');
  return `<!doctype html>
<html lang="${d.lang}">
<head>
<meta charset="utf-8">
<title>${esc(d.title)}</title>
<style>${CSS}</style>
</head>
<body>
  <h1>${esc(d.name)}</h1>
  <p class="role">${esc(d.role)}</p>
  <p class="contact">${esc(d.contact)}</p>
  <h2>${esc(d.aboutH)}</h2>
  <p class="about">${esc(d.about)}</p>
  <h2>${esc(d.expH)}</h2>${jobs}
  <h2>${esc(d.eduH)}</h2><div class="edu">${edu}</div>
  <h2>${esc(d.skillsH)}</h2><div class="skills">${skills}</div>
</body>
</html>
`;
}

writeFileSync(join(here, 'cv-es.html'), html(ES));
writeFileSync(join(here, 'cv-en.html'), html(EN));
console.log('cv-es.html y cv-en.html generados');
