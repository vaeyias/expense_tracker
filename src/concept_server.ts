import { Hono } from "jsr:@hono/hono";
import { getDb } from "@utils/database.ts";
import { walk } from "jsr:@std/fs";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { toFileUrl } from "jsr:@std/path/to-file-url";

// Parse command-line arguments
const flags = parseArgs(Deno.args, {
  string: ["port", "baseUrl"],
  default: { port: "8000", baseUrl: "/api" },
});

const PORT = parseInt(flags.port, 10);
const BASE_URL = flags.baseUrl;
const CONCEPTS_DIR = "src/concepts";

async function main() {
  const [db] = await getDb();
  const app = new Hono();

  // --- CORS Middleware ---
  app.use("*", (c, next) => {
    c.header("Access-Control-Allow-Origin", "http://localhost:5173"); // frontend URL
    c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type");
    return next();
  });

  // Handle preflight requests globally
  app.options("*", (c) => c.text(undefined, 204));

  app.get("/", (c) => c.text("Concept Server is running."));

  console.log(`Scanning for concepts in ./${CONCEPTS_DIR}...`);

  for await (
    const entry of walk(CONCEPTS_DIR, {
      maxDepth: 1,
      includeDirs: true,
      includeFiles: false,
    })
  ) {
    if (entry.path === CONCEPTS_DIR) continue;

    const conceptName = entry.name;
    const conceptFilePath = `${entry.path}/${conceptName}Concept.ts`;

    try {
      const modulePath = toFileUrl(Deno.realPathSync(conceptFilePath)).href;
      const module = await import(modulePath);
      const ConceptClass = module.default;

      if (
        typeof ConceptClass !== "function" ||
        !ConceptClass.name.endsWith("Concept")
      ) {
        console.warn(
          `! No valid concept class found in ${conceptFilePath}. Skipping.`,
        );
        continue;
      }

      const instance = new ConceptClass(db);
      const conceptApiName = conceptName;
      console.log(
        `- Registering concept: ${conceptName} at ${BASE_URL}/${conceptApiName}`,
      );

      const methodNames = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance),
      )
        .filter((name) =>
          name !== "constructor" && typeof instance[name] === "function"
        );

      for (const methodName of methodNames) {
        const actionName = methodName;
        const route = `${BASE_URL}/${conceptApiName}/${actionName}`;

        app.post(route, async (c) => {
          try {
            const body = await c.req.json().catch(() => ({}));
            const result = await instance[methodName](body);
            return c.json(result);
          } catch (e) {
            console.error(`Error in ${conceptName}.${methodName}:`, e);
            return c.json({ error: "An internal server error occurred." }, 500);
          }
        });
        console.log(`  - Endpoint: POST ${route}`);
      }
    } catch (e) {
      console.error(`! Error loading concept from ${conceptFilePath}:`, e);
    }
  }

  console.log(`\nServer listening on http://localhost:${PORT}`);
  Deno.serve({ port: PORT }, app.fetch);
}

main();
