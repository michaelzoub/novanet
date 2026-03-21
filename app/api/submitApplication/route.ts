import { NextResponse } from "next/server";
import { jobApplicationManager } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      message,
      cvFileName,
      cvFileType,
      cvFileData,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !cvFileData) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être remplis." },
        { status: 400 },
      );
    }

    // Create job application in database
    const jobApplication = await jobApplicationManager.createJobApplication({
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      position: position || "Non spécifié",
      message: message || null,
      cv_file_name: cvFileName,
      cv_file_type: cvFileType,
      cv_file_url: null, // Could store Supabase Storage URL here if using storage
    });

    // Send email notification
    const emailTo = process.env.EMAIL_TO || "novanet.qc@gmail.com";
    const emailFrom = process.env.EMAIL_FROM || "noreply@novanet.ca";

    try {
      await resend.emails.send({
        from: emailFrom,
        to: emailTo,
        subject: `Nouvelle candidature - ${firstName} ${lastName}${position ? ` - ${position}` : ""}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #0f1f4b; margin-bottom: 5px; display: block; }
                .value { color: #374151; }
                .message-box { background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin-top: 10px; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                .cv-info { background-color: #eff6ff; padding: 15px; border-radius: 6px; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Nouvelle candidature</h1>
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
                    <span class="value">${phone}</span>
                  </div>
                  ${
                    position
                      ? `
                  <div class="field">
                    <span class="label">Poste recherché:</span>
                    <span class="value">${position}</span>
                  </div>
                  `
                      : ""
                  }
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
                  <div class="field">
                    <span class="label">CV:</span>
                    <div class="cv-info">
                      <strong>${cvFileName}</strong><br>
                      Type: ${cvFileType}<br>
                      <em>Le CV est joint à cet email en pièce jointe.</em>
                    </div>
                  </div>
                  <div class="field" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <span class="label">Date de la candidature:</span>
                    <span class="value">${new Date().toLocaleString("fr-CA", { dateStyle: "long", timeStyle: "short" })}</span>
                  </div>
                </div>
                <div class="footer">
                  <p>Cette candidature a été enregistrée dans votre système de gestion.</p>
                  <p>Nova Net - Service de lavage extérieur</p>
                </div>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: cvFileName,
            content: cvFileData.split(",")[1], // Remove data:type;base64, prefix
          },
        ],
      });

      // Send confirmation email to applicant
      await resend.emails.send({
        from: emailFrom,
        to: email,
        subject: "Confirmation de réception - Candidature Nova Net",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Merci pour votre candidature!</h1>
                </div>
                <div class="content">
                  <p>Bonjour ${firstName},</p>
                  <p>Nous avons bien reçu votre candidature${position ? ` pour le poste de <strong>${position}</strong>` : ""}.</p>
                  <p>Notre équipe va examiner votre profil et nous vous contacterons si votre candidature correspond à nos besoins.</p>
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
      // Continue - the application was saved to database
    }

    return NextResponse.json({
      success: true,
      message: "Votre candidature a été envoyée avec succès!",
      data: jobApplication,
    });
  } catch (error: any) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de l'envoi de votre candidature.",
      },
      { status: 500 },
    );
  }
}
