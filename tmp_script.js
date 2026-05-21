<script>
// ════════════════════════════════════════════
// SUPABASE — conexão com banco de dados real
// ════════════════════════════════════════════

const SUPABASE_URL = 'https://xhfzcfefqinoyajwedgc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_awF5rTXO_7ulgLAbNy9Eiw_jctYNNxv';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ════════════════════════════════════════════
// STATE — espelho local do banco
// ════════════════════════════════════════════

const PLANE_LEVELS = [
  { name:'Teco-teco',          emoji:'🛩️',  minXP:0,   src:'plane-1-teco.png' },
  { name:'Avião comercial',    emoji:'✈️',  minXP:50,  src:'plane-2-comercial.png' },
  { name:'Jato executivo',     emoji:'🛫',  minXP:100, src:'plane-3-jato.png' },
  { name:'Acrobacia',          emoji:'🎯',  minXP:175, src:'plane-4-acrobacia.png' },
  { name:'Bombardeiro',        emoji:'💣',  minXP:275, src:'plane-5-bombardeiro.png' },
  { name:'Caça Força Aérea',   emoji:'🚀',  minXP:400, src:'plane-6-caca.png' },
];

function getPlaneLevel(xp) {
  let level = PLANE_LEVELS[0];
  for (const p of PLANE_LEVELS) { if (xp >= p.minXP) level = p; }
  return level;
}

const STATE = {
  currentUser: null,
  isGestor: false,
  currentScreen: 'login',
  rankTab: 'vendedores',
  semana: 12,
  resetTipo: '',

  membros: [
    { id:1, apelido:'Marquinhos', funcao:'vendedor', turno:'tarde',  xp:320, streak:5, senha:'1234', tarefasHoje:[true,true,true,false,true] },
    { id:2, apelido:'Bianca',     funcao:'vendedor', turno:'manha',  xp:185, streak:3, senha:'1234', tarefasHoje:[true,false,true,false,true] },
    { id:3, apelido:'Léo',        funcao:'vendedor', turno:'manha',  xp:210, streak:4, senha:'1234', tarefasHoje:[true,true,false,true,true] },
    { id:4, apelido:'Duda',       funcao:'vendedor', turno:'tarde',  xp:95,  streak:1, senha:'1234', tarefasHoje:[true,false,false,false,true] },
    { id:5, apelido:'Carol N.',   funcao:'caixa',    turno:'manha',  xp:215, streak:6, senha:'1234', tarefasHoje:[true,true,false,true,true] },
    { id:6, apelido:'Rafaela',    funcao:'caixa',    turno:'tarde',  xp:140, streak:2, senha:'1234', tarefasHoje:[true,false,true,false,false] },
  ],

  tarefasVendedor: [
    { nome:'Pontualidade',       xp:10,  emoji:'⏰', desc:'Chegou no horário?' },
    { nome:'Arrumação da loja',  xp:15,  emoji:'👔', desc:'Foto aprovada pela IA' },
    { nome:'Prospecção ativa',   xp:25,  emoji:'🎯', desc:'Clientes abordados na porta' },
    { nome:'Meta de vendas',     xp:30,  emoji:'💰', desc:'Bateu a meta do dia?' },
    { nome:'Atendimento nota 10',xp:20,  emoji:'⭐', desc:'Feedback positivo do cliente' },
  ],

  tarefasCaixa: [
    { nome:'Pontualidade',       xp:10,  emoji:'⏰', desc:'Chegou no horário?' },
    { nome:'Envelopes cortados', xp:12,  emoji:'✂️', desc:'Envelopes do dia cortados' },
    { nome:'Tickets conferidos', xp:15,  emoji:'🧾', desc:'Todos os tickets ok' },
    { nome:'Caixa organizado',   xp:12,  emoji:'📦', desc:'Mesa limpa e organizada' },
    { nome:'Fechamento preciso', xp:25,  emoji:'✔️', desc:'Caixa fechou sem diferença' },
  ],

  balcoes: [
    { id:1, nome:'Prateleira A1', tipo:'Prateleira', degrade:'vertical',   temFoto:true  },
    { id:2, nome:'Prateleira A2', tipo:'Prateleira', degrade:'vertical',   temFoto:true  },
    { id:3, nome:'Vitrine Frente',tipo:'Vitrine',    degrade:'horizontal', temFoto:false },
    { id:4, nome:'Ilha Central',  tipo:'Ilha',       degrade:'horizontal', temFoto:true  },
    { id:5, nome:'Balcão Caixa',  tipo:'Balcão',     degrade:'vertical',   temFoto:false },
  ],

  historico: [
    { semana:'S11', periodo:'05–11 mai', lidVend:'Léo',        xpVend:290, lidCaixa:'Carol N.', xpCaixa:195 },
    { semana:'S10', periodo:'28 abr–04 mai', lidVend:'Marquinhos', xpVend:310, lidCaixa:'Rafaela',  xpCaixa:180 },
    { semana:'S09', periodo:'21–27 abr', lidVend:'Bianca',     xpVend:265, lidCaixa:'Carol N.', xpCaixa:210 },
  ],

  logs: [
    { ts:'18/05 14h02', tipo:'foto',   icon:'📸', texto:'<strong>Léo</strong> foto aprovada · Prateleira A1 (+15 XP)' },
    { ts:'18/05 13h47', tipo:'tarefa', icon:'✅', texto:'<strong>Carol N.</strong> completou Envelopes (+12 XP)' },
    { ts:'18/05 11h33', tipo:'foto',   icon:'📸', texto:'<strong>Bianca</strong> score 971 · Prateleira A2 🔥' },
    { ts:'18/05 10h45', tipo:'login',  icon:'🔐', texto:'<strong>Marquinhos</strong> login — turno tarde' },
    { ts:'18/05 10h15', tipo:'tarefa', icon:'✅', texto:'<strong>Duda</strong> completou Pontualidade (+10 XP)' },
    { ts:'18/05 09h52', tipo:'reset',  icon:'🔄', texto:'Sistema verificou reset — próximo: seg 00h00' },
  ],

  feedData: [
    { id:1, author:'Bianca',   initials:'BI', plane:'✈️', time:'11h33', balcao:'Prateleira A2', score:971, xp:15, rankUp:'✈️ Avião comercial', emoji:'👗', reactions:{'🔥':7,'😮':5,'👏':6}, myReaction:null, comments:[{author:'Léo',initials:'LÉ',text:'CARA 971!! absurdo isso 🔥',time:'11h35'},{author:'Carol N.',initials:'CN',text:'Como fez esse degradê tão perfeito??',time:'11h38'}], liked:false, likes:12 },
    { id:2, author:'Léo',      initials:'LÉ', plane:'🛫', time:'14h02', balcao:'Prateleira A1', score:847, xp:15, rankUp:null, emoji:'👕', reactions:{'🔥':3,'👏':2}, myReaction:null, comments:[{author:'Carol N.',initials:'CN',text:'Ficou incrível! 🙌',time:'14h05'}], liked:false, likes:4 },
    { id:3, author:'Carol N.', initials:'CN', plane:'✈️', time:'13h47', balcao:'Balcão Caixa',  score:612, xp:12, rankUp:null, emoji:'🖥️', reactions:{'👏':4,'🔥':1}, myReaction:null, comments:[], liked:false, likes:3 },
    { id:4, author:'Rafaela',  initials:'RF', plane:'🛩️', time:'09h58', balcao:'Balcão Caixa',  score:688, xp:12, rankUp:null, emoji:'🧾', reactions:{'🔥':2,'👏':3}, myReaction:null, comments:[{author:'Carol N.',initials:'CN',text:'Arrasando Rafa!',time:'10h01'}], liked:false, likes:3 },
  ],
};

