import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: [
    "/ideation/:path*",
    "/code/:path*",
    "/test/:path*",
    "/optimize/:path*",
    "/deploy/:path*",
    "/library/:path*",
    "/copilot/:path*",
  ],
};

