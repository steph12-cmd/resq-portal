import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as admin from '../../lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and password required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Look up the token in Firestore
    const resetDoc = await getDoc(doc(db, 'passwordResets', token));

    if (!resetDoc.exists()) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    const resetData = resetDoc.data();

    // Check if already used
    if (resetData.used) {
      return NextResponse.json(
        { error: 'This reset link has already been used' },
        { status: 400 }
      );
    }

    // Check if expired
    const expiresAt = resetData.expiresAt?.toDate
      ? resetData.expiresAt.toDate()
      : new Date(resetData.expiresAt);

    if (new Date() > expiresAt) {
      return NextResponse.json(
        { error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Update password in Firebase Auth using Admin SDK
    const auth = (admin.getAuth?.() ?? admin.auth?.()) as any;
    if (!auth) {
      return NextResponse.json({ error: 'Auth initialization failed' }, { status: 500 });
    }

    await auth.updateUser(resetData.userId, {
      password: newPassword,
    });

    // Mark token as used so it can't be reused
    await updateDoc(doc(db, 'passwordResets', token), {
      used: true,
      usedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}