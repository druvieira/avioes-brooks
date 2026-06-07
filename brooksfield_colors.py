# -*- coding: utf-8 -*-
# Redesign completo com o verde Brooksfield #1E5631
path = r'c:\Users\Augusto\avioes-brooks\avioes-app.html'
with open(path, 'rb') as f:
    text = f.read().decode('utf-8')

def rep(text, old, new, label):
    if old in text:
        text = text.replace(old, new)
        print(f'  OK: {label}')
    else:
        print(f'  MISS: {label}')
    return text

# ══════════════════════════════════════════════════
# 1. :root — paleta Brooksfield verde forest
# ══════════════════════════════════════════════════
text = rep(text,
    ':root {\r\n'
    '  --bg:       #060610;\r\n'
    '  --s1:       #0d0d1f;\r\n'
    '  --s2:       #13132a;\r\n'
    '  --s3:       #1c1c3a;\r\n'
    '  --border:   rgba(124,108,252,0.12);\r\n'
    '  --accent:   #7c6cfc;\r\n'
    '  --accent2:  #a99fff;\r\n'
    '  --accent3:  #4a3db0;\r\n'
    '  --text:     #ddddf5;\r\n'
    '  --text2:    #5a5a98;\r\n'
    '  --text3:    #28285a;\r\n'
    '  --gold:     #fbbf24;\r\n'
    '  --red:      #ff6b6b;\r\n'
    '  --blue:     #38bdf8;\r\n'
    '  --green:    #34d399;\r\n'
    '  --safe-top: env(safe-area-inset-top, 0px);\r\n'
    '  --safe-bot: env(safe-area-inset-bottom, 0px);\r\n'
    '}',
    ':root {\r\n'
    '  /* ─── Brooksfield Forest Green ─── */\r\n'
    '  --bg:       #040c06;\r\n'
    '  --s1:       #091409;\r\n'
    '  --s2:       #0f1e10;\r\n'
    '  --s3:       #162a17;\r\n'
    '  --border:   rgba(30,86,49,0.22);\r\n'
    '  --accent:   #1e5631;\r\n'
    '  --accent2:  #2ea34d;\r\n'
    '  --accent3:  #0d3b1e;\r\n'
    '  --text:     #e2ede5;\r\n'
    '  --text2:    #527a5f;\r\n'
    '  --text3:    #233b28;\r\n'
    '  --gold:     #c9a94a;\r\n'
    '  --red:      #e05555;\r\n'
    '  --blue:     #4a9cdf;\r\n'
    '  --green:    #34d399;\r\n'
    '  --safe-top: env(safe-area-inset-top, 0px);\r\n'
    '  --safe-bot: env(safe-area-inset-bottom, 0px);\r\n'
    '}',
    ':root paleta Brooksfield'
)

# ══════════════════════════════════════════════════
# 2. Substitui referências diretas ao violeta
# ══════════════════════════════════════════════════

