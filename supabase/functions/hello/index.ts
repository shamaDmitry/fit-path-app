// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const { name } = await req.json();

  const data = {
    message: `Hello ${name}!`,
    SUPABASE_URL: Deno.env.get("PROJECT_URL"),
    SERVICE_ROLE_KEY: Deno.env.get("SERVICE_ROLE_KEY"),
  };

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  );
});
