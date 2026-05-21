import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Safeguard: Check if the key exists before initializing
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is missing in environment variables");
    return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
  }

  // 2. Initialize inside the function to prevent build-time errors
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { type, to, orgName, responderName, reason } = await request.json();

    let subject = '';
    let html = '';

    if (type === 'org_approved') {
      subject = 'Your ResQ Organisation Has Been Approved';
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111111; color: #ffffff; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 48px; height: 48px; background: #cc0000; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            </div>
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">ResQ</h1>
          </div>
          <h2 style="color: #ffffff; font-size: 20px;">Organisation Approved!</h2>
          <p style="color: #888888; line-height: 1.6;">
            Congratulations! <strong style="color: #ffffff;">${orgName}</strong> has been verified and approved on ResQ.
          </p>
          <p style="color: #888888; line-height: 1.6;">
            You can now login to your dashboard, add your personnel and start responding to emergencies across Nigeria.
          </p>
          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #cc0000;">
            <p style="color: #ffffff; margin: 0; font-weight: bold;">Next steps:</p>
            <p style="color: #888888; margin: 8px 0 0;">1. Login to your portal at resq-portal.vercel.app</p>
            <p style="color: #888888; margin: 4px 0 0;">2. Find your organisation code in Settings</p>
            <p style="color: #888888; margin: 4px 0 0;">3. Share the code with your personnel to join</p>
          </div>
          <a href="https://resq-portal.vercel.app/login" style="display: inline-block; background: #cc0000; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Login to Portal
          </a>
          <p style="color: #555555; font-size: 12px; margin-top: 32px;">
            ResQ — Nigeria's Emergency Response Network
          </p>
        </div>
      `;
    }

    if (type === 'org_rejected') {
      subject = 'ResQ Organisation Registration Update';
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111111; color: #ffffff; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">ResQ</h1>
          </div>
          <h2 style="color: #ffffff; font-size: 20px;">Registration Update</h2>
          <p style="color: #888888; line-height: 1.6;">
            Thank you for registering <strong style="color: #ffffff;">${orgName}</strong> on ResQ.
          </p>
          <p style="color: #888888; line-height: 1.6;">
            After reviewing your application, we are unable to approve your organisation at this time.
          </p>
          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #cc0000;">
            <p style="color: #ffffff; margin: 0; font-weight: bold;">Reason:</p>
            <p style="color: #888888; margin: 8px 0 0;">${reason}</p>
          </div>
          <p style="color: #888888; line-height: 1.6;">
            You are welcome to reapply after addressing the issues mentioned above.
          </p>
          <a href="https://resq-portal.vercel.app/register" style="display: inline-block; background: #cc0000; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Reapply
          </a>
          <p style="color: #555555; font-size: 12px; margin-top: 32px;">
            ResQ — Nigeria's Emergency Response Network
          </p>
        </div>
      `;
    }

    if (type === 'responder_approved') {
      subject = 'Your ResQ Responder Account Has Been Approved';
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111111; color: #ffffff; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">ResQ</h1>
          </div>
          <h2 style="color: #ffffff; font-size: 20px;">You are now a verified responder!</h2>
          <p style="color: #888888; line-height: 1.6;">
            Congratulations <strong style="color: #ffffff;">${responderName}</strong>! Your responder account has been verified and approved.
          </p>
          <p style="color: #888888; line-height: 1.6;">
            You can now open the ResQ app, toggle your availability on and start receiving emergency alerts near you.
          </p>
          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #cc0000;">
            <p style="color: #ffffff; margin: 0; font-weight: bold;">Getting started:</p>
            <p style="color: #888888; margin: 8px 0 0;">1. Open the ResQ app</p>
            <p style="color: #888888; margin: 4px 0 0;">2. Login with your phone number and password</p>
            <p style="color: #888888; margin: 4px 0 0;">3. Toggle availability ON to start receiving alerts</p>
          </div>
          <p style="color: #555555; font-size: 12px; margin-top: 32px;">
            ResQ — Nigeria's Emergency Response Network
          </p>
        </div>
      `;
    }

    if (type === 'responder_rejected') {
      subject = 'ResQ Responder Application Update';
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111111; color: #ffffff; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">ResQ</h1>
          </div>
          <h2 style="color: #ffffff; font-size: 20px;">Application Update</h2>
          <p style="color: #888888; line-height: 1.6;">
            Thank you for applying as a responder on ResQ, <strong style="color: #ffffff;">${responderName}</strong>.
          </p>
          <p style="color: #888888; line-height: 1.6;">
            After reviewing your application, we are unable to approve your account at this time.
          </p>
          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #cc0000;">
            <p style="color: #ffffff; margin: 0; font-weight: bold;">Reason:</p>
            <p style="color: #888888; margin: 8px 0 0;">${reason}</p>
          </div>
          <p style="color: #888888; line-height: 1.6;">
            You are welcome to reapply after addressing the issues mentioned above.
          </p>
          <p style="color: #555555; font-size: 12px; margin-top: 32px;">
            ResQ — Nigeria's Emergency Response Network
          </p>
        </div>
      `;
    }

    const data = await resend.emails.send({
      from: 'ResQ <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    });

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    // 3. Safer error handling for JSON serialization
    console.error("Email sending failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to send email" }, { status: 500 });
  }
}