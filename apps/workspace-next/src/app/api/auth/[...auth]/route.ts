import { createNextAuthHandler } from "@puzzle-ui/fullstack/auth/next";

import { handleAuthRequest } from "@/lib/auth/services";

const handleAuth = (request: Request) =>
  handleAuthRequest(request, (auth) => {
    const handlers = createNextAuthHandler({ auth });

    return request.method === "GET"
      ? handlers.GET(request)
      : handlers.POST(request);
  });

export { handleAuth as GET, handleAuth as POST };
