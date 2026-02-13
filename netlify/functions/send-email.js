// netlify/functions/send-email.js
// Sends emails via Resend API for invitations and notes

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Email service not configured' }) };
  }

  try {
    const { type, to, toName, senderName, senderEmail, message, inviteLink } = JSON.parse(event.body);

    if (!type || !to) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields: type, to' }) };
    }

    const FROM_ADDRESS = 'WhoDoIKnowThat <noreply@yogateachingtools.com>';
    let subject, html;

    if (type === 'invite') {
      subject = `${senderName} invited you to join WhoDoIKnowThat`;
      html = buildInviteEmail({ toName, senderName, inviteLink });
    } else if (type === 'note') {
      subject = `${senderName} sent you a note on WhoDoIKnowThat`;
      html = buildNoteEmail({ toName, senderName, senderEmail, message });
    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email type. Use "invite" or "note".' }) };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        subject,
        html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', result);
      return { statusCode: response.status, headers, body: JSON.stringify({ error: result.message || 'Email send failed' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, id: result.id }) };

  } catch (err) {
    console.error('Send email error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

function buildInviteEmail({ toName, senderName, inviteLink }) {
  const greeting = toName ? `Hi ${toName},` : 'Hi,';
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:520px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg, #f59e0b, #f97316); padding:32px 24px; text-align:center;">
      <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">You're Invited!</h1>
    </div>
    <div style="padding:32px 24px;">
      <p style="color:#334155; font-size:15px; line-height:1.6; margin:0 0 16px;">${greeting}</p>
      <p style="color:#334155; font-size:15px; line-height:1.6; margin:0 0 16px;">
        <strong>${senderName}</strong> thinks you'd be a great addition to <strong>WhoDoIKnowThat</strong> — a platform that helps people discover expertise within their professional networks.
      </p>
      <p style="color:#334155; font-size:15px; line-height:1.6; margin:0 0 24px;">
        Join to connect with ${senderName} and make your skills discoverable to people in your network.
      </p>
      <div style="text-align:center; margin:24px 0;">
        <a href="${inviteLink}" style="display:inline-block; background:linear-gradient(135deg, #f59e0b, #f97316); color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:12px; font-size:15px; font-weight:600;">Join Now</a>
      </div>
      <p style="color:#94a3b8; font-size:12px; line-height:1.5; margin:24px 0 0; text-align:center;">
        If the button doesn't work, copy this link:<br/>
        <a href="${inviteLink}" style="color:#f59e0b; word-break:break-all;">${inviteLink}</a>
      </p>
    </div>
    <div style="padding:16px 24px; background:#f8fafc; text-align:center;">
      <p style="color:#94a3b8; font-size:11px; margin:0;">WhoDoIKnowThat — Discover expertise in your network</p>
    </div>
  </div>
</body>
</html>`;
}

function buildNoteEmail({ toName, senderName, senderEmail, message }) {
  const greeting = toName ? `Hi ${toName},` : 'Hi,';
  // Escape HTML in the user-provided message
  const safeMessage = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:520px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg, #3b82f6, #6366f1); padding:32px 24px; text-align:center;">
      <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">New Note</h1>
    </div>
    <div style="padding:32px 24px;">
      <p style="color:#334155; font-size:15px; line-height:1.6; margin:0 0 16px;">${greeting}</p>
      <p style="color:#334155; font-size:15px; line-height:1.6; margin:0 0 20px;">
        <strong>${senderName}</strong> sent you a note on WhoDoIKnowThat:
      </p>
      <div style="background:#f1f5f9; border-left:4px solid #3b82f6; border-radius:8px; padding:16px 20px; margin:0 0 24px;">
        <p style="color:#334155; font-size:15px; line-height:1.6; margin:0;">${safeMessage}</p>
      </div>
      <p style="color:#64748b; font-size:13px; line-height:1.5; margin:0 0 4px;">
        You can reply to ${senderName} directly at <a href="mailto:${senderEmail}" style="color:#3b82f6;">${senderEmail}</a>, or log in to the platform to send a note back.
      </p>
    </div>
    <div style="padding:16px 24px; background:#f8fafc; text-align:center;">
      <p style="color:#94a3b8; font-size:11px; margin:0;">WhoDoIKnowThat — Discover expertise in your network</p>
    </div>
  </div>
</body>
</html>`;
}
