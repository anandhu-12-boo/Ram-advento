import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { JeepGlyph } from "@/components/brand/JeepGlyph";
import { btnPrimary } from "@/lib/ui";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-6 text-center">
      <BrandLogo size={120} interactive />
      <h1 className="mt-8 font-display text-[clamp(2rem,6vw,4rem)] text-mist">
        You've taken the wrong trail.
      </h1>
      <p className="mt-3 text-mist/70">Let's get you back to the adventure.</p>

      <div className="relative mt-10 h-8 w-full max-w-xs" aria-hidden>
        <span className="absolute top-6 left-0 h-px w-full bg-sand/30" />
        <motion.span
          className="absolute top-0 left-0 text-sand"
          initial={{ x: "100%", scaleX: -1 }}
          animate={{ x: 0, scaleX: -1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <JeepGlyph size={30} />
        </motion.span>
      </div>

      <Link to="/" className={`${btnPrimary} mt-10`}>
        Back to adventure
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ram Adventure | Munnar Jeep Safari & Tours" },
      {
        name: "description",
        content:
          "Explore Munnar with Ram Adventure. Experience unforgettable jeep safaris, mountain trails, sightseeing tours and authentic Kerala adventures.",
      },
      { name: "author", content: "Ram Adventure" },
      { name: "theme-color", content: "#102A1F" },
      { property: "og:site_name", content: "Ram Adventure" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
