import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "npm:stripe@^16.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    );

    console.log(`🔔 Event received: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const appointmentId = session.metadata?.appointment_id;

      console.log(`Processing session: ${session.id}, appointmentId: ${appointmentId}`);

      if (appointmentId) {
        console.log(`✅ Payment successful for appointment: ${appointmentId}. Checking existence...`);

        // 1. First, just try to find it
        const { data: existing, error: findError } = await supabaseAdmin
          .from("appointments")
          .select("id, paid, status")
          .eq("id", appointmentId)
          .maybeSingle();

        if (findError) {
          console.error(`❌ Database error while searching: ${findError.message}`);
        }

        if (!existing) {
          console.error(`⚠️ CRITICAL: Appointment ${appointmentId} NOT FOUND in database. This usually means the SERVICE_ROLE_KEY is wrong or the SUPABASE_URL points to a different project.`);
          return new Response(JSON.stringify({ error: "Appointment not found" }), { status: 404 });
        }

        console.log(`📍 Found appointment. Current state: paid=${existing.paid}, status=${existing.status}. Updating...`);

        // 2. Perform the update
        const { data, error } = await supabaseAdmin
          .from("appointments")
          .update({ paid: true })
          .eq("id", appointmentId)
          .select();

        if (error) {
          console.error(`❌ Error updating appointment ${appointmentId}: ${error.message}`);
          throw error;
        }

        if (!data || data.length === 0) {
          console.error(`⚠️ No appointment found with ID ${appointmentId} to update.`);
        } else {
          console.log(`🚀 Database updated successfully for ${appointmentId}:`, data);
        }
      } else {
        console.error("❌ No appointment_id found in session metadata. Metadata was:", JSON.stringify(session.metadata));
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`❌ Webhook error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
