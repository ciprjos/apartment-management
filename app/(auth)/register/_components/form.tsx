import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APPLICATION_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { GalleryVerticalEnd } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <form>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">{APPLICATION_NAME}</span>
              </a>
              <h1 className="text-xl font-bold">
                Welcome to {APPLICATION_NAME}
              </h1>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="lease-number">Lease Number</Label>
                <Input
                  id="lease-number"
                  type="text"
                  placeholder="Enter your lease number"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Proceed
              </Button>
            </div>
          </div>
        </form>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </>
  );
}