const EMOJIS = ['🔥','😮','👏','💛','😂','🎯','✈️','🏆'];

// ════════════════════════════════════════════
// NAVEGAÇÃO
// ════════════════════════════════════════════

function goTo(screen) {
  const screens = ['feed','tarefas','ranking','analise','gestor'];
  screens.forEach(s => {
    document.getElementById('screen-' + s).classList.add('hidden');
    const nav = document.getElementById('nav-' + s);
    if (nav) nav.classList.remove('active');
  });
  document.getElementById('screen-' + screen).classList.remove('hidden');
  const nav = document.getElementById('nav-' + screen);
  if (nav) nav.classList.add('active');
  STATE.currentScreen = screen;

  // Lazy render
  if (screen === 'feed')    renderFeed();
  if (screen === 'tarefas') renderTarefas();
  if (screen === 'ranking') renderRanking();
  if (screen === 'analise') renderAnalise();
  if (screen === 'gestor')  renderGestor();
}

function loginSuccess(membro, isGestor = false) {
  STATE.currentUser = membro;
  STATE.isGestor = isGestor;

  // Atualiza topbar
  document.getElementById('app-topbar').classList.remove('hidden');
  document.getElementById('bottom-nav').classList.remove('hidden');
  document.getElementById('screen-login').classList.add('hidden');

  const nivel = getPlaneLevel(membro ? membro.xp : 0);
  document.getElementById('topbar-plane').textContent = nivel.emoji;
  document.getElementById('topbar-name').textContent = isGestor ? 'GESTOR' : membro.apelido;
  document.getElementById('topbar-level').textContent = isGestor ? 'ADMIN' : nivel.name;
  document.getElementById('topbar-ava').textContent = isGestor ? '⚙️' : membro.apelido.slice(0,2).toUpperCase();

  // Mostra nav gestor só se for gestor
  document.getElementById('nav-gestor').style.display = isGestor ? 'flex' : 'none';

  if (isGestor) {
    goTo('gestor');
  } else {
    goTo('feed');
  }
}

// ════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════

function initLoginSelect() {
  const sel = document.getElementById('login-select');
  const paSel = document.getElementById('pa-select');
  sel.innerHTML = '<option value="">Selecione seu apelido...</option>';
  paSel.innerHTML = '<option value="">Selecione...</option>';
  STATE.membros.forEach(m => {
    sel.innerHTML += '<option value="' + m.id + '">' + m.apelido + ' (' + m.funcao + ' · ' + (m.turno === 'manha' ? 'manhã' : 'tarde') + ')</option>';
    paSel.innerHTML += '<option value="' + m.id + '">' + m.apelido + '</option>';
  });
}

function tentarLogin() {
  const id = parseInt(document.getElementById('login-select').value);
  const senha = document.getElementById('login-senha').value;
  const errEl = document.getElementById('login-error');

  if (!id) { showToast('⚠️ Selecione seu apelido'); return; }

  const membro = STATE.membros.find(m => m.id === id);
  if (!membro.senha) {
    errEl.textContent = 'Crie sua senha primeiro (primeiro acesso).';
    errEl.style.display = 'block'; return;
  }
  if (membro.senha !== senha) {
    errEl.style.display = 'block';
    document.getElementById('login-senha').value = '';
    return;
  }
  errEl.style.display = 'none';
  addLog('login', '🔐', '<strong>' + membro.apelido + '</strong> fez login — turno ' + membro.turno);
  loginSuccess(membro);
}

function loginGestor() {
  document.getElementById('gestor-senha').value = '';
  document.getElementById('gestor-login-error').style.display = 'none';
  openModal('modal-gestor-login');
}

function loginGestorConfirm() {
  const senha = document.getElementById('gestor-senha').value.trim();
  const errEl = document.getElementById('gestor-login-error');
  if (!senha) {
    errEl.textContent = 'Digite a senha do gestor.';
    errEl.style.display = 'block';
    return;
  }
  if (senha === '0000' || senha === 'gestor') {
    addLog('login', '⚙️', '<strong>Gestor</strong> acessou o painel');
    closeModal('modal-gestor-login');
    loginSuccess({ apelido:'Gestor', xp:9999, funcao:'gestor' }, true);
  } else {
    errEl.textContent = 'Senha incorreta';
    errEl.style.display = 'block';
  }
}

function logoutGestor() {
  STATE.currentUser = null;
  STATE.isGestor = false;
  document.getElementById('app-topbar').classList.add('hidden');
  document.getElementById('bottom-nav').classList.add('hidden');
  ['feed','tarefas','ranking','analise','gestor'].forEach(s =>
    document.getElementById('screen-' + s).classList.add('hidden'));
  document.getElementById('screen-login').classList.remove('hidden');
  document.getElementById('login-senha').value = '';
  document.getElementById('login-select').value = '';
  // Reset all gestor subs
  document.querySelectorAll('.gestor-sub').forEach(s => s.classList.remove('active'));
  document.getElementById('gestor-main').classList.add('active');
}

function criarSenha() {
  const id = parseInt(document.getElementById('pa-select').value);
  const senha = document.getElementById('pa-senha').value;
  const confirm = document.getElementById('pa-confirm').value;
  if (!id) { showToast('⚠️ Selecione o apelido'); return; }
  if (senha.length < 4) { showToast('⚠️ Mínimo 4 caracteres'); return; }
  if (senha !== confirm) { showToast('⚠️ Senhas diferentes'); return; }
  const m = STATE.membros.find(x => x.id === id);
  m.senha = senha;
  addLog('gestor','🔑','<strong>' + m.apelido + '</strong> criou nova senha');
  closeModal('modal-primeiro-acesso');
  showToast('✅ Senha criada! Faça login.');
  salvarSenhaBanco(m.id, senha);
}

// ════════════════════════════════════════════
// FEED
// ════════════════════════════════════════════

function renderFeed() {
  renderRankStrip();
  const container = document.getElementById('feed-container');
  container.innerHTML = '';
  STATE.feedData.forEach((post, i) => {
    const el = createPost(post);
    el.style.animationDelay = i * 0.06 + 's';
    container.appendChild(el);
  });
  setTimeout(animateScores, 200);
}

function renderRankStrip() {
  const maxXP = Math.max(...STATE.membros.map(m => m.xp));
  const strip = document.getElementById('rank-strip');
  strip.innerHTML = '';
  [...STATE.membros].sort((a,b) => b.xp - a.xp).forEach(m => {
    const pct = (m.xp / maxXP * 100).toFixed(0) + '%';
    const plane = getPlaneLevel(m.xp);
    const chip = document.createElement('div');
    chip.className = 'rank-chip';
    chip.innerHTML = '<div class="rank-ava-wrap"><div class="rank-ava-ring" style="--pct:' + pct + '"></div><div class="rank-ava">' + plane.emoji + '</div></div><div class="rank-name">' + m.apelido.split(' ')[0] + '</div><div class="rank-xp">' + m.xp + 'xp</div>';
    strip.appendChild(chip);
  });
}

function getScoreInfo(score) {
  if (score >= 950) return { label:'LENDÁRIO', cls:'legendary', barCls:'bar-legendary', tagCls:'tag-legendary' };
  if (score >= 850) return { label:'ÉPICO',    cls:'epic',      barCls:'bar-epic',      tagCls:'tag-epic' };
  if (score >= 700) return { label:'EXCELENTE',cls:'great',     barCls:'bar-great',     tagCls:'tag-great' };
  if (score >= 500) return { label:'BOM',      cls:'good',      barCls:'bar-good',      tagCls:'tag-good' };
  return                   { label:'REGULAR',  cls:'ok',        barCls:'bar-ok',        tagCls:'tag-ok' };
}

