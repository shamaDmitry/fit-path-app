import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "npm:stripe@^16.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { appointmentId, redirectPath = "/profile" } = await req.json();

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // 1. Fetch appointment details with relations
    const { data: appointment, error: aptError } = await supabaseAdmin
      .from("appointments")
      .select(`
        *,
        trainer:trainers(full_name),
        user:profiles!user_id(full_name, email)
      `)
      .eq("id", appointmentId)
      .single();

    if (aptError || !appointment) {
      throw new Error("Appointment not found");
    }

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Session with ${appointment.trainer.full_name}`,
              description: `Appointment on ${
                new Date(appointment.start_time).toLocaleDateString()
              }`,
            },
            unit_amount: Math.round(appointment.price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${
        req.headers.get("origin")
      }${redirectPath}?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        req.headers.get("origin")
      }${redirectPath}?status=cancelled`,
      customer_email: appointment.user.email,
      metadata: {
        appointment_id: appointmentId,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
