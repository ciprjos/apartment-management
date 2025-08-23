"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";

/**
 * Checks if a user has a specific permission (user or role based)
 * @param userId - The user's ID
 * @param module - The module name (e.g., "apartment")
 * @param action - The action (e.g., "create", "read")
 * @returns Promise<boolean> - true if granted, false otherwise
 */
export async function hasPermission(
  userId: string,
  module: string,
  action: string
): Promise<boolean> {
  // 1. Find the permission
  const permission = await prisma.permission.findUnique({
    where: { module_action: { module, action } },
  });
  if (!permission) return false;

  // 2. Check for user-specific permission
  const userPermission = await prisma.userPermission.findUnique({
    where: { userId_permissionId: { userId, permissionId: permission.id } },
  });
  if (userPermission) return !!userPermission.granted;

  // 3. Get user role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) return false;

  // 4. Check for role-based permission
  const rolePermission = await prisma.rolePermission.findUnique({
    where: {
      role_permissionId: { role: user.role, permissionId: permission.id },
    },
  });
  if (rolePermission) return !!rolePermission.granted;

  // 5. Default deny
  return false;
}

/**
 * Assigns a permission to a user (granted or revoked)
 * @param userId - The user's ID
 * @param permissionId - The permission's ID
 * @param granted - true to grant, false to revoke
 */
export async function setUserPermission(
  userId: string,
  permissionId: string,
  granted: boolean
): Promise<void> {
  await prisma.userPermission.upsert({
    where: { userId_permissionId: { userId, permissionId } },
    update: { granted },
    create: { userId, permissionId, granted },
  });
}

/**
 * Assigns a permission to a role (granted or revoked)
 * @param role - The user role (UserRole)
 * @param permissionId - The permission's ID
 * @param granted - true to grant, false to revoke
 */
export async function setRolePermission(
  role: UserRole,
  permissionId: string,
  granted: boolean
): Promise<void> {
  await prisma.rolePermission.upsert({
    where: { role_permissionId: { role, permissionId } },
    update: { granted },
    create: { role, permissionId, granted },
  });
}
