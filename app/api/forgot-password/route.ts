import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import {
  collection, query, where, getDocs,
  doc, setDoc, serverTimestamp
} from 'firebase/firestore';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    // Clean the phone number the same way the app does
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

    if (!userId) {
      // Don't reveal if phone exists or not — security best practice
      return NextResponse.json({ success: true });
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'no_email', message: 'No email address on file for this account.' },
        { status: 400 }
      );
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Store in Firestore with 15-minute expiry
    await setDoc(doc(db, 'passwordResets', token), {
      userId,
      phone: cleanPhone,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      used: false,
    });

    // Send reset email via Resend
    await resend.emails.send({
      from: 'Siren <noreply@siren.ng>',
      to: userEmail,
      subject: 'Reset your Siren password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #111; color: #fff; padding: 32px; border-radius: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
            <div style="width: 40px; height: 40px; background: #cc0000; border-radius: 10px;"></div>
            <span style="font-size: 20px; font-weight: 900; letter-spacing: 1px;">Siren</span>
          </div>
          <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #888; margin-bottom: 24px;">Hi ${userName || 'there'}, we received a request to reset your Siren password.</p>
          <a href="https://siren.ng/reset?token=${token}"
             style="display: block; background: #cc0000; color: white; text-align: center; padding: 16px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 16px; margin-bottom: 24px;">
            Reset Password
          </a>
          <p style="color: #555; font-size: 12px; margin-bottom: 8px;">This link expires in 15 minutes.</p>
          <p style="color: #555; font-size: 12px;">If you didn't request this, ignore this email — your password won't change.</p>
          <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;">
          <p style="color: #333; font-size: 11px;">Siren — Nigeria's Emergency Response Network</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}