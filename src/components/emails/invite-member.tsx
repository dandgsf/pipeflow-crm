interface InviteMemberEmailProps {
  workspaceName: string;
  inviteUrl: string;
  role: string;
}

export function inviteMemberHtml({
  workspaceName,
  inviteUrl,
  role,
}: InviteMemberEmailProps): string {
  const roleLabel = role === "admin" ? "administrador" : "membro";

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:'Inter','Helvetica Neue',Arial,sans-serif;background-color:#0A0A0F;">
  <div style="padding:40px 20px;">
    <div style="max-width:480px;margin:0 auto;background-color:#12121A;border-radius:12px;border:1px solid #1E1E2E;overflow:hidden;">
      <div style="padding:32px 32px 24px;border-bottom:1px solid #1E1E2E;">
        <div style="font-size:20px;font-weight:700;color:#00E5A0;letter-spacing:-0.02em;">
          Pipe<span style="color:#E0E0E6;">Flow</span>
        </div>
      </div>
      <div style="padding:32px;">
        <h1 style="font-size:20px;font-weight:600;color:#E0E0E6;margin:0 0 16px;line-height:1.4;">
          Você foi convidado!
        </h1>
        <p style="font-size:15px;color:#9999A8;line-height:1.6;margin:0 0 24px;">
          Você foi convidado como <strong style="color:#E0E0E6;">${roleLabel}</strong> para
          o workspace <strong style="color:#E0E0E6;">${workspaceName}</strong> no PipeFlow CRM.
        </p>
        <a href="${inviteUrl}" style="display:inline-block;background-color:#00E5A0;color:#0A0A0F;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;letter-spacing:-0.01em;">
          Aceitar convite
        </a>
        <p style="font-size:13px;color:#666674;line-height:1.5;margin:24px 0 0;">
          Se você não esperava este convite, pode ignorar este e-mail.
        </p>
      </div>
      <div style="padding:20px 32px;border-top:1px solid #1E1E2E;">
        <p style="font-size:12px;color:#4A4A58;margin:0;">PipeFlow CRM</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