function createPost(post) {
  const si = getScoreInfo(post.score);
  const pct = post.score / 10;
  const el = document.createElement('div');
  el.className = 'post';
  el.id = 'post-' + post.id;
  const rxHTML = Object.entries(post.reactions).map(([e,c]) =>
    '<span class="react-pill ' + (post.myReaction===e?'active':'') + '" onclick="toggleReaction(' + post.id + ',\'' + e + '\',this)">' + e + '<span class="react-count">' + c + '</span></span>'
  ).join('');
  const visComments = post.comments.slice(0,2);
  const hidCount = post.comments.length - 2;
  const commentsHTML = visComments.map(c =>
    '<div class="comment"><div class="comment-ava">' + c.initials + '</div><div><div class="comment-author">' + c.author + '</div><div class="comment-text">' + c.text + '</div><div class="comment-time">' + c.time + '</div></div></div>'
  ).join('');
  const rankUpHTML = post.rankUp ? '<div class="rank-up-overlay"><div class="rank-up-chip">🚀 SUBIU PARA ' + post.rankUp.toUpperCase() + '</div></div>' : '';
  const moreHTML = hidCount > 0 ? '<span class="view-more-comments" onclick="showAllComments(' + post.id + ')">Ver mais ' + hidCount + ' comentário' + (hidCount>1?'s':'') + '...</span>' : '';

  el.innerHTML =
    '<div class="post-header">' +
      '<div class="post-ava">' + post.plane + '</div>' +
      '<div style="flex:1"><div class="post-author">' + post.author +
        '<span class="post-plane-badge">' + post.plane + ' ' + getPlaneNameShort(STATE.membros.find(m=>m.apelido===post.author)?.xp||0) + '</span>' +
      '</div><div class="post-time">⏱ ' + post.time + ' · ' + post.balcao + '</div></div>' +
    '</div>' +
    '<div class="post-img-wrap">' +
      '<div class="post-img-placeholder"><div>' + post.emoji + '</div><span>Foto aprovada pela IA ✓</span></div>' +
      rankUpHTML +
      '<div class="score-overlay">' +
        '<div class="score-badge">' +
          '<div class="score-label">SCORE</div>' +
          '<div class="score-number score-' + si.cls + '" data-target="' + post.score + '" data-animated="false">0</div>' +
          '<div class="score-max">/1000</div>' +
          '<div class="score-bar-wrap"><div class="score-bar-fill ' + si.barCls + '" style="width:0%" data-target="' + pct + '"></div></div>' +
        '</div>' +
        '<div class="score-rank-tag ' + si.tagCls + '">' + si.label + '</div>' +
      '</div>' +
      '<div class="xp-pill">⚡ +' + post.xp + ' XP</div>' +
    '</div>' +
    '<div class="post-actions">' +
      '<button class="action-btn ' + (post.liked?'liked':'') + '" onclick="toggleLike(' + post.id + ',this)"><span class="icon">' + (post.liked?'❤️':'🤍') + '</span><span class="like-count">' + post.likes + '</span></button>' +
      '<button class="action-btn" onclick="toggleEmojiPicker(' + post.id + ')"><span class="icon">😄</span> ' + post.reactions ? Object.values(post.reactions).reduce((a,b)=>a+b,0) : 0 + '</button>' +
      '<button class="action-btn" onclick="focusComment(' + post.id + ')"><span class="icon">💬</span> ' + post.comments.length + '</button>' +
      '<div class="reaction-row">' + rxHTML + '</div>' +
    '</div>' +
    '<div class="emoji-picker" id="emoji-picker-' + post.id + '">' +
      EMOJIS.map(e => '<div class="emoji-opt ' + (post.myReaction===e?'selected':'') + '" onclick="pickEmoji(' + post.id + ',\'' + e + '\',this)">' + e + '</div>').join('') +
    '</div>' +
    '<div class="comments-section" id="comments-' + post.id + '">' + moreHTML + commentsHTML + '</div>' +
    '<div class="comment-input-row">' +
      '<div class="comment-ava" style="width:28px;height:28px;border-radius:50%;background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0">' + (STATE.currentUser?.apelido?.slice(0,2).toUpperCase() || 'EU') + '</div>' +
      '<input class="comment-input" id="ci-' + post.id + '" type="text" placeholder="Comentar..." onkeydown="if(event.key===\'Enter\')sendComment(' + post.id + ')">' +
      '<button class="comment-send" onclick="sendComment(' + post.id + ')">➤</button>' +
    '</div>';
  return el;
}

function getPlaneNameShort(xp) {
  const names = ['Teco','Comercial','Jato','Acrobacia','Bombardeiro','Caça'];
  const idx = PLANE_LEVELS.findIndex((p,i) => xp >= p.minXP && (i===PLANE_LEVELS.length-1 || xp < PLANE_LEVELS[i+1].minXP));
  return names[Math.max(0,idx)];
}

function animateScores() {
  document.querySelectorAll('.score-number[data-animated="false"]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.dataset.animated = 'true';
      const target = parseInt(el.dataset.target);
      const dur = 1200; const start = performance.now();
      const step = now => {
        const p = Math.min((now-start)/dur,1);
        el.textContent = Math.round((1-Math.pow(1-p,3))*target);
        if (p < 1) requestAnimationFrame(step); else el.textContent = target;
      };
      requestAnimationFrame(step);
      const bar = el.closest('.score-badge')?.querySelector('.score-bar-fill');
      if (bar) setTimeout(() => bar.style.width = bar.dataset.target + '%', 200);
    }
  });
}

function toggleLike(id, btn) {
  const p = STATE.feedData.find(x => x.id === id);
  p.liked = !p.liked; p.likes += p.liked ? 1 : -1;
  btn.classList.toggle('liked', p.liked);
  btn.querySelector('.icon').textContent = p.liked ? '❤️' : '🤍';
  btn.querySelector('.like-count').textContent = p.likes;
  if (p.liked) { burstEmoji('❤️', btn); showToast('❤️ Curtido!'); }
}

function toggleEmojiPicker(id) {
  document.getElementById('emoji-picker-' + id)?.classList.toggle('open');
}

function pickEmoji(id, emoji, el) {
  const p = STATE.feedData.find(x => x.id === id);
  document.getElementById('emoji-picker-' + id)?.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('selected'));
  if (p.myReaction === emoji) {
    p.reactions[emoji] > 1 ? p.reactions[emoji]-- : delete p.reactions[emoji];
    p.myReaction = null;
  } else {
    if (p.myReaction) { p.reactions[p.myReaction] > 1 ? p.reactions[p.myReaction]-- : delete p.reactions[p.myReaction]; }
    p.myReaction = emoji; p.reactions[emoji] = (p.reactions[emoji]||0)+1;
    el.classList.add('selected'); burstEmoji(emoji, el);
  }
  document.getElementById('emoji-picker-' + id)?.classList.remove('open');
  rerenderReactions(id);
}

function toggleReaction(id, emoji, el) {
  const p = STATE.feedData.find(x => x.id === id);
  if (p.myReaction === emoji) {
    p.reactions[emoji] > 1 ? p.reactions[emoji]-- : delete p.reactions[emoji];
    p.myReaction = null;
  } else {
    if (p.myReaction) { p.reactions[p.myReaction] > 1 ? p.reactions[p.myReaction]-- : delete p.reactions[p.myReaction]; }
    p.myReaction = emoji; p.reactions[emoji] = (p.reactions[emoji]||0)+1;
    burstEmoji(emoji, el);
  }
  rerenderReactions(id);
}

