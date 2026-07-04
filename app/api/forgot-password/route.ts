import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import {
  collection, query, where, getDocs,
  doc, setDoc, serverTimestamp
} from 'firebase/firestore';
import { Resend } from 'resend';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required' },
        { status: 400 }
      );
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    // Search both citizens and responders
    const [citizenSnap, responderSnap] = await Promise.all([
      getDocs(query(collection(db, 'users'), where('phone', '==', cleanPhone))),
      getDocs(query(collection(db, 'responders'), where('phone', '==', cleanPhone))),
    ]);

    let userId = null;
    let userEmail = null;
    let userName = null;

    if (!citizenSnap.empty) {
      const user = citizenSnap.docs[0];
      userId = user.id;
      userEmail = user.data().email;
      userName = user.data().name;
    } else if (!responderSnap.empty) {
      const user = responderSnap.docs[0];
      userId = user.id;
      userEmail = user.data().email;
      userName = user.data().name;
    }

    // Don't reveal whether phone exists or not — security best practice
    if (!userId) {
      return NextResponse.json({ success: true });
    }

    if (!userEmail) {
      return NextResponse.json(
        {
          error: 'no_email',
          message: 'No email address on file for this account.',
        },
        { status: 400 }
      );
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token to Firestore with 15-minute expiry
    await setDoc(doc(db, 'passwordResets', token), {
      userId,
      phone: cleanPhone,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      used: false,
    });

    // Send reset email via Resend
    await resend.emails.send({
      from: 'Siren <noreply@siren.ng>',
      to: userEmail,
      subject: 'Reset your Siren password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #111111; color: #ffffff; padding: 32px; border-radius: 16px;">
          
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
            <div style="width: 40px; height: 40px; background: #cc0000; border-radius: 10px;"></div>
            <span style="font-size: 20px; font-weight: 900; letter-spacing: 1px;">Siren</span>
          </div>

          <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 8px; color: #ffffff;">
            Reset your password
          </h2>
          <p style="color: #888888; margin-bottom: 24px; line-height: 1.6;">
            Hi ${userName || 'there'}, we received a request to reset your Siren password.
          </p>

          
            href="https://siren.ng/reset?token=${token}"
            style="display: block; background: #cc0000; color: #ffffff; text-align: center; padding: 16px 24px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 16px; margin-bottom: 24px;"
          >
            Reset Password
          </a>

          <p style="color: #555555; font-size: 13px; margin-bottom: 8px;">
            ⏱️ This link expires in <strong style="color: #ffffff;">15 minutes</strong>.
          </p>
          <p style="color: #555555; font-size: 13px; margin-bottom: 32px;">
            If you didn't request this, ignore this email — your password won't change.
          </p>

          <hr style="border: none; border-top: 1px solid #222222; margin-bottom: 24px;" />

          <p style="color: #333333; font-size: 11px; text-align: center;">
            Siren — Nigeria's Emergency Response Network · 
            <a href="https://siren.ng" style="color: #cc0000; text-decoration: none;">siren.ng</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.log('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}