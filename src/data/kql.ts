// Las 10 consultas de KQL de la guía (/recursos/kql y /en/resources/kql) y del archivo .kql descargable.
// Fuente: design/prototype/index.html (#guia-kql y la constante KQL). La traducción al inglés incluye
// los alias de las consultas (tipo → category, estado → state, regla → rule, etc.).
// IMPORTANTE: las consultas hay que probarlas en un entorno propio antes de publicar (docs/REDISENO.md §11).

import type { Lang } from '../i18n';

export interface KqlQuery {
  title: string;
  desc: string;
  query: string;
}

export const kqlQueries: Record<Lang, KqlQuery[]> = {
  es: [
    {
      "title": "Recursos huérfanos: discos, IP públicas y NICs",
      "desc": "Lo que quedó suelto después de borrar VMs y se sigue pagando.",
      "query": "resources\n| where type == \"microsoft.compute/disks\" and tostring(properties.diskState) == \"Unattached\"\n| project tipo = \"Disco sin adjuntar\", name, resourceGroup, subscriptionId\n| union (resources\n    | where type == \"microsoft.network/publicipaddresses\" and isnull(properties.ipConfiguration)\n    | project tipo = \"IP pública sin asociar\", name, resourceGroup, subscriptionId)\n| union (resources\n    | where type == \"microsoft.network/networkinterfaces\"\n        and isnull(properties.virtualMachine) and isnull(properties.privateEndpoint)\n    | project tipo = \"NIC sin VM\", name, resourceGroup, subscriptionId)"
    },
    {
      "title": "Estado de encendido de las VMs",
      "desc": "Cuántas están encendidas, apagadas o desasignadas. Una VM apagada sin desasignar se sigue cobrando.",
      "query": "resources\n| where type == \"microsoft.compute/virtualmachines\"\n| extend estado = tostring(properties.extended.instanceView.powerState.code)\n| summarize vms = count() by estado\n| order by vms desc"
    },
    {
      "title": "VMs sin Azure Backup",
      "desc": "Máquinas que no aparecen como protegidas en ningún Recovery Services Vault.",
      "query": "resources\n| where type == \"microsoft.compute/virtualmachines\"\n| extend vmId = tolower(id)\n| join kind = leftouter (\n    recoveryservicesresources\n    | where type == \"microsoft.recoveryservices/vaults/backupfabrics/protectioncontainers/protecteditems\"\n    | extend vmId = tolower(tostring(properties.sourceResourceId))\n    | project vmId, vault = tostring(split(id, \"/\")[8])\n  ) on vmId\n| where isempty(vault)\n| project name, resourceGroup, location, subscriptionId"
    },
    {
      "title": "Reglas de NSG abiertas a Internet en RDP o SSH",
      "desc": "La puerta más común para un incidente.",
      "query": "resources\n| where type == \"microsoft.network/networksecuritygroups\"\n| mv-expand regla = properties.securityRules\n| where regla.properties.direction == \"Inbound\" and regla.properties.access == \"Allow\"\n| where tostring(regla.properties.sourceAddressPrefix) in (\"*\", \"Internet\", \"0.0.0.0/0\")\n| extend puerto = tostring(regla.properties.destinationPortRange)\n| where puerto in (\"22\", \"3389\", \"*\")\n| project nsg = name, regla = tostring(regla.name), puerto, resourceGroup, subscriptionId"
    },
    {
      "title": "Cuentas de almacenamiento con acceso público o TLS viejo",
      "desc": "Blobs que se pueden leer sin autenticación y cuentas que aceptan TLS 1.0 o 1.1.",
      "query": "resources\n| where type == \"microsoft.storage/storageaccounts\"\n| extend accesoPublico = tobool(properties.allowBlobPublicAccess),\n         tls = tostring(properties.minimumTlsVersion)\n| where accesoPublico == true or tls != \"TLS1_2\"\n| project name, accesoPublico, tls, resourceGroup, subscriptionId"
    },
    {
      "title": "SQL Servers con acceso de red público",
      "desc": "Candidatos a private endpoint.",
      "query": "resources\n| where type == \"microsoft.sql/servers\"\n| where tostring(properties.publicNetworkAccess) == \"Enabled\"\n| project name, resourceGroup, location, subscriptionId"
    },
    {
      "title": "Recursos sin tag de responsable",
      "desc": "Sin owner, nadie decide si se apaga, se paga o se borra.",
      "query": "resources\n| where isempty(tostring(tags[\"owner\"]))\n| summarize recursos = count() by type\n| order by recursos desc"
    },
    {
      "title": "Recomendaciones de costo de Azure Advisor",
      "desc": "Lo que Microsoft ya detectó y nadie aplicó.",
      "query": "advisorresources\n| where type == \"microsoft.advisor/recommendations\"\n| where tostring(properties.category) == \"Cost\"\n| project impacto = tostring(properties.impact),\n          problema = tostring(properties.shortDescription.problem),\n          recurso = tostring(properties.resourceMetadata.resourceId)\n| order by impacto asc"
    },
    {
      "title": "Secure Score de Defender por suscripción",
      "desc": "Un número para seguir mes a mes.",
      "query": "securityresources\n| where type == \"microsoft.security/securescores\"\n| extend puntaje = round(todouble(properties.score.percentage) * 100, 1)\n| project subscriptionId, puntaje\n| order by puntaje asc"
    },
    {
      "title": "Recursos por región",
      "desc": "Para detectar despliegues fuera de las regiones permitidas antes de escribir la policy.",
      "query": "resources\n| summarize recursos = count() by location\n| order by recursos desc"
    }
  ],
  en: [
    {
      "title": "Orphaned resources: disks, public IPs and NICs",
      "desc": "What was left behind after deleting VMs and is still being paid for.",
      "query": "resources\n| where type == \"microsoft.compute/disks\" and tostring(properties.diskState) == \"Unattached\"\n| project category = \"Unattached disk\", name, resourceGroup, subscriptionId\n| union (resources\n    | where type == \"microsoft.network/publicipaddresses\" and isnull(properties.ipConfiguration)\n    | project category = \"Unassociated public IP\", name, resourceGroup, subscriptionId)\n| union (resources\n    | where type == \"microsoft.network/networkinterfaces\"\n        and isnull(properties.virtualMachine) and isnull(properties.privateEndpoint)\n    | project category = \"NIC without VM\", name, resourceGroup, subscriptionId)"
    },
    {
      "title": "VM power state",
      "desc": "How many are running, stopped or deallocated. A stopped VM that is not deallocated is still billed.",
      "query": "resources\n| where type == \"microsoft.compute/virtualmachines\"\n| extend state = tostring(properties.extended.instanceView.powerState.code)\n| summarize vms = count() by state\n| order by vms desc"
    },
    {
      "title": "VMs without Azure Backup",
      "desc": "Machines that don't show up as protected in any Recovery Services Vault.",
      "query": "resources\n| where type == \"microsoft.compute/virtualmachines\"\n| extend vmId = tolower(id)\n| join kind = leftouter (\n    recoveryservicesresources\n    | where type == \"microsoft.recoveryservices/vaults/backupfabrics/protectioncontainers/protecteditems\"\n    | extend vmId = tolower(tostring(properties.sourceResourceId))\n    | project vmId, vault = tostring(split(id, \"/\")[8])\n  ) on vmId\n| where isempty(vault)\n| project name, resourceGroup, location, subscriptionId"
    },
    {
      "title": "NSG rules open to the Internet on RDP or SSH",
      "desc": "The most common door for an incident.",
      "query": "resources\n| where type == \"microsoft.network/networksecuritygroups\"\n| mv-expand rule = properties.securityRules\n| where rule.properties.direction == \"Inbound\" and rule.properties.access == \"Allow\"\n| where tostring(rule.properties.sourceAddressPrefix) in (\"*\", \"Internet\", \"0.0.0.0/0\")\n| extend port = tostring(rule.properties.destinationPortRange)\n| where port in (\"22\", \"3389\", \"*\")\n| project nsg = name, rule = tostring(rule.name), port, resourceGroup, subscriptionId"
    },
    {
      "title": "Storage accounts with public access or old TLS",
      "desc": "Blobs that can be read without authentication and accounts that accept TLS 1.0 or 1.1.",
      "query": "resources\n| where type == \"microsoft.storage/storageaccounts\"\n| extend publicAccess = tobool(properties.allowBlobPublicAccess),\n         tls = tostring(properties.minimumTlsVersion)\n| where publicAccess == true or tls != \"TLS1_2\"\n| project name, publicAccess, tls, resourceGroup, subscriptionId"
    },
    {
      "title": "SQL servers with public network access",
      "desc": "Private endpoint candidates.",
      "query": "resources\n| where type == \"microsoft.sql/servers\"\n| where tostring(properties.publicNetworkAccess) == \"Enabled\"\n| project name, resourceGroup, location, subscriptionId"
    },
    {
      "title": "Resources without an owner tag",
      "desc": "Without an owner, nobody decides whether it gets shut down, paid for or deleted.",
      "query": "resources\n| where isempty(tostring(tags[\"owner\"]))\n| summarize resourceCount = count() by type\n| order by resourceCount desc"
    },
    {
      "title": "Azure Advisor cost recommendations",
      "desc": "What Microsoft already found and nobody applied.",
      "query": "advisorresources\n| where type == \"microsoft.advisor/recommendations\"\n| where tostring(properties.category) == \"Cost\"\n| project impact = tostring(properties.impact),\n          problem = tostring(properties.shortDescription.problem),\n          resource = tostring(properties.resourceMetadata.resourceId)\n| order by impact asc"
    },
    {
      "title": "Defender Secure Score by subscription",
      "desc": "One number to track month over month.",
      "query": "securityresources\n| where type == \"microsoft.security/securescores\"\n| extend score = round(todouble(properties.score.percentage) * 100, 1)\n| project subscriptionId, score\n| order by score asc"
    },
    {
      "title": "Resources by region",
      "desc": "To spot deployments outside the allowed regions before writing the policy.",
      "query": "resources\n| summarize resourceCount = count() by location\n| order by resourceCount desc"
    }
  ],
};

export const kqlFileName: Record<Lang, string> = {
  es: '10-consultas-kql-auditoria-azure.kql',
  en: '10-kql-queries-azure-audit.kql',
};

export const kqlHeader: Record<Lang, string[]> = {
  es: ['// Las 10 consultas de KQL que corro en toda auditoría de Azure', '// Santiago Da Ros · solo lectura · Azure Resource Graph'],
  en: ['// The 10 KQL queries I run in every Azure audit', '// Santiago Da Ros · read-only · Azure Resource Graph'],
};

/** Contenido del archivo .kql: encabezado + cada consulta con su título y descripción como comentarios. */
export function kqlFileText(lang: Lang): string {
  const NL = String.fromCharCode(10);
  const body = kqlQueries[lang].map(
    (q, i) => [`// ${String(i + 1).padStart(2, '0')}. ${q.title}`, `// ${q.desc}`, q.query].join(NL)
  );
  return [kqlHeader[lang].join(NL), ...body].join(NL + NL) + NL;
}
