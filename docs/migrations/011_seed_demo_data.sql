-- ============================================================
-- 011_seed_demo_data.sql
-- Dados de demonstração: 50 leads + 30 deals distribuídos
-- em todas as stages do pipeline.
--
-- PRÉ-REQUISITOS:
--   • Execute este script DEPOIS de criar um workspace e um
--     usuário admin no Supabase Auth.
--   • O workspace_id e owner_id são resolvidos dinamicamente
--     via subselect — não há hardcode de UUIDs.
--
-- COMO EXECUTAR:
--   Supabase Dashboard → SQL Editor → cole e execute.
--
-- IDEMPOTÊNCIA:
--   Usa ON CONFLICT DO NOTHING — seguro para re-executar.
--   Para limpar os seeds: DELETE FROM leads WHERE notes LIKE '%[seed]%';
-- ============================================================

BEGIN;

-- ── Resolve workspace e owner dinamicamente ──────────────────
-- Usa o PRIMEIRO workspace disponível e o PRIMEIRO admin como owner.
-- Adapte os filtros se tiver múltiplos workspaces.

DO $$
DECLARE
  v_workspace_id  UUID;
  v_owner_id      UUID;
  v_lead_ids      UUID[];
  v_i             INT;
  v_lead_id       UUID;
  v_stage         TEXT;
  v_position      INT;

  -- Arrays de nomes e empresas fictícias (variados para realismo)
  names           TEXT[] := ARRAY[
    'Ana Beatriz Ferreira','Carlos Eduardo Lima','Fernanda Oliveira',
    'Ricardo Santos','Juliana Costa','Marcos Alves','Patrícia Souza',
    'Bruno Martins','Camila Rodrigues','Diego Pereira','Elaine Nascimento',
    'Felipe Cardoso','Gabriela Mendes','Henrique Barbosa','Isabela Rocha',
    'João Paulo Silva','Karina Azevedo','Leonardo Castro','Mariana Dias',
    'Natanael Gomes','Olívia Teixeira','Paulo Freitas','Quézia Araújo',
    'Rafael Monteiro','Simone Correia','Tiago Moreira','Úrsula Vieira',
    'Vinícius Lopes','Wanda Cunha','Xavier Pinto','Yasmin Cavalcanti',
    'Zé Carlos Ribeiro','Alice Borges','Bernardo Fonseca','Clara Melo',
    'Daniel Tavares','Eduarda Campos','Fábio Ramos','Giovanna Luz',
    'Humberto Braga','Iara Macedo','Jonas Nunes','Kelly Vasconcelos',
    'Lucas Figueiredo','Marta Brito','Nilton Queiroz','Odete Rangel',
    'Pedro Carvalho','Rafaela Dantas','Sandro Rezende'
  ];

  companies       TEXT[] := ARRAY[
    'TechNova Soluções','Grupo Meridian','Inova Digital','Plataforma X',
    'Consultoria Ágil','DataPrime','Nexus Sistemas','FutureTech Brasil',
    'SoftEdge','CloudPoint','Velomax Logística','WaveMedia',
    'CoreBusiness','Alphatech','Sigma Consulting','OmegaSoft',
    'Conecta Hub','BlueLayer','GreenPath Sustentável','Redspark',
    'Zenith Ventures','Apex Soluções','Vortex Digital','Primus Gestão',
    'KineticLabs','Lumia Criativa','Forte Sistemas','AgileMind',
    'ByteForce','PixelWork','Startix','Momentum IT',
    'Pulse Analytics','Synapse AI','ClearView Tech','Horizon Corp',
    'Stellar Media','Orbit Solutions','Quantic Dev','Nova Presença',
    'Traction Co','Ledger Finance','Bolt Commerce','Circuit Labs',
    'Stratum Engenharia','Nuvem Serviços','Cascade Apps','Helix Bio',
    'Praxis Consultoria','Vox Marketing'
  ];

  positions       TEXT[] := ARRAY[
    'CEO','CTO','Diretor Comercial','Gerente de TI','Head of Sales',
    'Diretor de Marketing','Analista de Negócios','Sócio-fundador',
    'VP de Operações','Coordenador de Projetos'
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
    'Implementação ERP','Consultoria Digital','Renovação de Contrato',
    'Plataforma SaaS','Migração de Dados','Automação de Processos',
    'Dashboard Analytics','Integração de APIs','Portal do Cliente',
    'Sistema de CRM','App Mobile','Revamp do Site',
    'Infraestrutura Cloud','Projeto de BI','Solução de E-commerce',
    'Módulo Financeiro','Treinamento e Capacitação','Setup DevOps',
    'Consultoria de Segurança','Otimização de Performance',
    'Licenciamento Enterprise','Expansão de Recursos',
    'Projeto Piloto','Contrato Anual Premium','POC Técnica'
  ];