function rerenderReactions(id) {
  const p = STATE.feedData.find(x => x.id === id);
  const row = document.querySelector('#post-' + id + ' .reaction-row');
  if (row) row.innerHTML = Object.entries(p.reactions).map(([e,c]) =>
    '<span class="react-pill ' + (p.myReaction===e?'active':'') + '" onclick="toggleReaction(' + id + ',\'' + e + '\',this)">' + e + '<span class="react-count">' + c + '</span></span>'
  ).join('');
}

function focusComment(id) { document.getElementById('ci-' + id)?.focus(); }

function sendComment(id) {
  const inp = document.getElementById('ci-' + id);
  const text = inp?.value.trim();
  if (!text) return;
  const p = STATE.feedData.find(x => x.id === id);
  const me = STATE.currentUser;
  const c = { author: me?.apelido||'Eu', initials: me?.apelido?.slice(0,2).toUpperCase()||'EU', text, time:'agora' };
  p.comments.push(c);
  const sec = document.getElementById('comments-' + id);
  const el = document.createElement('div');
  el.className = 'comment';
  el.innerHTML = '<div class="comment-ava">' + c.initials + '</div><div><div class="comment-author">' + c.author + '</div><div class="comment-text">' + text + '</div><div class="comment-time">agora</div></div>';
  sec?.appendChild(el);
  inp.value = '';
  showToast('💬 Comentado!');
  // Salva no banco em background
  if (STATE.currentUser) salvarComentarioBanco(id, STATE.currentUser.id, text);
}

function showAllComments(id) {
  const p = STATE.feedData.find(x => x.id === id);
  const sec = document.getElementById('comments-' + id);
  if (sec) sec.innerHTML = p.comments.map(c =>
    '<div class="comment"><div class="comment-ava">' + c.initials + '</div><div><div class="comment-author">' + c.author + '</div><div class="comment-text">' + c.text + '</div><div class="comment-time">' + c.time + '</div></div></div>'
  ).join('');
}

function burstEmoji(emoji, from) {
  const r = from.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'reaction-burst';
  el.textContent = emoji;
  el.style.left = (r.left + r.width/2 - 14) + 'px';
  el.style.top  = (r.top + window.scrollY - 10) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// ════════════════════════════════════════════
// TAREFAS
// ════════════════════════════════════════════

function renderTarefas() {
  const me = STATE.currentUser;
  if (!me) return;
  const tarefas = me.funcao === 'vendedor' ? STATE.tarefasVendedor : STATE.tarefasCaixa;

  // Streak
  document.getElementById('streak-num').textContent = me.streak;

  // XP hoje
  const xpHoje = tarefas.reduce((sum, t, i) => sum + (me.tarefasHoje[i] ? t.xp : 0), 0);
  const xpMax  = tarefas.reduce((sum, t) => sum + t.xp, 0);
  document.getElementById('progress-num').textContent = xpHoje;
  const arc = document.getElementById('progress-arc');
  const circ = 213.6;
  arc.style.strokeDashoffset = (circ - (xpHoje / xpMax) * circ).toFixed(1);

  // Lista de tarefas
  const list = document.getElementById('tarefas-list');
  list.innerHTML = '';
  tarefas.forEach((t, i) => {
    const done = me.tarefasHoje[i];
    const el = document.createElement('div');
    el.className = 'tarefa-card' + (done ? ' done' : '');
    el.onclick = () => toggleTarefa(i);
    el.innerHTML =
      '<div class="tarefa-check">' + (done ? '✓' : '') + '</div>' +
      '<div class="tarefa-info">' +
        '<div class="tarefa-nome">' + t.emoji + ' ' + t.nome + '</div>' +
        '<div class="tarefa-desc">' + t.desc + '</div>' +
      '</div>' +
      '<div class="tarefa-xp">+' + t.xp + ' XP</div>';
    list.appendChild(el);
  });

  // Semana
  const myRank = getRankPos(me);
  document.getElementById('xp-semana-num').textContent = me.xp;
  document.getElementById('rank-pos-badge').textContent = myRank + 'º lugar';
  const maxXP = Math.max(...STATE.membros.filter(m => m.funcao === me.funcao).map(m => m.xp));
  document.getElementById('xp-semana-bar').style.width = (me.xp / maxXP * 100) + '%';
}

function toggleTarefa(idx) {
  const me = STATE.currentUser;
  if (!me) return;
  const tarefas = me.funcao === 'vendedor' ? STATE.tarefasVendedor : STATE.tarefasCaixa;
  const wasDone = me.tarefasHoje[idx];
  me.tarefasHoje[idx] = !wasDone;
  const t = tarefas[idx];
  if (!wasDone) {
    me.xp += t.xp;
    addLog('tarefa','✅','<strong>' + me.apelido + '</strong> completou ' + t.nome + ' (+' + t.xp + ' XP)');
    showXPCelebration('+' + t.xp + ' XP ⚡');
    const nivel = getPlaneLevel(me.xp);
    document.getElementById('topbar-level').textContent = nivel.name;
    document.getElementById('topbar-plane').textContent = nivel.emoji;
  } else {
    me.xp = Math.max(0, me.xp - t.xp);
  }
  // Salva no banco em background
  salvarTarefaBanco(me.id, t.nome, t.xp, me.tarefasHoje[idx]);
  salvarXPBanco(me.id, me.xp, me.streak);
  salvarLogBanco('tarefa','✅', me.apelido + ' ' + (me.tarefasHoje[idx]?'completou':'desmarcou') + ' ' + t.nome);
  renderTarefas();
}

function getRankPos(me) {
  const mesmaFuncao = STATE.membros.filter(m => m.funcao === me.funcao).sort((a,b) => b.xp - a.xp);
  return mesmaFuncao.findIndex(m => m.id === me.id) + 1;
}

// ════════════════════════════════════════════
// RANKING
// ════════════════════════════════════════════

function renderRanking() {
  renderRankingForFunc('vendedores', 'vendedor');
  renderRankingForFunc('caixas', 'caixa');
}

function renderRankingForFunc(id, funcao) {
  const membros = STATE.membros.filter(m => m.funcao === funcao).sort((a,b) => b.xp - a.xp);
  const medals = ['🥇','🥈','🥉'];

  // Podium (top 3)
  const podiumEl = document.getElementById('podium-' + id);
  const order = [membros[1], membros[0], membros[2]].filter(Boolean);
  const posClasses = ['p2','p1','p3'];
  podiumEl.innerHTML = '<div class="podium">' + order.map((m, i) => {
    const realPos = membros.indexOf(m);
    const plane = getPlaneLevel(m.xp);
    return '<div class="podium-item ' + posClasses[i] + '">' +
      '<div class="podium-ava">' + plane.emoji + '</div>' +
      '<div class="podium-name">' + m.apelido.split(' ')[0] + '</div>' +
      '<div class="podium-xp">' + m.xp + ' XP</div>' +
      '<div class="podium-block"><div class="podium-medal">' + medals[realPos] + '</div></div>' +
    '</div>';
  }).join('') + '</div>';

  // Lista completa
  const listEl = document.getElementById('ranking-list-' + id);
  listEl.innerHTML = '<div class="card">' + membros.map((m, i) => {
    const plane = getPlaneLevel(m.xp);
    const isMe = STATE.currentUser?.id === m.id;
    return '<div class="ranking-list-item" style="' + (isMe ? 'background:rgba(90,171,104,0.06);border-radius:8px;padding:12px 8px;' : '') + '">' +
      '<div class="rl-pos">' + (medals[i] || (i+1)) + '</div>' +
      '<div class="rl-ava">' + plane.emoji + '</div>' +
      '<div class="rl-info">' +
        '<div class="rl-name">' + m.apelido + (isMe ? ' <span style="font-size:10px;color:var(--accent)">(você)</span>' : '') + '</div>' +
        '<div class="rl-plane">' + plane.name + '</div>' +
      '</div>' +
      '<div style="text-align:right">' +
        '<div class="rl-xp">' + m.xp + '</div>' +
        '<div class="rl-streak">🔥 ' + m.streak + 'd</div>' +
      '</div>' +
    '</div>';
  }).join('') + '</div>';
}

function switchRankTab(tab) {
  STATE.rankTab = tab;
  document.getElementById('tab-vendedores').classList.toggle('active', tab === 'vendedores');
  document.getElementById('tab-caixas').classList.toggle('active', tab === 'caixas');
  document.getElementById('podium-vendedores').style.display = tab === 'vendedores' ? 'block' : 'none';
  document.getElementById('podium-caixas').style.display = tab === 'caixas' ? 'block' : 'none';
  document.getElementById('ranking-list-vendedores').style.display = tab === 'vendedores' ? 'block' : 'none';
  document.getElementById('ranking-list-caixas').style.display = tab === 'caixas' ? 'block' : 'none';
}

// ════════════════════════════════════════════
// ANÁLISE
// ════════════════════════════════════════════

let chartInstances = {};
function renderAnalise() {
  const me = STATE.currentUser;
  if (!me || STATE.isGestor) return;

  document.getElementById('kpi-xp').textContent = me.xp;
  document.getElementById('kpi-xp-delta').textContent = '▲ acima da média';
  document.getElementById('kpi-xp-delta').className = 'kpi-delta delta-up';
  document.getElementById('kpi-streak').textContent = me.streak;
  document.getElementById('kpi-streak-status').textContent = me.streak > 3 ? '🔥 Em chamas!' : 'Continue!';
  document.getElementById('kpi-streak-status').className = 'kpi-delta delta-up';
  const tarefas = me.funcao === 'vendedor' ? STATE.tarefasVendedor : STATE.tarefasCaixa;
  const done = me.tarefasHoje.filter(Boolean).length;
  document.getElementById('kpi-tarefas').textContent = done + '/' + tarefas.length;
  document.getElementById('kpi-posicao').textContent = getRankPos(me) + 'º';

  // Chart XP semana
  const ctx1 = document.getElementById('chart-xp-semana').getContext('2d');
  if (chartInstances.xpSemana) chartInstances.xpSemana.destroy();
  chartInstances.xpSemana = new Chart(ctx1, {
    type:'line',
    data:{ labels:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
      datasets:[{ data:[45,80,120,160,210,265,me.xp], borderColor:'var(--accent)', backgroundColor:'rgba(90,171,104,0.1)', fill:true, tension:0.4, pointBackgroundColor:'var(--accent)', pointRadius:4 }]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
      scales:{ x:{ticks:{color:'#5d8f65',font:{size:10}}, grid:{color:'rgba(255,255,255,0.04)'}},
               y:{ticks:{color:'#5d8f65',font:{size:10}}, grid:{color:'rgba(255,255,255,0.04)'}} } }
  });

  // Adesão por tarefa
  const adList = document.getElementById('adesao-list');
  adList.innerHTML = '';
  tarefas.forEach((t,i) => {
    const done2 = STATE.membros.filter(m => m.funcao === me.funcao && m.tarefasHoje[i]).length;
    const total = STATE.membros.filter(m => m.funcao === me.funcao).length;
    const pct = Math.round(done2/total*100);
    const color = pct >= 75 ? 'var(--accent)' : pct >= 50 ? '#f5c842' : 'var(--red)';
    adList.innerHTML += '<div class="adesao-item"><div class="adesao-label"><span>' + t.emoji + ' ' + t.nome + '</span><span class="adesao-pct" style="color:' + color + '">' + pct + '%</span></div><div class="xp-bar-wrap"><div class="xp-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div></div>';
  });

  // Chart equipe
  const ctx2 = document.getElementById('chart-xp-equipe').getContext('2d');
  if (chartInstances.equipe) chartInstances.equipe.destroy();
  const sorted = [...STATE.membros].sort((a,b) => b.xp - a.xp);
  chartInstances.equipe = new Chart(ctx2, {
    type:'bar',
    data:{ labels: sorted.map(m => m.apelido.split(' ')[0]),
      datasets:[{ data: sorted.map(m => m.xp),
        backgroundColor: sorted.map(m => m.id === me.id ? 'rgba(90,171,104,0.9)' : 'rgba(90,171,104,0.25)'),
        borderRadius:6 }]},
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
      scales:{ x:{ticks:{color:'#5d8f65',font:{size:10}}, grid:{display:false}},
               y:{ticks:{color:'#5d8f65',font:{size:10}}, grid:{color:'rgba(255,255,255,0.04)'}} } }
  });
}

