# Configurar Email de Confirmacao no Supabase via Resend

O email de confirmacao de registro nao chega porque o Supabase usa seu SMTP built-in com rate limit severo e deliverability ruim. A solucao e configurar Custom SMTP apontando para o Resend.

---

## Passo 1: Configurar Custom SMTP no Supabase Dashboard

1. Acesse: **https://supabase.com/dashboard/project/bqpsqzaxzydcfbuneqzf/settings/auth**
2. Role ate **SMTP Settings**
3. Toggle **Enable Custom SMTP** = **ON**
4. Preencha:

| Campo | Valor |
|-------|-------|
| **Sender email** | `noreply@marktracking.com.br` |
| **Sender name** | `PipeFlow` |
| **Host** | `smtp.resend.com` |
| **Port number** | `465` |
| **Minimum interval** | `60` |
| **Username** | `resend` |
| **Password** | _(o mesmo valor da RESEND_API_KEY no .env.local)_ |

5. Clique **Save**

---

## Passo 2: Customizar Email Templates

Acesse: **Authentication > Email Templates** no Supabase Dashboard.

### 2a. Confirm Signup

**Subject:** `Confirme seu e-mail - PipeFlow`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Confirme seu e-mail</title>
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
                <div style="display:inline-block;width:36px;height:36px;background:#CAFF33;border-radius:8px;font-weight:800;font-size:16px;color:#0C0C0E;text-align:center;line-height:36px;">P</div>
              </td>
              <td style="vertical-align:middle;">
                <span style="font-size:15px;font-weight:600;color:#E8E8E8;">PipeFlow</span>
                <span style="display:block;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#555559;margin-top:1px;">CRM</span>
              </td>
            </tr></tbody></table>
          </td></tr>
          <!-- Body -->
          <tr><td style="padding:36px 36px 28px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#F0F0F0;line-height:1.3;">Confirme seu e-mail</p>
            <p style="margin:0 0 24px;font-size:15px;color:#888;line-height:1.6;">
              Obrigado por se cadastrar no PipeFlow! Clique no botao abaixo para confirmar seu endereco de e-mail e ativar sua conta.
            </p>
            <table cellpadding="0" cellspacing="0"><tbody><tr><td>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#CAFF33;color:#0C0C0E;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Confirmar E-mail
              </a>
            </td></tr></tbody></table>
            <p style="margin:20px 0 0;font-size:12px;color:#555559;line-height:1.6;">
              Se voce nao criou uma conta no PipeFlow, pode ignorar este e-mail com seguranca.
            </p>
            <p style="margin:12px 0 0;font-size:11px;color:#444;word-break:break-all;">
              Ou copie este link: <a href="{{ .ConfirmationURL }}" style="color:#666;text-decoration:underline;">{{ .ConfirmationURL }}</a>
            </p>
          </td></tr>
          <!-- Footer -->
          <tr><td style="padding:16px 36px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#444;text-align:center;">
            PipeFlow CRM &middot; Enviado automaticamente, nao responda este e-mail.
          </td></tr>
        </tbody>
      </table>
    </td></tr></tbody>
  </table>
</body>
</html>
```

---

### 2b. Reset Password

**Subject:** `Redefinir senha - PipeFlow`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Redefinir senha</title>
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
                <div style="display:inline-block;width:36px;height:36px;background:#CAFF33;border-radius:8px;font-weight:800;font-size:16px;color:#0C0C0E;text-align:center;line-height:36px;">P</div>
              </td>
              <td style="vertical-align:middle;">
                <span style="font-size:15px;font-weight:600;color:#E8E8E8;">PipeFlow</span>
                <span style="display:block;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#555559;margin-top:1px;">CRM</span>
              </td>
            </tr></tbody></table>
          </td></tr>
          <!-- Body -->
          <tr><td style="padding:36px 36px 28px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#F0F0F0;line-height:1.3;">Redefinir senha</p>
            <p style="margin:0 0 24px;font-size:15px;color:#888;line-height:1.6;">
              Recebemos uma solicitacao para redefinir a senha da sua conta no PipeFlow. Clique no botao abaixo para criar uma nova senha.
            </p>
            <table cellpadding="0" cellspacing="0"><tbody><tr><td>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#CAFF33;color:#0C0C0E;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Redefinir Senha
              </a>
            </td></tr></tbody></table>
            <p style="margin:20px 0 0;font-size:12px;color:#555559;line-height:1.6;">
              Se voce nao solicitou a redefinicao de senha, pode ignorar este e-mail. Sua senha atual permanece inalterada.
            </p>
            <p style="margin:12px 0 0;font-size:11px;color:#444;word-break:break-all;">
              Ou copie este link: <a href="{{ .ConfirmationURL }}" style="color:#666;text-decoration:underline;">{{ .ConfirmationURL }}</a>
            </p>
          </td></tr>
          <!-- Footer -->
          <tr><td style="padding:16px 36px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#444;text-align:center;">
            PipeFlow CRM &middot; Enviado automaticamente, nao responda este e-mail.
          </td></tr>
        </tbody>
      </table>
    </td></tr></tbody>
  </table>
</body>
</html>
```

---

### 2c. Magic Link

**Subject:** `Seu link de acesso - PipeFlow`

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Seu link de acesso</title>
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
                <div style="display:inline-block;width:36px;height:36px;background:#CAFF33;border-radius:8px;font-weight:800;font-size:16px;color:#0C0C0E;text-align:center;line-height:36px;">P</div>
              </td>
              <td style="vertical-align:middle;">
                <span style="font-size:15px;font-weight:600;color:#E8E8E8;">PipeFlow</span>
                <span style="display:block;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#555559;margin-top:1px;">CRM</span>
              </td>
            </tr></tbody></table>
          </td></tr>
          <!-- Body -->
          <tr><td style="padding:36px 36px 28px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#F0F0F0;line-height:1.3;">Entrar no PipeFlow</p>
            <p style="margin:0 0 24px;font-size:15px;color:#888;line-height:1.6;">
              Clique no botao abaixo para acessar sua conta no PipeFlow. Este link e valido por tempo limitado.
            </p>
            <table cellpadding="0" cellspacing="0"><tbody><tr><td>
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#CAFF33;color:#0C0C0E;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Entrar no PipeFlow
              </a>
            </td></tr></tbody></table>
            <p style="margin:20px 0 0;font-size:12px;color:#555559;line-height:1.6;">
              Se voce nao solicitou este link, pode ignorar este e-mail com seguranca.
            </p>
            <p style="margin:12px 0 0;font-size:11px;color:#444;word-break:break-all;">
              Ou copie este link: <a href="{{ .ConfirmationURL }}" style="color:#666;text-decoration:underline;">{{ .ConfirmationURL }}</a>
            </p>
          </td></tr>
          <!-- Footer -->
          <tr><td style="padding:16px 36px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#444;text-align:center;">
            PipeFlow CRM &middot; Enviado automaticamente, nao responda este e-mail.
          </td></tr>
        </tbody>
      </table>
    </td></tr></tbody>
  </table>
</body>
</html>
```

---

## Passo 3: Verificar DNS

Acesse https://resend.com/domains e confirme que `marktracking.com.br` esta com status **Verified** (SPF + DKIM).

---

## Passo 4: Testar

1. Registre uma nova conta com email real
2. Verifique que o email chega de `PipeFlow <noreply@marktracking.com.br>`
3. Verifique o template com branding PipeFlow (dark theme, botao verde-limao)
4. Clique no link de confirmacao → deve redirecionar para `/onboarding`
5. Confira no Resend Dashboard que o email aparece nos logs
