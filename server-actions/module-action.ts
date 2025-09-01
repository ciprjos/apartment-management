import { prisma } from "@/lib/prisma";

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

/**
 * Gets all modules and submodules for a user based on their permissions
 * @param userId string
 * @returns Promise<{ modules: Module[], submodules: Submodule[] }>
 */
export async function getUserModulesAndSubmodules(userId: string) {
  // Find all permissions granted to the user
  const userPermissions = await prisma.userPermission.findMany({
    where: { userId, granted: true },
    include: {
      permission: {
        include: {
          module: true,
          submodule: true,
        },
      },
    },
  });

  // Extract unique modules and submodules
  const modulesMap = new Map<string, typeof userPermissions[0]["permission"]["module"]>();
  const submodulesMap = new Map<string, typeof userPermissions[0]["permission"]["submodule"]>();

  for (const up of userPermissions) {
    const { module, submodule } = up.permission;
    if (module && !modulesMap.has(module.id)) {
      modulesMap.set(module.id, module);
    }
    if (submodule && !submodulesMap.has(submodule.id)) {
      submodulesMap.set(submodule.id, submodule);
    }
  }

  return {
    modules: Array.from(modulesMap.values()),
    submodules: Array.from(submodulesMap.values()),
  };
}
