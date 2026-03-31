-- ============================================================
-- 014_seed_withcode_startup.sql
-- Dados de demonstração para o workspace "WithCode StartUp"
-- 50 leads + 30 deals distribuídos em todas as stages.
--
-- WORKSPACE ALVO:
--   UUID: a4c0bbe1-3290-4d02-ad7d-b6c785a7612e
--   Nome: WithCode StartUp
--   Slug: withcode-startup-tz0g
--
-- COMO EXECUTAR:
--   Supabase Dashboard → SQL Editor → cole e execute.
--
-- IDEMPOTÊNCIA:
--   Usa ON CONFLICT DO NOTHING — seguro para re-executar.
--   Para limpar: DELETE FROM leads WHERE notes LIKE '%[seed-withcode]%';
--   (deals são removidos em cascata via FK)
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_workspace_id  UUID := 'a4c0bbe1-3290-4d02-ad7d-b6c785a7612e';
  v_owner_id      UUID;
  v_lead_ids      UUID[];
  v_i             INT;
  v_lead_id       UUID;
  v_stage         TEXT;
  v_position      INT;

  -- Arrays de nomes brasileiros (diferentes do seed 011)
  names           TEXT[] := ARRAY[
    'Thiago Bernardo','Larissa Monteiro','André Cavalcanti',
    'Beatriz Nogueira','Caio Henrique Duarte','Débora Pimentel',
    'Emanuel Farias','Flávia Rezende','Guilherme Teixeira',
    'Helena Proença','Igor Saraiva','Joana D''Arc Lima',
    'Kevin Albuquerque','Letícia Fontes','Miguel Ângelo Reis',
    'Nathália Bittencourt','Otávio Magalhães','Priscila Andrade',
    'Roberto Sampaio','Sabrina Lacerda','Thales Drummond',
    'Valéria Pacheco','Wesley Alencar','Ximena Salgado',
    'Yago Pinheiro','Zilda Moraes','Amanda Barreto',
    'Bryan Quaresma','Cecília Viana','Davi Lucca Esteves',
    'Elisa Furtado','Fernando Brandão','Gisele Mattos',
    'Hugo Leonardo Sena','Ingrid Carvalho','Jefferson Coelho',
    'Kamila Trindade','Leandro Bonfim','Milena Assis',
    'Nicolas Fragoso','Olga Siqueira','Pablo Henrique Maia',
    'Queila Drummond','Rodrigo Valente','Silvana Guedes',
    'Tadeu Mesquita','Úrsula Parente','Vagner Coutinho',
    'Walquíria Bastos','Yuri Medeiros'
  ];

  companies       TEXT[] := ARRAY[
    'ByteWave Tech','Innova Labs','CloudSync Brasil','DataVerse',
    'AgileSpark','NeoLogic Systems','Quantum Dev','SmartFlow TI',
    'Vertex Soluções','Impulso Digital','RapidScale','InfoBridge',
    'Athena Consultoria','PrimeCode','Centauri Software','Elevate IT',
    'HyperNode','Codex Sistemas','Bitwise Solutions','Turbo Sistemas',
    'Fusion Analytics','NetPrime','Pivotal Tech','GridForce',
    'Altus Engenharia','Lumen Criativa','SkyLab Digital','Pragma Dev',
    'Optic Solutions','Vektora','TrueNorth IT','FlexBase',
    'Maple Ventures','Ponto Digital','Synaptic AI','ClearStack',
    'Aura Marketing','Rocket Commerce','Zetta Labs','Fluxo Sistemas',
    'Integra Hub','Cosmos Dev','Stratton Consulting','Nimbus Cloud',
    'Cipher Security','WarpDrive Tech','Epoch Fintech','Tangent Labs',
    'Orion Platforms','Summit Digital'
  ];

  positions       TEXT[] := ARRAY[
    'CEO','CTO','Diretor Comercial','Gerente de TI','Head of Sales',
    'Diretor de Marketing','Analista de Negócios','Sócio-fundador',
    'VP de Operações','Coordenador de Projetos','Head of Product',
    'Gerente Financeiro'
  ];

  lead_statuses   TEXT[] := ARRAY[
    'novo','novo','contato','contato','proposta',
    'negociacao','ganho','ganho','perdido','contato'
  ];

  pipeline_stages TEXT[] := ARRAY[
    'novo_lead','novo_lead','novo_lead',
    'contato_realizado','contato_realizado',
    'proposta_enviada','proposta_enviada',
    'negociacao','negociacao',
    'fechado_ganho','fechado_ganho',
    'fechado_perdido'
  ];

  deal_titles     TEXT[] := ARRAY[
    'Plataforma de Agendamento','Chatbot com IA','Sistema de Gestão',
    'App de Delivery','Portal de RH','Automação de Marketing',
    'Painel de BI','Integração ERP-CRM','E-commerce B2B',
    'Migração para Cloud','Consultoria DevOps','MVP SaaS',
    'Sistema de Tickets','Plataforma de Ensino EAD','Gateway de Pagamentos',
    'Módulo de Estoque','White-label App','Setup Kubernetes',
    'Auditoria de Segurança','Otimização de SEO',
    'Redesign UX/UI','Projeto de Data Lake','API Gateway',
    'Plataforma de Eventos','Contrato de Suporte Anual'
  ];

