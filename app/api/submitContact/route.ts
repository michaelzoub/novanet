import { NextResponse } from "next/server";
import { potentialClientManager, referralManager, jobManager } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message, referralCode } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Les champs prénom, nom, email et téléphone sont requis." },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = String(phone).trim();
    const normalizedReferralCode =
      typeof referralCode === "string" ? referralCode.trim().toLowerCase() : "";

    let referralProfile = null;
    if (normalizedReferralCode) {
      referralProfile = await referralManager.getReferralProfileByCode(
        normalizedReferralCode,
      );
    }

    // Create potential client in database
    const potentialClient = await potentialClientManager.createPotentialClient({
      first_name: firstName,
      last_name: lastName,
      email: normalizedEmail,
      phone: normalizedPhone,
      message: message || null,
      referred_by_referral_profile_id: referralProfile?.id ?? null,
      referral_discount_percent: referralProfile ? 20 : null,
    });

    // Create a corresponding job so it appears in the dashboard job tracker
    try {
      await jobManager.createJob({
        client_id: null,
        potential_client_id: potentialClient.id,
        job_type: "Demande de soumission",
        status: "submitted",
        location: [0, 0],
        description: message || null,
      });
    } catch (jobError) {
      // Non-fatal — potential client was saved, job link is a best-effort
      console.error("Could not create linked job:", jobError);
    }

    if (referralProfile) {
      try {
        await referralManager.createReferralConversion({
          referral_profile_id: referralProfile.id,
          potential_client_id: potentialClient.id,
          referred_email: normalizedEmail,
          referrer_reward_percent: 20,
          referred_reward_percent: 20,
        });

        await referralManager.incrementReferralCount(referralProfile.id);
      } catch (referralError: any) {
        if (referralError?.code !== "23505") {
          throw referralError;
        }
      }
    }

    // Send email notification
    // EMAIL_FROM is the sender address (must be verified in Resend)
    // EMAIL_TO is where you receive notifications
    // The user's email (from form) is used for the confirmation email
    const emailTo = process.env.EMAIL_TO || "novanet.qc@gmail.com";
    const emailFrom = process.env.EMAIL_FROM || "noreply@novanet.ca";

    try {
      await resend.emails.send({
        from: emailFrom,
        to: emailTo,
        subject: `Nouvelle demande de soumission - ${firstName} ${lastName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #0f1f4b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #0f1f4b; margin-bottom: 5px; display: block; }
                .value { color: #374151; }
                .message-box { background-color: white; padding: 15px; border-left: 4px solid #0f1f4b; margin-top: 10px; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Nouvelle demande de soumission</h1>
                </div>
                <div class="content">
                  <div class="field">
                    <span class="label">Nom complet:</span>
                    <span class="value">${firstName} ${lastName}</span>
                  </div>
                  <div class="field">
                    <span class="label">Email:</span>
                    <span class="value">${email}</span>
                  </div>
                  <div class="field">
                    <span class="label">Téléphone:</span>
                    <span class="value">${normalizedPhone}</span>
                  </div>
                  ${
                    message
                      ? `
                  <div class="field">
                    <span class="label">Message:</span>
                    <div class="message-box">${message.replace(/\n/g, "<br>")}</div>
                  </div>
                  `
                      : ""
                  }
                  <div class="field" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <span class="label">Date de la demande:</span>
                    <span class="value">${new Date().toLocaleString("fr-CA", { dateStyle: "long", timeStyle: "short" })}</span>
                  </div>
                </div>
                <div class="footer">
                  <p>Cette demande a été enregistrée dans votre système de gestion.</p>
                  <p>Nova Net - Service de lavage extérieur</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      // Also send confirmation email to the client
      await resend.emails.send({
        from: emailFrom,
        to: email,
        subject: "Confirmation de votre demande - Nova Net",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #0f1f4b; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Merci pour votre demande!</h1>
                </div>
                <div class="content">
                  <p>Bonjour ${firstName},</p>
                  <p>Nous avons bien reçu votre demande de soumission. Notre équipe va l'examiner et vous contactera dans les plus brefs délais.</p>
                  <p>Nous vous répondrons généralement dans les 24 heures.</p>
                  <p style="margin-top: 30px;">Cordialement,<br><strong>L'équipe Nova Net</strong></p>
                </div>
                <div class="footer">
                  <p>Nova Net - Service professionnel de lavage extérieur</p>
                  <p>Grand Montréal, QC</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError: any) {
      // Log email error but don't fail the request if database save succeeded
      console.error("Error sending email:", emailError);
      // Continue - the form submission was saved to database
    }

    return NextResponse.json({
      success: true,
      message: "Votre demande a été envoyée avec succès!",
      data: potentialClient,
    });
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre demande." },
      { status: 500 },
    );
  }
}
