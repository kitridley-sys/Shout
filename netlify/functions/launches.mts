import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  try {
    const upstream = await fetch(
      "https://services.rnli.org/api/launches?numberOfShouts=50",
      { headers: { "accept": "application/json" } }
    );

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: `RNLI API returned ${upstream.status}` }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const body = await upstream.text();

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=20"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to reach RNLI API", detail: String(err) }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/launches"
};
