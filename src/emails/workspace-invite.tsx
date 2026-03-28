interface WorkspaceInviteEmailProps {
  workspaceName: string
  inviterEmail: string
  role: 'admin' | 'member'
  acceptUrl: string
  expiresInDays?: number
}

/**
 * Retorna o HTML do e-mail de convite como string pura.
 * Não usa react-dom/server — compatível com Server Actions e Turbopack.
 */
export function renderWorkspaceInviteEmail(props: WorkspaceInviteEmailProps): string {
  const { workspaceName, inviterEmail, role, acceptUrl, expiresInDays = 7 } = props
  const roleLabel = role === 'admin' ? 'Administrador' : 'Membro'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Convite para ${workspaceName}</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'DM Sans','Helvetica Neue',Arial,sans-serif;color:#F0F0F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 16px;">
    <tbody><tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111111;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <tbody>
          <!-- Header -->
          <tr><td style="padding:28px 36px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <table cellpadding="0" cellspacing="0"><tbody><tr>
              <td style="vertical-align:middle;padding-right:10px;">
                <div style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#CAFF33;border-radius:8px;font-weight:800;font-size:16px;color:#0C0C0E;">P</div>
              </td>
              <td style="vertical-align:middle;">
                <span style="font-size:15px;font-weight:600;color:#E8E8E8;">PipeFlow</span>
                <span style="display:block;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#555559;margin-top:1px;">CRM</span>
              </td>
            </tr></tbody></table>
          </td></tr>
          <!-- Body -->
          <tr><td style="padding:36px 36px 28px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#F0F0F0;line-height:1.3;">Você foi convidado</p>
            <p style="margin:0 0 24px;font-size:15px;color:#888;line-height:1.6;">
              <strong style="color:#C8C8C8;">${inviterEmail}</strong> convidou você para colaborar no workspace
              <strong style="color:#C8C8C8;"> ${workspaceName}</strong> como
              <span style="display:inline-block;background:rgba(202,255,51,0.12);color:#CAFF33;border-radius:4px;padding:1px 8px;font-size:12px;font-weight:600;margin-left:4px;">${roleLabel}</span>.
            </p>
            <table cellpadding="0" cellspacing="0"><tbody><tr><td>
              <a href="${acceptUrl}" style="display:inline-block;background:#CAFF33;color:#0C0C0E;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Aceitar Convite
              </a>
            </td></tr></tbody></table>
            <p style="margin:20px 0 0;font-size:12px;color:#555559;line-height:1.6;">
              Este convite expira em ${expiresInDays} dias. Se você não esperava este e-mail, pode ignorá-lo com segurança.
            </p>
            <p style="margin:12px 0 0;font-size:11px;color:#444;word-break:break-all;">
              Ou copie este link: <a href="${acceptUrl}" style="color:#666;text-decoration:underline;">${acceptUrl}</a>
            </p>
          </td></tr>
          <!-- Footer -->
          <tr><td style="padding:16px 36px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#444;text-align:center;">
            PipeFlow CRM · Enviado automaticamente, não responda este e-mail.
          </td></tr>
        </tbody>
      </table>
    </td></tr></tbody>
  </table>
</body>
</html>`
}

// Mantém o componente React para uso eventual com @react-email/render
export function WorkspaceInviteEmail({
  workspaceName,
  inviterEmail,
  role,
  acceptUrl,
  expiresInDays = 7,
}: WorkspaceInviteEmailProps) {
  const roleLabel = role === 'admin' ? 'Administrador' : 'Membro'

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Convite para {workspaceName}</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#0A0A0A',
          fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
          color: '#F0F0F0',
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: '#0A0A0A', padding: '40px 16px' }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    maxWidth: '560px',
                    backgroundColor: '#111111',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          padding: '28px 36px 24px',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <table cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td>
                                {/* Logo mark */}
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '36px',
                                    height: '36px',
                                    backgroundColor: '#CAFF33',
                                    borderRadius: '8px',
                                    fontWeight: 800,
                                    fontSize: '16px',
                                    color: '#0C0C0E',
                                    verticalAlign: 'middle',
                                    marginRight: '10px',
                                  }}
                                >
                                  P
                                </div>
                              </td>
                              <td style={{ verticalAlign: 'middle' }}>
                                <span
                                  style={{
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: '#E8E8E8',
                                    letterSpacing: '-0.01em',
                                  }}
                                >
                                  PipeFlow
                                </span>
                                <span
                                  style={{
                                    display: 'block',
                                    fontSize: '9px',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: '#555559',
                                    marginTop: '1px',
                                  }}
                                >
                                  CRM
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: '36px 36px 28px' }}>
                        <p
                          style={{
                            margin: '0 0 8px',
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#F0F0F0',
                            lineHeight: 1.3,
                          }}
                        >
                          Você foi convidado
                        </p>
                        <p
                          style={{
                            margin: '0 0 24px',
                            fontSize: '15px',
                            color: '#888',
                            lineHeight: 1.6,
                          }}
                        >
                          <strong style={{ color: '#C8C8C8' }}>{inviterEmail}</strong> convidou
                          você para colaborar no workspace{' '}
                          <strong style={{ color: '#C8C8C8' }}>{workspaceName}</strong> como{' '}
                          <span
                            style={{
                              display: 'inline-block',
                              backgroundColor: 'rgba(202,255,51,0.12)',
                              color: '#CAFF33',
                              borderRadius: '4px',
                              padding: '1px 8px',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {roleLabel}
                          </span>
                          .
                        </p>

                        {/* CTA */}
                        <table cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td>
                                <a
                                  href={acceptUrl}
                                  style={{
                                    display: 'inline-block',
                                    backgroundColor: '#CAFF33',
                                    color: '#0C0C0E',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    padding: '12px 28px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    letterSpacing: '-0.01em',
                                  }}
                                >
                                  Aceitar Convite
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p
                          style={{
                            margin: '20px 0 0',
                            fontSize: '12px',
                            color: '#555559',
                            lineHeight: 1.6,
                          }}
                        >
                          Este convite expira em {expiresInDays} dias. Se você não esperava este
                          e-mail, pode ignorá-lo com segurança.
                        </p>

                        {/* URL fallback */}
                        <p
                          style={{
                            margin: '12px 0 0',
                            fontSize: '11px',
                            color: '#444',
                            wordBreak: 'break-all',
                          }}
                        >
                          Ou copie este link:{' '}
                          <a href={acceptUrl} style={{ color: '#666', textDecoration: 'underline' }}>
                            {acceptUrl}
                          </a>
                        </p>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          padding: '16px 36px',
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          fontSize: '11px',
                          color: '#444',
                          textAlign: 'center',
                        }}
                      >
                        PipeFlow CRM · Enviado automaticamente, não responda este e-mail.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}
