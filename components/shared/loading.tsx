export function Loading() {
  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted rounded-full animate-spin border-t-primary"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-primary/20"></div>
          </div>

          {/* Loading text */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Loading...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we prepare your experience
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
