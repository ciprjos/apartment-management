import { prisma } from "@/lib/prisma";

/**
 * Gets all unique modules from the Permission table
 * @returns Promise<string[]>
 */
export async function getModules(): Promise<string[]> {
  const modules = await prisma.permission.findMany({
    select: { module: true },
    distinct: ["module"],
    orderBy: { module: "asc" },
  });
  return modules.map((m) => m.module);
}