# Violeta → verde forest (todas as ocorrências)
replacements = [
    # rgba violeta → rgba verde
    ('rgba(124,108,252,0.15)', 'rgba(30,86,49,0.18)'),
    ('rgba(124,108,252,0.2)',  'rgba(30,86,49,0.22)'),
    ('rgba(124,108,252,0.12)', 'rgba(30,86,49,0.20)'),
    ('rgba(124,108,252,0.10)', 'rgba(30,86,49,0.18)'),
    ('rgba(124,108,252,0.18)', 'rgba(30,86,49,0.22)'),
    ('rgba(124,108,252,0.35)', 'rgba(30,86,49,0.40)'),
    ('rgba(124,108,252,0.40)', 'rgba(30,86,49,0.45)'),
    ('rgba(124,108,252,0.4)',  'rgba(30,86,49,0.45)'),
    ('rgba(124,108,252,0.6)',  'rgba(30,86,49,0.60)'),
    # hex violeta → hex verde
    ('#7c6cfc', '#1e5631'),
    ('#a99fff', '#2ea34d'),
    ('#4a3db0', '#0d3b1e'),
    ('#5b3fcf', '#0d3b1e'),
    # fundo violeta em gradients
    ('rgba(124,108,252,0.05)', 'rgba(30,86,49,0.05)'),
    # ring realtime badge violet
    ('box-shadow:0 0 8px var(--accent)', 'box-shadow:0 0 10px var(--accent)'),
    # Login glassmorphism
    ('rgba(13,13,31,0.85)', 'rgba(4,12,6,0.88)'),
    ('rgba(124,108,252,0.2)', 'rgba(30,86,49,0.25)'),
    ('rgba(124,108,252,0.05)', 'rgba(30,86,49,0.06)'),
    # Loading bg
    ('rgba(124,108,252,0.18) 0%', 'rgba(30,86,49,0.20) 0%'),
    ('rgba(124,108,252,0.15) 0%', 'rgba(30,86,49,0.18) 0%'),
    # overlay foto
    ('rgba(124,108,252,0.20)', 'rgba(30,86,49,0.22)'),
    # resultado foto
    ('rgba(124,108,252,0.2);border:1px solid rgba(124,108,252,0.35)', 'rgba(30,86,49,0.2);border:1px solid rgba(30,86,49,0.40)'),
    # rt-toast border
    ('border:1px solid var(--accent)', 'border:1px solid rgba(30,86,49,0.6)'),
    # filial chip active
    ('background:rgba(124,108,252,0.15);border-color:var(--accent);', 'background:rgba(30,86,49,0.18);border-color:var(--accent);'),
    ('box-shadow:0 0 12px rgba(124,108,252,0.2)', 'box-shadow:0 0 12px rgba(30,86,49,0.3)'),
    # overlay resultado bg
    ('rgba(124,108,252,0.18) 0%,var(--bg)', 'rgba(30,86,49,0.15) 0%,var(--bg)'),
    # nav badge
    ('background:var(--accent);border:2px solid var(--bg);\r\n  box-shadow:0 0 8px var(--accent)',
     'background:var(--accent);border:2px solid var(--bg);\r\n  box-shadow:0 0 10px var(--accent)'),
    # perfil header gradient
    ('background:linear-gradient(135deg,var(--accent3),var(--accent),#5b3fcf)',
     'background:linear-gradient(135deg,var(--accent3),var(--accent),#1a6635)'),
    # ring epic
    ('.rstory-ring.r-epic   {--rc:var(--accent)}',
     '.rstory-ring.r-epic   {--rc:var(--accent2)}'),
    # screen nova senha bg
    ('rgba(124,108,252,0.18) 0%,var(--bg) 65%)',
     'rgba(30,86,49,0.18) 0%,var(--bg) 65%)'),
    # identificacao bg
    ('rgba(124,108,252,0.15) 0%,var(--bg) 65%)',
     'rgba(30,86,49,0.15) 0%,var(--bg) 65%)'),
    # overlay foto bg
    ('rgba(124,108,252,0.18) 0%,var(--bg) 65%)',
     'rgba(30,86,49,0.18) 0%,var(--bg) 65%)'),
    # login screen bg
    ("background:radial-gradient(ellipse at 40% 20%,rgba(124,108,252,0.15) 0%,var(--bg) 65%)",
     "background:radial-gradient(ellipse at 40% 20%,rgba(30,86,49,0.18) 0%,var(--bg) 65%)"),
    # xp bar gradient
    ('background:linear-gradient(90deg,var(--accent3),var(--accent),var(--accent2))',
     'background:linear-gradient(90deg,var(--accent3),var(--accent),var(--accent2))'),
    # btn primary
    ('background:linear-gradient(135deg,var(--accent3),var(--accent))',
     'background:linear-gradient(135deg,var(--accent3),var(--accent))'),
    # score bar epic
    ("bar:'linear-gradient(90deg,var(--accent3),var(--accent))'",
     "bar:'linear-gradient(90deg,var(--accent3),var(--accent2))'"),
    # analyzing bar
    ("background:linear-gradient(90deg,var(--accent3),var(--accent));border-radius:2px;transition:width .5s ease",
     "background:linear-gradient(90deg,var(--accent3),var(--accent));border-radius:2px;transition:width .5s ease"),
]

for old, new in replacements:
    if old in text and old != new:
        text = text.replace(old, new)
        # Don't print each one, count at end

# Conta violeta restante
violet_count = text.count('#7c6cfc') + text.count('rgba(124,108,252')
print(f'  Violeta restante: {violet_count} ocorrências')
print('  OK: substituições de cor violeta → verde')

# ══════════════════════════════════════════════════
# 3. Score/tier colors — mantém mas ajusta ao tema
# ══════════════════════════════════════════════════
# Garante que "épico" usa accent2 (verde mais claro)
text = text.replace(
    ".tag-epic{background:rgba(124,108,252,0.2);color:var(--accent2);border:1px solid rgba(124,108,252,0.4)}",
    ".tag-epic{background:rgba(30,86,49,0.25);color:var(--accent2);border:1px solid rgba(30,86,49,0.5)}"
)

# ══════════════════════════════════════════════════
# 4. Topbar branding — destaca o verde Brooksfield
# ══════════════════════════════════════════════════
text = rep(text,
    "  background:linear-gradient(135deg,var(--accent),var(--accent2));",
    "  background:linear-gradient(135deg,#1e5631,#2ea34d);",
    'topbar title gradient'
)

# ══════════════════════════════════════════════════
# 5. Loading screen — verde Brooksfield
# ══════════════════════════════════════════════════
text = rep(text,
    '<div style="font-family:\'Outfit\',sans-serif;font-size:24px;font-weight:800;letter-spacing:3px;background:linear-gradient(135deg,var(--accent),var(--accent2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent">AVIÕES</div>',
    '<div style="font-family:\'Outfit\',sans-serif;font-size:24px;font-weight:800;letter-spacing:3px;background:linear-gradient(135deg,#1e5631,#2ea34d,#c9a94a);-webkit-background-clip:text;-webkit-text-fill-color:transparent">AVIÕES</div>',
    'loading screen title verde'
)

# ══════════════════════════════════════════════════
# 6. Ring glow — verde para lendário mantém dourado,
#    r-me glow usa verde
# ══════════════════════════════════════════════════
text = text.replace(
    '@keyframes ring-glow{\r\n'
    '  0%,100%{filter:drop-shadow(0 0 4px #fcd34d)}\r\n'
    '  50%{filter:drop-shadow(0 0 14px #fcd34d) brightness(1.3)}\r\n'
    '}',
    '@keyframes ring-glow{\r\n'
    '  0%,100%{filter:drop-shadow(0 0 6px #c9a94a)}\r\n'
    '  50%{filter:drop-shadow(0 0 18px #c9a94a) brightness(1.3)}\r\n'
    '}'
)

with open(path, 'wb') as f:
    f.write(text.encode('utf-8'))
print('\nArquivo salvo.')
