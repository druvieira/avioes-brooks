import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RUBRICAS: Record<string, string> = {
  paredao: `Você é especialista em visual merchandising de loja de moda premium.
Avalie esta foto de um PAREDÃO (parede de araras com roupas penduradas) com a rubrica abaixo (total 1000 pts):
• Degradê de cores (0-300): peças ordenadas do mais claro ao mais escuro ou padrão cromático intencional
• Alinhamento das araras (0-200): araras na mesma altura, sem espaços vazios entre peças
• Visibilidade dos produtos (0-200): etiquetas aparentes, boa iluminação, sem peças escondidas
• Limpeza e acabamento (0-150): sem cabides tortos, sem peças caídas, chão limpo
• Impacto visual (0-150): composição atraente que convida à compra

Responda SOMENTE com JSON: {"score": <inteiro 0-1000>, "resumo": "<elogio ou sugestão em até 15 palavras>"}`,

  ilha: `Você é especialista em visual merchandising de loja de moda premium.
Avalie esta foto de uma ILHA (expositor central ou mesa de produtos) com a rubrica abaixo (total 1000 pts):
• Composição e simetria (0-300): peças distribuídas de forma equilibrada e atraente
• Variedade e destaque (0-200): boa diversidade de produtos sem parecer bagunça
• Alinhamento e dobras (0-200): peças empilhadas com dobras precisas e uniformes
• Limpeza e acabamento (0-150): sem amassados, sem peças fora do lugar
• Impacto visual (0-150): atrai o olhar do cliente que passa

Responda SOMENTE com JSON: {"score": <inteiro 0-1000>, "resumo": "<elogio ou sugestão em até 15 palavras>"}`,

  balcao: `Você é especialista em visual merchandising de loja de moda premium.
Avalie esta foto de um BALCÃO (balcão de atendimento ou expositor de acessórios) com a rubrica abaixo (total 1000 pts):
• Organização e agrupamento (0-300): produtos agrupados por categoria/cor de forma lógica
• Aproveitamento do espaço (0-200): espaço bem usado sem excesso nem falta de produto
• Alinhamento e dobras (0-200): peças bem dobradas e alinhadas
• Limpeza e acabamento (0-150): superfície limpa, sem peças amassadas
• Impacto visual (0-150): apresentação que convida o cliente a tocar e experimentar

Responda SOMENTE com JSON: {"score": <inteiro 0-1000>, "resumo": "<elogio ou sugestão em até 15 palavras>"}`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY não configurado');

    const { foto_url, tipo_sessao } = await req.json();
    if (!foto_url) throw new Error('foto_url obrigatório');

    const rubrica = RUBRICAS[tipo_sessao as string] ?? RUBRICAS.paredao;

    // Baixa a imagem
    const imgResp = await fetch(foto_url, { signal: AbortSignal.timeout(15_000) });
    if (!imgResp.ok) throw new Error(`Falha ao baixar imagem: ${imgResp.status}`);
    const imgBytes = await imgResp.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(imgBytes)));
    const mime = imgResp.headers.get('content-type') ?? 'image/jpeg';

    // Chama Gemini Flash
    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [
            { text: rubrica },
            { inline_data: { mime_type: mime, data: b64 } },
          ]}],
          generationConfig: { temperature: 0.2, maxOutputTokens: 200 },
        }),
        signal: AbortSignal.timeout(30_000),
      }
    );

    if (!geminiResp.ok) {
      const txt = await geminiResp.text();
      throw new Error(`Gemini ${geminiResp.status}: ${txt.slice(0, 300)}`);
    }

    const data = await geminiResp.json();
    const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Extrai JSON mesmo se o Gemini adicionar markdown
    const match = raw.match(/\{[\s\S]*?\}/);
    if (!match) throw new Error(`Gemini sem JSON: ${raw.slice(0, 200)}`);

    const parsed = JSON.parse(match[0]);
    const score  = Math.max(0, Math.min(1000, Math.round(Number(parsed.score) || 0)));
    const resumo = String(parsed.resumo ?? '').slice(0, 120);

    return new Response(
      JSON.stringify({ score, resumo }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[avaliar-foto]', err);
    return new Response(
      JSON.stringify({ error: String((err as Error).message) }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    );
  }
});
