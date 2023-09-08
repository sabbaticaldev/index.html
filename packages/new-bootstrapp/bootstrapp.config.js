import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const apps = Object.values(
  import.meta.glob("./apps/**/bootstrapp.config.@(js|ts)", {
    eager: true,
  })
).map((module) => module.default);

function generateDynamicContent(apps) {
  const appEntries = apps
    .map(
      (app) =>
        `    { page === '${app.name.toLowerCase()}' && <${app.tag}></${
          app.tag
        }> }`
    )
    .join("\n");
  const staticPaths = apps
    .map((app) => `      { params: { page: '${app.name.toLowerCase()}' }}`)
    .join(",\n");

  return `---
  import Layout from '../layouts/layout.astro';
  import { Bootstrapp } from '../bootstrapp.js';

  let { page } = Astro.params;
  
  export function getStaticPaths() {
    return [
${staticPaths}
    ];
  }
---
  
<Layout title={page}>
  <Bootstrapp client:only="lit">
${appEntries}
  </Bootstrapp>
</Layout>
  `;
}

export const bootstrappAstro = () => {
  return {
    name: "bootstrapp",
    keywords: ["astro-integration"],
    hooks: {
      "astro:server:setup": () => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const content = generateDynamicContent(apps);
        const filePath = path.join(__dirname, "src/pages", "[page].astro");
        fs.writeFileSync(filePath, content, "utf8");
      },
    },
  };
};
