import app from "./app";
import { prisma } from "./lib/prisma";

import { seedAdmin } from "../scripts/seedAdmin";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log("listening at port", PORT);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