// ════════════════════════════════════════════
// GESTOR
// ════════════════════════════════════════════

function renderGestor() {
  renderGestorEquipe();
  renderGestorHistorico();
  renderGestorBalcoes();
  renderLogs();
}

function renderGestorEquipe() {
  ['vendedor','caixa'].forEach(func => {
    const id = func === 'vendedor' ? 'gestor-tabela-vendedores' : 'gestor-tabela-caixas';
    const el = document.getElementById(id);
    const membros = STATE.membros.filter(m => m.funcao === func).sort((a,b) => b.xp - a.xp);
    el.innerHTML = membros.map(m => {
      const plane = getPlaneLevel(m.xp);
      return '<div style="display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04)">' +
        '<div style="font-size:20px">' + plane.emoji + '</div>' +
        '<div style="flex:1"><div style="font-weight:600;font-size:14px">' + m.apelido + '</div>' +
        '<div style="font-size:11px;color:var(--text2)">' + (m.turno==='manha'?'🌅 Manhã':'🌇 Tarde') + ' · ' + m.xp + ' XP · 🔥' + m.streak + 'd</div></div>' +
        '<button onclick="abrirEditarMembro(' + m.id + ')" style="background:none;border:1px solid var(--border);border-radius:8px;padding:5px 10px;color:var(--text2);font-size:12px;cursor:pointer">✏️</button>' +
        '<button onclick="resetarSenhaDireto(' + m.id + ')" style="background:none;border:1px solid rgba(255,95,95,0.3);border-radius:8px;padding:5px 10px;color:var(--red);font-size:12px;cursor:pointer;margin-left:6px">🔑</button>' +
      '</div>';
    }).join('');
  });
}

function abrirEditarMembro(id) {
  const m = STATE.membros.find(x => x.id === id);
  document.getElementById('em-id').value = id;
  document.getElementById('em-apelido').value = m.apelido;
  document.getElementById('em-turno').value = m.turno;
  openModal('modal-edit-membro');
}

