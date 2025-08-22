import { UserRole } from "@/generated/prisma";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};
