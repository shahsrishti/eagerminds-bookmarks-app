import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, handle: string) {
  try {
    const data = await resend.emails.send({
      from: 'Eagerminds <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Eagerminds Bookmarks!',
      html: `
        <div>
          <h1>Welcome, @${handle}!</h1>
          <p>Thanks for joining Eagerminds Bookmarks. We're excited to have you on board.</p>
          <p>You can now start saving and organizing your favorite bookmarks, and share your public profile at /${handle}.</p>
          <br />
          <p>Best,</p>
          <p>The Eagerminds Team</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