function salvarEdicao() {
  const id = parseInt(document.getElementById('em-id').value);
  const m = STATE.membros.find(x => x.id === id);
  const old = m.apelido;
  m.apelido = document.getElementById('em-apelido').value.trim() || m.apelido;
  m.turno   = document.getElementById('em-turno').value;
  if (old !== m.apelido) addLog('gestor','⚙️','<strong>Gestor</strong> editou: "' + old + '" → "' + m.apelido + '"');
  closeModal('modal-edit-membro');
  renderGestorEquipe();
  // ════════════════════════════════════════════
// INIT SUPABASE — carrega dados do banco
// ════════════════════════════════════════════

async function initApp() {
  showLoadingScreen();
  try {
    // Carrega membros
    const { data: membros, error: eMembros } = await sb.from('membros').select('*').order('xp', { ascending: false });
    if (eMembros) throw eMembros;
    STATE.membros = membros.map(m => ({
      id: m.id,
      apelido: m.apelido,
      funcao: m.funcao,
      turno: m.turno,
      xp: m.xp,
      streak: m.streak,
      senha: m.senha,
      semana_num: m.semana_num,
      tarefasHoje: [false, false, false, false, false],
    }));

    // Carrega tarefas do dia de hoje para cada membro
    const hoje = new Date().toISOString().split('T')[0];
    const { data: tarefasDia } = await sb.from('tarefas_dia').select('*').eq('data', hoje);
    if (tarefasDia) {
      tarefasDia.forEach(t => {
        const m = STATE.membros.find(x => x.id === t.membro_id);
        if (!m) return;
        const tarefas = m.funcao === 'vendedor' ? STATE.tarefasVendedor : STATE.tarefasCaixa;
        const idx = tarefas.findIndex(x => x.nome === t.tarefa_nome);
        if (idx >= 0) m.tarefasHoje[idx] = t.concluida;
      });
    }

    // Carrega feed
    const { data: feedRows } = await sb.from('feed').select('*, membros(apelido), comentarios(*, membros(apelido)), reacoes(emoji, membro_id)').order('criado_em', { ascending: false }).limit(20);
    if (feedRows && feedRows.length > 0) {
      STATE.feedData = feedRows.map(p => {
        const reactions = {};
        (p.reacoes || []).forEach(r => { reactions[r.emoji] = (reactions[r.emoji] || 0) + 1; });
        return {
          id: p.id,
          author: p.membros?.apelido || '—',
          initials: (p.membros?.apelido || '??').slice(0,2).toUpperCase(),
          plane: getPlaneLevel(STATE.membros.find(m => m.apelido === p.membros?.apelido)?.xp || 0).emoji,
          time: new Date(p.criado_em).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'}),
          balcao: p.balcao,
          score: p.score,
          xp: p.xp,
          rankUp: p.rank_up,
          emoji: p.emoji || '📸',
          reactions,
          myReaction: (p.reacoes || []).find(r => r.membro_id === STATE.currentUser?.id)?.emoji || null,
          comments: (p.comentarios || []).map(c => ({
            author: c.membros?.apelido || '—',
            initials: (c.membros?.apelido || '??').slice(0,2).toUpperCase(),
            text: c.texto,
            time: new Date(c.criado_em).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'}),
          })),
          liked: false,
          likes: p.likes || 0,
        };
      });
    }

    // Carrega balcões
    const { data: balcoes } = await sb.from('balcoes').select('*').order('id');
    if (balcoes) STATE.balcoes = balcoes.map(b => ({ id: b.id, nome: b.nome, tipo: b.tipo, degrade: b.degrade, temFoto: b.tem_foto }));

    // Carrega histórico
    const { data: hist } = await sb.from('historico_semanas').select('*').order('semana_num', { ascending: false }).limit(5);
    if (hist) STATE.historico = hist.map(h => ({ semana: 'S'+h.semana_num, periodo: h.periodo, lidVend: h.lid_vend, xpVend: h.xp_vend, lidCaixa: h.lid_caixa, xpCaixa: h.xp_caixa }));

    // Carrega logs
    const { data: logs } = await sb.from('logs').select('*').order('criado_em', { ascending: false }).limit(50);
    if (logs) STATE.logs = logs.map(l => ({ ts: new Date(l.criado_em).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).replace(',',''), tipo: l.tipo, icon: l.icon, texto: l.texto }));

  } catch(err) {
    console.error('Erro ao carregar dados:', err);
    showToast('⚠️ Erro ao conectar banco — usando dados locais');
  }

  hideLoadingScreen();
  initLoginSelect();
}

// ── Salvar tarefa no banco ──
async function salvarTarefaBanco(membroId, tarefaNome, xp, concluida) {
  const hoje = new Date().toISOString().split('T')[0];
  await sb.from('tarefas_dia').upsert({
    membro_id: membroId, tarefa_nome: tarefaNome, xp, concluida, data: hoje
  }, { onConflict: 'membro_id,tarefa_nome,data' });
}

// ── Salvar XP do membro no banco ──
async function salvarXPBanco(membroId, xp, streak) {
  await sb.from('membros').update({ xp, streak }).eq('id', membroId);
}

// ── Salvar comentário no banco ──
async function salvarComentarioBanco(postId, membroId, texto) {
  const { data } = await sb.from('comentarios').insert({ post_id: postId, membro_id: membroId, texto }).select('*, membros(apelido)').single();
  return data;
}

// ── Salvar reação no banco ──
async function salvarReacaoBanco(postId, membroId, emoji) {
  if (emoji) {
    await sb.from('reacoes').upsert({ post_id: postId, membro_id: membroId, emoji }, { onConflict: 'post_id,membro_id' });
  } else {
    await sb.from('reacoes').delete().eq('post_id', postId).eq('membro_id', membroId);
  }
}

// ── Salvar log no banco ──
async function salvarLogBanco(tipo, icon, texto) {
  await sb.from('logs').insert({ tipo, icon, texto: texto.replace(/<[^>]+>/g,'') });
}

// ── Criar senha no banco ──
async function salvarSenhaBanco(membroId, senha) {
  await sb.from('membros').update({ senha }).eq('id', membroId);
}

// ── Reset de semana no banco ──
async function resetarSemanaBanco(semanaNum, lidVend, xpVend, lidCaixa, xpCaixa) {
  await sb.from('historico_semanas').insert({ semana_num: semanaNum, periodo: '—', lid_vend: lidVend, xp_vend: xpVend, lid_caixa: lidCaixa, xp_caixa: xpCaixa });
  await sb.from('membros').update({ xp: 0, streak: 0 });
  // Deleta tarefas da semana
  await sb.from('tarefas_dia').delete().neq('id', 0);
}

// ── Loading screen ──
function showLoadingScreen() {
  const el = document.getElementById('loading-screen');
  if (el) el.style.display = 'flex';
}
function hideLoadingScreen() {
  const el = document.getElementById('loading-screen');
  if (el) el.style.display = 'none';
}

function resetarSenhaDireto(id) {
  const m = STATE.membros.find(x => x.id === id);
  m.senha = null;
  addLog('gestor','🔑','<strong>Gestor</strong> resetou senha de <strong>' + m.apelido + '</strong>');
  showToast('🔑 Senha de ' + m.apelido + ' resetada');
}

function resetarSenhaModal() {
  const id = parseInt(document.getElementById('em-id').value);
  resetarSenhaDireto(id);
  closeModal('modal-edit-membro');
}