BEGIN
  -- Verifica se o workspace existe
  IF NOT EXISTS (SELECT 1 FROM workspaces WHERE id = v_workspace_id) THEN
    RAISE EXCEPTION 'Workspace a4c0bbe1-3290-4d02-ad7d-b6c785a7612e não encontrado.';
  END IF;

  -- Resolve owner_id (primeiro admin do workspace)
  SELECT user_id INTO v_owner_id
  FROM workspace_members
  WHERE workspace_id = v_workspace_id
    AND role = 'admin'
  ORDER BY created_at
  LIMIT 1;

  IF v_owner_id IS NULL THEN
    -- Fallback: qualquer membro
    SELECT user_id INTO v_owner_id
    FROM workspace_members
    WHERE workspace_id = v_workspace_id
    ORDER BY created_at
    LIMIT 1;
  END IF;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum membro encontrado no workspace. Adicione um membro antes de executar.';
  END IF;

  RAISE NOTICE 'Workspace: % (WithCode StartUp)', v_workspace_id;
  RAISE NOTICE 'Owner: %', v_owner_id;

  -- ── Inserir 50 Leads ──────────────────────────────────────
  v_lead_ids := ARRAY[]::UUID[];

  FOR v_i IN 1..50 LOOP
    v_lead_id := gen_random_uuid();
    v_lead_ids := array_append(v_lead_ids, v_lead_id);

    INSERT INTO leads (
      id, workspace_id, name, email, phone, company,
      position, status, owner_id, estimated_value, notes,
      created_at, updated_at
    )
    VALUES (
      v_lead_id,
      v_workspace_id,
      names[v_i],
      -- Email: nome normalizado + index @ empresa normalizada
      lower(regexp_replace(
        translate(names[v_i],
          'ÁÀÃÂÉÊÍÓÔÕÚÜÇáàãâéêíóôõúüç ''',
          'AAAAEEIOOOUUCaaaaeeiooouuc--'),
        '[^a-z0-9\-]', '', 'g'
      )) || '.' || v_i || '@' || lower(regexp_replace(
        translate(companies[v_i],
          'ÁÀÃÂÉÊÍÓÔÕÚÜÇáàãâéêíóôõúüç ',
          'AAAAEEIOOOUUCaaaaeeiooouuc-'),
        '[^a-z0-9\-]', '', 'g'
      )) || '.com.br',
      -- Telefone: (11) 9XXXX-XXXX com variação
      '(11) 9' || lpad(((v_i * 2137 + 5309) % 10000)::TEXT, 4, '0')
              || '-' || lpad(((v_i * 4271 + 6917) % 10000)::TEXT, 4, '0'),
      companies[v_i],
      positions[((v_i - 1) % array_length(positions, 1)) + 1],
      lead_statuses[((v_i - 1) % array_length(lead_statuses, 1)) + 1],
      v_owner_id,
      -- Valor estimado: R$5k–R$200k
      round((5000 + (v_i * 4217 % 195000))::NUMERIC, -2),
      '[seed-withcode] Lead de demonstração #' || v_i,
      now() - (((v_i * 2.3)::INT) % 120 || ' days')::INTERVAL,
      now() - (((v_i * 1.2)::INT) % 30  || ' days')::INTERVAL
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  RAISE NOTICE '% leads inseridos.', array_length(v_lead_ids, 1);

  -- ── Inserir 30 Deals ──────────────────────────────────────
  v_position := 0;

  FOR v_i IN 1..30 LOOP
    v_stage    := pipeline_stages[((v_i - 1) % array_length(pipeline_stages, 1)) + 1];
    v_lead_id  := v_lead_ids[v_i];
    v_position := v_position + 1;

    INSERT INTO deals (
      id, workspace_id, lead_id, title, stage, position,
      estimated_value, owner_id, due_date, notes,
      created_at, updated_at
    )
    VALUES (
      gen_random_uuid(),
      v_workspace_id,
      v_lead_id,
      deal_titles[((v_i - 1) % array_length(deal_titles, 1)) + 1]
        || ' — ' || companies[v_i],
      v_stage,
      ((v_i - 1) % 5) + 1,
      -- Valor 80–120% do lead vinculado
      round((5000 + (v_i * 4217 % 195000))::NUMERIC * (0.8 + (v_i % 5) * 0.1), -2),
      v_owner_id,
      CASE
        WHEN v_stage IN ('fechado_ganho','fechado_perdido') THEN NULL
        ELSE (now() + (((v_i * 7) % 53 + 7) || ' days')::INTERVAL)::DATE
      END,
      '[seed-withcode] Deal de demonstração #' || v_i,
      now() - (((v_i * 2.9)::INT) % 90 || ' days')::INTERVAL,
      now() - (((v_i * 1.4)::INT) % 20 || ' days')::INTERVAL
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  RAISE NOTICE '30 deals inseridos.';
  RAISE NOTICE 'Seed WithCode StartUp concluído com sucesso!';
END $$;

COMMIT;
