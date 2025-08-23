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

/**
 * Sanitizes a route string. Only allows routes like /dashboard, /user/settings, etc.
 */
export function sanitizeRoute(route: string): string | null {
  const trimmed = route.trim();
  const regex = /^\/[a-zA-Z0-9/_-]*$/;
  if (regex.test(trimmed)) return trimmed;
  return null;
}

/**
 * Sanitizes an icon string by checking against a whitelist.
 */
export function sanitizeIcon(
  icon: string,
  allowedIcons: readonly string[]
): string | null {
  const trimmed = icon.trim();
  if (allowedIcons.includes(trimmed)) return trimmed;
  return null;
}