async function addMembro() {
  const apelido = document.getElementById('nm-apelido').value.trim();
  const funcao  = document.getElementById('nm-funcao').value;
  const turno   = document.getElementById('nm-turno').value;
  if (!apelido) { showToast('⚠️ Preencha o apelido'); return; }

  const novoMembro = {
    apelido,
    funcao,
    turno,
    xp: 0,
    streak: 0,
    senha: null,
  };

  try {
    const { data, error } = await sb.from('membros').insert(novoMembro).select().single();
    if (error) throw error;

    const membro = {
      id: data.id,
      apelido: data.apelido,
      funcao: data.funcao,
      turno: data.turno,
      xp: data.xp ?? 0,
      streak: data.streak ?? 0,
      senha: data.senha ?? null,
      tarefasHoje: [false, false, false, false, false],
    };

    STATE.membros.push(membro);
    addLog('gestor','➕','<strong>Gestor</strong> adicionou <strong>' + apelido + '</strong>');
    try { await salvarLogBanco('gestor','➕','<strong>Gestor</strong> adicionou <strong>' + apelido + '</strong>'); } catch(_) {}

    document.getElementById('nm-apelido').value = '';
    closeModal('modal-add-membro');
    renderGestorEquipe();
    initLoginSelect();
    showToast('✅ ' + apelido + ' adicionado!');
  } catch(err) {
    console.error('Erro ao salvar membro:', err);
    showToast('⚠️ Falha ao salvar funcionário');
  }
}

initApp();

function renderGestorHistorico() {
  const el = document.getElementById('g-historico');
  el.innerHTML = STATE.historico.map(h =>
    '<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">' +
    '<div style="display:flex;justify-content:space-between;align-items:center">' +
    '<span style="font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--accent);font-weight:700">' + h.semana + '</span>' +
    '<span style="font-size:11px;color:var(--text2)">' + h.periodo + '</span></div>' +
    '<div style="font-size:12px;margin-top:4px">🛍️ <strong>' + h.lidVend + '</strong> ' + h.xpVend + ' XP &nbsp;|&nbsp; 🖥️ <strong>' + h.lidCaixa + '</strong> ' + h.xpCaixa + ' XP</div>' +
    '</div>'
  ).join('');
  document.getElementById('g-semana-num').textContent = 'S' + STATE.semana;
}

function renderGestorBalcoes() {
  const el = document.getElementById('g-balcoes-list');
  el.innerHTML = STATE.balcoes.map(b =>
    '<div style="display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04)">' +
    '<div style="font-size:22px">' + (b.tipo==='Vitrine'?'🪟':b.tipo==='Ilha'?'🏝️':b.tipo==='Balcão'?'🖥️':'📦') + '</div>' +
    '<div style="flex:1"><div style="font-weight:600;font-size:14px">' + b.nome + '</div>' +
    '<div style="font-size:11px;color:var(--text2)">' + b.tipo + ' · ' + (b.degrade==='vertical'?'↕ Vertical':'↔ Horizontal') + '</div></div>' +
    '<span class="badge ' + (b.temFoto ? 'badge-green' : 'badge-red') + '">' + (b.temFoto ? '✓ Foto' : '⚠ Sem foto') + '</span>' +
    '<button onclick="removerBalcao(' + b.id + ')" style="background:none;border:none;color:var(--text3);font-size:16px;cursor:pointer;margin-left:8px">🗑</button>' +
    '</div>'
  ).join('');
}

function addBalcao() {
  const nome = document.getElementById('nb-nome').value.trim();
  const tipo = document.getElementById('nb-tipo').value;
  const degrade = document.getElementById('nb-degrade').value;
  if (!nome) { showToast('⚠️ Preencha o nome'); return; }
  const id = Math.max(...STATE.balcoes.map(b => b.id)) + 1;
  STATE.balcoes.push({ id, nome, tipo, degrade, temFoto:false });
  addLog('gestor','⚙️','<strong>Gestor</strong> cadastrou balcão: "' + nome + '"');
  document.getElementById('nb-nome').value = '';
  closeModal('modal-add-balcao');
  renderGestorBalcoes();
  showToast('✅ ' + nome + ' cadastrado!');
}

function removerBalcao(id) {
  const b = STATE.balcoes.find(x => x.id === id);
  STATE.balcoes = STATE.balcoes.filter(x => x.id !== id);
  addLog('gestor','🗑','<strong>Gestor</strong> removeu balcão: "' + b.nome + '"');
  renderGestorBalcoes();
  showToast('🗑 Removido');
}

function showGestorSub(id) {
  document.getElementById('gestor-main').classList.remove('active');
  document.getElementById(id).classList.add('active');
}
function hideGestorSub(id) {
  document.getElementById(id).classList.remove('active');
  document.getElementById('gestor-main').classList.add('active');
}

// ════════════════════════════════════════════
// RESET
// ════════════════════════════════════════════

function confirmarReset(tipo) {
  STATE.resetTipo = tipo;
  const msgs = {
    semana: 'Isso encerrará a semana atual, registrará os vencedores e zerará o XP de todos.',
    xp:     'O XP do membro selecionado será zerado.',
  };
  document.getElementById('reset-titulo').textContent = tipo === 'semana' ? '🔄 Resetar semana' : '⚡ Zerar XP';
  document.getElementById('reset-msg').textContent = msgs[tipo];
  const sw = document.getElementById('reset-select-wrap');
  sw.style.display = tipo !== 'semana' ? 'block' : 'none';
  if (tipo !== 'semana') {
    const sel = document.getElementById('reset-membro-select');
    sel.innerHTML = STATE.membros.map(m => '<option value="' + m.id + '">' + m.apelido + '</option>').join('');
  }
  openModal('modal-confirmar-reset');
}

function executarReset() {
  if (STATE.resetTipo === 'semana') {
    const lv = STATE.membros.filter(m=>m.funcao==='vendedor').sort((a,b)=>b.xp-a.xp)[0];
    const lc = STATE.membros.filter(m=>m.funcao==='caixa').sort((a,b)=>b.xp-a.xp)[0];
    STATE.historico.unshift({ semana:'S'+STATE.semana, periodo:'—', lidVend:lv.apelido, xpVend:lv.xp, lidCaixa:lc.apelido, xpCaixa:lc.xp });
    STATE.membros.forEach(m => { m.xp=0; m.streak=0; m.tarefasHoje=[false,false,false,false,false]; });
    STATE.semana++;
    addLog('reset','🔄','<strong>Gestor</strong> resetou semana S' + (STATE.semana-1));
    resetarSemanaBanco(STATE.semana-1, lv.apelido, lv.xp, lc.apelido, lc.xp);
    showToast('🔄 Semana resetada!');
  } else {
    const id = parseInt(document.getElementById('reset-membro-select').value);
    const m = STATE.membros.find(x=>x.id===id);
    m.xp=0;
    addLog('reset','⚡','<strong>Gestor</strong> zerou XP de <strong>' + m.apelido + '</strong>');
    showToast('⚡ XP de ' + m.apelido + ' zerado');
  }
  closeModal('modal-confirmar-reset');
  renderGestorHistorico();
  renderGestorEquipe();
}

// ════════════════════════════════════════════
// LOGS
// ════════════════════════════════════════════

function addLog(tipo, icon, texto) {
  const now = new Date();
  const ts = now.getDate().toString().padStart(2,'0') + '/' + (now.getMonth()+1).toString().padStart(2,'0') + ' ' + now.getHours().toString().padStart(2,'0') + 'h' + now.getMinutes().toString().padStart(2,'0');
  STATE.logs.unshift({ ts, tipo, icon, texto });
}

function renderLogs() {
  const filtro = document.getElementById('filtro-log')?.value || 'todos';
  const lista = filtro === 'todos' ? STATE.logs : STATE.logs.filter(l => l.tipo === filtro);
  const el = document.getElementById('g-logs-list');
  el.innerHTML = lista.map(l =>
    '<div class="log-entry"><div class="log-time">' + l.ts + '</div><div style="font-size:15px">' + l.icon + '</div><div class="log-text">' + l.texto + '</div></div>'
  ).join('');
}

