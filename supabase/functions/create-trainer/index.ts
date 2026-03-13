import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
      },
    );

    // Extract token and get user
    const token = authHeader.replace("Bearer ", "");

    const { data: { user }, error: userError } = await supabaseClient.auth
      .getUser(token);

    if (userError || !user) {
      console.error("Auth verification failed:", userError);

      throw new Error(
        "Unauthorized: " + (userError?.message || "Invalid session"),
      );
    }

    // 2. Check if the user is an admin
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      throw new Error("Only admins can create trainers");
    }

    // 3. Parse request body for new trainer details
    const {
      email,
      password,
      full_name,
      bio,
      specialty,
      experience_years,
      phone,
      color,
      certifications,
    } = await req.json();

    // 4. Initialize Admin client with service_role to bypass RLS and create user
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin
      .createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          role: "trainer",
          is_super_admin: true, // Bypass the role check in the trigger
        },
      });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("User creation failed");
    }

    // 5. Update the trainer record with extra details
    // The 'handle_new_user' trigger created the row, now we enrich it.
    const { error: updateError } = await supabaseAdmin
      .from("trainers")
      .update({
        bio,
        specialty,
        experience_years: parseInt(experience_years) || 0,
        phone,
        color,
        certifications,
        full_name,
        email,
      })
      .eq("id", authData.user.id);

    if (updateError) {
      console.error("Trainer detail update error:", updateError);
    }

    return new Response(
      JSON.stringify({
        user: authData.user,
        message: "Trainer created successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error("Edge Function Error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error
          ? error.message
          : "An unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
