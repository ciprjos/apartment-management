"use client";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Lock } from "lucide-react";
import { logout } from "@/server-actions/auth-action";

export function SignInPrompt() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Access Required</CardTitle>
          <CardDescription>
            Please sign in to access the portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" onClick={() => logout()}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