function exportarLogs() {
  const csv = ['Horário,Tipo,Evento',...STATE.logs.map(l => '"'+l.ts+'","'+l.tipo+'","'+l.texto.replace(/<[^>]+>/g,'')+'"')].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download = 'logs-avioes.csv';
  a.click();
  showToast('⬇ CSV exportado!');
}

// ════════════════════════════════════════════
// UI HELPERS
// ════════════════════════════════════════════

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(o =>
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); })
);

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function showXPCelebration(text) {
  const cel = document.getElementById('xp-celebration');
  const burst = document.getElementById('xp-burst-text');
  burst.textContent = text;
  burst.style.animation = 'none';
  cel.classList.add('show');
  requestAnimationFrame(() => {
    burst.style.animation = 'xp-burst-anim 0.8s cubic-bezier(0.34,1.56,0.64,1) both';
  });
  setTimeout(() => cel.classList.remove('show'), 900);
}

// Scroll animations
document.getElementById('screen-feed').querySelector('.scroll-area').addEventListener('scroll', animateScores, { passive:true });

// ════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════

// ════════════════════════════════════════════
// INIT SUPABASE — carrega dados do banco
// ════════════════════════════════════════════

async function initApp() {
  showLoadingScreen();
  try {
    // Carrega membros
    const { data: membros, error: eMembros } = await sb.from('membros').select('*').order('xp', { ascending: false });
    if (eMembros) throw eMembros;
    STATE.membros = membros.map(m => ({
      id: m.id,
      apelido: m.apelido,
      funcao: m.funcao,
      turno: m.turno,
      xp: m.xp,
      streak: m.streak,
      senha: m.senha,
      semana_num: m.semana_num,
      tarefasHoje: [false, false, false, false, false],
    }));

    // Carrega tarefas do dia de hoje para cada membro
    const hoje = new Date().toISOString().split('T')[0];
    const { data: tarefasDia } = await sb.from('tarefas_dia').select('*').eq('data', hoje);
    if (tarefasDia) {
      tarefasDia.forEach(t => {
        const m = STATE.membros.find(x => x.id === t.membro_id);
        if (!m) return;
        const tarefas = m.funcao === 'vendedor' ? STATE.tarefasVendedor : STATE.tarefasCaixa;
        const idx = tarefas.findIndex(x => x.nome === t.tarefa_nome);
        if (idx >= 0) m.tarefasHoje[idx] = t.concluida;
      });
    }

    // Carrega feed
    const { data: feedRows } = await sb.from('feed').select('*, membros(apelido), comentarios(*, membros(apelido)), reacoes(emoji, membro_id)').order('criado_em', { ascending: false }).limit(20);
    if (feedRows && feedRows.length > 0) {
      STATE.feedData = feedRows.map(p => {
        const reactions = {};
        (p.reacoes || []).forEach(r => { reactions[r.emoji] = (reactions[r.emoji] || 0) + 1; });
        return {
          id: p.id,
          author: p.membros?.apelido || '—',
          initials: (p.membros?.apelido || '??').slice(0,2).toUpperCase(),
          plane: getPlaneLevel(STATE.membros.find(m => m.apelido === p.membros?.apelido)?.xp || 0).emoji,
          time: new Date(p.criado_em).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'}),
          balcao: p.balcao,
          score: p.score,
          xp: p.xp,
          rankUp: p.rank_up,
          emoji: p.emoji || '📸',
          reactions,
          myReaction: (p.reacoes || []).find(r => r.membro_id === STATE.currentUser?.id)?.emoji || null,
          comments: (p.comentarios || []).map(c => ({
            author: c.membros?.apelido || '—',
            initials: (c.membros?.apelido || '??').slice(0,2).toUpperCase(),
            text: c.texto,
            time: new Date(c.criado_em).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'}),
          })),
          liked: false,
          likes: p.likes || 0,
        };
      });
    }

    // Carrega balcões
    const { data: balcoes } = await sb.from('balcoes').select('*').order('id');
    if (balcoes) STATE.balcoes = balcoes.map(b => ({ id: b.id, nome: b.nome, tipo: b.tipo, degrade: b.degrade, temFoto: b.tem_foto }));

    // Carrega histórico
    const { data: hist } = await sb.from('historico_semanas').select('*').order('semana_num', { ascending: false }).limit(5);
    if (hist) STATE.historico = hist.map(h => ({ semana: 'S'+h.semana_num, periodo: h.periodo, lidVend: h.lid_vend, xpVend: h.xp_vend, lidCaixa: h.lid_caixa, xpCaixa: h.xp_caixa }));

    // Carrega logs
    const { data: logs } = await sb.from('logs').select('*').order('criado_em', { ascending: false }).limit(50);
    if (logs) STATE.logs = logs.map(l => ({ ts: new Date(l.criado_em).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).replace(',',''), tipo: l.tipo, icon: l.icon, texto: l.texto }));

  } catch(err) {
    console.error('Erro ao carregar dados:', err);
    showToast('⚠️ Erro ao conectar banco — usando dados locais');
  }

  hideLoadingScreen();
  initLoginSelect();
}

// ── Salvar tarefa no banco ──
async function salvarTarefaBanco(membroId, tarefaNome, xp, concluida) {
  const hoje = new Date().toISOString().split('T')[0];
  await sb.from('tarefas_dia').upsert({
    membro_id: membroId, tarefa_nome: tarefaNome, xp, concluida, data: hoje
  }, { onConflict: 'membro_id,tarefa_nome,data' });
}

// ── Salvar XP do membro no banco ──
async function salvarXPBanco(membroId, xp, streak) {
  await sb.from('membros').update({ xp, streak }).eq('id', membroId);
}

// ── Salvar comentário no banco ──
async function salvarComentarioBanco(postId, membroId, texto) {
  const { data } = await sb.from('comentarios').insert({ post_id: postId, membro_id: membroId, texto }).select('*, membros(apelido)').single();
  return data;
}

// ── Salvar reação no banco ──
async function salvarReacaoBanco(postId, membroId, emoji) {
  if (emoji) {
    await sb.from('reacoes').upsert({ post_id: postId, membro_id: membroId, emoji }, { onConflict: 'post_id,membro_id' });
  } else {
    await sb.from('reacoes').delete().eq('post_id', postId).eq('membro_id', membroId);
  }
}

// ── Salvar log no banco ──
async function salvarLogBanco(tipo, icon, texto) {
  await sb.from('logs').insert({ tipo, icon, texto: texto.replace(/<[^>]+>/g,'') });
}

// ── Criar senha no banco ──
async function salvarSenhaBanco(membroId, senha) {
  await sb.from('membros').update({ senha }).eq('id', membroId);
}

// ── Reset de semana no banco ──
async function resetarSemanaBanco(semanaNum, lidVend, xpVend, lidCaixa, xpCaixa) {
  await sb.from('historico_semanas').insert({ semana_num: semanaNum, periodo: '—', lid_vend: lidVend, xp_vend: xpVend, lid_caixa: lidCaixa, xp_caixa: xpCaixa });
  await sb.from('membros').update({ xp: 0, streak: 0 });
  // Deleta tarefas da semana
  await sb.from('tarefas_dia').delete().neq('id', 0);
}

// ── Loading screen ──
function showLoadingScreen() {
  const el = document.getElementById('loading-screen');
  if (el) el.style.display = 'flex';
}
function hideLoadingScreen() {
  const el = document.getElementById('loading-screen');
  if (el) el.style.display = 'none';
}

initApp();