-- ═══════════════════════════════════════════════════════
-- AVIÕES — Schema Supabase
-- Cole isso inteiro no SQL Editor do Supabase e execute
-- ═══════════════════════════════════════════════════════

-- 1. MEMBROS
CREATE TABLE IF NOT EXISTS membros (
  id          SERIAL PRIMARY KEY,
  apelido     TEXT NOT NULL,
  nome        TEXT,
  sobrenome   TEXT,
  telefone    TEXT,
  funcao      TEXT NOT NULL DEFAULT 'vendedor',
  turno       TEXT NOT NULL DEFAULT 'tarde',
  filial      TEXT NOT NULL DEFAULT 'goiabeiras',
  xp          INTEGER NOT NULL DEFAULT 0,
  streak      INTEGER NOT NULL DEFAULT 0,
  senha       TEXT,
  semana_num  INTEGER DEFAULT 1,
  frase       TEXT,
  frase_ativa BOOLEAN DEFAULT true,
  cidade      TEXT,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SESSÕES (territórios dos vendedores)
CREATE TABLE IF NOT EXISTS sessoes (
  id             SERIAL PRIMARY KEY,
  nome           TEXT NOT NULL,
  descricao      TEXT,
  responsavel_id INTEGER REFERENCES membros(id) ON DELETE SET NULL,
  filial         TEXT DEFAULT 'goiabeiras',
  criado_em      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TAREFAS DO DIA
CREATE TABLE IF NOT EXISTS tarefas_dia (
  id          SERIAL PRIMARY KEY,
  membro_id   INTEGER REFERENCES membros(id) ON DELETE CASCADE,
  tarefa_nome TEXT NOT NULL,
  xp          INTEGER NOT NULL DEFAULT 0,
  concluida   BOOLEAN NOT NULL DEFAULT false,
  data        DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(membro_id, tarefa_nome, data)
);

-- 4. FEED (postagens de foto)
CREATE TABLE IF NOT EXISTS feed (
  id        SERIAL PRIMARY KEY,
  membro_id INTEGER REFERENCES membros(id) ON DELETE CASCADE,
  balcao    TEXT,
  score     INTEGER DEFAULT 0,
  xp        INTEGER DEFAULT 0,
  emoji     TEXT DEFAULT '📸',
  rank_up   TEXT,
  likes     INTEGER DEFAULT 0,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMENTÁRIOS
CREATE TABLE IF NOT EXISTS comentarios (
  id        SERIAL PRIMARY KEY,
  post_id   INTEGER REFERENCES feed(id) ON DELETE CASCADE,
  membro_id INTEGER REFERENCES membros(id) ON DELETE CASCADE,
  texto     TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REAÇÕES
CREATE TABLE IF NOT EXISTS reacoes (
  id        SERIAL PRIMARY KEY,
  post_id   INTEGER REFERENCES feed(id) ON DELETE CASCADE,
  membro_id INTEGER REFERENCES membros(id) ON DELETE CASCADE,
  emoji     TEXT NOT NULL,
  UNIQUE(post_id, membro_id)
);

-- 7. LOGS
CREATE TABLE IF NOT EXISTS logs (
  id        SERIAL PRIMARY KEY,
  tipo      TEXT,
  icon      TEXT,
  texto     TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 8. HISTÓRICO DE SEMANAS
CREATE TABLE IF NOT EXISTS historico_semanas (
  id         SERIAL PRIMARY KEY,
  semana_num INTEGER NOT NULL,
  filial     TEXT DEFAULT 'goiabeiras',
  periodo    TEXT,
  lid_vend   TEXT,
  xp_vend    INTEGER,
  lid_caixa  TEXT,
  xp_caixa   INTEGER,
  criado_em  TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BALCÕES
CREATE TABLE IF NOT EXISTS balcoes (
  id       SERIAL PRIMARY KEY,
  nome     TEXT NOT NULL,
  tipo     TEXT,
  degrade  TEXT,
  tem_foto BOOLEAN DEFAULT false,
  filial   TEXT DEFAULT 'goiabeiras'
);

-- ═══════════════════════════════════════════════════════
-- RLS — desabilita para app interno (chave única)
-- ═══════════════════════════════════════════════════════
ALTER TABLE membros          DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes          DISABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas_dia      DISABLE ROW LEVEL SECURITY;
ALTER TABLE feed             DISABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios      DISABLE ROW LEVEL SECURITY;
ALTER TABLE reacoes          DISABLE ROW LEVEL SECURITY;
ALTER TABLE logs             DISABLE ROW LEVEL SECURITY;
ALTER TABLE historico_semanas DISABLE ROW LEVEL SECURITY;
ALTER TABLE balcoes          DISABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════
-- MEMBROS — Goiabeiras (equipe inicial)
-- ═══════════════════════════════════════════════════════
INSERT INTO membros (apelido, nome, telefone, funcao, turno, filial, xp, streak, senha) VALUES
  ('Arthur',  'Arthur',  '65993031620', 'vendedor', 'tarde', 'goiabeiras', 0, 0, '1111'),
  ('Brenno',  'Brenno',  '66999146759', 'vendedor', 'tarde', 'goiabeiras', 0, 0, '1111'),
  ('Evellyn', 'Evellyn', '65992989342', 'vendedor', 'tarde', 'goiabeiras', 0, 0, '1111'),
  ('Leela',   'Leela',   '65981544173', 'vendedor', 'tarde', 'goiabeiras', 0, 0, '1111'),
  ('Witoria', 'Witoria', '65992709858', 'vendedor', 'tarde', 'goiabeiras', 0, 0, '1111'),
  ('Caixa',   'Caixa',   '65999905727', 'caixa',   'tarde', 'goiabeiras', 0, 0, '1111')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- SESSÕES iniciais — Goiabeiras
-- ═══════════════════════════════════════════════════════
INSERT INTO sessoes (nome, descricao, filial) VALUES
  ('Camisetas e Polo',   'Balcões centrais de camisetas e polo',  'goiabeiras'),
  ('Calças',             'Toda a seção de calças da loja',        'goiabeiras'),
  ('Jaquetas e Costumes','Seção de jaquetas e costumes',          'goiabeiras'),
  ('Acessórios',         'Cintos, carteiras e acessórios',        'goiabeiras')
ON CONFLICT DO NOTHING;
