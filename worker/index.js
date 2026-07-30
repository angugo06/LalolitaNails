export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      return response;
    }

    const url = new URL(request.url);

    // Clean URLs: /servicios -> /servicios.html, /en/book -> /en/book.html
    if (!url.pathname.split("/").pop().includes(".")) {
      const trimmed = url.pathname.replace(/\/+$/, "");
      const attempt = new URL(url);
      attempt.pathname = `${trimmed || "/index"}.html`;
      let page = await env.ASSETS.fetch(new Request(attempt, request));
      if (page.status !== 404) {
        return page;
      }
      // Directory index: /en -> /en/index.html
      attempt.pathname = `${trimmed}/index.html`;
      page = await env.ASSETS.fetch(new Request(attempt, request));
      if (page.status !== 404) {
        return page;
      }
    }

    // Branded 404 for navigations
    if (request.headers.get("accept")?.includes("text/html")) {
      const notFound = new URL(url);
      notFound.pathname = "/404.html";
      const page = await env.ASSETS.fetch(new Request(notFound, request));
      if (page.status !== 404) {
        return new Response(page.body, { status: 404, headers: page.headers });
      }
    }

    return response;
  },
};
