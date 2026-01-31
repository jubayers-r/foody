import fs from "fs";
import path from "path";
import readline from "readline";

// ---------- helpers ----------
const toKebabCase = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

const toPascalCase = (str: string) =>
  str
    .split(/[-_\s]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

const askOverwriteAll = (files: string[]) => {
  return new Promise<boolean>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log("The following files already exist:");
    files.forEach((f) => console.log("  " + f));
    rl.question("⚠️ Overwrite all these files? (y/N) ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
};

// ---------- args ----------
const moduleName = process.argv[2];
const force = process.argv.includes("--force") || process.argv.includes("-f");

if (!moduleName) {
  console.error("❌ Please provide a module name (e.g., userProfile)");
  process.exit(1);
}

const kebabName = toKebabCase(moduleName);
const pascalName = toPascalCase(moduleName);
const camelName = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);

// ---------- paths ----------
const baseDir = path.join("src", "modules", kebabName);
const routesIndexPath = path.join("src", "routes", "index.ts");

// ---------- templates ----------

const validationTemplate = `import { z } from 'zod';

const create = z.object({
  body: z.object({
    // add fields
  }),
});

const update = z.object({
  body: z.object({
    // add fields
  }),
});

export const ${pascalName}Validation = { create, update };
`;

const serviceTemplate = `import { prisma } from "@/core/database";
import AppError from "@/core/errors/AppError";
import { HTTP_STATUS_CODES } from "@/shared/constants";

const create${pascalName} = async (payload: any) => {
  return await prisma.${camelName}.create({ data: payload });
};

const getAll${pascalName}s = async () => {
  return await prisma.${camelName}.findMany();
};

const get${pascalName}ById = async (id: string) => {
  const result = await prisma.${camelName}.findUnique({ where: { id } });
  if (!result) throw new AppError("${pascalName} not found", HTTP_STATUS_CODES.NOT_FOUND);
  return result;
};

export const ${pascalName}Service = {
  create${pascalName},
  getAll${pascalName}s,
  get${pascalName}ById,
};
`;

const controllerTemplate = `import type { Request, Response } from 'express';
import handleController from '@/shared/utils/controller.utils';
import sendResponse from '@/shared/utils/response.utils';
import { HTTP_STATUS_CODES } from '@/shared/constants';
import { ${pascalName}Service } from './${kebabName}.service';

const create = handleController(async (req, res) => {
  const result = await ${pascalName}Service.create${pascalName}(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS_CODES.CREATED,
    success: true,
    message: '${pascalName} created successfully',
    data: result,
  });
});

const getAll = handleController(async (req, res) => {
  const result = await ${pascalName}Service.getAll${pascalName}s();
  sendResponse(res, {
    statusCode: HTTP_STATUS_CODES.OK,
    success: true,
    message: '${pascalName}s retrieved successfully',
    data: result,
  });
});

export const ${pascalName}Controller = { create, getAll };
`;

const routeTemplate = `import { Router } from 'express';
import validateRequest from '@/shared/middlewares/validateRequest.middleware';
import { ${pascalName}Controller } from './${kebabName}.controller';
import { ${pascalName}Validation } from './${kebabName}.validation';

const router = Router();

router.post(
  '/',
  validateRequest(${pascalName}Validation.create),
  ${pascalName}Controller.create
);

router.get('/', ${pascalName}Controller.getAll);

export const ${pascalName}Routes = router;
`;

const fileTemplates: Record<string, string> = {
  [`${kebabName}.controller.ts`]: controllerTemplate,
  [`${kebabName}.service.ts`]: serviceTemplate,
  [`${kebabName}.route.ts`]: routeTemplate,
  [`${kebabName}.validation.ts`]: validationTemplate,
};

// ---------- Execution ----------
(async () => {
  fs.mkdirSync(baseDir, { recursive: true });

  const allFiles = Object.keys(fileTemplates).map((f) => path.join(baseDir, f));
  const existingFiles = allFiles.filter((f) => fs.existsSync(f));

  let overwriteAll = force;
  if (existingFiles.length > 0 && !force) {
    overwriteAll = await askOverwriteAll(existingFiles);
  }

  for (const [fileName, template] of Object.entries(fileTemplates)) {
    const filePath = path.join(baseDir, fileName);
    if (!fs.existsSync(filePath) || overwriteAll) {
      fs.writeFileSync(filePath, template.trim() + "\n");
      console.log(
        `✅ ${fs.existsSync(filePath) ? "Overwritten" : "Created"}: ${filePath}`,
      );
    }
  }

  console.log(`\n✨ Module "${pascalName}" is ready!`);
})();
