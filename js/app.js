/**
 * App.js
 * Main UI Controller for Council-Hub
 */

class App {
    constructor() {
        this.currentView = 'home';
        this.views = {
            home: this.renderHome.bind(this),
            ringisho: this.renderRingisho.bind(this),
            attendance: this.renderAttendance.bind(this),
            equipment: this.renderEquipment.bind(this),
            todo: this.renderTodo.bind(this),
            schedule: this.renderSchedule.bind(this),
            soukai: this.renderSoukai.bind(this),
            seiunsai: this.renderSeiunsai.bind(this),
            search: this.renderSearch.bind(this)
        };

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupSidebarToggle();
        this.loadView('home');
        this.checkAIRecommendation();
        this.setupGlobalSettings();
    }

    setupGlobalSettings() {
        const btn = document.getElementById('global-ai-settings-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.openAISettingsModal();
            });
        }
    }

    setupSidebarToggle() {
        const toggleBtn = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        const toggleMenu = () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        };

        toggleBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        
        const navLinks = document.querySelectorAll('.nav-links li');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links li');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');

                const viewName = target.getAttribute('data-view');
                if (this.views[viewName]) {
                    this.loadView(viewName);
                } else {
                    this.renderPlaceholder(viewName);
                }
            });
        });
    }

    setupThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        const body = document.body;
        toggleBtn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            
            if(newTheme === 'dark') {
                toggleBtn.innerHTML = '<i class="fas fa-sun"></i> ライトモード';
            } else {
                toggleBtn.innerHTML = '<i class="fas fa-moon"></i> ダークモード';
            }
        });
    }

    loadView(viewName) {
        const container = document.getElementById('view-container');
        const titleEl = document.getElementById('page-title');
        
        const titles = {
            home: 'Dashboard',
            ringisho: '稟議書作成',
            attendance: '出欠簿',
            equipment: '備品管理',
            archive: '活動記録アーカイブ',
            schedule: 'スケジュール',
            soukai: '生徒総会 特設本部',
            seiunsai: '青雲祭 実行委員会'
        };
        titleEl.textContent = titles[viewName] || viewName.toUpperCase();

        container.innerHTML = '';
        const panel = document.createElement('div');
        panel.className = 'view-panel';
        container.appendChild(panel);
        
        this.views[viewName](panel);
    }

    renderPlaceholder(viewName) {
        const container = document.getElementById('view-container');
        document.getElementById('page-title').textContent = viewName.toUpperCase();
        container.innerHTML = `<div class="view-panel"><p><i class="fas fa-tools"></i> 開発中...</p></div>`;
    }

    renderHome(container) {
        // 実際のデータを集計
        if (!this.equipmentData) {
            const saved = localStorage.getItem('ch_equipment');
            this.equipmentData = saved ? JSON.parse(saved) : [];
        }
        if (!this.scheduleEvents) {
            const saved = localStorage.getItem('ch_calendar_events');
            this.scheduleEvents = saved ? JSON.parse(saved) : {};
        }

        const lentCount = this.equipmentData.filter(i => i.status === 'lent').length;
        
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        const todayEventsCount = (this.scheduleEvents[dateStr] || []).length;

        container.innerHTML = `
            <div class="welcome-container" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:40px;">
                <div class="welcome-icon" style="margin-bottom:25px; display:flex; justify-content:center;">
                    <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 12px rgba(74,144,226,0.5));">
                        <defs>
                            <linearGradient id="cosPrimaryMain" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#6ee7b7" />
                                <stop offset="50%" stop-color="#3b82f6" />
                                <stop offset="100%" stop-color="#9333ea" />
                            </linearGradient>
                            <linearGradient id="glassPillarMain" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
                                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.2" />
                            </linearGradient>
                        </defs>
                        <path d="M 2 22 C 8 22, 11 4, 16 4 C 21 4, 24 22, 30 22" fill="none" stroke="url(#cosPrimaryMain)" stroke-width="2" stroke-linecap="round" />
                        <path d="M 2 18 C 8 18, 11 8, 16 8 C 21 8, 24 18, 30 18" fill="none" stroke="url(#cosPrimaryMain)" stroke-width="0.75" stroke-opacity="0.6" stroke-dasharray="2 2" />
                        <path d="M 11 12 C 11 7, 21 7, 21 12 Z" fill="url(#glassPillarMain)" stroke="url(#cosPrimaryMain)" stroke-width="0.5" />
                        <line x1="16" y1="4" x2="16" y2="8" stroke="url(#cosPrimaryMain)" stroke-width="1.5" />
                        <circle cx="16" cy="3" r="1.5" fill="#6ee7b7" />
                        <path d="M 6 15 C 8 12, 10 12, 11 15" fill="none" stroke="url(#cosPrimaryMain)" stroke-width="0.5" />
                        <path d="M 11 15 C 13 12, 15 12, 16 15" fill="none" stroke="url(#cosPrimaryMain)" stroke-width="0.5" />
                        <path d="M 16 15 C 18 12, 19 12, 21 15" fill="none" stroke="url(#cosPrimaryMain)" stroke-width="0.5" />
                        <path d="M 21 15 C 22 12, 24 12, 26 15" fill="none" stroke="url(#cosPrimaryMain)" stroke-width="0.5" />
                        <rect x="5.5" y="15" width="1" height="9" fill="url(#glassPillarMain)" />
                        <rect x="10.5" y="15" width="1" height="9" fill="url(#glassPillarMain)" />
                        <rect x="15.5" y="15" width="1" height="9" fill="url(#glassPillarMain)" />
                        <rect x="20.5" y="15" width="1" height="9" fill="url(#glassPillarMain)" />
                        <rect x="25.5" y="15" width="1" height="9" fill="url(#glassPillarMain)" />
                        <path d="M 4 24 L 28 24 L 29 26 L 3 26 Z" fill="url(#glassPillarMain)" stroke="url(#cosPrimaryMain)" stroke-width="0.5" />
                        <path d="M 3 26 L 29 26 L 31 29 L 1 29 Z" fill="url(#glassPillarMain)" stroke="url(#cosPrimaryMain)" stroke-width="0.5" />
                    </svg>
                </div>
                <h2 style="font-family: 'Yu Mincho', 'Noto Serif JP', serif; font-size:2.2rem; margin-bottom:12px; font-weight:600; letter-spacing:1px; background: var(--welcome-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.1));">Council Operating System (COS) へようこそ</h2>
                <p style="font-family: 'Yu Mincho', 'Noto Serif JP', serif; opacity:0.8; max-width:600px; line-height:1.8; font-size:1.05rem;">
                    生徒会活動をよりスマートに、より美しく。<br>
                    左のメニューから、稟議書の作成、備品の管理、活動記録の確認などを行えます。
                </p>
                <div class="quick-stats" style="display:flex; gap:20px; margin-top:40px;">
                    <div class="stat-card glass-panel" style="padding:20px; border-radius:15px; min-width:150px; cursor:pointer;" onclick="app.loadView('schedule')">
                        <div style="font-size:0.8rem; opacity:0.6;">今日の予定</div>
                        <div style="font-size:1.5rem; font-weight:600; margin-top:5px;">${todayEventsCount} 件</div>
                    </div>
                    <div class="stat-card glass-panel" style="padding:20px; border-radius:15px; min-width:150px; cursor:pointer;" onclick="app.loadView('equipment')">
                        <div style="font-size:0.8rem; opacity:0.6;">未返却備品</div>
                        <div style="font-size:1.5rem; font-weight:600; margin-top:5px; color:${lentCount > 0 ? '#ff3b30' : 'inherit'};">${lentCount} 件</div>
                    </div>
                </div>

                <div class="todo-mini-card glass-panel" style="margin-top:20px; width:100%; max-width:320px; padding:20px; border-radius:15px; text-align:left; cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'" onclick="app.loadView('todo')">
                    <div style="font-size:0.8rem; opacity:0.6; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                        <span><i class="fas fa-check-square" style="color:var(--primary-color);"></i> 最近の ToDo</span>
                        <i class="fas fa-chevron-right" style="font-size:0.7rem;"></i>
                    </div>
                    <div class="todo-mini-list">
                        ${(() => {
                            const todos = JSON.parse(localStorage.getItem('ch_todos') || '[]');
                            const pending = todos.filter(t => !t.completed).slice(0, 3);
                            if (pending.length === 0) return '<div style="opacity:0.4; font-size:0.85rem; padding:5px 0;">タスクはありません</div>';
                            return pending.map(t => `
                                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px; font-size:0.9rem; white-space:nowrap; overflow:hidden;">
                                    <i class="far fa-circle" style="font-size:0.75rem; color:var(--primary-color); flex-shrink:0;"></i>
                                    <span style="text-overflow:ellipsis; overflow:hidden;">${t.text}</span>
                                </div>
                            `).join('');
                        })()}
                    </div>
                </div>
            </div>
        `;
    }

    renderRingisho(container) {
        container.innerHTML = `
            <div class="ringisho-wrapper">
                <div class="ringisho-toolbar">
                    <div class="ringisho-tabs">
                        <button class="ringisho-tab active" data-type="business">
                            <i class="fas fa-briefcase"></i> 事業用
                        </button>
                        <button class="ringisho-tab" data-type="purchase">
                            <i class="fas fa-shopping-cart"></i> 購入用
                        </button>
                    </div>
                    <div class="paper-size-selector">
                        <label><i class="fas fa-ruler-combined"></i> 用紙サイズ</label>
                        <select id="paper-size">
                            <option value="A4" selected>A4 (210×297mm)</option>
                            <option value="B5">B5 (182×257mm)</option>
                            <option value="A5">A5 (148×210mm)</option>
                            <option value="B4">B4 (257×364mm)</option>
                        </select>
                    </div>
                    <button type="button" id="save-default-btn" class="btn-glass btn-sm" style="margin-left: 10px;">
                        <i class="fas fa-save"></i> 常用設定を保存
                    </button>
                </div>

                <div class="ringisho-body">
                    <div class="ringisho-main-layout">
                        <div class="ringisho-form-area glass-panel">
                            <form id="ringisho-form">
                                <div class="form-row">
                                    <div class="form-group form-half">
                                        <label>作成日 <span class="required">*</span></label>
                                        <input type="date" id="r-date">
                                    </div>
                                    <div class="form-group form-half">
                                        <label>宛先（指導部長名） <span class="required">*</span></label>
                                        <input type="text" id="r-teacher" placeholder="例: 佐藤" autocomplete="off">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group form-half">
                                        <label>生徒会 代数 <span class="required">*</span></label>
                                        <input type="number" id="r-generation" placeholder="例: 78" autocomplete="off">
                                    </div>
                                    <div class="form-group form-half">
                                        <label>役員名（メイン）</label>
                                        <input type="text" id="r-member1" placeholder="例: 山田 太郎" autocomplete="off">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>役員名（同）</label>
                                    <div id="sub-member-list" class="item-list"></div>
                                    <button type="button" id="add-sub-member-btn" class="btn-glass btn-sm">
                                        <i class="fas fa-plus"></i> 追加
                                    </button>
                                </div>
                                <div class="form-group">
                                    <label>題名 <span class="required">*</span></label>
                                    <input type="text" id="r-summary" placeholder="例: 文化祭における備品購入について" autocomplete="off">
                                </div>
                                <div class="form-group">
                                    <label>概要 <span class="required">*</span></label>
                                    <textarea id="r-overview" rows="3" placeholder="事業や購入の概要を記述"></textarea>
                                </div>
                                <div class="form-group">
                                    <label>理由 <span class="required">*</span></label>
                                    <div style="display:flex; gap:8px; margin-bottom:4px;">
                                        <button type="button" id="ai-gen-reason-btn" class="btn-glass btn-sm">
                                            <i class="fas fa-magic"></i> AIで理由を提案
                                        </button>
                                    </div>
                                    <textarea id="r-reason" rows="3" placeholder="理由を記述"></textarea>
                                </div>
                                <div id="purchase-details" class="purchase-only" style="display:none;">
                                    <label>詳細（品目）</label>
                                    <div id="item-list" class="item-list"></div>
                                    <button type="button" id="add-item-btn" class="btn-glass btn-sm">
                                        <i class="fas fa-plus"></i> 品目を追加
                                    </button>
                                    <div class="form-group" style="margin-top:16px;">
                                        <label>金額（税込合計）</label>
                                        <div class="amount-input">
                                            <span class="currency">¥</span>
                                            <input type="number" id="r-total-amount" placeholder="0">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>備考 <span class="optional">（追加・削除可能）</span></label>
                                    <div id="note-list"></div>
                                    <button type="button" id="add-note-btn" class="btn-glass btn-sm" style="margin-top: 8px;">
                                        <i class="fas fa-plus"></i> 備考を追加
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div class="ai-side-panel glass-panel">

                            <div class="ai-panel-content">
                                <div class="ai-header-minimal">
                                    <span class="ai-label">AIアシスタント</span>
                                </div>
                                
                                <div class="ai-body">
                                    <!-- Status Message -->
                                    <div class="ai-comment-container">
                                        <div id="ai-status-msg" class="ai-comment-text">
                                            入力内容を分析し、誤字脱字や矛盾をこちらに表示します。
                                        </div>
                                    </div>

                                    <!-- Results below -->
                                    <div id="ai-warnings" class="ai-warnings-list"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ringisho-actions">
                        <button type="button" id="proofread-btn" class="btn-glass">
                            <i class="fas fa-spell-check"></i> AI校正
                        </button>
                        <button type="button" id="preview-btn" class="btn-glass">
                            <i class="fas fa-eye"></i> プレビュー
                        </button>
                        <button type="button" id="download-btn" class="btn-primary">
                            <i class="fas fa-file-word"></i> Word
                        </button>
                        <button type="button" id="download-pdf-btn" class="btn-primary">
                            <i class="fas fa-file-pdf"></i> PDF
                        </button>
                    </div>
                </div>

                <div id="ringisho-preview" class="ringisho-preview-overlay" style="display:none;">
                    <div class="preview-backdrop">
                        <div class="preview-toolbar">
                            <h3><i class="fas fa-file-alt"></i> 印刷プレビュー</h3>
                            <div class="preview-toolbar-right">
                                <span id="preview-size-label" class="preview-size-label">A4</span>
                                <button id="preview-download-btn" class="btn-primary"><i class="fas fa-download"></i> ダウンロード (.docx)</button>
                                <button id="close-preview" class="btn-icon"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                        <div class="preview-scroll-area">
                            <div class="preview-inner-container">
                                <div id="paper-sheet" class="paper-sheet paper-A4">
                                    <div id="preview-content" class="paper-content"></div>
                                </div>
                                <div class="preview-footer-actions">
                                    <button id="preview-download-btn-bottom" class="btn-primary">
                                        <i class="fas fa-download"></i> ダウンロード (.docx)
                                    </button>
                                    <button id="preview-close-btn-bottom" class="btn-glass">
                                        閉じる
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.initRingishoLogic();
    }

    initRingishoLogic() {
        const savedData = JSON.parse(localStorage.getItem('ch_ringisho_defaults') || '{}');
        
        const state = { 
            type: 'business', 
            items: [{ name: '', quantity: '', company: '', price: '' }],
            subMembers: savedData.subMembers || [{ name: '' }],
            notes: savedData.notes || []
        };

        document.getElementById('r-date').valueAsDate = new Date();
        
        if (savedData.generation) document.getElementById('r-generation').value = savedData.generation;
        if (savedData.member1) document.getElementById('r-member1').value = savedData.member1;
        if (savedData.teacher) document.getElementById('r-teacher').value = savedData.teacher;

        const tabs = document.querySelectorAll('.ringisho-tab');
        const purchaseSection = document.getElementById('purchase-details');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.type = tab.dataset.type;
                purchaseSection.style.display = state.type === 'purchase' ? 'block' : 'none';
            });
        });

        const renderItems = () => {
            const list = document.getElementById('item-list');
            list.innerHTML = '';
            state.items.forEach((item, idx) => {
                const row = document.createElement('div');
                row.className = 'item-row';
                row.innerHTML = `
                    <input type="text" placeholder="品名" value="${item.name}" data-idx="${idx}" data-field="name" class="item-input">
                    <input type="number" placeholder="個数" value="${item.quantity}" data-idx="${idx}" data-field="quantity" class="item-input item-sm">
                    <input type="text" placeholder="販売会社" value="${item.company}" data-idx="${idx}" data-field="company" class="item-input">
                    <input type="number" placeholder="単価" value="${item.price}" data-idx="${idx}" data-field="price" class="item-input item-sm">
                    <button type="button" class="btn-icon-sm remove-item" data-idx="${idx}" ${state.items.length <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                list.appendChild(row);
            });

            list.querySelectorAll('.item-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const i = parseInt(e.target.dataset.idx);
                    const field = e.target.dataset.field;
                    state.items[i][field] = e.target.value;
                });
            });

            list.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const i = parseInt(e.currentTarget.dataset.idx);
                    state.items.splice(i, 1);
                    renderItems();
                });
            });
        };

        const renderSubMembers = () => {
            const list = document.getElementById('sub-member-list');
            list.innerHTML = '';
            state.subMembers.forEach((mem, idx) => {
                const row = document.createElement('div');
                row.className = 'item-row';
                row.innerHTML = `
                    <input type="text" placeholder="例: 鈴木 花子" value="${mem.name}" data-idx="${idx}" class="item-input sub-member-input">
                    <button type="button" class="btn-icon-sm remove-sub-member" data-idx="${idx}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                list.appendChild(row);
            });

            list.querySelectorAll('.sub-member-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const i = parseInt(e.target.dataset.idx);
                    state.subMembers[i].name = e.target.value;
                });
            });

            list.querySelectorAll('.remove-sub-member').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const i = parseInt(e.currentTarget.dataset.idx);
                    state.subMembers.splice(i, 1);
                    renderSubMembers();
                });
            });
        };

        const renderNotes = () => {
            const list = document.getElementById('note-list');
            list.innerHTML = '';
            state.notes.forEach((note, idx) => {
                const row = document.createElement('div');
                row.className = 'item-row';
                row.innerHTML = `
                    <input type="text" placeholder="特記事項を記入" value="${note}" data-idx="${idx}" class="item-input note-input">
                    <button type="button" class="btn-icon-sm remove-note" data-idx="${idx}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                list.appendChild(row);
            });

            list.querySelectorAll('.note-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const i = parseInt(e.target.dataset.idx);
                    state.notes[i] = e.target.value;
                });
            });

            list.querySelectorAll('.remove-note').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const i = parseInt(e.currentTarget.dataset.idx);
                    state.notes.splice(i, 1);
                    renderNotes();
                });
            });
        };

        document.getElementById('add-sub-member-btn').addEventListener('click', () => {
            state.subMembers.push({ name: '' });
            renderSubMembers();
        });

        document.getElementById('add-note-btn').addEventListener('click', () => {
            state.notes.push('');
            renderNotes();
        });

        renderSubMembers();
        renderNotes();

        document.getElementById('add-item-btn').addEventListener('click', () => {
            state.items.push({ name: '', quantity: '', company: '', price: '' });
            renderItems();
        });

        renderItems();

        document.getElementById('preview-btn').addEventListener('click', () => {
            this.showRingishoPreview(state);
        });

        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadRingisho(state);
        });
        document.getElementById('download-pdf-btn').addEventListener('click', () => {
            this.downloadRingishoPDF(state);
        });
        document.getElementById('preview-download-btn').addEventListener('click', () => {
            this.downloadRingisho(state);
        });
        document.getElementById('preview-download-btn-bottom').addEventListener('click', () => {
            this.downloadRingisho(state);
        });

        const closePreview = () => {
            document.getElementById('ringisho-preview').style.display = 'none';
        };
        document.getElementById('close-preview').addEventListener('click', closePreview);
        document.getElementById('preview-close-btn-bottom').addEventListener('click', closePreview);

        document.getElementById('save-default-btn').addEventListener('click', () => {
            const defaults = {
                generation: document.getElementById('r-generation').value,
                member1: document.getElementById('r-member1').value,
                teacher: document.getElementById('r-teacher').value,
                subMembers: state.subMembers
            };
            localStorage.setItem('ch_ringisho_defaults', JSON.stringify(defaults));
            alert('代数、役員名、指導部長名を「常用設定」として保存しました。');
        });

        document.getElementById('ai-gen-reason-btn').addEventListener('click', async () => {
            const overview = document.getElementById('r-overview').value;
            if (!overview) {
                alert('先に「概要」を入力してください。');
                return;
            }
            const btn = document.getElementById('ai-gen-reason-btn');
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI生成中...';
            btn.disabled = true;

            try {
                const reason = await OSAPI.AI.generateReason(overview);
                document.getElementById('r-reason').value = reason;
            } catch (e) {
                alert('AI生成に失敗しました。');
            } finally {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }
        });

        document.getElementById('proofread-btn').addEventListener('click', async () => {
            const btn = document.getElementById('proofread-btn');
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 校正中...';
            btn.disabled = true;

            try {
                await this.runProofread(state);
            } finally {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }
        });    }

    async runProofread(state) {
        const formData = this.collectFormData(state);
        const warnings = await OSAPI.AI.proofreadRingisho(formData);
        const area = document.getElementById('ai-warnings');

        if (warnings.length === 0) {
            area.innerHTML = `
                <div class="ai-no-warnings">
                    <i class="fas fa-check-circle"></i>
                    <p>特に問題は見つかりませんでした。</p>
                </div>
            `;
            return;
        }

        area.innerHTML = warnings.map(w => `
            <div class="ai-warning ai-${w.type}">
                <div class="ai-warning-icon">
                    <i class="fas ${w.type === 'error' ? 'fa-exclamation-circle' : w.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                </div>
                <div class="ai-warning-content">${w.message}</div>
            </div>
        `).join('');
    }

    openAISettingsModal() {
        const existing = document.getElementById('ai-settings-modal');
        if (existing) existing.remove();

        const currentProvider = OSAPI.AI.getProvider();
        const providers = OSAPI.AI.PROVIDERS;

        /* ── フィールド値を localStorage から読む ── */
        const vals = {
            ollamaUrl:    OSAPI.AI.getOllamaBaseUrl(),
            ollamaModel:  OSAPI.AI.getOllamaModel(),
            geminiKey:    OSAPI.AI.getGeminiApiKey(),
            groqKey:      OSAPI.AI.getGroqApiKey(),
            groqModel:    OSAPI.AI.getGroqModel(),
            openaiKey:    OSAPI.AI.getOpenAIApiKey(),
            openaiModel:  OSAPI.AI.getOpenAIModel(),
            openaiBaseUrl:OSAPI.AI.getOpenAIBaseUrl(),
            anthropicKey: OSAPI.AI.getAnthropicApiKey(),
            anthropicModel:OSAPI.AI.getAnthropicModel(),
        };

        /* ── プロバイダーカード HTML ── */
        const cardHTML = providers.map(p => `
            <label class="ai-prov-card ${p.id === currentProvider ? 'selected' : ''}" data-prov="${p.id}" style="
                display:flex; flex-direction:column; gap:4px;
                flex:1; min-width:100px; border:2px solid ${p.id === currentProvider ? p.color : 'transparent'};
                border-radius:12px; padding:12px 10px; cursor:pointer;
                background:${p.id === currentProvider ? `rgba(${_hexToRgb(p.color)},0.14)` : 'rgba(255,255,255,0.04)'};
                transition:all 0.2s; text-align:center;
            ">
                <input type="radio" name="ai-provider" value="${p.id}" ${p.id === currentProvider ? 'checked' : ''} style="display:none;">
                <i class="fas ${p.icon}" style="font-size:1.3rem; color:${p.color}; margin-bottom:4px;"></i>
                <span style="font-weight:700; font-size:0.88rem;">${p.name}</span>
                <span style="font-size:0.7rem; opacity:0.6;">${p.label}</span>
                ${p.offline ? '<span style="font-size:0.65rem; margin-top:4px; color:#34d399;">● オフライン</span>' : ''}
            </label>
        `).join('');

        /* ── 設定フォーム HTML（全プロバイダー分、display切替） ── */
        const formHTML = `
            <!-- Ollama -->
            <div class="ai-prov-form" data-form="ollama" style="display:${currentProvider==='ollama'?'block':'none'}">
                <div class="ai-form-row">
                    <label>サーバー URL</label>
                    <input type="text" id="set-ollama-url" value="${vals.ollamaUrl}" placeholder="http://localhost:11434" style="font-family:monospace;">
                </div>
                <div class="ai-form-row">
                    <label>モデル</label>
                    <div style="display:flex; gap:8px;">
                        <select id="set-ollama-model" style="flex:1;">
                            <option value="${vals.ollamaModel}">${vals.ollamaModel}</option>
                        </select>
                        <button id="ollama-fetch-models" class="btn-glass btn-sm"><i class="fas fa-sync-alt"></i> 取得</button>
                    </div>
                    <p class="ai-form-hint">推奨: gemma3:4b（軽量）, gemma3:12b（高精度）</p>
                </div>
                <div id="ollama-badge" class="ai-status-badge">
                    <i class="fas fa-circle-notch fa-spin"></i> 確認中...
                </div>
            </div>

            <!-- Gemini -->
            <div class="ai-prov-form" data-form="gemini" style="display:${currentProvider==='gemini'?'block':'none'}">
                <div class="ai-form-row">
                    <label>API キー</label>
                    <input type="password" id="set-gemini-key" value="${vals.geminiKey}" placeholder="AIza..." style="font-family:monospace;">
                </div>
                <p class="ai-form-hint">
                    <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--primary-color);">Google AI Studio</a>
                    でキーを取得できます。※インターネット接続が必要です。
                </p>
            </div>

            <!-- Groq -->
            <div class="ai-prov-form" data-form="groq" style="display:${currentProvider==='groq'?'block':'none'}">
                <div class="ai-form-row">
                    <label>API キー</label>
                    <input type="password" id="set-groq-key" value="${vals.groqKey}" placeholder="gsk_..." style="font-family:monospace;">
                </div>
                <div class="ai-form-row">
                    <label>モデル</label>
                    <select id="set-groq-model">
                        ${[
                            ['llama-3.3-70b-versatile', 'Llama 3.3 70B（推奨）'],
                            ['llama3-8b-8192',          'Llama 3 8B（軽量）'],
                            ['gemma2-9b-it',            'Gemma 2 9B'],
                            ['mixtral-8x7b-32768',      'Mixtral 8x7B'],
                        ].map(([v,l]) => `<option value="${v}" ${vals.groqModel===v?'selected':''}>${l}</option>`).join('')}
                    </select>
                </div>
                <p class="ai-form-hint">
                    <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i>
                    <a href="https://console.groq.com/keys" target="_blank" style="color:var(--primary-color);">console.groq.com</a>
                    で無料APIキーを取得。※インターネット接続が必要です。
                </p>
            </div>

            <!-- OpenAI -->
            <div class="ai-prov-form" data-form="openai" style="display:${currentProvider==='openai'?'block':'none'}">
                <div class="ai-form-row">
                    <label>API キー</label>
                    <input type="password" id="set-openai-key" value="${vals.openaiKey}" placeholder="sk-..." style="font-family:monospace;">
                </div>
                <div class="ai-form-row">
                    <label>モデル</label>
                    <select id="set-openai-model">
                        ${[
                            ['gpt-4o-mini',   'GPT-4o mini（推奨・低コスト）'],
                            ['gpt-4o',        'GPT-4o'],
                            ['gpt-4-turbo',   'GPT-4 Turbo'],
                            ['gpt-3.5-turbo', 'GPT-3.5 Turbo（安価）'],
                        ].map(([v,l]) => `<option value="${v}" ${vals.openaiModel===v?'selected':''}>${l}</option>`).join('')}
                    </select>
                </div>
                <div class="ai-form-row">
                    <label>ベース URL <span style="font-size:0.7rem; opacity:0.5;">（互換APIの場合のみ変更）</span></label>
                    <input type="text" id="set-openai-base-url" value="${vals.openaiBaseUrl}" placeholder="https://api.openai.com/v1" style="font-family:monospace;">
                </div>
                <p class="ai-form-hint">
                    <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i>
                    <a href="https://platform.openai.com/api-keys" target="_blank" style="color:var(--primary-color);">platform.openai.com</a>
                    でキーを取得。※インターネット接続が必要です。
                </p>
            </div>

            <!-- Anthropic (Claude) -->
            <div class="ai-prov-form" data-form="anthropic" style="display:${currentProvider==='anthropic'?'block':'none'}">
                <div class="ai-form-row">
                    <label>API キー</label>
                    <input type="password" id="set-anthropic-key" value="${vals.anthropicKey}" placeholder="sk-ant-..." style="font-family:monospace;">
                </div>
                <div class="ai-form-row">
                    <label>モデル</label>
                    <select id="set-anthropic-model">
                        ${[
                            ['claude-3-5-sonnet-latest', 'Claude 3.5 Sonnet（推奨）'],
                            ['claude-3-5-haiku-latest',  'Claude 3.5 Haiku（高速）'],
                            ['claude-3-opus-latest',     'Claude 3 Opus（最高精度）']
                        ].map(([v,l]) => `<option value="${v}" ${vals.anthropicModel===v?'selected':''}>${l}</option>`).join('')}
                    </select>
                </div>
                <p class="ai-form-hint">
                    <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i>
                    <a href="https://console.anthropic.com/" target="_blank" style="color:var(--primary-color);">console.anthropic.com</a>
                    でキーを取得。※ブラウザから直接リクエストするため、CORSエラーになる場合があります。
                </p>
            </div>
        `;

        /* ── モーダル組み立て ── */
        const modal = document.createElement('div');
        modal.id = 'ai-settings-modal';
        modal.style.cssText = `
            position:fixed; inset:0; z-index:9999;
            display:flex; align-items:center; justify-content:center;
            background:rgba(0,0,0,0.58); backdrop-filter:blur(8px);
        `;
        modal.innerHTML = `
            <div class="glass-panel" style="
                width:520px; max-width:96vw; max-height:90vh; overflow-y:auto;
                border-radius:20px; padding:32px;
                box-shadow:0 28px 90px rgba(0,0,0,0.45); position:relative;
            ">
                <button id="ai-settings-close" style="
                    position:absolute; top:14px; right:14px;
                    background:none; border:none; cursor:pointer;
                    font-size:1.2rem; opacity:0.45; color:inherit;
                "><i class="fas fa-times"></i></button>

                <h3 style="margin:0 0 4px; font-size:1.1rem; display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-microchip" style="color:var(--primary-color);"></i>
                    AI エンジン設定
                </h3>
                <p style="font-size:0.78rem; opacity:0.5; margin:0 0 20px;">
                    使用するAIバックエンドを切り替えられます。
                </p>

                <!-- プロバイダー選択カード -->
                <div style="display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap;">
                    ${cardHTML}
                </div>

                <!-- 各プロバイダー設定フォーム -->
                <div class="ai-form-area">
                    ${formHTML}
                </div>

                <!-- 保存ボタン -->
                <button id="ai-settings-save" class="btn-primary" style="width:100%; margin-top:20px; padding:14px;">
                    <i class="fas fa-save"></i> 設定を保存して閉じる
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        this._bindAISettingsModal(modal);
    }

    _bindAISettingsModal(modal) {
        /* カード切り替え */
        modal.querySelectorAll('.ai-prov-card').forEach(card => {
            card.addEventListener('click', () => {
                const provId = card.dataset.prov;
                const providers = OSAPI.AI.PROVIDERS;
                const prov = providers.find(p => p.id === provId);

                /* カードスタイル更新 */
                modal.querySelectorAll('.ai-prov-card').forEach(c => {
                    const cp = providers.find(p => p.id === c.dataset.prov);
                    const active = c.dataset.prov === provId;
                    c.style.borderColor = active ? cp.color : 'transparent';
                    c.style.background  = active ? `rgba(${_hexToRgb(cp.color)},0.14)` : 'rgba(255,255,255,0.04)';
                    c.classList.toggle('selected', active);
                });

                /* フォーム表示切替 */
                modal.querySelectorAll('.ai-prov-form').forEach(f => {
                    f.style.display = f.dataset.form === provId ? 'block' : 'none';
                });

                /* ラジオ同期 */
                const radio = card.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });

        /* Ollama ステータス確認 */
        const badge = modal.querySelector('#ollama-badge');
        OSAPI.AI.checkOllamaStatus().then(online => {
            badge.innerHTML = online
                ? '<span style="color:#34d399;"><i class="fas fa-circle" style="font-size:0.6rem;"></i> 起動中</span>'
                : '<span style="color:#f87171;"><i class="fas fa-circle" style="font-size:0.6rem;"></i> 停止中 — Ollamaを起動してください</span>';
        });

        /* Ollama モデル取得 */
        modal.querySelector('#ollama-fetch-models').addEventListener('click', async () => {
            const btn = modal.querySelector('#ollama-fetch-models');
            const urlInput = modal.querySelector('#set-ollama-url');
            localStorage.setItem('cos_ollama_url', urlInput.value.trim() || 'http://localhost:11434');

            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            const models = await OSAPI.AI.getOllamaModels();
            btn.innerHTML = orig;

            const select = modal.querySelector('#set-ollama-model');
            if (models.length > 0) {
                const cur = OSAPI.AI.getOllamaModel();
                select.innerHTML = models.map(m => `<option value="${m}" ${m===cur?'selected':''}>${m}</option>`).join('');
            } else {
                alert('モデルの取得に失敗しました。OllamaのURLと起動状態を確認してください。');
            }
        });

        /* 閉じる */
        modal.querySelector('#ai-settings-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

        /* 保存 */
        modal.querySelector('#ai-settings-save').addEventListener('click', () => {
            const selected = modal.querySelector('[name="ai-provider"]:checked')?.value || 'ollama';
            OSAPI.AI.setProvider(selected);

            /* 各フィールドを保存 */
            const g = id => modal.querySelector(`#${id}`)?.value?.trim() || '';
            localStorage.setItem('cos_ollama_url',      g('set-ollama-url')       || 'http://localhost:11434');
            localStorage.setItem('cos_ollama_model',    g('set-ollama-model')     || 'gemma3:4b');
            localStorage.setItem('cos_gemini_api_key',  g('set-gemini-key'));
            localStorage.setItem('cos_groq_api_key',    g('set-groq-key'));
            localStorage.setItem('cos_groq_model',      modal.querySelector('#set-groq-model')?.value   || 'llama-3.3-70b-versatile');
            localStorage.setItem('cos_openai_api_key',  g('set-openai-key'));
            localStorage.setItem('cos_openai_model',    modal.querySelector('#set-openai-model')?.value || 'gpt-4o-mini');
            localStorage.setItem('cos_openai_base_url', g('set-openai-base-url') || 'https://api.openai.com/v1');
            localStorage.setItem('cos_anthropic_api_key', g('set-anthropic-key'));
            localStorage.setItem('cos_anthropic_model',   modal.querySelector('#set-anthropic-model')?.value || 'claude-3-5-sonnet-latest');

            this._updateAIStatusBar(selected);
            modal.remove();
        });
    }

    _updateAIStatusBar(provider) {
        const el = document.getElementById('ai-status');
        if (!el) return;
        const prov = (OSAPI.AI.PROVIDERS || []).find(p => p.id === provider);
        const name = prov ? prov.name : provider;
        const icon = prov ? prov.icon : 'fa-microchip';

        if (provider === 'ollama') {
            el.innerHTML = `<i class="fas ${icon}"></i> ${name}`;
            OSAPI.AI.checkOllamaStatus().then(online => {
                el.innerHTML = online
                    ? `<i class="fas ${icon}"></i> ${name} <span style="color:#34d399; font-size:0.7rem;">● Online</span>`
                    : `<i class="fas ${icon}" style="color:#f87171;"></i> ${name} <span style="color:#f87171; font-size:0.7rem;">● Offline</span>`;
            });
        } else {
            el.innerHTML = `<i class="fas ${icon}"></i> ${name}`;
        }
    }



    collectFormData(state) {
        return {
            type: state.type,
            date: document.getElementById('r-date')?.value || '',
            teacher: document.getElementById('r-teacher')?.value || '',
            generation: document.getElementById('r-generation')?.value || '',
            member1: document.getElementById('r-member1')?.value || '',
            subMembers: state.subMembers.map(m => m.name).filter(n => n.trim() !== ''),
            summary: document.getElementById('r-summary')?.value || '',
            overview: document.getElementById('r-overview')?.value || '',
            reason: document.getElementById('r-reason')?.value || '',
            notes: state.notes.filter(n => n.trim() !== ''),
            items: state.items,
            totalAmount: document.getElementById('r-total-amount')?.value || '',
        };
    }

    showRingishoPreview(state) {
        const data = this.collectFormData(state);
        const preview = document.getElementById('ringisho-preview');
        const content = document.getElementById('preview-content');
        const paperSheet = document.getElementById('paper-sheet');
        const sizeLabel = document.getElementById('preview-size-label');
        const paperSize = document.getElementById('paper-size').value;

        paperSheet.className = 'paper-sheet paper-' + paperSize;
        sizeLabel.textContent = paperSize;

        content.innerHTML = this.generateRingishoHTML(data);
        preview.style.display = 'flex';
    }

    generateRingishoHTML(data, bodyOnly = false) {
        let dateStr = '';
        if (data.date) {
            const d = new Date(data.date);
            const reiwa = d.getFullYear() - 2018;
            dateStr = `令和${reiwa}年${d.getMonth() + 1}月${d.getDate()}日`;
        } else {
            const today = new Date();
            const reiwa = today.getFullYear() - 2018;
            dateStr = `令和${reiwa}年${today.getMonth() + 1}月${today.getDate()}日`;
        }

        const teacherName = data.teacher ? data.teacher + '先生' : '＿＿＿＿先生';
        const genNum = data.generation || '＿';
        const member1Name = data.member1 ? `　${data.member1}` : '';

        let sectionNum = 1;
        
        let headerHtml = `
            <p class="doc-date">${dateStr}</p>
            <p class="doc-addressee">生徒会指導部長　${teacherName}</p>
            <table style="border-collapse: collapse; margin-bottom: 24px; border: none; margin-left: auto;">
                <tr>
                    <td style="text-align: right; padding-right: 12px; font-size: 10.5pt; white-space: nowrap;">第${genNum}代生徒会</td>
                    <td style="text-align: left; font-size: 10.5pt; white-space: nowrap;">${data.member1 ? '　' + data.member1 : ''}　<u>印</u></td>
                </tr>
                ${data.subMembers.map(name => `
                    <tr>
                        <td style="text-align: right; padding-right: 12px; font-size: 10.5pt; white-space: nowrap;">同</td>
                        <td style="text-align: left; font-size: 10.5pt; white-space: nowrap;">　${name}</td>
                    </tr>
                `).join('')}
            </table>
            <br>
            <p class="doc-title-line">${data.summary || '題名未入力'}</p>
            <br>
            <p class="doc-greeting">表題の件につきまして、ご承認いただきたくお願い申し上げます。</p>
            <br>
            <p class="doc-ki">記</p>
            <br>
        `;

        let bodyHtml = `
            <p class="doc-section-head">${sectionNum}.概要</p>
            <p class="doc-section-body">${data.overview || '（未入力）'}</p>
            <br>
        `;
        sectionNum++;

        bodyHtml += `
            <p class="doc-section-head">${sectionNum}.理由</p>
            <p class="doc-section-body">${data.reason || '（未入力）'}</p>
            <br>
        `;
        sectionNum++;

        if (data.type === 'purchase') {
            bodyHtml += `<p class="doc-section-head">${sectionNum}.詳細</p>`;
            bodyHtml += `<table class="paper-inner-table" style="margin: 8px 0 4px 16px;">
                <thead><tr><th>品名</th><th>個数</th><th>販売会社</th><th>単価</th></tr></thead><tbody>`;
            data.items.forEach(item => {
                if (item.name || item.quantity || item.company || item.price) {
                    bodyHtml += `<tr>
                        <td>${item.name || '-'}</td>
                        <td>${item.quantity || '-'}</td>
                        <td>${item.company || '-'}</td>
                        <td>${item.price ? '¥' + parseInt(item.price).toLocaleString() : '-'}</td>
                    </tr>`;
                }
            });
            bodyHtml += `</tbody></table><br>`;
            sectionNum++;

            bodyHtml += `
                <p class="doc-section-head">${sectionNum}.金額</p>
                <p class="doc-section-body doc-amount">¥${data.totalAmount ? parseInt(data.totalAmount).toLocaleString() : '0'}－（税込）</p>
                <br>
            `;
            sectionNum++;
        }

        if (data.notes.length > 0) {
            bodyHtml += `<p class="doc-section-head">${sectionNum}.備考</p>`;
            data.notes.forEach(note => {
                bodyHtml += `<p class="doc-section-body">${note}</p>`;
            });
            bodyHtml += `<br>`;
        }

        bodyHtml += `<p class="doc-end">以上</p>`;

        return bodyOnly ? bodyHtml : (headerHtml + bodyHtml);
    }

    getRingishoFilename(data) {
        const summary = data.summary ? data.summary.trim() : '題名なし';
        let dateSuffix = '';
        if (data.date) {
            const d = new Date(data.date);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            dateSuffix = `${y}${m}${day}`;
        } else {
            const now = new Date();
            dateSuffix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        }
        return `${summary}_${dateSuffix}`;
    }

    async downloadRingisho(state) {
        const data = this.collectFormData(state);
        const filename = this.getRingishoFilename(data);
        const warnings = await OSAPI.AI.proofreadRingisho(data);
        const errors = warnings.filter(w => w.type === 'error');

        if (errors.length > 0) {
            const proceed = confirm(`${errors.length}件のエラーがあります。\n\n${errors.map(e => '・' + e.message).join('\n')}\n\nこのままダウンロードしますか？`);
            if (!proceed) return;
        }

        let dateStr = '';
        if (data.date) {
            const d = new Date(data.date);
            const reiwa = d.getFullYear() - 2018;
            dateStr = `令和${reiwa}年${d.getMonth() + 1}月${d.getDate()}日`;
        } else {
            const today = new Date();
            const reiwa = today.getFullYear() - 2018;
            dateStr = `令和${reiwa}年${today.getMonth() + 1}月${today.getDate()}日`;
        }
        const teacherName = data.teacher ? data.teacher + '先生' : '＿＿＿＿先生';
        const genNum = data.generation || '＿';
        const paperSize = document.getElementById('paper-size')?.value || 'A4';

        // ── docx ライブラリ（jsDelivr CDN）でページサイズを正確に指定 ──
        // 単位: twip (1 inch = 1440 twip, 1 mm ≈ 56.692913 twip)
        const pageSizeTwipMap = {
            'A4': { width: 11906, height: 16838 }, // 210mm × 297mm
            'A5': { width:  8391, height: 11906 }, // 148mm × 210mm
            'B4': { width: 14572, height: 20639 }, // 257mm × 364mm
            'B5': { width: 10319, height: 14572 }, // 182mm × 257mm
        };
        const twipSize = pageSizeTwipMap[paperSize] || pageSizeTwipMap['A4'];
        // 余白: 上下25mm≒1418twip, 左右20mm≒1134twip
        const margins = { top: 1418, right: 1134, bottom: 1418, left: 1134, header: 709, footer: 709 };

        if (typeof docx !== 'undefined') {
            try {
                const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
                        AlignmentType, BorderStyle, UnderlineType, HeadingLevel, convertInchesToTwip,
                        PageSize, PageOrientation, SectionType } = docx;

                const mmToTwip = mm => Math.round(mm * 56.6929);

                // ヘルパー: 段落生成
                const para = (text, opts = {}) => new Paragraph({
                    alignment: opts.align || AlignmentType.LEFT,
                    spacing: { before: opts.spaceBefore || 0, after: opts.spaceAfter || 80 },
                    children: [new TextRun({
                        text,
                        bold: opts.bold || false,
                        size: opts.size || 21, // 10.5pt = 21 half-points
                        font: 'Yu Mincho',
                        underline: opts.underline ? { type: UnderlineType.SINGLE } : undefined,
                    })],
                });

                const emptyLine = () => new Paragraph({ children: [new TextRun({ text: '', font: 'Yu Mincho', size: 21 })], spacing: { after: 80 } });

                // 送信者ブロック（右寄せ表）
                const noBorder = { 
                    top: { style: BorderStyle.NIL, size: 0, color: "auto" }, 
                    bottom: { style: BorderStyle.NIL, size: 0, color: "auto" }, 
                    left: { style: BorderStyle.NIL, size: 0, color: "auto" }, 
                    right: { style: BorderStyle.NIL, size: 0, color: "auto" } 
                };
                const senderRows = [
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: noBorder,
                                children: [new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [new TextRun({ text: `第${genNum}代生徒会`, font: 'Yu Mincho', size: 21 })]
                                })],
                            }),
                            new TableCell({
                                borders: noBorder,
                                children: [new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    children: [
                                        new TextRun({ text: `　${data.member1 || ''}　`, font: 'Yu Mincho', size: 21 }),
                                        new TextRun({ text: '印', font: 'Yu Mincho', size: 21, underline: { type: UnderlineType.SINGLE } }),
                                    ]
                                })],
                            }),
                        ],
                    }),
                    ...data.subMembers.map(name => new TableRow({
                        children: [
                            new TableCell({
                                borders: noBorder,
                                children: [new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [new TextRun({ text: '同', font: 'Yu Mincho', size: 21 })]
                                })],
                            }),
                            new TableCell({
                                borders: noBorder,
                                children: [new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    children: [new TextRun({ text: `　${name}`, font: 'Yu Mincho', size: 21 })]
                                })],
                            }),
                        ],
                    }))
                ];
                const senderTable = new Table({
                    alignment: AlignmentType.RIGHT,
                    width: { size: 0, type: WidthType.AUTO },
                    borders: { 
                        top: { style: BorderStyle.NIL, size: 0, color: "auto" }, 
                        bottom: { style: BorderStyle.NIL, size: 0, color: "auto" }, 
                        left: { style: BorderStyle.NIL, size: 0, color: "auto" }, 
                        right: { style: BorderStyle.NIL, size: 0, color: "auto" }, 
                        insideH: { style: BorderStyle.NIL, size: 0, color: "auto" }, 
                        insideV: { style: BorderStyle.NIL, size: 0, color: "auto" } 
                    },
                    rows: senderRows,
                });

                // 本文段落
                const bodyChildren = [];
                let sectionNum = 1;

                bodyChildren.push(para(`${sectionNum}.概要`, { bold: true }));
                bodyChildren.push(para(`　${data.overview || '（未入力）'}`));
                bodyChildren.push(emptyLine());
                sectionNum++;

                bodyChildren.push(para(`${sectionNum}.理由`, { bold: true }));
                bodyChildren.push(para(`　${data.reason || '（未入力）'}`));
                bodyChildren.push(emptyLine());
                sectionNum++;

                if (data.type === 'purchase') {
                    bodyChildren.push(para(`${sectionNum}.詳細`, { bold: true }));
                    // 詳細テーブル
                    const headerRow = new TableRow({
                        children: ['品名', '個数', '販売会社', '単価'].map(h =>
                            new TableCell({
                                shading: { fill: 'EEEEEE' },
                                children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, font: 'Yu Mincho', size: 21 })] })],
                            })
                        ),
                    });
                    const itemRows = data.items
                        .filter(item => item.name || item.quantity || item.company || item.price)
                        .map(item => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.name || '-', font: 'Yu Mincho', size: 21 })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(item.quantity || '-'), font: 'Yu Mincho', size: 21 })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.company || '-', font: 'Yu Mincho', size: 21 })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.price ? '¥' + parseInt(item.price).toLocaleString() : '-', font: 'Yu Mincho', size: 21 })] })] }),
                            ],
                        }));
                    if (itemRows.length > 0) {
                        bodyChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...itemRows] }));
                    }
                    bodyChildren.push(emptyLine());
                    sectionNum++;

                    bodyChildren.push(para(`${sectionNum}.金額`, { bold: true }));
                    bodyChildren.push(new Paragraph({
                        children: [new TextRun({
                            text: `　¥${data.totalAmount ? parseInt(data.totalAmount).toLocaleString() : '0'}－（税込）`,
                            bold: true, size: 24, font: 'Yu Mincho',
                        })],
                    }));
                    bodyChildren.push(emptyLine());
                    sectionNum++;
                }

                if (data.notes.length > 0) {
                    bodyChildren.push(para(`${sectionNum}.備考`, { bold: true }));
                    data.notes.forEach(note => bodyChildren.push(para(`　${note}`)));
                    bodyChildren.push(emptyLine());
                }

                bodyChildren.push(para('以上', { align: AlignmentType.RIGHT }));

                const doc = new Document({
                    sections: [{
                        properties: {
                            page: {
                                size: { width: twipSize.width, height: twipSize.height, orientation: PageOrientation.PORTRAIT },
                                margin: margins,
                            },
                        },
                        children: [
                            para(dateStr, { align: AlignmentType.RIGHT }),
                            para(`生徒会指導部長　${teacherName}`),
                            emptyLine(),
                            senderTable,
                            emptyLine(),
                            para(data.summary || '題名未入力', { align: AlignmentType.CENTER, bold: true, size: 28 }),
                            emptyLine(),
                            para('表題の件につきまして、ご承認いただきたくお願い申し上げます。', { align: AlignmentType.CENTER }),
                            emptyLine(),
                            para('記', { align: AlignmentType.CENTER, bold: true }),
                            emptyLine(),
                            ...bodyChildren,
                        ],
                    }],
                });

                const blob = await Packer.toBlob(doc);
                saveAs(blob, `${filename}.docx`);
            } catch (e) {
                console.error('docxライブラリエラー:', e);
                alert('Wordファイルの生成に失敗しました。\n' + e.message);
            }
        } else {
            alert('docxライブラリが読み込まれていません。\nネットワーク接続を確認してページを再読み込みしてください。');
        }
    }

    async downloadRingishoPDF(state) {
        const data = this.collectFormData(state);
        const filename = this.getRingishoFilename(data);
        const warnings = await OSAPI.AI.proofreadRingisho(data);
        const errors = warnings.filter(w => w.type === 'error');

        if (errors.length > 0) {
            const proceed = confirm(`${errors.length}件のエラーがあります。\n\n${errors.map(e => '・' + e.message).join('\n')}\n\nこのままダウンロードしますか？`);
            if (!proceed) return;
        }

        let dateStr = '';
        if (data.date) {
            const d = new Date(data.date);
            const reiwa = d.getFullYear() - 2018;
            dateStr = `令和${reiwa}年${d.getMonth() + 1}月${d.getDate()}日`;
        } else {
            const today = new Date();
            const reiwa = today.getFullYear() - 2018;
            dateStr = `令和${reiwa}年${today.getMonth() + 1}月${today.getDate()}日`;
        }
        const teacherName = data.teacher ? data.teacher + '先生' : '＿＿＿＿先生';
        const genNum = data.generation || '＿';
        const paperSize = document.getElementById('paper-size')?.value || 'A4';
        const sizeMap = { 'A4': '210mm', 'A5': '148mm', 'B4': '257mm', 'B5': '182mm' };
        const w = sizeMap[paperSize] || '210mm';

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '0';
        tempDiv.style.top = '0';
        tempDiv.style.zIndex = '-9999';
        tempDiv.style.opacity = '0';
        tempDiv.style.pointerEvents = 'none';
        tempDiv.innerHTML = `
            <div id="pdf-capture-root" style="width: ${w}; padding: 25mm 20mm; background: #fff; color: #000; font-family: 'Yu Mincho', 'MS Mincho', serif; font-size: 10.5pt; line-height: 1.6; box-sizing: border-box; margin: 0;">
                <p style="text-align: right; margin-bottom: 24px;">${dateStr}</p>
                <p style="text-align: left; margin-bottom: 12px;">生徒会指導部長　${teacherName}</p>
                
                <table style="border-collapse: collapse; margin-bottom: 24px; border: none; margin-left: auto;">
                    <tr>
                        <td style="text-align: right; padding-right: 12px; font-size: 10.5pt; white-space: nowrap;">第${genNum}代生徒会</td>
                        <td style="text-align: left; font-size: 10.5pt; white-space: nowrap;">${data.member1 ? '　' + data.member1 : ''}　<u>印</u></td>
                    </tr>
                    ${data.subMembers.map(name => `
                        <tr>
                            <td style="text-align: right; padding-right: 12px; font-size: 10.5pt; white-space: nowrap;">同</td>
                            <td style="text-align: left; font-size: 10.5pt; white-space: nowrap;">　${name}</td>
                        </tr>
                    `).join('')}
                </table>
                <br>
                <p style="text-align: center; font-size: 14pt; font-weight: bold; margin: 20px 0;">${data.summary || '題名未入力'}</p>
                <br>
                <p style="text-align: center; margin-bottom: 8px;">表題の件につきまして、ご承認いただきたくお願い申し上げます。</p>
                <br>
                <p style="text-align: center; font-weight: bold; margin: 8px 0;">記</p>
                <br>
                <style>
                    .doc-section-head { text-align: left; margin-bottom: 4px; font-weight: bold; }
                    .doc-section-body { text-align: left; padding-left: 16px; margin-bottom: 12px; }
                    .paper-inner-table { width: 100%; border-collapse: collapse; margin: 8px 0 4px 16px; }
                    .paper-inner-table th, .paper-inner-table td { border: 1px solid #000; padding: 4px; text-align: left; }
                    .doc-amount { font-weight: bold; font-size: 12pt; }
                    .doc-end { text-align: right; margin-top: 30px; }
                </style>
                ${this.generateRingishoHTML(data, true)}
            </div>
        `;
        document.body.appendChild(tempDiv);

        const target = tempDiv.querySelector('#pdf-capture-root');
        const opt = {
            margin:       0,
            filename:     `${filename}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                letterRendering: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF:        { unit: 'mm', format: paperSize.toLowerCase(), orientation: 'portrait' }
        };

        try {
            await html2pdf().from(target).set(opt).save();
        } catch (e) {
            alert('PDFの生成に失敗しました。');
        } finally {
            document.body.removeChild(tempDiv);
        }
    }

    renderEquipment(container) {
        if (!this.equipmentData) {
            const saved = localStorage.getItem('ch_equipment');
            this.equipmentData = saved ? JSON.parse(saved) : [
                { id: 1, name: 'ワイヤレスマイク A', location: '放送室棚2', status: 'ready', icon: 'fa-microphone', quantity: 2, purchaseDate: '2021-04-10' },
                { id: 2, name: 'デジタル一眼レフ EOS Kiss', location: '生徒会室金庫', status: 'ready', icon: 'fa-camera', quantity: 1, purchaseDate: '2022-06-15' }
            ];
        }

        const inlineStyles = `
            <style>
                .equipment-container { display: flex; flex-direction: column; gap: 20px; padding: 10px; }
                .equipment-header { display: flex; justify-content: space-between; align-items: center; }
                .equipment-list { display: flex; flex-direction: column; gap: 12px; }
                .swipe-item-wrapper { position: relative; border-radius: 12px; overflow: hidden; background: transparent; margin-bottom: 8px; }
                .swipe-item-content { 
                    display: flex; align-items: center; padding: 15px; border: 1px solid var(--glass-border); border-radius: 12px;
                    position: relative; z-index: 2; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: grab; user-select: none;
                }
                body[data-theme="light"] .swipe-item-content { background: #ffffff !important; color: #1d1d1f; }
                body[data-theme="dark"] .swipe-item-content { background: #1a1a1a !important; color: #f5f5f7; }
                .delete-action {
                    position: absolute; right: 0; top: 0; bottom: 0; width: 80px;
                    display: flex; align-items: center; justify-content: center;
                    background: #ff3b30; color: white; font-weight: bold; z-index: 1; cursor: pointer;
                    border-radius: 0 12px 12px 0;
                }
                .track-icon { width: 45px; height: 45px; border-radius: 10px; background: rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-right: 15px; }
                .track-info { flex: 1; }
                .track-title { font-weight: 600; font-size: 1rem; margin-bottom: 2px; }
                .track-meta { font-size: 0.8rem; opacity: 0.7; display: flex; flex-direction: column; gap: 2px; }
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.3s; padding: 20px;
                }
                .modal-overlay.active { opacity: 1; pointer-events: auto; }
                .equipment-modal-box {
                    width: 100%; max-width: 450px; max-height: 90vh; padding: 30px; border-radius: 24px;
                    background: #fff; color: #1d1d1f; box-shadow: 0 25px 50px rgba(0,0,0,0.5); overflow-y: auto;
                }
                body[data-theme="dark"] .equipment-modal-box { background: #1c1c1e !important; color: #f5f5f7; border: 1px solid rgba(255,255,255,0.1); }
                .form-group { margin-bottom: 18px; }
                .form-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; }
                .form-group input, .form-group select { 
                    width: 100%; padding: 12px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1);
                    background: #f5f5f7; color: #1d1d1f; outline: none; font-size: 1rem;
                }
                body[data-theme="dark"] .form-group input, body[data-theme="dark"] .form-group select { background: rgba(255,255,255,0.05); color: #fff; border-color: rgba(255,255,255,0.1); }
                .section-header { font-size: 0.8rem; font-weight: 700; opacity: 0.5; margin: 25px 0 10px; text-transform: uppercase; }
                .separator { height: 1px; background: rgba(128,128,128,0.2); margin: 20px 0; }
                .btn-qty { width:40px; height:40px; border-radius:10px; border:1px solid rgba(0,0,0,0.1); background:#f5f5f7; cursor:pointer; }
                .lend-btn { padding: 8px 16px; border-radius: 20px; border: none; background: #0071e3; color: white; font-weight: 600; cursor: pointer; }
                .return-btn { padding: 8px 16px; border-radius: 20px; border: 1px solid #0071e3; background: none; color: #0071e3; font-weight: 600; cursor: pointer; }
            </style>
        `;

        container.innerHTML = inlineStyles + `
            <div class="equipment-container">
                <div class="equipment-header">
                    <h2 style="margin:0;"><i class="fas fa-boxes"></i> 備品管理</h2>
                    <button id="add-equipment-btn" class="lend-btn"><i class="fas fa-plus"></i> 新規追加</button>
                </div>
                <div class="equipment-list" id="equipment-list-root"></div>
            </div>

            <!-- 新規追加モーダル -->
            <div id="equipment-modal" class="modal-overlay">
                <div class="equipment-modal-box">
                    <h3>備品の新規登録</h3>
                    <div class="form-group"><label>名前</label><input type="text" id="eq-name" placeholder="例: マイク"></div>
                    <div class="form-group">
                        <label>個数</label>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <button id="qty-minus" class="btn-qty">−</button>
                            <input type="number" id="eq-qty" value="1" style="flex:1; text-align:center;">
                            <button id="qty-plus" class="btn-qty">＋</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="display:flex; justify-content:space-between;">保管場所 <label style="font-size:0.7rem;"><input type="checkbox" id="no-loc"> 設定しない</label></label>
                        <input type="text" id="eq-loc" placeholder="例: 生徒会室">
                    </div>
                    <div class="form-group">
                        <label style="display:flex; justify-content:space-between;">購入日 <label style="font-size:0.7rem;"><input type="checkbox" id="no-date"> 設定しない</label></label>
                        <input type="date" id="eq-date">
                    </div>
                    <div class="form-group">
                        <label>種類</label>
                        <div style="display:flex; gap:10px;">
                            <label style="flex:1; text-align:center; padding:10px; border:1px solid #ddd; border-radius:12px; cursor:pointer;" id="type-box">
                                <input type="radio" name="eq-type" value="fa-box" checked style="display:none;">
                                <i class="fas fa-box"></i><br><span style="font-size:0.7rem;">消耗品</span>
                            </label>
                            <label style="flex:1; text-align:center; padding:10px; border:1px solid #ddd; border-radius:12px; cursor:pointer;" id="type-tools">
                                <input type="radio" name="eq-type" value="fa-tools" style="display:none;">
                                <i class="fas fa-tools"></i><br><span style="font-size:0.7rem;">設備</span>
                            </label>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:20px;">
                        <button id="modal-cancel" style="flex:1; padding:12px; border:none; border-radius:12px; cursor:pointer;">キャンセル</button>
                        <button id="modal-save" style="flex:1; padding:12px; border:none; border-radius:12px; background:#0071e3; color:white; font-weight:600; cursor:pointer;">保存する</button>
                    </div>
                </div>
            </div>

            <!-- 貸出モーダル -->
            <div id="lend-modal" class="modal-overlay">
                <div class="equipment-modal-box">
                    <h3>備品の貸出</h3>
                    <div id="lend-info-text" style="margin-bottom:15px; font-size:0.85rem; color:#0071e3;"></div>
                    <div class="form-group"><label>借用者名</label><input type="text" id="lend-who" placeholder="名前や団体名"></div>
                    <div class="form-group">
                        <label>貸出日</label>
                        <input type="date" id="lend-date">
                    </div>
                    <div class="form-group">
                        <label>貸出個数</label>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <button id="lqty-minus" class="btn-qty">−</button>
                            <input type="number" id="lend-qty" value="1" style="flex:1; text-align:center;">
                            <button id="lqty-plus" class="btn-qty">＋</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="display:flex; justify-content:space-between;">予定日数 <label style="font-size:0.7rem;"><input type="checkbox" id="no-lend-days"> 設定しない</label></label>
                        <div id="lend-days-controls" style="display:flex; align-items:center; gap:5px;">
                            <input type="number" id="lend-days" value="1" style="width:80px;"> 日間
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="display:flex; justify-content:space-between;">返却予定時刻 <label style="font-size:0.7rem;"><input type="checkbox" id="no-lend-time"> 設定しない</label></label>
                        <div id="lend-time-controls" style="display:flex; align-items:center; gap:10px;">
                            <select id="lend-hour" style="flex:1;">
                                ${Array.from({length:24}, (_,i)=>`<option value="${i.toString().padStart(2,'0')}">${i.toString().padStart(2,'0')}時</option>`).join('')}
                            </select>
                            <select id="lend-min" style="flex:1;">
                                ${['00','10','20','30','40','50'].map(m => `<option value="${m}">${m}分</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:20px;">
                        <button id="lend-cancel" style="flex:1; padding:12px; border:none; border-radius:12px; cursor:pointer;">キャンセル</button>
                        <button id="lend-confirm" style="flex:1; padding:12px; border:none; border-radius:12px; background:#0071e3; color:white; font-weight:600; cursor:pointer;">貸出を実行</button>
                    </div>
                </div>
            </div>
        `;

        const listRoot = container.querySelector('#equipment-list-root');
        const addModal = container.querySelector('#equipment-modal');
        const lendModal = container.querySelector('#lend-modal');
        let currentLendId = null;

        const renderItems = () => {
            const readyItems = this.equipmentData.filter(i => i.status !== 'lent');
            const lentItems = this.equipmentData.filter(i => i.status === 'lent');

            const buildItem = (item) => `
                <div class="swipe-item-wrapper" data-id="${item.id}">
                    <div class="delete-action"><i class="fas fa-trash-alt"></i></div>
                    <div class="swipe-item-content">
                        <div class="track-icon"><i class="fas ${item.icon || 'fa-box'}"></i></div>
                        <div class="track-info">
                            <div class="track-title">${item.name}</div>
                            <div class="track-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                                ${item.status === 'lent' 
                                    ? `<span style="color:#ff9500;"><i class="fas fa-user"></i> ${item.lentTo} (${item.lentQty}点)</span>
                                       <span style="color:#ff9500; font-size:0.75rem;"><i class="fas fa-clock"></i> 貸出: ${item.lentDate} / 返却予定: ${item.returnAt}</span>`
                                    : `<span><i class="fas fa-calendar-day"></i> 購入: ${item.purchaseDate}</span>`}
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px; margin-right:15px;">
                            ${item.status === 'ready' ? `
                                <button class="q-dec" style="width:28px; height:28px; border-radius:50%; border:1px solid #ddd; background:none; cursor:pointer; opacity:${item.quantity <= 1 ? 0.2 : 1};">−</button>
                                <span style="font-weight:600; min-width:20px; text-align:center;">${item.quantity}</span>
                                <button class="q-inc" style="width:28px; height:28px; border-radius:50%; border:1px solid #ddd; background:none; cursor:pointer;">＋</button>
                            ` : `<span style="font-size:0.8rem; opacity:0.6;">(在庫: ${item.quantity})</span>`}
                        </div>
                        <button class="${item.status === 'ready' ? 'lend-btn-trigger' : 'return-btn-trigger'}" 
                                style="padding:6px 12px; border-radius:15px; border:${item.status === 'ready' ? 'none' : '1px solid #0071e3'}; 
                                background:${item.status === 'ready' ? '#0071e3' : 'none'}; 
                                color:${item.status === 'ready' ? 'white' : '#0071e3'}; cursor:pointer; font-size:0.8rem; font-weight:600;">
                            ${item.status === 'ready' ? '貸出' : '返却'}
                        </button>
                    </div>
                </div>
            `;

            listRoot.innerHTML = `
                ${lentItems.length > 0 ? `
                    <div class="section-header">貸出中 (${lentItems.length})</div>
                    ${lentItems.map(buildItem).join('')}
                    <div class="separator"></div>
                ` : ''}
                <div class="section-header">在庫あり (${readyItems.length})</div>
                ${readyItems.map(buildItem).join('')}
            `;

            listRoot.querySelectorAll('.swipe-item-wrapper').forEach(wrapper => {
                const id = parseInt(wrapper.dataset.id);
                const item = this.equipmentData.find(i => i.id === id);
                
                wrapper.querySelector('.q-inc')?.addEventListener('click', (e) => { e.stopPropagation(); item.quantity++; saveAndRefresh(); });
                wrapper.querySelector('.q-dec')?.addEventListener('click', (e) => { e.stopPropagation(); if(item.quantity > 1) { item.quantity--; saveAndRefresh(); } });
                wrapper.querySelector('.lend-btn-trigger')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentLendId = id;
                    lendModal.classList.add('active');
                    lendModal.querySelector('#lend-info-text').innerText = `${item.name} (在庫: ${item.quantity})`;
                    lendModal.querySelector('#lend-qty').value = 1;
                    lendModal.querySelector('#lend-qty').max = item.quantity;
                    
                    const now = new Date();
                    lendModal.querySelector('#lend-date').valueAsDate = now;
                    lendModal.querySelector('#lend-hour').value = now.getHours().toString().padStart(2, '0');
                    lendModal.querySelector('#lend-min').value = (Math.floor(now.getMinutes()/10)*10).toString().padStart(2, '0');
                    lendModal.querySelector('#no-lend-time').checked = false;
                    lendModal.querySelector('#lend-time-controls').style.opacity = '1';
                    lendModal.querySelector('#lend-hour').disabled = false;
                    lendModal.querySelector('#lend-min').disabled = false;
                    
                    lendModal.querySelector('#no-lend-days').checked = false;
                    lendModal.querySelector('#lend-days').disabled = false;
                    lendModal.querySelector('#lend-days').style.opacity = '1';
                });
                wrapper.querySelector('.return-btn-trigger')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if(confirm(`「${item.name}」を返却しますか？`)) {
                        item.status = 'ready'; delete item.lentTo; delete item.lentQty; delete item.lentAt; delete item.lentDuration;
                        saveAndRefresh();
                    }
                });
                wrapper.querySelector('.delete-action').addEventListener('click', (e) => {
                    e.stopPropagation();
                    if(confirm('削除しますか？')) {
                        this.equipmentData = this.equipmentData.filter(i => i.id !== id);
                        saveAndRefresh();
                    }
                });

                const content = wrapper.querySelector('.swipe-item-content');
                let sX = 0, cX = 0;
                content.onmousedown = content.ontouchstart = (e) => { sX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX; content.style.transition = 'none'; };
                window.onmousemove = window.ontouchmove = (e) => {
                    if(!sX) return;
                    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                    cX = x - sX;
                    if(cX > 0) cX = 0; if(cX < -100) cX = -100;
                    content.style.transform = `translateX(${cX}px)`;
                };
                window.onmouseup = window.ontouchend = () => {
                    if(!sX) return;
                    sX = 0; content.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    content.style.transform = cX < -40 ? 'translateX(-80px)' : 'translateX(0)';
                };
            });
        };

        const saveAndRefresh = () => {
            localStorage.setItem('ch_equipment', JSON.stringify(this.equipmentData));
            renderItems();
        };

        renderItems();

        const nLT = lendModal.querySelector('#no-lend-time');
        const lH = lendModal.querySelector('#lend-hour');
        const lM = lendModal.querySelector('#lend-min');
        nLT.onchange = () => {
            lH.disabled = lM.disabled = nLT.checked;
            lendModal.querySelector('#lend-time-controls').style.opacity = nLT.checked ? 0.3 : 1;
        };

        const nLD = lendModal.querySelector('#no-lend-days');
        const lD = lendModal.querySelector('#lend-days');
        nLD.onchange = () => {
            lD.disabled = nLD.checked;
            lD.style.opacity = nLD.checked ? 0.3 : 1;
        };

        container.querySelector('#add-equipment-btn').onclick = () => {
            addModal.classList.add('active');
            container.querySelector('#eq-name').value = '';
            container.querySelector('#eq-qty').value = 1;
        };
        container.querySelector('#modal-cancel').onclick = () => addModal.classList.remove('active');
        container.querySelector('#qty-plus').onclick = () => addModal.querySelector('#eq-qty').value++;
        container.querySelector('#qty-minus').onclick = () => { if(addModal.querySelector('#eq-qty').value > 1) addModal.querySelector('#eq-qty').value--; };
        
        const nL = container.querySelector('#no-loc'), eL = container.querySelector('#eq-loc');
        const nD = container.querySelector('#no-date'), eD = container.querySelector('#eq-date');
        nL.onchange = () => { eL.disabled = nL.checked; eL.style.opacity = nL.checked ? 0.3 : 1; };
        nD.onchange = () => { eD.disabled = nD.checked; eD.style.opacity = nD.checked ? 0.3 : 1; };

        // 種類選択の視覚的フィードバック
        const typeLabels = container.querySelectorAll('input[name="eq-type"]');
        typeLabels.forEach(input => {
            input.addEventListener('change', () => {
                container.querySelectorAll('input[name="eq-type"]').forEach(i => {
                    i.parentElement.style.borderColor = '#ddd';
                    i.parentElement.style.background = 'none';
                });
                if(input.checked) {
                    input.parentElement.style.borderColor = '#0071e3';
                    input.parentElement.style.background = 'rgba(0,113,227,0.1)';
                }
            });
        });
        // 初期状態の反映
        container.querySelector('input[name="eq-type"]:checked').dispatchEvent(new Event('change'));

        container.querySelector('#modal-save').onclick = () => {
            const name = container.querySelector('#eq-name').value;
            if(!name) return alert('名前を入力してください');
            this.equipmentData.push({
                id: Date.now(), name, 
                quantity: parseInt(container.querySelector('#eq-qty').value),
                location: nL.checked ? 'ー' : (eL.value || 'ー'),
                purchaseDate: nD.checked ? 'ー' : (eD.value || 'ー'),
                icon: container.querySelector('input[name="eq-type"]:checked').value,
                status: 'ready'
            });
            addModal.classList.remove('active');
            saveAndRefresh();
        };

        lendModal.querySelector('#lend-cancel').onclick = () => lendModal.classList.remove('active');
        lendModal.querySelector('#lqty-plus').onclick = () => {
            const i = lendModal.querySelector('#lend-qty'), item = this.equipmentData.find(x => x.id === currentLendId);
            if(parseInt(i.value) < item.quantity) i.value++;
        };
        lendModal.querySelector('#lqty-minus').onclick = () => { if(lendModal.querySelector('#lend-qty').value > 1) lendModal.querySelector('#lend-qty').value--; };
        lendModal.querySelector('#lend-confirm').onclick = () => {
            const who = lendModal.querySelector('#lend-who').value;
            const date = lendModal.querySelector('#lend-date').value;
            if(!who) return alert('借用者を入力してください');
            if(!date) return alert('貸出日を入力してください');
            
            const item = this.equipmentData.find(x => x.id === currentLendId);
            item.status = 'lent'; 
            item.lentTo = who; 
            item.lentDate = date;
            item.lentQty = lendModal.querySelector('#lend-qty').value;
            
            item.returnAt = nLT.checked ? 'ー' : `${lH.value}:${lM.value}`;
            item.lentDuration = nLD.checked ? 'ー' : `${lD.value}日間`;
            
            lendModal.classList.remove('active');
            saveAndRefresh();
        };
    }

    async renderArchive(container) {
        container.innerHTML = `<div class="archive-grid" id="archive-grid"></div>`;
        const grid = document.getElementById('archive-grid');
        
        try {
            const files = await OSAPI.FileSystem.readArchiveFiles();
            files.forEach(f => {
                const icon = f.type === 'word' ? 'fa-file-word' : f.type === 'excel' ? 'fa-file-excel' : 'fa-file-pdf';
                const el = document.createElement('div');
                el.className = 'archive-item glass-panel';
                el.innerHTML = `
                    <i class="fas ${icon}"></i>
                    <span style="font-size: 0.9rem; text-align: center; font-weight: 500;">${f.name}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">${f.date}</span>
                `;
                grid.appendChild(el);
            });
        } catch(e) {
            console.error("Failed to load archive", e);
        }
    }

    renderSchedule(container) {
        if (!this.scheduleDate) {
            this.scheduleDate = new Date();
        }

        const year = this.scheduleDate.getFullYear();
        const month = this.scheduleDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay(); 
        const totalDays = lastDay.getDate();

        if (!this.scheduleEvents) {
            const saved = localStorage.getItem('ch_calendar_events');
            this.scheduleEvents = saved ? JSON.parse(saved) : {};
        }

        const inlineStyles = `
            <style>
                .schedule-container { display: flex; flex-direction: column; min-height: 100%; gap: 15px; padding-bottom: 40px; }
                .calendar-header { display: flex; justify-content: center; align-items: center; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 12px; position: relative; }
                .calendar-body { display: flex; flex-direction: column; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.2); overflow: visible !important; }
                body[data-theme="light"] .calendar-body { background: #ffffff !important; color: #1d1d1f; }
                body[data-theme="dark"] .calendar-body { background: #000000 !important; color: #f5f5f7; }
                .calendar-days-header { display: grid; grid-template-columns: repeat(7, 1fr); background: rgba(0,0,0,0.1); text-align: center; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); }
                #calendar-grid { display: grid !important; grid-template-columns: repeat(7, 1fr) !important; grid-template-rows: repeat(6, minmax(120px, auto)) !important; }
                .calendar-cell { border-right: 1px solid rgba(128,128,128,0.1); border-bottom: 1px solid rgba(128,128,128,0.1); padding: 8px; display: flex; flex-direction: column; min-height: 120px; transition: background 0.2s; cursor: pointer; }
                .calendar-cell:hover { background: rgba(128,128,128,0.05); }
                .calendar-cell:nth-child(7n) { border-right: none; }
                .date-number { display: inline-block; width: 28px; height: 28px; text-align: center; line-height: 28px; border-radius: 50%; font-size: 1rem; margin-bottom: 8px; font-weight: 500; }
                .today .date-number { background: #0071e3; color: white; }
                .sunday { color: #ff6b6b; }
                .saturday { color: #4facfe; }
                .empty-cell { background: rgba(128,128,128,0.03); opacity: 0.3; cursor: default; }
                .calendar-events { display: flex; flex-direction: column; gap: 4px; overflow-y: visible; flex: 1; }
                .cal-event { background: #0071e3; color: white; padding: 4px 10px; font-size: 0.8rem; border-radius: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; transition: background 0.2s; border: none; }
                .cal-event:hover { background: #005bb5; }
                body[data-theme="light"] .cal-event { background: #e1f0ff; color: #0071e3; }
                body[data-theme="light"] .cal-event:hover { background: #cfe5ff; }
            </style>
        `;

        container.innerHTML = inlineStyles + `
            <div class="schedule-container">
                <div class="calendar-header">
                    <div class="calendar-nav" style="display:flex; align-items:center; gap:25px;">
                        <button class="btn-nav" id="prev-month" style="width:40px; height:40px; border-radius:50%; border:1px solid rgba(255,255,255,0.2); background:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fas fa-chevron-left"></i></button>
                        <h2 style="margin:0; font-size:1.6rem; min-width:200px; text-align:center;">${year}年 ${month + 1}月</h2>
                        <button class="btn-nav" id="next-month" style="width:40px; height:40px; border-radius:50%; border:1px solid rgba(255,255,255,0.2); background:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="calendar-body">
                    <div class="calendar-days-header">
                        <div class="calendar-day-name sunday" style="padding:15px; font-size:1rem;">日</div>
                        <div class="calendar-day-name" style="padding:15px; font-size:1rem;">月</div>
                        <div class="calendar-day-name" style="padding:15px; font-size:1rem;">火</div>
                        <div class="calendar-day-name" style="padding:15px; font-size:1rem;">水</div>
                        <div class="calendar-day-name" style="padding:15px; font-size:1rem;">木</div>
                        <div class="calendar-day-name" style="padding:15px; font-size:1rem;">金</div>
                        <div class="calendar-day-name saturday" style="padding:15px; font-size:1rem;">土</div>
                    </div>
                    <div id="calendar-grid"></div>
                </div>
                <p style="margin:0; font-size:0.9rem; color:var(--text-muted); text-align:center; padding:10px;"><i class="fas fa-info-circle"></i> 日付をダブルクリックして予定を追加できます</p>
            </div>
        `;

        const grid = container.querySelector('#calendar-grid');
        const today = new Date();

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const dayNum = prevMonthLastDay - i;
            const cell = document.createElement('div');
            cell.className = 'calendar-cell empty-cell';
            cell.innerHTML = `<span class="date-number" style="opacity: 0.5;">${dayNum}</span>`;
            grid.appendChild(cell);
        }

        for (let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            const dateStr = `${year}-${month + 1}-${day}`;
            cell.dataset.date = dateStr;
            
            const currentDate = new Date(year, month, day);
            const isToday = currentDate.getDate() === today.getDate() && 
                            currentDate.getMonth() === today.getMonth() && 
                            currentDate.getFullYear() === today.getFullYear();
            
            if (isToday) cell.classList.add('today');

            const dayOfWeek = currentDate.getDay();
            let dayClass = '';
            if (dayOfWeek === 0) dayClass = 'sunday';
            if (dayOfWeek === 6) dayClass = 'saturday';

            const dayEvents = this.scheduleEvents[dateStr] || [];
            const eventsHtml = dayEvents.map(ev => `<div class="cal-event">${ev}</div>`).join('');

            cell.innerHTML = `
                <span class="date-number ${dayClass}">${day}</span>
                <div class="calendar-events">${eventsHtml}</div>
            `;

            cell.addEventListener('dblclick', () => {
                const title = prompt(`${month + 1}月${day}日の予定を入力してください:`);
                if (title && title.trim()) {
                    if (!this.scheduleEvents[dateStr]) {
                        this.scheduleEvents[dateStr] = [];
                    }
                    this.scheduleEvents[dateStr].push(title.trim());
                    localStorage.setItem('ch_calendar_events', JSON.stringify(this.scheduleEvents));
                    this.renderSchedule(container);
                }
            });

            grid.appendChild(cell);
        }

        grid.addEventListener('click', (e) => {
            const eventEl = e.target.closest('.cal-event');
            if (eventEl) {
                const cell = eventEl.closest('.calendar-cell');
                const dateStr = cell.dataset.date;
                const title = eventEl.textContent;
                
                if (confirm(`予定「${title}」を削除しますか？`)) {
                    const idx = this.scheduleEvents[dateStr].indexOf(title);
                    if (idx > -1) {
                        this.scheduleEvents[dateStr].splice(idx, 1);
                        localStorage.setItem('ch_calendar_events', JSON.stringify(this.scheduleEvents));
                        this.renderSchedule(container);
                    }
                }
            }
        });

        const totalCellsAdded = startingDay + totalDays;
        const remainingCells = 42 - totalCellsAdded;
        for (let i = 1; i <= remainingCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell empty-cell';
            cell.innerHTML = `<span class="date-number" style="opacity: 0.5;">${i}</span>`;
            grid.appendChild(cell);
        }

        container.querySelector('#prev-month').addEventListener('click', () => {
            this.scheduleDate.setMonth(this.scheduleDate.getMonth() - 1);
            this.renderSchedule(container);
        });

        container.querySelector('#next-month').addEventListener('click', () => {
            this.scheduleDate.setMonth(this.scheduleDate.getMonth() + 1);
            this.renderSchedule(container);
        });
    }

    renderAttendance(container) {
        if (!this.attendanceData) {
            const saved = localStorage.getItem('ch_attendance');
            this.attendanceData = saved ? JSON.parse(saved) : [];
        }

        const inlineStyles = `
            <style>
                .att-container { display:flex; flex-direction:column; gap:20px; padding:10px; }
                .att-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
                .att-header h2 { margin:0; display:flex; align-items:center; gap:10px; }
                .att-book-list { display:flex; flex-direction:column; gap:16px; }
                .att-book { border-radius:16px; overflow:hidden; border:1px solid var(--glass-border); }
                .att-book-header {
                    display:flex; justify-content:space-between; align-items:center;
                    padding:16px 20px; cursor:pointer; transition:background 0.2s;
                }
                body[data-theme="light"] .att-book-header { background:rgba(0,113,227,0.06); }
                body[data-theme="dark"] .att-book-header { background:rgba(0,113,227,0.12); }
                .att-book-header:hover { filter:brightness(1.1); }
                .att-book-title { font-weight:600; font-size:1.05rem; display:flex; align-items:center; gap:10px; }
                .att-book-actions { display:flex; gap:8px; align-items:center; }
                .att-book-body { padding:0; max-height:0; overflow:hidden; transition:max-height 0.4s ease, padding 0.3s ease; }
                .att-book-body.open { max-height:2000px; padding:20px; }
                .att-table-wrap { overflow-x:auto; }
                .att-table { width:100%; border-collapse:collapse; font-size:0.9rem; }
                .att-table th, .att-table td {
                    padding:10px 14px; text-align:center;
                    border-bottom:1px solid rgba(128,128,128,0.15);
                }
                .att-table th { font-weight:600; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; opacity:0.7; }
                .att-table th:first-child, .att-table td:first-child { text-align:left; min-width:120px; }
                .att-table tbody tr { transition:background 0.15s; }
                .att-table tbody tr:hover { background:rgba(128,128,128,0.06); }
                .att-radio-group { display:flex; gap:6px; justify-content:center; }
                .att-radio-label {
                    display:flex; align-items:center; justify-content:center;
                    width:36px; height:36px; border-radius:10px; cursor:pointer;
                    border:2px solid transparent; transition:all 0.2s;
                }
                .att-radio-label input { display:none; }
                .att-radio-label.present { color:#34c759; background:rgba(52,199,89,0.05); }
                .att-radio-label.present:hover, .att-radio-label.present.checked { background:rgba(52,199,89,0.25); border-color:#34c759; box-shadow:0 0 10px rgba(52,199,89,0.2); }
                .att-radio-label.absent { color:#ff3b30; background:rgba(255,59,48,0.05); }
                .att-radio-label.absent:hover, .att-radio-label.absent.checked { background:rgba(255,59,48,0.25); border-color:#ff3b30; box-shadow:0 0 10px rgba(255,59,48,0.2); }
                .att-radio-label.late { color:#ff9500; background:rgba(255,149,0,0.05); }
                .att-radio-label.late:hover, .att-radio-label.late.checked { background:rgba(255,149,0,0.25); border-color:#ff9500; box-shadow:0 0 10px rgba(255,149,0,0.2); }
                .att-radio-label.unconfirmed { color:#8e8e93; background:rgba(142,142,147,0.05); }
                .att-radio-label.unconfirmed:hover, .att-radio-label.unconfirmed.checked { background:rgba(142,142,147,0.25); border-color:#8e8e93; box-shadow:0 0 10px rgba(142,142,147,0.2); }
                .att-add-member-row { display:flex; gap:8px; margin-top:12px; }
                .att-add-member-row input { flex:1; padding:10px 14px; border-radius:10px; border:1px solid var(--glass-border); background:var(--glass-bg); color:var(--text-color); font-size:0.9rem; }
                .att-btn { padding:8px 16px; border-radius:10px; border:none; font-weight:600; cursor:pointer; font-size:0.85rem; transition:all 0.2s; display:inline-flex; align-items:center; gap:6px; }
                .att-btn-primary { background:#0071e3; color:#fff; }
                .att-btn-primary:hover { background:#005bb5; }
                .att-btn-danger { background:none; color:#ff3b30; border:1px solid rgba(255,59,48,0.3); }
                .att-btn-danger:hover { background:rgba(255,59,48,0.1); }
                .att-btn-sm { padding:6px 10px; font-size:0.8rem; }
                .att-delete-member { opacity:0.4; cursor:pointer; transition:opacity 0.2s; background:none; border:none; color:var(--text-color); }
                .att-delete-member:hover { opacity:1; color:#ff3b30; }
                .att-summary { display:flex; gap:16px; font-size:0.8rem; opacity:0.7; }
                .att-summary span { display:flex; align-items:center; gap:4px; }
                .att-empty { text-align:center; padding:60px 20px; opacity:0.5; }
                .att-empty i { font-size:3rem; margin-bottom:16px; display:block; }
                .att-chevron { transition:transform 0.3s; font-size:0.9rem; }
                .att-chevron.open { transform:rotate(90deg); }
                .att-date-label { font-size:0.8rem; opacity:0.5; }
                .modal-overlay {
                    position:fixed; top:0; left:0; width:100%; height:100%;
                    background:rgba(0,0,0,0.75); backdrop-filter:blur(8px);
                    display:flex; align-items:center; justify-content:center;
                    z-index:1000; opacity:0; pointer-events:none; transition:opacity 0.3s; padding:20px;
                }
                .modal-overlay.active { opacity:1; pointer-events:auto; }
                .att-modal-box {
                    width:100%; max-width:420px; padding:30px; border-radius:24px;
                    background:#fff; color:#1d1d1f; box-shadow:0 25px 50px rgba(0,0,0,0.5);
                }
                body[data-theme="dark"] .att-modal-box { background:#1c1c1e; color:#f5f5f7; border:1px solid rgba(255,255,255,0.1); }
                .att-modal-box h3 { margin:0 0 20px; font-size:1.1rem; }
                .att-modal-box .form-group { margin-bottom:16px; }
                .att-modal-box .form-group label { display:block; font-size:0.85rem; font-weight:600; margin-bottom:6px; }
                .att-modal-box .form-group input { width:100%; padding:12px; border-radius:12px; border:1px solid rgba(0,0,0,0.1); background:#f5f5f7; color:#1d1d1f; font-size:1rem; outline:none; }
                body[data-theme="dark"] .att-modal-box .form-group input { background:rgba(255,255,255,0.05); color:#fff; border-color:rgba(255,255,255,0.1); }
                .att-modal-btns { display:flex; gap:10px; margin-top:24px; }
                .att-modal-btns button { flex:1; padding:12px; border:none; border-radius:12px; cursor:pointer; font-weight:600; font-size:0.95rem; }
            </style>
        `;

        const saveData = () => {
            localStorage.setItem('ch_attendance', JSON.stringify(this.attendanceData));
        };

        const renderAll = () => {
            const listEl = container.querySelector('#att-book-list');
            if (!listEl) return;

            if (this.attendanceData.length === 0) {
                listEl.innerHTML = `<div class="att-empty"><i class="fas fa-clipboard-list"></i><p>出欠簿がまだありません。<br>「出欠簿を追加」ボタンから作成してください。</p></div>`;
                return;
            }

            listEl.innerHTML = this.attendanceData.map((book, bIdx) => {
                const presentCount = book.members.filter(m => m.status === 'present').length;
                const absentCount = book.members.filter(m => m.status === 'absent').length;
                const lateCount = book.members.filter(m => m.status === 'late').length;
                const unconfirmedCount = book.members.filter(m => m.status === 'unconfirmed').length;

                const rows = book.members.map((member, mIdx) => `
                    <tr>
                        <td style="font-weight:500;">${member.name}</td>
                        <td>
                            <div class="att-radio-group">
                                <label class="att-radio-label present ${member.status === 'present' ? 'checked' : ''}">
                                    <input type="radio" name="att-${bIdx}-${mIdx}" value="present" ${member.status === 'present' ? 'checked' : ''} data-book="${bIdx}" data-member="${mIdx}">
                                    <i class="fas fa-check"></i>
                                </label>
                            </div>
                        </td>
                        <td>
                            <div class="att-radio-group">
                                <label class="att-radio-label absent ${member.status === 'absent' ? 'checked' : ''}">
                                    <input type="radio" name="att-${bIdx}-${mIdx}" value="absent" ${member.status === 'absent' ? 'checked' : ''} data-book="${bIdx}" data-member="${mIdx}">
                                    <i class="fas fa-times"></i>
                                </label>
                            </div>
                        </td>
                        <td>
                            <div class="att-radio-group">
                                <label class="att-radio-label late ${member.status === 'late' ? 'checked' : ''}">
                                    <input type="radio" name="att-${bIdx}-${mIdx}" value="late" ${member.status === 'late' ? 'checked' : ''} data-book="${bIdx}" data-member="${mIdx}">
                                    <i class="fas fa-clock"></i>
                                </label>
                            </div>
                        </td>
                        <td>
                            <div class="att-radio-group">
                                <label class="att-radio-label unconfirmed ${member.status === 'unconfirmed' ? 'checked' : ''}">
                                    <input type="radio" name="att-${bIdx}-${mIdx}" value="unconfirmed" ${member.status === 'unconfirmed' ? 'checked' : ''} data-book="${bIdx}" data-member="${mIdx}">
                                    <i class="fas fa-question"></i>
                                </label>
                            </div>
                        </td>
                        <td>
                            <button class="att-delete-member" data-book="${bIdx}" data-member="${mIdx}" title="削除">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');

                return `
                    <div class="att-book" data-book-idx="${bIdx}">
                        <div class="att-book-header" data-toggle="${bIdx}">
                            <div class="att-book-title">
                                <i class="fas fa-chevron-right att-chevron ${book.open ? 'open' : ''}" id="chevron-${bIdx}"></i>
                                ${book.name}
                                <span class="att-date-label">${book.date || ''}</span>
                            </div>
                            <div class="att-book-actions">
                                <div class="att-summary">
                                    <span style="color:#34c759;" title="出席"><i class="fas fa-check"></i> ${presentCount}</span>
                                    <span style="color:#ff3b30;" title="欠席"><i class="fas fa-times"></i> ${absentCount}</span>
                                    <span style="color:#ff9500;" title="遅刻"><i class="fas fa-clock"></i> ${lateCount}</span>
                                    <span style="color:#8e8e93;" title="未確認"><i class="fas fa-question"></i> ${unconfirmedCount}</span>
                                </div>
                                <button class="att-btn att-btn-danger att-btn-sm delete-book-btn" data-book="${bIdx}" title="削除">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="att-book-body ${book.open ? 'open' : ''}" id="att-body-${bIdx}">
                            <div style="display:flex; justify-content:flex-end; gap:8px; margin-bottom:12px;">
                                <button class="att-btn att-btn-sm set-all-present" data-book="${bIdx}" style="background:rgba(52,199,89,0.1); color:#34c759;">
                                    <i class="fas fa-check-double"></i> 全員出席
                                </button>
                                <button class="att-btn att-btn-sm export-csv" data-book="${bIdx}" style="background:rgba(0,113,227,0.1); color:#0071e3;">
                                    <i class="fas fa-file-csv"></i> CSV出力
                                </button>
                            </div>
                            <div class="att-table-wrap">
                                <table class="att-table">
                                    <thead>
                                        <tr>
                                            <th>名前</th>
                                            <th style="color:#34c759;"><i class="fas fa-check"></i> 出席</th>
                                            <th style="color:#ff3b30;"><i class="fas fa-times"></i> 欠席</th>
                                            <th style="color:#ff9500;"><i class="fas fa-clock"></i> 遅刻</th>
                                            <th style="color:#8e8e93;"><i class="fas fa-question"></i> 未確認</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>${rows}</tbody>
                                </table>
                            </div>
                            <div class="att-add-member-row">
                                <input type="text" placeholder="メンバー名を入力" id="new-member-${bIdx}">
                                <button class="att-btn att-btn-primary att-btn-sm add-member-btn" data-book="${bIdx}">
                                    <i class="fas fa-plus"></i> 追加
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // イベントバインド
            listEl.querySelectorAll('[data-toggle]').forEach(header => {
                header.addEventListener('click', (e) => {
                    if (e.target.closest('.delete-book-btn')) return;
                    const idx = parseInt(header.dataset.toggle);
                    this.attendanceData[idx].open = !this.attendanceData[idx].open;
                    saveData();
                    renderAll();
                });
            });

            listEl.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const bIdx = parseInt(e.target.dataset.book);
                    const mIdx = parseInt(e.target.dataset.member);
                    this.attendanceData[bIdx].members[mIdx].status = e.target.value;
                    saveData();
                    renderAll();
                });
            });

            listEl.querySelectorAll('.add-member-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const bIdx = parseInt(btn.dataset.book);
                    const input = container.querySelector(`#new-member-${bIdx}`);
                    const name = input.value.trim();
                    if (!name) return;
                    this.attendanceData[bIdx].members.push({ name, status: '' });
                    this.attendanceData[bIdx].open = true;
                    saveData();
                    renderAll();
                });
            });

            listEl.querySelectorAll(`input[id^="new-member-"]`).forEach(input => {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const bIdx = input.id.replace('new-member-', '');
                        container.querySelector(`.add-member-btn[data-book="${bIdx}"]`).click();
                    }
                });
            });

            listEl.querySelectorAll('.att-delete-member').forEach(btn => {
                btn.addEventListener('click', () => {
                    const bIdx = parseInt(btn.dataset.book);
                    const mIdx = parseInt(btn.dataset.member);
                    const name = this.attendanceData[bIdx].members[mIdx].name;
                    if (confirm(`「${name}」を削除しますか？`)) {
                        this.attendanceData[bIdx].members.splice(mIdx, 1);
                        saveData();
                        renderAll();
                    }
                });
            });

            listEl.querySelectorAll('.delete-book-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const bIdx = parseInt(btn.dataset.book);
                    const name = this.attendanceData[bIdx].name;
                    if (confirm(`出欠簿「${name}」を削除しますか？`)) {
                        this.attendanceData.splice(bIdx, 1);
                        saveData();
                        renderAll();
                    }
                });
            });

            listEl.querySelectorAll('.set-all-present').forEach(btn => {
                btn.addEventListener('click', () => {
                    const bIdx = parseInt(btn.dataset.book);
                    this.attendanceData[bIdx].members.forEach(m => {
                        if (m.status === '') m.status = 'present';
                        else if (confirm('既に入力されている出欠状況も「出席」で上書きしますか？')) {
                            this.attendanceData[bIdx].members.forEach(m2 => m2.status = 'present');
                        }
                    });
                    // Simple logic: if anyone has status, ask once. If all empty, just set.
                    // Let's refine:
                    const hasStatus = this.attendanceData[bIdx].members.some(m => m.status !== '');
                    if (hasStatus) {
                        if (confirm('すべてのメンバーの出欠状況を「出席」に書き換えますか？')) {
                            this.attendanceData[bIdx].members.forEach(m => m.status = 'present');
                        }
                    } else {
                        this.attendanceData[bIdx].members.forEach(m => m.status = 'present');
                    }
                    saveData();
                    renderAll();
                });
            });

            listEl.querySelectorAll('.export-csv').forEach(btn => {
                btn.addEventListener('click', () => {
                    const bIdx = parseInt(btn.dataset.book);
                    const book = this.attendanceData[bIdx];
                    let csv = '名前,状況\n';
                    const statusMap = { present: '出席', absent: '欠席', late: '遅刻', unconfirmed: '未確認', '': '未入力' };
                    book.members.forEach(m => {
                        csv += `${m.name},${statusMap[m.status]}\n`;
                    });
                    
                    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement("a");
                    const url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", `出欠簿_${book.name}_${book.date}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            });
        };

        container.innerHTML = inlineStyles + `
            <div class="att-container">
                <div class="att-header">
                    <h2><i class="fas fa-clipboard-list"></i> 出欠簿</h2>
                    <button class="att-btn att-btn-primary" id="add-att-book-btn">
                        <i class="fas fa-plus"></i> 出欠簿を追加
                    </button>
                </div>
                <div class="att-book-list" id="att-book-list"></div>
            </div>
            <div id="att-modal" class="modal-overlay">
                <div class="att-modal-box">
                    <h3><i class="fas fa-clipboard-list"></i> 新しい出欠簿</h3>
                    <div class="form-group">
                        <label>出欠簿名</label>
                        <input type="text" id="att-new-name" placeholder="例: 5月定例会議">
                    </div>
                    <div class="form-group">
                        <label>日付</label>
                        <input type="date" id="att-new-date">
                    </div>
                    <div class="form-group">
                        <label>メンバー追加（オプション）</label>
                        <textarea id="att-new-members-bulk" placeholder="名前を改行またはカンマ区切りで入力" style="width:100%; height:80px; padding:12px; border-radius:12px; border:1px solid rgba(0,0,0,0.1); background:var(--glass-bg); color:var(--text-color); font-size:0.9rem; resize:none; outline:none;"></textarea>
                    </div>
                    ${this.attendanceData.length > 0 ? `
                    <div class="form-group" style="display:flex; align-items:center; gap:8px;">
                        <input type="checkbox" id="att-copy-prev" style="width:auto;">
                        <label for="att-copy-prev" style="margin:0; font-size:0.85rem; cursor:pointer;">前回の出欠簿からメンバーをコピー</label>
                    </div>
                    ` : ''}
                    <div class="att-modal-btns">
                        <button id="att-modal-cancel" style="background:rgba(128,128,128,0.1); color:var(--text-color);">キャンセル</button>
                        <button id="att-modal-save" style="background:#0071e3; color:#fff;">作成する</button>
                    </div>
                </div>
            </div>
        `;

        renderAll();

        const modal = container.querySelector('#att-modal');
        container.querySelector('#add-att-book-btn').addEventListener('click', () => {
            modal.classList.add('active');
            container.querySelector('#att-new-name').value = '';
            container.querySelector('#att-new-date').valueAsDate = new Date();
            setTimeout(() => container.querySelector('#att-new-name').focus(), 100);
        });
        container.querySelector('#att-modal-cancel').addEventListener('click', () => modal.classList.remove('active'));
        container.querySelector('#att-modal-save').addEventListener('click', () => {
            const name = container.querySelector('#att-new-name').value.trim();
            if (!name) return alert('出欠簿名を入力してください。');
            const date = container.querySelector('#att-new-date').value;
            
            let members = [];
            
            // コピー機能
            const copyPrev = container.querySelector('#att-copy-prev');
            if (copyPrev && copyPrev.checked && this.attendanceData.length > 0) {
                members = this.attendanceData[0].members.map(m => ({ name: m.name, status: '' }));
            }
            
            // 一括追加機能
            const bulkText = container.querySelector('#att-new-members-bulk').value.trim();
            if (bulkText) {
                const bulkNames = bulkText.split(/[\n,，、]/).map(n => n.trim()).filter(n => n !== '');
                bulkNames.forEach(n => {
                    // 重複チェック
                    if (!members.find(m => m.name === n)) {
                        members.push({ name: n, status: '' });
                    }
                });
            }

            this.attendanceData.unshift({ name, date, open: true, members });
            saveData();
            modal.classList.remove('active');
            renderAll();
        });
        container.querySelector('#att-new-name').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') container.querySelector('#att-modal-save').click();
        });
    }

    async renderTodo(container) {
        let todos = JSON.parse(localStorage.getItem('ch_todos') || '[]');

        const saveTodos = () => {
            localStorage.setItem('ch_todos', JSON.stringify(todos));
        };

        const inlineStyles = `
            <style>
                .todo-view { max-width:900px; margin:0 auto; display:flex; flex-direction:column; gap:25px; }
                .todo-input-wrap {
                    display:flex; flex-direction:column; gap:15px; background:var(--glass-bg); padding:20px;
                    border-radius:24px; border:1px solid var(--glass-border);
                    box-shadow:var(--glass-shadow);
                }
                .todo-input-main { display:flex; gap:12px; }
                .todo-input-main input {
                    flex:1; border:none; background:rgba(0,0,0,0.05); color:var(--text-color);
                    font-size:1.1rem; outline:none; padding:12px 18px; border-radius:15px;
                }
                .todo-input-sub { display:flex; gap:12px; }
                .todo-input-sub input {
                    flex:1; border:none; background:rgba(0,0,0,0.05); color:var(--text-color);
                    font-size:0.9rem; outline:none; padding:10px 15px; border-radius:12px;
                }
                .btn-add-todo {
                    background:var(--primary-color); color:#fff; border:none;
                    padding:0 30px; border-radius:15px; font-weight:600; cursor:pointer;
                    transition:all 0.2s;
                }
                .btn-add-todo:hover { background:var(--primary-hover); transform:translateY(-2px); }

                .todo-list { display:flex; flex-direction:column; gap:12px; }
                .todo-item {
                    display:flex; align-items:center; gap:15px; padding:18px 24px;
                    background:var(--glass-bg); border-radius:20px;
                    border:1px solid var(--glass-border); transition:all 0.2s;
                }
                .todo-item:hover { background:var(--glass-bg-hover); }
                .todo-item.completed { opacity:0.6; }
                
                .swipe-wrapper { position: relative; border-radius: 20px; overflow: hidden; background: rgba(128,128,128,0.2); }
                .swipe-content { 
                    display: flex; align-items: center; gap: 15px; padding: 18px 24px;
                    position: relative; z-index: 2;
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: grab; user-select: none;
                }
                body[data-theme="light"] .swipe-content { background: #ffffff !important; color: #1d1d1f; }
                body[data-theme="dark"] .swipe-content { background: #1a1a1a !important; color: #f5f5f7; }
                .todo-delete-action {
                    position: absolute; right: 0; top: 0; bottom: 0; width: 80px;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-size: 1.2rem; cursor: pointer;
                }
                
                .todo-checkbox {
                    width:26px; height:26px; border-radius:9px; border:2px solid var(--primary-color);
                    cursor:pointer; display:flex; align-items:center; justify-content:center;
                    transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; overflow: hidden;
                }
                .todo-item.completed .todo-checkbox { background:var(--primary-color); border-color:var(--primary-color); }
                
                .todo-checkbox svg {
                    width: 16px; height: 16px;
                    fill: none; stroke: #fff;
                    stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round;
                    stroke-dasharray: 24; stroke-dashoffset: 24;
                    transition: stroke-dashoffset 0.4s ease 0.1s;
                }
                .todo-item.completed .todo-checkbox svg { stroke-dashoffset: 0; }
                
                /* Pop animation */
                .todo-item.completed .todo-checkbox { animation: check-pop 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                @keyframes check-pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }

                .todo-content { flex:1; display:flex; flex-direction:column; gap:4px; }
                .todo-text { font-size:1.05rem; font-weight:600; cursor: text; }
                .todo-edit-input {
                    flex:1; border:none; background:rgba(0,0,0,0.05); color:var(--text-color);
                    font-size:1.05rem; font-weight:600; outline:none; padding:5px 10px; border-radius:8px;
                }
                .todo-info { display:flex; gap:15px; font-size:0.8rem; opacity:0.6; }
                .todo-info span { display:flex; align-items:center; gap:5px; }
                .todo-info .deadline.urgent { color:#ff3b30; font-weight:600; opacity:1; }

                .btn-delete-todo {
                    opacity:0; color:#ff3b30; background:none; border:none;
                    cursor:pointer; transition:all 0.2s; padding:8px;
                }
                .todo-item:hover .btn-delete-todo { opacity:1; }
            </style>
        `;

        container.innerHTML = inlineStyles + `
            <div class="todo-view">
                <div class="todo-input-wrap">
                    <div class="todo-input-main">
                        <input type="text" id="todo-input" placeholder="新しいタスクを入力...">
                        <button id="todo-add-btn" class="btn-add-todo">追加</button>
                    </div>
                    <div class="todo-input-sub">
                        <input type="date" id="todo-deadline" title="期限">
                        <input type="text" id="todo-assignee" placeholder="担当者名">
                    </div>
                </div>
                <div id="todo-list-area" class="todo-list"></div>
            </div>
        `;

        const listArea = container.querySelector('#todo-list-area');
        const input = container.querySelector('#todo-input');
        const deadlineInput = container.querySelector('#todo-deadline');
        const assigneeInput = container.querySelector('#todo-assignee');
        const addBtn = container.querySelector('#todo-add-btn');

        const renderItems = () => {
            if (todos.length === 0) {
                listArea.innerHTML = `<div style="text-align:center; padding:60px; opacity:0.4;">タスクはありません</div>`;
                return;
            }

            listArea.innerHTML = todos.map((todo, idx) => {
                const isUrgent = todo.deadline && new Date(todo.deadline) < new Date(new Date().setDate(new Date().getDate() + 3)) && !todo.completed;
                return `
                    <div class="swipe-wrapper" data-idx="${idx}">
                        <div class="todo-delete-action"><i class="fas fa-trash-alt"></i></div>
                        <div class="swipe-content todo-item ${todo.completed ? 'completed' : ''}">
                            <div class="todo-checkbox">
                                <svg viewBox="0 0 20 20">
                                    <path d="M4 10l4 4 8-8"></path>
                                </svg>
                            </div>
                            <div class="todo-content">
                                <div class="todo-text">${todo.text}</div>
                                <div class="todo-info">
                                    ${todo.deadline ? `<span class="deadline ${isUrgent ? 'urgent' : ''}"><i class="fas fa-calendar-day"></i> ${todo.deadline}まで</span>` : ''}
                                    ${todo.assignee ? `<span><i class="fas fa-user"></i> ${todo.assignee}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            listArea.querySelectorAll('.swipe-wrapper').forEach(wrapper => {
                const idx = parseInt(wrapper.dataset.idx);
                const checkbox = wrapper.querySelector('.todo-checkbox');
                const content = wrapper.querySelector('.swipe-content');
                const textEl = wrapper.querySelector('.todo-text');
                
                // Toggle only on checkbox
                checkbox.onclick = (e) => {
                    e.stopPropagation();
                    todos[idx].completed = !todos[idx].completed;
                    saveTodos();
                    renderItems();
                };

                // Edit on Double Click
                textEl.ondblclick = (e) => {
                    e.stopPropagation();
                    const currentText = todos[idx].text;
                    textEl.innerHTML = `<input type="text" class="todo-edit-input" value="${currentText}">`;
                    const input = textEl.querySelector('input');
                    input.focus();
                    
                    const saveEdit = () => {
                        const newText = input.value.trim();
                        if (newText && newText !== currentText) {
                            todos[idx].text = newText;
                            saveTodos();
                        }
                        renderItems();
                    };

                    input.onkeydown = (e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') renderItems(); };
                    input.onblur = saveEdit;
                };

                // Delete Action
                wrapper.querySelector('.todo-delete-action').onclick = (e) => {
                    e.stopPropagation();
                    todos.splice(idx, 1);
                    saveTodos();
                    renderItems();
                };

                // Swipe logic
                let sX = 0, cX = 0, moved = false;
                content.onmousedown = content.ontouchstart = (e) => { 
                    sX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX; 
                    content.style.transition = 'none';
                    moved = false;
                };
                
                const moveHandler = (e) => {
                    if(!sX) return;
                    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                    cX = x - sX;
                    if(Math.abs(cX) > 5) moved = true;
                    if(cX > 0) cX = 0; if(cX < -100) cX = -100;
                    content.style.transform = `translateX(${cX}px)`;
                };

                const endHandler = () => {
                    if(!sX) return;
                    sX = 0; 
                    content.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    if (cX < -40) {
                        content.style.transform = 'translateX(-80px)';
                    } else {
                        content.style.transform = 'translateX(0)';
                    }
                };

                window.addEventListener('mousemove', moveHandler);
                window.addEventListener('touchmove', moveHandler);
                window.addEventListener('mouseup', endHandler);
                window.addEventListener('touchend', endHandler);
            });
        };

        const addTodo = () => {
            const text = input.value.trim();
            const deadline = deadlineInput.value;
            const assignee = assigneeInput.value.trim();
            if (text) {
                todos.unshift({ text, deadline, assignee, completed: false });
                input.value = '';
                deadlineInput.value = '';
                assigneeInput.value = '';
                saveTodos();
                renderItems();
            }
        };

        addBtn.onclick = addTodo;
        input.onkeydown = (e) => { if (e.key === 'Enter') addTodo(); };

        renderItems();
    }

    async renderSearch(container) {
        let allFiles = [];
        let filteredFiles = [];
        let currentQuery = '';
        let currentFilters = new Set(['all']);

        const inlineStyles = `
            <style>
                .search-view { display:flex; flex-direction:column; padding:0; height:100%; overflow:hidden; }
                .search-header {
                    position:sticky; top:0; z-index:100;
                    background:var(--glass-bg); backdrop-filter:blur(24px);
                    padding:20px; border-bottom:1px solid var(--glass-border);
                    display:flex; flex-direction:column; gap:15px;
                }
                .search-input-container {
                    flex:1; display:flex; align-items:center; gap:12px;
                    background:rgba(0,0,0,0.05); padding:12px 20px; border-radius:20px;
                }
                .search-input-container input {
                    flex:1; border:none; background:none; color:var(--text-color);
                    font-size:1.1rem; outline:none;
                }
                .btn-refresh {
                    background:var(--primary-color); color:#fff; border:none;
                    width:44px; height:44px; border-radius:15px; cursor:pointer;
                    display:flex; align-items:center; justify-content:center;
                    font-size:1.1rem; transition:all 0.3s;
                }
                .btn-refresh:hover { transform:rotate(90deg); background:var(--primary-hover); }
                .btn-refresh.spinning i { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                
                .filter-chips { display:flex; gap:10px; overflow-x:auto; scrollbar-width:none; padding-bottom:5px; }
                .filter-chips::-webkit-scrollbar { display:none; }
                .chip {
                    display:inline-flex; align-items:center; justify-content:center;
                    height:38px; padding:0 18px; border-radius:12px; background:rgba(0,0,0,0.05);
                    border:1px solid transparent; cursor:pointer; font-size:0.85rem;
                    white-space:nowrap; transition:all 0.2s;
                }
                .chip.active { background:var(--primary-color); color:#fff; }
                
                #btn-multi-select {
                    background:rgba(0,0,0,0.05); border:1px solid transparent;
                    border-radius:12px; padding:0 15px; height:38px; color:var(--text-color);
                    cursor:pointer; font-size:0.85rem; display:flex; align-items:center; gap:6px;
                    transition:all 0.2s; white-space:nowrap;
                }
                #btn-multi-select.active { background:var(--primary-color); color:white; }
                .file-list-scroll { flex:1; overflow-y:auto; padding:20px; }
                .file-list { display:flex; flex-direction:column; gap:24px; }
                .folder-section {
                    background:rgba(128,128,128,0.03);
                    border:1px solid var(--glass-border);
                    border-radius:24px; padding:20px;
                }
                .folder-header {
                    display:flex; align-items:center; gap:10px;
                    margin-bottom:15px; font-weight:600; font-size:1rem;
                    color:var(--text-color); opacity:0.8;
                }
                .folder-grid {
                    display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px;
                }
                .file-card {
                    display:flex; align-items:center; gap:15px; padding:16px;
                    border-radius:18px; cursor:pointer; transition:all 0.2s;
                }
                .file-card:hover { transform:translateY(-2px); background:var(--glass-bg-hover); }
                .file-icon {
                    width:48px; height:48px; border-radius:12px;
                    display:flex; align-items:center; justify-content:center; font-size:1.5rem;
                }
                .icon-word { background:rgba(43,123,191,0.1); color:#2b7bbf; }
                .icon-excel { background:rgba(33,163,102,0.1); color:#21a366; }
                .icon-pdf { background:rgba(224,30,55,0.1); color:#e01e37; }
                .icon-image { background:rgba(142,142,147,0.1); color:#8e8e93; }
                .icon-archive { background:rgba(255,149,0,0.1); color:#ff9500; }
                .icon-other { background:rgba(128,128,128,0.1); color:#555; }
                
                .file-info { flex:1; overflow:hidden; }
                .file-name { font-weight:600; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .file-meta { font-size:0.75rem; opacity:0.6; margin-top:4px; display:flex; gap:10px; }
            </style>
        `;

        container.innerHTML = inlineStyles + `
            <div class="search-view">
                <div class="search-header">
                    <div style="display:flex; gap:12px; align-items:center;">
                        <div class="search-input-container">
                            <i class="fas fa-search" style="opacity:0.5;"></i>
                            <input type="text" id="file-search-input" placeholder="「フォルダ」内から検索...">
                        </div>
                        <button id="btn-file-refresh" class="btn-refresh" title="フォルダと同期">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <div class="filter-chips" id="filter-chips" style="flex:1;">
                            <div class="chip active" data-filter="all">すべて</div>
                            <div class="chip" data-filter="text">テキスト</div>
                            <div class="chip" data-filter="word">Word</div>
                            <div class="chip" data-filter="excel">Excel</div>
                            <div class="chip" data-filter="pdf">PDF</div>
                            <div class="chip" data-filter="slide">スライド</div>
                            <div class="chip" data-filter="image">画像</div>
                            <div class="chip" data-filter="audio">音声</div>
                            <div class="chip" data-filter="video">動画</div>
                            <div class="chip" data-filter="archive">圧縮</div>
                            <div class="chip" data-filter="other">その他</div>
                        </div>
                        <button id="btn-multi-select" title="複数選択モード">
                            <i class="fas fa-check-double"></i> 複数選択
                        </button>
                    </div>
                </div>
                <div class="file-list-scroll">
                    <div class="file-list" id="file-list-area">
                        <!-- Files will be rendered here -->
                    </div>
                </div>
            </div>
        `;

        const listArea = container.querySelector('#file-list-area');
        const searchInput = container.querySelector('#file-search-input');
        const chips = container.querySelectorAll('.chip');

        const getIconClass = (type) => {
            switch(type) {
                case 'text': return { icon: 'fa-file-lines', class: 'icon-other' };
                case 'word': return { icon: 'fa-file-word', class: 'icon-word' };
                case 'excel': return { icon: 'fa-file-excel', class: 'icon-excel' };
                case 'pdf': return { icon: 'fa-file-pdf', class: 'icon-pdf' };
                case 'slide': return { icon: 'fa-file-powerpoint', class: 'icon-pdf' }; // Use red-ish for slides
                case 'image': return { icon: 'fa-file-image', class: 'icon-image' };
                case 'audio': return { icon: 'fa-file-audio', class: 'icon-archive' };
                case 'video': return { icon: 'fa-file-video', class: 'icon-archive' };
                case 'archive': return { icon: 'fa-file-zipper', class: 'icon-archive' };
                case 'folder': return { icon: 'fa-folder', class: 'icon-archive' };
                default: return { icon: 'fa-file', class: 'icon-other' };
            }
        };

        const renderFiles = () => {
            const matchesQuery = (f) => f.name.toLowerCase().includes(currentQuery.toLowerCase());
            const matchesFilter = (f) => currentFilters.has('all') || currentFilters.has(f.type);
            
            filteredFiles = allFiles.filter(f => matchesQuery(f) && matchesFilter(f) && f.type !== 'folder');

            if (filteredFiles.length === 0) {
                listArea.innerHTML = `<div style="text-align:center; padding:60px; opacity:0.5;"><i class="fas fa-folder-open" style="font-size:3rem; margin-bottom:15px; display:block;"></i>該当するファイルが見つかりません</div>`;
                return;
            }

            // Group by folder
            const groups = {};
            filteredFiles.forEach(f => {
                const folderName = f.folder || '/';
                if (!groups[folderName]) groups[folderName] = [];
                groups[folderName].push(f);
            });

            // Ensure root files are first, then other folders
            const folderNames = Object.keys(groups).sort((a, b) => {
                if (a === '/') return -1;
                if (b === '/') return 1;
                return a.localeCompare(b);
            });

            listArea.innerHTML = folderNames.map(folderName => {
                const files = groups[folderName];
                const isRoot = folderName === '/';
                
                return `
                    <div class="folder-section">
                        ${!isRoot ? `
                            <div class="folder-header">
                                <i class="fas fa-folder-open" style="color:#ff9500;"></i>
                                ${folderName}
                            </div>
                        ` : `
                            <div class="folder-header">
                                <i class="fas fa-house" style="font-size:0.8rem; opacity:0.5;"></i>
                                ルート
                            </div>
                        `}
                        <div class="folder-grid">
                            ${files.map(f => {
                                const iconInfo = getIconClass(f.type);
                                return `
                                    <div class="file-card glass-panel" data-path="${f.path}">
                                        <div class="file-icon ${iconInfo.class}">
                                            <i class="fas ${iconInfo.icon}"></i>
                                        </div>
                                        <div class="file-info">
                                            <div class="file-name" title="${f.name}">${f.name}</div>
                                            <div class="file-meta">
                                                <span><i class="fas fa-calendar"></i> ${f.date}</span>
                                                <span><i class="fas fa-database"></i> ${f.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('');

            // Add click events for file preview/open
            listArea.querySelectorAll('.file-card').forEach(card => {
                card.addEventListener('click', async () => {
                    const path = card.dataset.path;
                    try {
                        let dirHandle = this.fileSearchDirHandle;
                        // IndexedDBからハンドル復元を試みる（リロード対策）
                        if (!dirHandle) {
                            dirHandle = await new Promise((resolve) => {
                                const req = indexedDB.open('COS_FS_DB', 1);
                                req.onupgradeneeded = e => e.target.result.createObjectStore('handles');
                                req.onsuccess = e => {
                                    const db = e.target.result;
                                    const getReq = db.transaction('handles', 'readonly').objectStore('handles').get('root');
                                    getReq.onsuccess = () => resolve(getReq.result);
                                    getReq.onerror = () => resolve(null);
                                };
                                req.onerror = () => resolve(null);
                            });
                            
                            if (dirHandle) {
                                // 権限チェックと要求（ブラウザのネイティブダイアログが出る）
                                if ((await dirHandle.queryPermission({ mode: 'read' })) !== 'granted') {
                                    const perm = await dirHandle.requestPermission({ mode: 'read' });
                                    if (perm !== 'granted') {
                                        alert('アクセスが拒否されました。再度「更新ボタン」からフォルダを選択してください。');
                                        return;
                                    }
                                }
                                this.fileSearchDirHandle = dirHandle;
                            } else {
                                alert('権限がありません。まず「更新ボタン（右上）」を押してフォルダを選択してください。');
                                return;
                            }
                        }
                        // Traverse directory handle to find the file
                        const parts = path.split('/');
                        let currentHandle = this.fileSearchDirHandle;
                        for (let i = 0; i < parts.length - 1; i++) {
                            currentHandle = await currentHandle.getDirectoryHandle(parts[i]);
                        }
                        const fileHandle = await currentHandle.getFileHandle(parts[parts.length - 1]);
                        const file = await fileHandle.getFile();
                        const fileUrl = URL.createObjectURL(file);
                        const ext = file.name.split('.').pop().toLowerCase();
                        if (['txt', 'csv', 'md'].includes(ext)) {
                            const buffer = await file.arrayBuffer();
                            let text = new TextDecoder('shift-jis').decode(buffer);
                            if (text.includes('')) text = new TextDecoder('utf-8').decode(buffer);
                            
                            const newWin = window.open('', '_blank');
                            newWin.document.write(`<html><head><title>${file.name}</title><style>body{background:#1e1e1e;color:#d4d4d4;padding:20px;font-family:monospace;font-size:15px;line-height:1.6;}</style></head><body><pre style="white-space:pre-wrap;word-wrap:break-word;">${text}</pre></body></html>`);
                            newWin.document.close();
                            
                        } else if (ext === 'docx') {
                            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
                            const newWin = window.open('', '_blank');
                            newWin.document.write(`
                                <html><head><title>${file.name}</title>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js"></script>
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                                <style>
                                    body{background:#f0f2f5;display:flex;flex-direction:column;align-items:center;padding:40px;font-family:'Yu Mincho',serif;margin:0;}
                                    .toolbar{width:100%;max-width:850px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;background:rgba(255,255,255,0.8);padding:10px 20px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);backdrop-filter:blur(10px);position:sticky;top:20px;z-index:100;}
                                    #preview{background:white;padding:50px;box-shadow:0 4px 12px rgba(0,0,0,0.1);max-width:850px;width:100%;min-height:1000px;border-radius:4px;}
                                    .status-msg{text-align:center;margin-top:100px;color:#666;}
                                    .btn-open{background:#2b7bbf;color:white;text-decoration:none;padding:8px 16px;border-radius:6px;font-family:sans-serif;font-size:0.9rem;font-weight:600;transition:0.2s;}
                                    .btn-open:hover{background:#1e5a8a;transform:translateY(-1px);}
                                    img{max-width:100%;height:auto;}
                                    table{border-collapse:collapse;width:100%;margin:20px 0;}
                                    td,th{border:1px solid #ccc;padding:8px;}
                                </style></head>
                                <body>
                                    <div class="toolbar">
                                        <div style="font-family:sans-serif;font-size:0.9rem;color:#333;">
                                            <i class="fas fa-file-word" style="color:#2b7bbf;margin-right:8px;"></i>
                                            <strong>${file.name}</strong> <span style="opacity:0.6;margin-left:8px;">(${fileSizeMB} MB)</span>
                                        </div>
                                        <a href="${fileUrl}" download="${file.name}" class="btn-open">
                                            <i class="fas fa-external-link-alt"></i> Wordで直接開く
                                        </a>
                                    </div>
                                    <div id="preview">
                                        <div class="status-msg" id="status">
                                            <i class="fas fa-circle-notch fa-spin fa-2x" style="margin-bottom:15px;display:block;"></i>
                                            プレビューを生成中...<br>
                                            <small style="opacity:0.7;display:block;margin-top:10px;">${fileSizeMB > 5 ? 'ファイルサイズが大きいため、時間がかかる場合があります。' : 'まもなく表示されます。'}</small>
                                        </div>
                                    </div>
                                <script>
                                    window.onload = () => {
                                        const status = document.getElementById('status');
                                        if(typeof mammoth === 'undefined') {
                                            status.innerHTML = '<div style="color:red;padding:40px;text-align:center;"><i class="fas fa-exclamation-triangle"></i> ライブラリの読み込みに失敗しました。<br>上部のボタンからWordアプリで開いてください。</div>';
                                            return;
                                        }
                                        fetch("${fileUrl}").then(r=>r.arrayBuffer()).then(buf=>{
                                            mammoth.convertToHtml({arrayBuffer: buf}).then(res=>{
                                                document.getElementById('preview').innerHTML = res.value || '<div style="text-align:center;padding:50px;opacity:0.5;">内容が空か、表示できない形式です。</div>';
                                            }).catch(err=>{ 
                                                status.innerHTML = '<div style="color:red;padding:40px;text-align:center;"><i class="fas fa-exclamation-circle"></i> プレビューの生成に失敗しました。ファイルが複雑すぎるか、メモリ制限を超えた可能性があります。<br><br>上部の「Wordで直接開く」ボタンをご利用ください。</div>';
                                            });
                                        }).catch(err=> {
                                            status.innerHTML = '<div style="color:red;padding:40px;text-align:center;">ファイルの取得に失敗しました。</div>';
                                        });
                                    };
                                </script></body></html>
                            `);
                            newWin.document.close();
                            
                        } else if (['xlsx', 'xls'].includes(ext)) {
                            // Excelファイルをブラウザ内でプレビュー
                            const fileUrl = URL.createObjectURL(file);
                            const newWin = window.open('', '_blank');
                            newWin.document.write(`
                                <html><head><title>${file.name}</title>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
                                <style>
                                    body{background:#f0f2f5;padding:20px;font-family:sans-serif;}
                                    #preview{background:white;padding:20px;overflow:auto;box-shadow:0 4px 12px rgba(0,0,0,0.1);border-radius:8px;}
                                    table{border-collapse:collapse;min-width:100%;font-size:14px;}
                                    td,th{border:1px solid #ddd;padding:8px 12px;white-space:nowrap;}
                                    tr:nth-child(even){background-color:#f9f9f9;}
                                    .tabs{display:flex;gap:10px;margin-bottom:15px;overflow-x:auto;}
                                    .tab{padding:8px 16px;background:#ddd;cursor:pointer;border-radius:4px;white-space:nowrap;}
                                    .tab.active{background:#21a366;color:white;}
                                </style></head>
                                <body><div class="tabs" id="tabs"></div><div id="preview"><div style="text-align:center;color:#666;margin-top:100px;"><i class="fas fa-spinner fa-spin"></i> Excelファイルを読み込み中...</div></div>
                                <script>
                                    window.onload = () => {
                                        if(typeof XLSX === 'undefined') {
                                            document.getElementById('preview').innerHTML = '<div style="color:red;text-align:center;padding:20px;">XLSXライブラリの読み込みに失敗しました。</div>';
                                            return;
                                        }
                                        fetch("${fileUrl}").then(r=>r.arrayBuffer()).then(buf=>{
                                            try {
                                                const wb = XLSX.read(buf, {type:'array'});
                                                const tabsDiv = document.getElementById('tabs');
                                                const previewDiv = document.getElementById('preview');
                                                function showSheet(name) {
                                                    Array.from(tabsDiv.children).forEach(btn=>btn.classList.remove('active'));
                                                    document.getElementById('tab-'+name).classList.add('active');
                                                    previewDiv.innerHTML = XLSX.utils.sheet_to_html(wb.Sheets[name]) || 'データがありません';
                                                }
                                                wb.SheetNames.forEach((name, i) => {
                                                    const btn = document.createElement('div');
                                                    btn.className = 'tab' + (i===0?' active':'');
                                                    btn.id = 'tab-'+name; btn.textContent = name;
                                                    btn.onclick = () => showSheet(name);
                                                    tabsDiv.appendChild(btn);
                                                });
                                                if(wb.SheetNames.length > 0) showSheet(wb.SheetNames[0]);
                                                else previewDiv.innerHTML = 'シートが見つかりません';
                                            } catch(err) { document.getElementById('preview').innerHTML = '変換エラー: '+err.message; }
                                        }).catch(err=> { document.getElementById('preview').innerHTML = 'ファイル取得エラー: '+err.message; });
                                    };
                                </script></body></html>
                            `);
                            newWin.document.close();
                            
                        } else if (['ppt', 'pptx'].includes(ext)) {
                            // スライド(PPTX)ファイルをブラウザ内でプレビュー（JSZipでサムネイルとテキストを抽出）
                            const fileUrl = URL.createObjectURL(file);
                            const newWin = window.open('', '_blank');
                            newWin.document.write(`
                                <html><head><title>${file.name}</title>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
                                <style>
                                    body{background:#222;color:#eee;padding:20px;font-family:sans-serif;}
                                    #preview{max-width:900px;margin:0 auto;background:#333;padding:30px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.5);}
                                    .slide-card{background:#fff;color:#333;margin-bottom:20px;padding:25px;border-radius:8px;}
                                    .slide-num{font-weight:bold;color:#888;border-bottom:2px solid #eee;padding-bottom:10px;margin-bottom:15px;font-size:1.1rem;text-transform:uppercase;letter-spacing:1px;}
                                    .slide-text{font-size:1.2rem;line-height:1.7;}
                                    img.thumbnail{width:100%;max-width:800px;display:block;margin:0 auto 40px;border-radius:6px;box-shadow:0 4px 15px rgba(0,0,0,0.4);}
                                </style></head>
                                <body><div id="preview"><div style="text-align:center;color:#ccc;padding:50px;font-size:1.2rem;">スライドを解析中...<br><small style="opacity:0.6;font-size:0.9rem;display:block;margin-top:10px;">※テキストデータとサムネイルの簡易プレビューです</small></div></div>
                                <script>
                                    fetch("${fileUrl}").then(r=>r.arrayBuffer()).then(buf=>{
                                        JSZip.loadAsync(buf).then(async zip => {
                                            const previewDiv = document.getElementById('preview');
                                            previewDiv.innerHTML = '<h2 style="text-align:center;margin-bottom:40px;font-weight:300;">${file.name}</h2>';
                                            
                                            // サムネイル画像の抽出（PPTXは通常docProps/thumbnail.jpegを含んでいる）
                                            const thumbFile = zip.file("docProps/thumbnail.jpeg");
                                            if (thumbFile) {
                                                const base64 = await thumbFile.async("base64");
                                                previewDiv.innerHTML += '<img src="data:image/jpeg;base64,' + base64 + '" class="thumbnail" alt="Thumbnail">';
                                            }
                                            
                                            // スライドテキストと画像の抽出（ppt/slides/slideN.xml および _rels/slideN.xml.rels）
                                            let html = '';
                                            for(let i=1; i<=200; i++) {
                                                const slide = zip.file("ppt/slides/slide"+i+".xml");
                                                if(!slide) {
                                                    if(i>1) break; // スライドが見つからなくなったら終了
                                                    continue;
                                                }
                                                const text = await slide.async("string");
                                                
                                                // 画像の抽出
                                                let imagesHtml = '';
                                                const relsFile = zip.file("ppt/slides/_rels/slide"+i+".xml.rels");
                                                if (relsFile) {
                                                    const relsText = await relsFile.async("string");
                                                    // Target="../media/image1.jpeg" などを抽出
                                                    const imgMatches = [...relsText.matchAll(/Target="\\.\\.\\/media\\/([^"]+)"/g)];
                                                    for (const match of imgMatches) {
                                                        const imgName = match[1];
                                                        const imgFile = zip.file("ppt/media/" + imgName);
                                                        if (imgFile) {
                                                            const ext = imgName.split('.').pop().toLowerCase();
                                                            const mime = (ext === 'png') ? 'image/png' : (ext === 'jpeg' || ext === 'jpg') ? 'image/jpeg' : (ext === 'gif') ? 'image/gif' : (ext === 'svg') ? 'image/svg+xml' : 'image/jpeg';
                                                            const base64 = await imgFile.async("base64");
                                                            imagesHtml += '<img src="data:'+mime+';base64,'+base64+'" style="max-width:100%; max-height:300px; display:inline-block; margin:10px 10px 0 0; border-radius:4px; box-shadow:0 2px 6px rgba(0,0,0,0.2);">';
                                                        }
                                                    }
                                                }
                                                
                                                // <a:t>...</a:t> からテキストを抽出
                                                const matches = text.match(/<a:t>([\\s\\S]*?)<\\/a:t>/g);
                                                let cleanText = '';
                                                if(matches) {
                                                    cleanText = matches.map(m=>m.replace(/<\\/?a:t>/g,'')).join(' ');
                                                }
                                                
                                                if(cleanText.trim() || imagesHtml) {
                                                    html += '<div class="slide-card"><div class="slide-num">Slide '+i+'</div>';
                                                    if (cleanText.trim()) html += '<div class="slide-text">'+cleanText+'</div>';
                                                    if (imagesHtml) html += '<div style="margin-top:15px; border-top:1px dashed #eee; padding-top:10px;">' + imagesHtml + '</div>';
                                                    html += '</div>';
                                                }
                                            }
                                            
                                            if(html) {
                                                previewDiv.innerHTML += html;
                                            } else if (!thumbFile) {
                                                previewDiv.innerHTML += '<div style="text-align:center;opacity:0.6;">表示できるテキストデータがありません。</div>';
                                            }
                                        }).catch(err => {
                                            document.getElementById('preview').innerHTML = '解析エラー: ' + err.message + '<br><small>※古い形式のpptファイルはプレビュー非対応です</small>';
                                        });
                                    });
                                </script></body></html>
                            `);
                            newWin.document.close();
                            
                        } else {
                            // PDF、画像、その他ファイルは直接表示
                            window.open(fileUrl, '_blank');
                        }
                        
                    } catch (e) {
                        console.error('File open error:', e);
                        if (e.name === 'NotFoundError') {
                            alert('ファイルが見つかりません。移動、名前の変更、または削除された可能性があります。');
                        } else {
                            alert('ファイルを開けませんでした。\n' + e.message);
                        }
                    }
                });
            });
        };

        // ── File System Access API でフォルダを再帰スキャン ──
        const FILE_CACHE_KEY = 'cos_file_index';

        // 拡張子からファイルタイプを判定
        const getTypeFromExt = (name) => {
            const ext = name.split('.').pop().toLowerCase();
            if (['txt', 'md'].includes(ext)) return 'text';
            if (['doc','docx'].includes(ext)) return 'word';
            if (['xls','xlsx','csv'].includes(ext)) return 'excel';
            if (['pdf'].includes(ext)) return 'pdf';
            if (['ppt','pptx'].includes(ext)) return 'slide';
            if (['jpg','jpeg','png','gif','webp','bmp','svg','heic','avif'].includes(ext)) return 'image';
            if (['mp3','wav','aac','flac','m4a','ogg'].includes(ext)) return 'audio';
            if (['mp4','mov','avi','mkv','webm','wmv'].includes(ext)) return 'video';
            if (['zip','rar','7z','tar','gz','tgz'].includes(ext)) return 'archive';
            return 'other';
        };

        // バイト数を人間が読みやすいサイズ表記に変換
        const formatSize = (bytes) => {
            if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + 'GB';
            if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'MB';
            if (bytes >= 1024) return (bytes / 1024).toFixed(1) + 'KB';
            return bytes + 'B';
        };

        // 再帰的にフォルダハンドルをスキャンしてファイル一覧を取得
        const scanDirectory = async (dirHandle, folderPath) => {
            const results = [];
            let id = 0;
            for await (const [name, handle] of dirHandle.entries()) {
                if (handle.kind === 'file') {
                    try {
                        const file = await handle.getFile();
                        const date = new Date(file.lastModified);
                        const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
                        results.push({
                            id: id++,
                            name: name,
                            type: getTypeFromExt(name),
                            date: dateStr,
                            size: formatSize(file.size),
                            folder: folderPath || '/',
                            path: folderPath ? `${folderPath}/${name}` : name
                        });
                    } catch (e) {
                        // アクセス不可ファイルはスキップ
                    }
                } else if (handle.kind === 'directory') {
                    const subPath = folderPath ? `${folderPath}/${name}` : name;
                    const subFiles = await scanDirectory(handle, subPath);
                    results.push(...subFiles);
                }
            }
            return results;
        };

        // キャッシュからロード
        const loadFromCache = () => {
            try {
                const cached = sessionStorage.getItem(FILE_CACHE_KEY);
                return cached ? JSON.parse(cached) : null;
            } catch { return null; }
        };

        // キャッシュへ保存
        const saveToCache = (files) => {
            try {
                sessionStorage.setItem(FILE_CACHE_KEY, JSON.stringify(files));
            } catch { /* sessionStorageが満杯の場合は無視 */ }
        };

        // 実際にスキャン処理を行う
        const executeScan = async (dirHandle) => {
            listArea.innerHTML = `
                <div style="text-align:center; padding:60px; opacity:0.7;">
                    <i class="fas fa-spinner fa-spin" style="font-size:2rem; margin-bottom:15px; display:block;"></i>
                    フォルダをスキャン中...<br><small style="opacity:0.6;">ファイル数が多い場合は少し時間がかかります</small>
                </div>`;
            const files = await scanDirectory(dirHandle, '');
            // ルートファイルのfolder値を修正
            files.forEach(f => { if (f.folder === '') f.folder = '/'; });
            saveToCache(files);
            return files;
        };

        // フォルダを選択してスキャンする
        const pickAndScan = async () => {
            try {
                const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
                this.fileSearchDirHandle = dirHandle; // ハンドルを記憶
                
                // IndexedDBにも保存しておく
                const req = indexedDB.open('COS_FS_DB', 1);
                req.onupgradeneeded = e => e.target.result.createObjectStore('handles');
                req.onsuccess = e => {
                    const db = e.target.result;
                    db.transaction('handles', 'readwrite').objectStore('handles').put(dirHandle, 'root');
                };

                return await executeScan(dirHandle);
            } catch (e) {
                if (e.name !== 'AbortError') {
                    console.error('フォルダ選択エラー:', e);
                }
                return null;
            }
        };

        // 初回ロード：キャッシュがあればキャッシュから、なければフォルダ選択を促す
        const cached = loadFromCache();
        if (cached && cached.length > 0) {
            allFiles = cached;
            renderFiles();
        } else {
            listArea.innerHTML = `
                <div style="text-align:center; padding:80px 40px; opacity:0.8;">
                    <i class="fas fa-folder-open" style="font-size:3.5rem; margin-bottom:20px; display:block; color:var(--primary-color);"></i>
                    <p style="font-size:1.1rem; font-weight:600; margin-bottom:12px;">「フォルダ」を選択してください</p>
                    <p style="font-size:0.9rem; opacity:0.6; margin-bottom:24px;">対象のフォルダ(D:\CH\フォルダなど) を選択すると、中のファイルがすべて表示されます</p>
                    <button id="btn-pick-folder" style="background:var(--primary-color); color:#fff; border:none; padding:12px 28px; border-radius:12px; font-size:1rem; cursor:pointer; font-weight:600;">
                        <i class="fas fa-folder-plus"></i>　フォルダを選択
                    </button>
                </div>`;
            const pickBtn = listArea.querySelector('#btn-pick-folder');
            if (pickBtn) {
                pickBtn.addEventListener('click', async () => {
                    const files = await pickAndScan();
                    if (files) {
                        allFiles = files;
                        renderFiles();
                    }
                });
            }
        }

        // Listeners
        searchInput.addEventListener('input', (e) => {
            currentQuery = e.target.value;
            renderFiles();
        });

        let isMultiSelect = false;
        const btnMultiSelect = container.querySelector('#btn-multi-select');
        if (btnMultiSelect) {
            btnMultiSelect.addEventListener('click', () => {
                isMultiSelect = !isMultiSelect;
                if (isMultiSelect) {
                    btnMultiSelect.classList.add('active');
                } else {
                    btnMultiSelect.classList.remove('active');
                    // 複数選択が解除された場合、最初の1つだけにする
                    if (currentFilters.size > 1 && !currentFilters.has('all')) {
                        const first = Array.from(currentFilters)[0];
                        currentFilters.clear();
                        currentFilters.add(first);
                        updateChips();
                        renderFiles();
                    }
                }
            });
        }

        const updateChips = () => {
            chips.forEach(c => {
                if (currentFilters.has(c.dataset.filter)) {
                    c.classList.add('active');
                } else {
                    c.classList.remove('active');
                }
            });
        };

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.dataset.filter;
                
                if (filter === 'all') {
                    currentFilters.clear();
                    currentFilters.add('all');
                } else {
                    if (isMultiSelect) {
                        // 複数選択モード
                        if (currentFilters.has('all')) {
                            currentFilters.delete('all');
                        }
                        if (currentFilters.has(filter)) {
                            currentFilters.delete(filter);
                        } else {
                            currentFilters.add(filter);
                        }
                    } else {
                        // 単一選択モード
                        currentFilters.clear();
                        currentFilters.add(filter);
                    }
                    
                    if (currentFilters.size === 0) {
                        currentFilters.add('all');
                    }
                }

                updateChips();
                renderFiles();
            });
        });

        // Refresh Listener（同じフォルダを再スキャン。ページ更新後などでハンドルがない場合のみ再選択）
        const refreshBtn = container.querySelector('#btn-file-refresh');
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('spinning');
            try {
                let files;
                // 一度選択したフォルダのハンドルがあればそれを使い、なければ選択させる
                if (this.fileSearchDirHandle) {
                    files = await executeScan(this.fileSearchDirHandle);
                } else {
                    files = await pickAndScan();
                }
                if (files) {
                    allFiles = files;
                    renderFiles();
                }
            } catch (e) {
                console.error("更新エラー:", e);
            } finally {
                refreshBtn.classList.remove('spinning');
            }
        });
    }

    renderSoukai(container) {
        container.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px; padding:10px;">
                <div class="glass-panel" style="padding:24px; grid-column: 1 / -1; display:flex; align-items:center; gap:20px; background: linear-gradient(135deg, rgba(0,113,227,0.2), rgba(0,0,0,0));">
                    <div style="font-size:3rem;"><i class="fas fa-users-rectangle"></i></div>
                    <div>
                        <h2 style="margin:0;">令和6年度 第1回 生徒総会</h2>
                        <p style="margin:5px 0 0; opacity:0.7;">開催まで残り 12日 | 場所: 体育館第一アリーナ</p>
                    </div>
                </div>
                
                <div class="glass-panel" style="padding:20px;">
                    <h3 style="margin-bottom:15px;"><i class="fas fa-list-check"></i> 審議事項 (Agenda)</h3>
                    <ul style="list-style:none; display:flex; flex-direction:column; gap:12px;">
                        <li style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid rgba(128,128,128,0.1);">
                            <span>1. 昨年度決算報告</span>
                            <span style="font-size:0.7rem; padding:2px 8px; border-radius:10px; background:rgba(52,199,89,0.2); color:#34c759;">準備完了</span>
                        </li>
                        <li style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid rgba(128,128,128,0.1);">
                            <span>2. 今年度予算案審議</span>
                            <span style="font-size:0.7rem; padding:2px 8px; border-radius:10px; background:rgba(0,113,227,0.2); color:#0071e3;">作成中</span>
                        </li>
                        <li style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid rgba(128,128,128,0.1);">
                            <span>3. 部活動昇格に関する規程変更</span>
                            <span style="font-size:0.7rem; padding:2px 8px; border-radius:10px; background:rgba(128,128,128,0.1);">未着手</span>
                        </li>
                    </ul>
                </div>

                <div class="glass-panel" style="padding:20px;">
                    <h3 style="margin-bottom:15px;"><i class="fas fa-file-export"></i> 配布資料アーカイブ</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div class="glass-panel" style="padding:15px; text-align:center; cursor:pointer; background:rgba(128,128,128,0.05);">
                            <i class="fas fa-file-pdf" style="font-size:1.5rem; color:#ff3b30;"></i>
                            <div style="font-size:0.8rem; margin-top:8px;">議案書全文</div>
                        </div>
                        <div class="glass-panel" style="padding:15px; text-align:center; cursor:pointer; background:rgba(128,128,128,0.05);">
                            <i class="fas fa-file-excel" style="font-size:1.5rem; color:#34c759;"></i>
                            <div style="font-size:0.8rem; margin-top:8px;">予算詳細表</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSeiunsai(container) {
        container.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px; padding:10px;">
                <div class="glass-panel" style="padding:24px; grid-column: 1 / -1; display:flex; justify-content:space-between; align-items:center; background: linear-gradient(135deg, rgba(255,149,0,0.2), rgba(0,0,0,0));">
                    <div style="display:flex; align-items:center; gap:20px;">
                        <div style="font-size:3rem; color:#ff9500;"><i class="fas fa-star"></i></div>
                        <div>
                            <h2 style="margin:0;">第58回 青雲祭</h2>
                            <p style="margin:5px 0 0; opacity:0.7;">スローガン: 「飛翔 - 新たな空へ」</p>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:0.8rem; opacity:0.6;">開催まであと</div>
                        <div style="font-size:2rem; font-weight:700;">84 <span style="font-size:1rem;">日</span></div>
                    </div>
                </div>

                <div class="glass-panel" style="padding:20px;">
                    <h3 style="margin-bottom:15px;"><i class="fas fa-tasks"></i> 実行委員会 タスク</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:5px;">
                                <span>企画審査 (第一段階)</span>
                                <span>80%</span>
                            </div>
                            <div style="height:6px; background:rgba(0,0,0,0.1); border-radius:3px;">
                                <div style="width:80%; height:100%; background:#ff9500; border-radius:3px;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:5px;">
                                <span>外部発注・備品手配</span>
                                <span>35%</span>
                            </div>
                            <div style="height:6px; background:rgba(0,0,0,0.1); border-radius:3px;">
                                <div style="width:35%; height:100%; background:#ff9500; border-radius:3px;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="glass-panel" style="padding:20px; background:rgba(0,113,227,0.05);">
                    <h3 style="margin-bottom:15px;"><i class="fas fa-bullhorn"></i> 最新の告知</h3>
                    <p style="font-size:0.9rem; line-height:1.6;">
                        <strong style="color:var(--primary-color);">[重要]</strong> 模擬店企画の保健所提出書類の締め切りは来週金曜日です。各クラスの責任者は至急確認をお願いします。
                    </p>
                    <button class="att-btn att-btn-primary att-btn-sm" style="margin-top:10px;">詳細を見る</button>
                </div>
            </div>
        `;
    }

    async checkAIRecommendation() {
        setTimeout(async () => {
            await OSAPI.AI.getRecommend();
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

window.closeModal = function() {
    const modal = document.getElementById('ai-recommend-modal');
    if(modal) modal.classList.add('hidden');
}