BEGIN
  -- Resolve workspace_id
  SELECT id INTO v_workspace_id
  FROM workspaces
  ORDER BY created_at
  LIMIT 1;

  IF v_workspace_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum workspace encontrado. Crie um workspace antes de executar este seed.';
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
    RAISE EXCEPTION 'Nenhum membro encontrado no workspace. Adicione um membro antes de executar este seed.';
  END IF;

  RAISE NOTICE 'Usando workspace_id: %', v_workspace_id;
  RAISE NOTICE 'Usando owner_id: %', v_owner_id;

  -- ── Inserir 50 Leads ──────────────────────────────────────
  -- Armazena os IDs para reusar na criação dos deals
  v_lead_ids := ARRAY[]::UUID[];

  FOR v_i IN 1..50 LOOP
    v_lead_id := gen_random_uuid();
    v_lead_ids := array_append(v_lead_ids, v_lead_id);

    INSERT INTO leads (
      id,
      workspace_id,
      name,
      email,
      phone,
      company,
      position,
      status,
      owner_id,
      estimated_value,
      notes,
      created_at,
      updated_at
    )
    VALUES (
      v_lead_id,
      v_workspace_id,
      names[v_i],
      -- Email derivado do nome: sem acentos e minúsculo
      lower(regexp_replace(
        translate(names[v_i],
          'ÁÀÃÂÉÊÍÓÔÕÚÜÇáàãâéêíóôõúüç ',
          'AAAAEEIOOOUUCaaaaeeiooouuc-'),
        '[^a-z0-9\-]', '', 'g'
      )) || '.' || v_i || '@' || lower(regexp_replace(
        translate(companies[v_i],
          'ÁÀÃÂÉÊÍÓÔÕÚÜÇáàãâéêíóôõúüç ',
          'AAAAEEIOOOUUCaaaaeeiooouuc-'),
        '[^a-z0-9\-]', '', 'g'
      )) || '.com.br',
      -- Telefone fictício: (11) 9XXXX-XXXX variando por índice
      '(11) 9' || lpad(((v_i * 1731 + 4219) % 10000)::TEXT, 4, '0')
              || '-' || lpad(((v_i * 3571 + 8123) % 10000)::TEXT, 4, '0'),
      companies[v_i],
      positions[((v_i - 1) % array_length(positions, 1)) + 1],
      -- Status distribuído realisticamente
      lead_statuses[((v_i - 1) % array_length(lead_statuses, 1)) + 1],
      v_owner_id,
      -- Valor estimado: R$5k–R$200k com variação realista
      round((5000 + (v_i * 3947 % 195000))::NUMERIC, -2),
      '[seed] Lead de demonstração #' || v_i,
      -- Data de criação: últimos 120 dias, distribuída
      now() - (((v_i * 2.4)::INT) % 120 || ' days')::INTERVAL,
      now() - (((v_i * 1.1)::INT) % 30  || ' days')::INTERVAL
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  RAISE NOTICE '% leads inseridos.', array_length(v_lead_ids, 1);

  -- ── Inserir 30 Deals ──────────────────────────────────────
  -- Distribui os 30 deals pelos 50 leads (cada deal liga a um lead distinto)
  -- e percorre todos os pipeline stages de forma equilibrada.

  v_position := 0;

  FOR v_i IN 1..30 LOOP
    v_stage    := pipeline_stages[((v_i - 1) % array_length(pipeline_stages, 1)) + 1];
    v_lead_id  := v_lead_ids[v_i]; -- lead único por deal (índices 1-30)
    v_position := v_position + 1;

    INSERT INTO deals (
      id,
      workspace_id,
      lead_id,
      title,
      stage,
      position,
      estimated_value,
      owner_id,
      due_date,
      notes,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      v_workspace_id,
      v_lead_id,
      deal_titles[((v_i - 1) % array_length(deal_titles, 1)) + 1]
        || ' — ' || companies[v_i],
      v_stage,
      -- Posição dentro do stage (reset por stage)
      ((v_i - 1) % 5) + 1,
      -- Valor 80–120% do estimated_value do lead para coerência
      round((5000 + (v_i * 3947 % 195000))::NUMERIC * (0.8 + (v_i % 5) * 0.1), -2),
      v_owner_id,
      -- Due date: 7–60 dias no futuro (exceto fechados)
      CASE
        WHEN v_stage IN ('fechado_ganho','fechado_perdido') THEN NULL
        ELSE (now() + (((v_i * 7) % 53 + 7) || ' days')::INTERVAL)::DATE
      END,
      '[seed] Deal de demonstração #' || v_i,
      now() - (((v_i * 3.1)::INT) % 90 || ' days')::INTERVAL,
      now() - (((v_i * 1.3)::INT) % 20 || ' days')::INTERVAL
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  RAISE NOTICE '30 deals inseridos.';
  RAISE NOTICE 'Seed concluído com sucesso.';
END $$;

COMMIT;
