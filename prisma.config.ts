import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: path.join("prisma", "schema.prisma"),
    migrations: {
        path: path.join("prisma", "migrations"),
    },
    datasource: {
        // Use DIRECT_URL for migrations (session mode, no pgBouncer)
        // Falls back to DATABASE_URL if DIRECT_URL is not set
        url: env("DIRECT_URL"),
    },
});
