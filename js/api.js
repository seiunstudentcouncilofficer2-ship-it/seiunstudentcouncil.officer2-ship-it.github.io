/**
 * API.js
 * Hardware & OS Integration Layer
 * Desktop App (Electron) 化を見据え、ブラウザAPIとOSネイティブAPIの抽象化レイヤーを提供。
 *
 * 【AI バックエンド一覧】
 *   - "ollama"   : Ollama ローカルLLM（完全オフライン）
 *   - "gemini"   : Google Gemini API
 *   - "groq"     : Groq API（無料枠あり・高速・Llama/Gemma対応）
 *   - "openai"   : OpenAI API（GPT-4o mini 等）
 *
 * 切り替えは localStorage の "cos_ai_provider" で管理。
 * デフォルトは "ollama"（オフライン優先）。
 */

const OSAPI = {
    // ─────────────────────────────────────────────
    // 1. ファイルシステム (エクスプローラー連携)
    // ─────────────────────────────────────────────
    FileSystem: {
        openExplorer: async (path) => {
            console.log(`[OS-API] Opening Explorer at: ${path}`);
            if (window.electron) await window.electron.openExplorer(path);
            return true;
        },
        readArchiveFiles: async () => {
            return [
                { id: 1, name: "Rashinban_No86_Final_Complete_V12.docx", type: "word", date: "2026-05-05" },
                { id: 2, name: "出欠簿集計_2026-05-07.csv", type: "excel", date: "2026-05-07" },
                { id: 3, name: "マイク用のドキュメント.pdf", type: "pdf", date: "2026-04-05" },
            ];
        },
        readDownloadFiles: async () => {
            return [
                { id: 201, name: "README.txt", type: "text", date: "2026-05-09", size: "1KB", folder: "/" },
                { id: 202, name: "メモ.txt", type: "text", date: "2026-05-08", size: "2KB", folder: "/" },
                { id: 301, name: "令和6年度_議案書案.docx", type: "word", date: "2026-05-07", size: "120KB", folder: "11_Documents" },
                { id: 302, name: "予算詳細表_2026.xlsx", type: "excel", date: "2026-05-05", size: "45KB", folder: "11_Documents" },
                { id: 303, name: "青雲祭_企画規定.pdf", type: "pdf", date: "2026-04-20", size: "2.4MB", folder: "11_Documents" },
                { id: 304, name: "議事録_0415.docx", type: "word", date: "2026-04-15", size: "38KB", folder: "11_Documents" },
                { id: 307, name: "プレゼン資料.pptx", type: "slide", date: "2026-05-01", size: "8.2MB", folder: "11_Documents" },
                { id: 401, name: "DSC_8416.JPG", type: "image", date: "2025-08-30", size: "4.2MB", folder: "05_Images" },
                { id: 405, name: "集合写真_2025.webp", type: "image", date: "2025-11-15", size: "1.5MB", folder: "05_Images" },
                { id: 501, name: "742919709.mp4", type: "video", date: "2025-09-10", size: "45MB", folder: "06_Videos" },
                { id: 601, name: "Sam Day - Nothing To Hide.mp3", type: "audio", date: "2025-06-20", size: "8.5MB", folder: "07_Audio" },
                { id: 701, name: "map.ai", type: "other", date: "2025-08-15", size: "12MB", folder: "08_Design" },
                { id: 702, name: "Orbitron-font.zip", type: "archive", date: "2025-04-10", size: "450KB", folder: "08_Design" },
                { id: 801, name: "Premiere_Pro_Set-Up.exe", type: "other", date: "2025-05-15", size: "1.2GB", folder: "09_Installers" },
                { id: 901, name: "YukkuriMovieMaker_v4.zip", type: "archive", date: "2026-01-20", size: "85MB", folder: "10_Archives" }
            ];
        }
    },

    // ─────────────────────────────────────────────
    // 2. ハードウェア (Canonプリンター連携)
    // ─────────────────────────────────────────────
    Hardware: {
        getPrinterStatus: async () => {
            return { status: 'online', inkLevel: { C: 80, M: 75, Y: 90, K: 60 } };
        },
        printDocument: async () => {
            if (window.electron) await window.electron.launchCanonTool();
            else alert("印刷ジョブをプリンターに送信しました。（Electron環境外ではモック動作）");
            return true;
        }
    },

    // ─────────────────────────────────────────────
    // 3. AI エンジン設定管理
    // ─────────────────────────────────────────────
    AI: {

        /** プロバイダー定義（UIに表示する順序） */
        PROVIDERS: [
            {
                id: 'ollama',
                name: 'Ollama',
                label: 'ローカル LLM',
                icon: 'fa-laptop-code',
                color: '#34d399',
                offline: true,
                description: 'PCで動作・完全オフライン',
                fields: ['ollamaUrl', 'ollamaModel']
            },
            {
                id: 'gemini',
                name: 'Gemini',
                label: 'Google AI',
                icon: 'fa-google',
                color: '#4285f4',
                offline: false,
                description: 'gemini-2.0-flash-lite',
                fields: ['geminiKey']
            },
            {
                id: 'groq',
                name: 'Groq',
                label: '高速・無料枠あり',
                icon: 'fa-bolt',
                color: '#f59e0b',
                offline: false,
                description: 'Llama / Gemma 対応',
                fields: ['groqKey', 'groqModel']
            },
            {
                id: 'openai',
                name: 'OpenAI',
                label: 'GPT-4o mini 等',
                icon: 'fa-robot',
                color: '#10b981',
                offline: false,
                description: 'ChatGPT ベース',
                fields: ['openaiKey', 'openaiModel', 'openaiBaseUrl']
            },
            {
                id: 'anthropic',
                name: 'Claude',
                label: 'Anthropic',
                icon: 'fa-brain',
                color: '#d97757',
                offline: false,
                description: 'Claude 3.5 Sonnet 等',
                fields: ['anthropicKey', 'anthropicModel']
            }
        ],

        getProvider: () => localStorage.getItem('cos_ai_provider') || 'ollama',
        setProvider: (p) => { localStorage.setItem('cos_ai_provider', p); console.log(`[OS-API] AI Provider → ${p}`); },

        // ─── Ollama ───
        getOllamaBaseUrl:  () => localStorage.getItem('cos_ollama_url')   || 'http://localhost:11434',
        getOllamaModel:    () => localStorage.getItem('cos_ollama_model') || 'gemma3:4b',

        // ─── Gemini ───
        getGeminiApiKey: (force = false) => {
            let key = localStorage.getItem('cos_gemini_api_key') || '';
            if (force) {
                const nk = prompt('Gemini API キーを入力してください:');
                if (nk?.trim()) { key = nk.trim(); localStorage.setItem('cos_gemini_api_key', key); }
            }
            return key;
        },

        // ─── Groq ───
        getGroqApiKey:   () => localStorage.getItem('cos_groq_api_key')   || '',
        getGroqModel:    () => localStorage.getItem('cos_groq_model')     || 'llama-3.3-70b-versatile',

        // ─── OpenAI (互換エンドポイント対応) ───
        getOpenAIApiKey:  () => localStorage.getItem('cos_openai_api_key')  || '',
        getOpenAIModel:   () => localStorage.getItem('cos_openai_model')    || 'gpt-4o-mini',
        getOpenAIBaseUrl: () => localStorage.getItem('cos_openai_base_url') || 'https://api.openai.com/v1',

        // ─── Anthropic (Claude) ───
        getAnthropicApiKey: () => localStorage.getItem('cos_anthropic_api_key') || '',
        getAnthropicModel:  () => localStorage.getItem('cos_anthropic_model')   || 'claude-3-5-sonnet-latest',

        // ─────────────────────────────────────────────
        // Ollamaステータス確認
        // ─────────────────────────────────────────────
        checkOllamaStatus: async () => {
            try {
                const res = await fetch(`${OSAPI.AI.getOllamaBaseUrl()}/api/tags`, { signal: AbortSignal.timeout(3000) });
                if (!res.ok) return false;
                const data = await res.json();
                return Array.isArray(data.models);
            } catch { return false; }
        },

        getOllamaModels: async () => {
            try {
                const res = await fetch(`${OSAPI.AI.getOllamaBaseUrl()}/api/tags`, { signal: AbortSignal.timeout(3000) });
                const data = await res.json();
                return (data.models || []).map(m => m.name);
            } catch { return []; }
        },

        // ─────────────────────────────────────────────
        // 3-A. Ollama バックエンド
        // ─────────────────────────────────────────────
        _ollama: {
            async generate(prompt) {
                const res = await fetch(`${OSAPI.AI.getOllamaBaseUrl()}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: OSAPI.AI.getOllamaModel(), prompt, stream: false, options: { temperature: 0.1 } })
                });
                if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
                return (await res.json()).response || '';
            },
            async proofread(formData)    { return _parseAIJson(await OSAPI.AI._ollama.generate(_buildProofPrompt(formData))); },
            async generateReason(ov)    { return (await OSAPI.AI._ollama.generate(_buildReasonPrompt(ov))).trim(); }
        },

        // ─────────────────────────────────────────────
        // 3-B. Gemini バックエンド
        // ─────────────────────────────────────────────
        _gemini: {
            async request(prompt, temp = 0.1) {
                const key = OSAPI.AI.getGeminiApiKey();
                if (!key) throw new Error('GEMINI_NO_KEY');
                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`,
                    { method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: temp } }) }
                );
                if (!res.ok) { const e = await res.json().catch(() => null); throw new Error(`GEMINI_HTTP_${res.status}|${JSON.stringify(e)}`); }
                return (await res.json()).candidates?.[0]?.content?.parts?.[0]?.text || '';
            },
            async proofread(formData)   { return _parseAIJson(await OSAPI.AI._gemini.request(_buildProofPrompt(formData))); },
            async generateReason(ov)   { return (await OSAPI.AI._gemini.request(_buildReasonPrompt(ov), 0.7)).trim(); }
        },

        // ─────────────────────────────────────────────
        // 3-C. Groq バックエンド
        // ─────────────────────────────────────────────
        _groq: {
            async request(prompt, temp = 0.1) {
                const key = OSAPI.AI.getGroqApiKey();
                if (!key) throw new Error('GROQ_NO_KEY');
                const model = OSAPI.AI.getGroqModel();
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                    body: JSON.stringify({
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: temp
                    })
                });
                if (!res.ok) { const e = await res.json().catch(() => null); throw new Error(`GROQ_HTTP_${res.status}|${JSON.stringify(e)}`); }
                return (await res.json()).choices?.[0]?.message?.content || '';
            },
            async proofread(formData)   { return _parseAIJson(await OSAPI.AI._groq.request(_buildProofPrompt(formData))); },
            async generateReason(ov)   { return (await OSAPI.AI._groq.request(_buildReasonPrompt(ov), 0.7)).trim(); }
        },

        // ─────────────────────────────────────────────
        // 3-D. OpenAI バックエンド（互換エンドポイント対応）
        // ─────────────────────────────────────────────
        _openai: {
            async request(prompt, temp = 0.1) {
                const key     = OSAPI.AI.getOpenAIApiKey();
                const model   = OSAPI.AI.getOpenAIModel();
                const baseUrl = OSAPI.AI.getOpenAIBaseUrl();
                if (!key) throw new Error('OPENAI_NO_KEY');
                const res = await fetch(`${baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                    body: JSON.stringify({
                        model,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: temp
                    })
                });
                if (!res.ok) { const e = await res.json().catch(() => null); throw new Error(`OPENAI_HTTP_${res.status}|${JSON.stringify(e)}`); }
                return (await res.json()).choices?.[0]?.message?.content || '';
            },
            async proofread(formData)   { return _parseAIJson(await OSAPI.AI._openai.request(_buildProofPrompt(formData))); },
            async generateReason(ov)   { return (await OSAPI.AI._openai.request(_buildReasonPrompt(ov), 0.7)).trim(); }
        },

        // ─────────────────────────────────────────────
        // 3-E. Anthropic バックエンド (Claude)
        // ─────────────────────────────────────────────
        _anthropic: {
            async request(prompt, temp = 0.1) {
                const key   = OSAPI.AI.getAnthropicApiKey();
                const model = OSAPI.AI.getAnthropicModel();
                if (!key) throw new Error('ANTHROPIC_NO_KEY');
                
                // Anthropic API はフロントエンドから直接叩くとCORSエラーになることが多いため、
                // 将来的にElectronメインプロセス経由にするか、プロキシが必要ですが、今回は直接叩く形を定義
                const res = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': key,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true'
                    },
                    body: JSON.stringify({
                        model: model,
                        max_tokens: 1024,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: temp
                    })
                });
                if (!res.ok) { const e = await res.json().catch(() => null); throw new Error(`ANTHROPIC_HTTP_${res.status}|${JSON.stringify(e)}`); }
                const data = await res.json();
                return data.content?.[0]?.text || '';
            },
            async proofread(formData)   { return _parseAIJson(await OSAPI.AI._anthropic.request(_buildProofPrompt(formData))); },
            async generateReason(ov)   { return (await OSAPI.AI._anthropic.request(_buildReasonPrompt(ov), 0.7)).trim(); }
        },

        // ─────────────────────────────────────────────
        // 3-F. 統合ルーター（外部から呼ぶのはここのみ）
        // ─────────────────────────────────────────────

        proofreadRingisho: async (formData) => {
            const warnings = [];
            if (!formData.summary)  warnings.push({ type: 'error', message: '「題名」が入力されていません。' });
            if (!formData.overview) warnings.push({ type: 'info',  message: '「概要」が未入力です。' });

            const provider = OSAPI.AI.getProvider();
            try {
                let aiWarnings = [];

                if (provider === 'ollama') {
                    if (!(await OSAPI.AI.checkOllamaStatus())) {
                        warnings.push({ type: 'warning', message: 'Ollamaが起動していません。\nPCでOllamaを起動するか、設定から別のAIへ切り替えてください。' });
                        return warnings;
                    }
                    aiWarnings = await OSAPI.AI._ollama.proofread(formData);

                } else if (provider === 'gemini') {
                    if (!OSAPI.AI.getGeminiApiKey()) {
                        warnings.push({ type: 'warning', message: 'GeminiのAPIキーが設定されていません。設定画面から登録してください。' });
                        return warnings;
                    }
                    aiWarnings = await OSAPI.AI._gemini.proofread(formData);

                } else if (provider === 'groq') {
                    if (!OSAPI.AI.getGroqApiKey()) {
                        warnings.push({ type: 'warning', message: 'GroqのAPIキーが設定されていません。設定画面から登録してください。' });
                        return warnings;
                    }
                    aiWarnings = await OSAPI.AI._groq.proofread(formData);

                } else if (provider === 'openai') {
                    if (!OSAPI.AI.getOpenAIApiKey()) {
                        warnings.push({ type: 'warning', message: 'OpenAIのAPIキーが設定されていません。設定画面から登録してください。' });
                        return warnings;
                    }
                    aiWarnings = await OSAPI.AI._openai.proofread(formData);

                } else if (provider === 'anthropic') {
                    if (!OSAPI.AI.getAnthropicApiKey()) {
                        warnings.push({ type: 'warning', message: 'Claude (Anthropic) のAPIキーが設定されていません。設定画面から登録してください。' });
                        return warnings;
                    }
                    aiWarnings = await OSAPI.AI._anthropic.proofread(formData);
                }

                warnings.push(...aiWarnings);
            } catch (e) {
                console.error(`[OS-API] AI proofread error (${provider}):`, e);
                warnings.push({ type: 'error', message: _buildErrorMessage(provider, e) });
            }
            return warnings;
        },

        generateReason: async (overview) => {
            if (!overview) return '概要を入力してください。';
            const provider = OSAPI.AI.getProvider();
            try {
                if (provider === 'ollama') {
                    if (!(await OSAPI.AI.checkOllamaStatus())) return 'Ollamaが起動していません。PCでOllamaを起動してから再試行してください。';
                    return await OSAPI.AI._ollama.generateReason(overview);
                } else if (provider === 'gemini') {
                    if (!OSAPI.AI.getGeminiApiKey()) return 'GeminiのAPIキーが設定されていません。';
                    return await OSAPI.AI._gemini.generateReason(overview);
                } else if (provider === 'groq') {
                    if (!OSAPI.AI.getGroqApiKey()) return 'GroqのAPIキーが設定されていません。';
                    return await OSAPI.AI._groq.generateReason(overview);
                } else if (provider === 'openai') {
                    if (!OSAPI.AI.getOpenAIApiKey()) return 'OpenAIのAPIキーが設定されていません。';
                    return await OSAPI.AI._openai.generateReason(overview);
                } else if (provider === 'anthropic') {
                    if (!OSAPI.AI.getAnthropicApiKey()) return 'Claude (Anthropic) のAPIキーが設定されていません。';
                    return await OSAPI.AI._anthropic.generateReason(overview);
                }
            } catch (e) {
                console.error(`[OS-API] generateReason error (${provider}):`, e);
                return `エラーが発生しました: ${e.message}`;
            }
        },

        /** @deprecated analyzeText は proofreadRingisho に統合済み */
        analyzeText: async (text) => {
            const w = [];
            if (text.includes("平成")) w.push("元号が「平成」になっています。「令和」の誤りではないですか？");
            return w;
        },
        getRecommend: async () => "去年の今頃は「生徒総会」の準備をしていました。前回のテンプレートを使用して開始しますか？"
    }
};

// ─────────────────────────────────────────────
// 内部ユーティリティ
// ─────────────────────────────────────────────

/** 校正プロンプト生成 */
function _buildProofPrompt(fd) {
    return `あなたは優秀な校正アシスタントです。以下の稟議書（生徒会・学校向け）の入力データを読み、問題を指摘してください。

【チェック項目】
1. 文脈に合わない漢字の誤字・同音異義語のミス
2. 文が途中で終わっている、または日本語として不自然な箇所
3. 題名・概要・理由の論理的な矛盾

【入力データ】
題名: ${fd.summary || '未入力'}
概要: ${fd.overview || '未入力'}
理由: ${fd.reason  || '未入力'}

【出力形式】
以下のJSON配列のみ出力（Markdownコードブロック記号は一切含めないこと）。
問題なければ空配列 [] を返すこと。
[
  { "type": "error", "message": "指摘内容" }
]
※ "type" は "error", "warning", "info" のいずれか。`;
}

/** 理由文生成プロンプト */
function _buildReasonPrompt(overview) {
    return `あなたは生徒会活動をサポートするAIアシスタントです。「${overview}」という企画の稟議書に相応しい、説得力のある「理由」を150文字程度で作成してください。本文のみ出力してください。`;
}

/** JSON解析 */
function _parseAIJson(text) {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [{ type: 'warning', message: `AIの応答を解析できませんでした。\n生の応答: ${cleaned.slice(0, 200)}` }];
    }
}

/** エラーメッセージ生成 */
function _buildErrorMessage(provider, error) {
    const msg = error.message || '';
    const table = {
        GEMINI_NO_KEY:     'GeminiのAPIキーが設定されていません。',
        GEMINI_HTTP_400:   'GeminiへのリクエストFormが不正です（APIキー形式エラーの可能性）。',
        GEMINI_HTTP_401:   'GeminiのAPIキーが無効です。',
        GEMINI_HTTP_403:   'GeminiのAPIキーに権限がありません。',
        GEMINI_HTTP_429:   'Geminiのレート制限に達しました。しばらく待ってから再試行してください。',
        GROQ_NO_KEY:       'GroqのAPIキーが設定されていません。',
        GROQ_HTTP_401:     'GroqのAPIキーが無効です。',
        GROQ_HTTP_429:     'Groqのレート制限に達しました。',
        OPENAI_NO_KEY:     'OpenAIのAPIキーが設定されていません。',
        OPENAI_HTTP_401:   'OpenAIのAPIキーが無効です。',
        OPENAI_HTTP_429:   'OpenAIのレート制限に達しました。',
    };
    for (const [key, val] of Object.entries(table)) {
        if (msg.includes(key)) return val;
    }
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        return `${provider} への接続に失敗しました。インターネット接続またはサーバーURLを確認してください。`;
    }
    return `AI校正エラー (${provider}): ${msg}`;
}

/**
 * HEXカラーコードを "r,g,b" 文字列に変換（モーダルのrgba()用）
 * @param {string} hex - "#xxxxxx" または "#xxx"
 * @returns {string} "r,g,b"
 */
function _hexToRgb(hex) {
    const h = hex.replace('#', '');
    const full = h.length === 3
        ? h.split('').map(c => c + c).join('')
        : h;
    const r = parseInt(full.substring(0, 2), 16);
    const g = parseInt(full.substring(2, 4), 16);
    const b = parseInt(full.substring(4, 6), 16);
    return `${r},${g},${b}`;
}

