import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { compileFunction } from 'node:vm'
import { test } from 'node:test'
import Stripe from 'stripe'
import ts from 'typescript'

const workspace = { id: 'workspace-fixture', plan: 'free' }
const customer = { id: 'cus_fixture', metadata: { workspaceId: workspace.id } }
const subscription = {
  id: 'sub_fixture', customer: customer.id, metadata: {}, status: 'active',
  items: { data: [{ price: { id: 'price_fixture' }, current_period_end: 2000000000 }] },
}
const webhookSecret = 'fixture-only'
const signer = new Stripe('unused')

// Exercise the actual Next server modules without starting Next or contacting providers.
function loadServerModule(path, imports) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  const exports = {}
  compileFunction(outputText, ['require', 'exports'])((name) => {
    assert.ok(Object.hasOwn(imports, name), name)
    return imports[name]
  }, exports)
  return exports
}

function fixture({ admin = true, remoteCustomer = customer, plan = 'free', sessions = [] } = {}) {
  const calls = []
  const query = {
    select() { return this },
    eq() { return this },
    is() { return this },
    update(changes) { calls.push(changes); return this },
    maybeSingle() {
      return { data: { id: 'row', plan, workspace_id: workspace.id, stripe_customer_id: customer.id,
        stripe_subscription_id: plan === 'free' ? null : subscription.id } }
    },
  }
  const db = { auth: { getUser: () => ({ data: { user: { id: 'admin-fixture' } } }) }, from: () => query }
  const stripe = {
    webhooks: signer.webhooks,
    customers: { retrieve: () => remoteCustomer },
    subscriptions: { retrieve: () => subscription },
    checkout: { sessions: { list: () => ({ data: sessions }), create: () => ({ url: 'checkout' }) } },
    billingPortal: { sessions: { create: () => ({ url: 'portal' }) } },
  }
  const imports = {
    'next/navigation': { redirect: url => { throw new Error('redirect:' + url) } },
    'next/server': { NextResponse: Response },
    '@/lib/supabase/server': { getSupabaseServer: () => db },
    '@/lib/supabase/admin': { getSupabaseAdmin: () => db },
    '@/lib/permissions': { isAdmin: () => admin },
    '@/lib/workspace': { getActiveWorkspace: () => ({ ...workspace, plan }) },
    '@/lib/stripe': { getStripe: () => { calls.push('stripe'); return stripe } },
  }
  return {
    calls, stripe,
    actions: loadServerModule('../src/lib/actions/billing.ts', imports),
    handler: loadServerModule('../src/app/api/webhooks/stripe/route.ts', imports).POST,
  }
}

for (const [action, target] of [['createCheckoutSessionAction', 'checkout'], ['createPortalSessionAction', 'portal']]) {
  test(target + ' requires a workspace admin and a matching Stripe customer', async () => {
    const member = fixture({ admin: false })
    assert.ok((await member.actions[action]()).error)
    assert.deepEqual(member.calls, [])
    const mismatch = fixture({ remoteCustomer: { ...customer, metadata: { workspaceId: 'other' } } })
    assert.ok((await mismatch.actions[action]()).error)
    await assert.rejects(fixture().actions[action], new RegExp('redirect:' + target))
  })
}

test('checkout resumes an open session and refuses a workspace recovering payment', async () => {
  const open = { id: 'cs_fixture', mode: 'subscription', status: 'open', url: 'resume', metadata: customer.metadata }
  await assert.rejects(fixture({ sessions: [open] }).actions.createCheckoutSessionAction, /redirect:resume/)
  assert.ok((await fixture({ plan: 'payment_failed' }).actions.createCheckoutSessionAction()).error)
})

test('webhook requires a signature, Stripe ownership and the configured price', async () => {
  process.env.STRIPE_WEBHOOK_SECRET = webhookSecret
  process.env.STRIPE_PRO_PRICE_ID = 'price_fixture'
  const event = { id: 'evt_fixture', type: 'checkout.session.completed', data: { object: {
    mode: 'subscription', customer: customer.id, subscription: subscription.id, metadata: customer.metadata,
  } } }
  const body = JSON.stringify(event)
  function request(secret) {
    const signature = signer.webhooks.generateTestHeaderString({ payload: body, secret })
    return new Request('http://localhost/', { method: 'POST', body, headers: { 'stripe-signature': signature } })
  }

  const ok = fixture()
  assert.equal((await ok.handler(request('wrong-fixture'))).status, 400)
  assert.equal((await ok.handler(request(webhookSecret))).status, 200)
  assert.deepEqual(ok.calls.filter(v => typeof v === 'object').map(v => v.plan), ['pro'])

  const mismatch = fixture({ remoteCustomer: { ...customer, metadata: {} } })
  await mismatch.handler(request(webhookSecret))
  assert.ok(mismatch.calls.every(v => typeof v === 'string'))
  const wrongPrice = fixture()
  wrongPrice.stripe.subscriptions.retrieve = () => ({ ...subscription, items: { data: [] } })
  await wrongPrice.handler(request(webhookSecret))
  assert.ok(wrongPrice.calls.every(v => typeof v === 'string'))
})
