/**
 * ==============================================================================
 * 🌌 MHENT UNIVERSE - DISCORD RICH PRESENCE (RPC) BRIDGE & COMMUNITY INTEGRATION
 * ==============================================================================
 * Đồng bộ trạng thái thời gian thực của người dùng khi đang duyệt Đại Sảnh,
 * Thưởng thức Âm nhạc (Music Studio), Xem Anime/Phim (Cinema), hoặc Tranh tài Trò chơi (Game Center).
 * 
 * Hỗ trợ:
 *   - MHEnt Link Companion App (ws://127.0.0.1:14128 & http fallback)
 *   - PreMiD Extension & CustomEvent (window.__MHEntDiscordPresence)
 *   - Tự động nhận diện bài hát, tập phim, trò chơi và thời gian phát live
 *   - Nút tham gia Discord Server chính thức: https://discord.gg/mhentuniverse
 * ==============================================================================
 */

(function (global) {
    'use strict';

    const BRIDGE_HTTP_PORT = 14128;
    const DEFAULT_CLIENT_ID = '1570699759319126037';
    const DISCORD_INVITE_URL = 'https://discord.gg/mhentuniverse';
    const APPS_LINK_DOWNLOAD_URL = 'https://apps.mhentuniverse.com/link';

    class MHEntUniverseDiscordBridge {
        constructor() {
            this.isDesktop = Boolean(window.MHEntDesktop && window.MHEntDesktop.discord);
            this.isBridgeConnected = false;
            this.isEnabled = localStorage.getItem('mhent_discord_rpc_enabled') !== 'off';
            this.customClientId = localStorage.getItem('mhent_discord_client_id') || '';
            this.currentActivity = null;
            this.discordUser = null;
            this.sessionStartTime = Math.floor(Date.now() / 1000);
            this.ws = null;
            this.reconnectTimer = null;
            this.contextPoller = null;

            this.init();
        }

        async init() {
            if (!this.isEnabled) {
                this.injectDiscordUI();
                return;
            }

            if (this.isDesktop) {
                try {
                    const status = await window.MHEntDesktop.discord.getStatus();
                    if (status) {
                        this.isBridgeConnected = Boolean(status.ready);
                        this.discordUser = status.user || null;
                    }
                } catch (e) {
                    console.warn('[MHEnt Discord] Desktop IPC:', e);
                }
            } else {
                this.connectWebSocket();
            }

            // Gắn widget UI
            this.injectDiscordUI();

            // Nhận diện bối cảnh trang và tự động phát hiện hoạt động
            setTimeout(() => {
                this.autoDetectPageContext();
            }, 800);

            // Tự động giải phóng trạng thái khi tắt hoặc rời khỏi trang
            window.addEventListener('beforeunload', () => {
                if (this.ws && this.ws.readyState === 1) {
                    try { this.ws.send(JSON.stringify({ action: 'clearActivity' })); } catch (e) {}
                } else if (navigator.sendBeacon) {
                    try {
                        const blob = new Blob([JSON.stringify({ action: 'clearActivity' })], { type: 'application/json' });
                        navigator.sendBeacon(`http://127.0.0.1:${BRIDGE_HTTP_PORT}/api/discord-rpc`, blob);
                    } catch (e) {}
                }
            });
        }

        connectWebSocket() {
            if (this.isDesktop) return;
            if (this.ws && (this.ws.readyState === 0 || this.ws.readyState === 1)) return;

            try {
                const ws = new WebSocket(`ws://127.0.0.1:${BRIDGE_HTTP_PORT}`);
                this.ws = ws;

                ws.onopen = () => {
                    this.isBridgeConnected = true;
                    this.updateUIPill();
                    if (this.currentActivity) {
                        try {
                            ws.send(JSON.stringify({
                                action: 'setActivity',
                                activity: this.currentActivity,
                                clientId: this.customClientId || DEFAULT_CLIENT_ID
                            }));
                        } catch (e) {}
                    }
                };

                ws.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        if (msg.type === 'status') {
                            this.isBridgeConnected = Boolean(msg.ready);
                            this.discordUser = msg.user || null;
                            this.updateUIPill();
                        }
                    } catch (e) {}
                };

                ws.onclose = () => {
                    this.isBridgeConnected = false;
                    this.ws = null;
                    this.updateUIPill();
                    if (!this.reconnectTimer) {
                        this.reconnectTimer = setTimeout(() => {
                            this.reconnectTimer = null;
                            this.connectWebSocket();
                        }, 4000);
                    }
                };

                ws.onerror = () => {
                    this.isBridgeConnected = false;
                    this.updateUIPill();
                    this.probeLocalBridge();
                };
            } catch (e) {
                this.probeLocalBridge();
                if (!this.reconnectTimer) {
                    this.reconnectTimer = setTimeout(() => {
                        this.reconnectTimer = null;
                        this.connectWebSocket();
                    }, 5000);
                }
            }
        }

        async probeLocalBridge() {
            if (this.isDesktop) return;
            try {
                const res = await fetch(`http://127.0.0.1:${BRIDGE_HTTP_PORT}/api/discord-status`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache'
                });
                if (res.ok) {
                    const data = await res.json();
                    this.isBridgeConnected = Boolean(data.ready);
                    this.discordUser = data.user || null;
                    this.updateUIPill();
                } else {
                    this.isBridgeConnected = false;
                    this.updateUIPill();
                }
            } catch (e) {
                this.isBridgeConnected = false;
                this.updateUIPill();
            }
        }

        async setActivity(activity) {
            if (!this.isEnabled) return false;
            this.currentActivity = activity;

            if (activity && !activity.startTimestamp && !activity.endTimestamp) {
                activity.startTimestamp = this.sessionStartTime;
            }

            if (activity && (!activity.buttons || activity.buttons.length === 0)) {
                activity.buttons = [
                    { label: 'Khám phá Universe 🌌', url: 'https://www.mhentuniverse.com' },
                    { label: 'Gia nhập Discord 💬', url: DISCORD_INVITE_URL }
                ];
            }

            // 1. Electron Desktop IPC
            if (this.isDesktop && window.MHEntDesktop.discord) {
                try {
                    const ok = await window.MHEntDesktop.discord.setActivity(activity);
                    this.isBridgeConnected = Boolean(ok);
                    this.updateUIPill();
                    return ok;
                } catch (err) {
                    console.warn('[MHEnt Discord IPC]:', err);
                    return false;
                }
            }

            // 2. WebSocket Realtime
            if (this.ws && this.ws.readyState === 1) {
                try {
                    this.ws.send(JSON.stringify({
                        action: 'setActivity',
                        activity,
                        clientId: this.customClientId || DEFAULT_CLIENT_ID
                    }));
                    this.isBridgeConnected = true;
                    this.updateUIPill();
                    return true;
                } catch (e) {}
            }

            // 3. Fallback HTTP Post
            try {
                const res = await fetch(`http://127.0.0.1:${BRIDGE_HTTP_PORT}/api/discord-rpc`, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-store',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'setActivity',
                        activity,
                        clientId: this.customClientId || DEFAULT_CLIENT_ID
                    })
                });
                if (res.ok) {
                    this.isBridgeConnected = true;
                    this.updateUIPill();
                }
            } catch (err) {
                this.isBridgeConnected = false;
                this.updateUIPill();
            }

            // 4. PreMiD CustomEvent
            try {
                window.__MHEntDiscordPresence = activity;
                window.dispatchEvent(new CustomEvent('mhent:discord-presence', { detail: activity }));
            } catch (e) {}

            return true;
        }

        async clearActivity() {
            this.currentActivity = null;
            if (this.isDesktop && window.MHEntDesktop.discord) {
                await window.MHEntDesktop.discord.clearActivity();
            } else if (this.ws && this.ws.readyState === 1) {
                try { this.ws.send(JSON.stringify({ action: 'clearActivity' })); } catch (e) {}
            } else {
                try {
                    await fetch(`http://127.0.0.1:${BRIDGE_HTTP_PORT}/api/discord-rpc`, {
                        method: 'POST',
                        mode: 'cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'clearActivity' })
                    });
                } catch (e) {}
            }
            this.updateUIPill();
        }

        // =========================================================
        // 🎯 TỰ ĐỘNG PHÁT HIỆN HOẠT ĐỘNG THEO PHÂN KHU VŨ TRỤ
        // =========================================================

        autoDetectPageContext() {
            const path = window.location.pathname.toLowerCase();

            // 1. Phân khu Âm Nhạc (Music Studio & Private Room)
            if (path.includes('/music')) {
                this.hookMusic();
                return;
            }

            // 2. Phân khu Điện Ảnh (Cinema & Watch)
            if (path.includes('/cinema')) {
                this.hookCinema();
                return;
            }

            // 3. Phân khu Game Center
            if (path.includes('/game')) {
                this.hookGame();
                return;
            }

            // 4. Phân khu Đấu Trường Tri Thức (Arena)
            if (path.includes('/arena')) {
                this.setActivity({
                    details: 'Đấu Trường Trí Tuệ',
                    state: 'Tranh tài bảng vàng • MHEnt Arena',
                    type: 0,
                    largeImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3af.png',
                    largeImageText: 'MHEnt Arena Challenge',
                    smallImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26a1.png',
                    smallImageText: 'Arena Live',
                    buttons: [
                        { label: 'Thách đấu cùng tớ ⚔️', url: window.location.href },
                        { label: 'MHEnt Universe 🌌', url: 'https://www.mhentuniverse.com' }
                    ]
                });
                return;
            }

            // 5. Trang Về chúng tớ (About)
            if (path.includes('/about')) {
                this.setActivity({
                    details: 'Miyazaki Haruto Entertainment',
                    state: 'Đang tìm hiểu câu chuyện & dự án MHEnt',
                    type: 0,
                    largeImage: 'https://www.mhentuniverse.com/assets/avt-web.jpg',
                    largeImageText: 'MHEnt Universe Portal',
                    buttons: [
                        { label: 'Về chúng tớ 🌟', url: 'https://www.mhentuniverse.com/about' },
                        { label: 'Gia nhập Discord 💬', url: DISCORD_INVITE_URL }
                    ]
                });
                return;
            }

            // 6. Đại Sảnh MHEnt Universe (Hub Mặc Định)
            this.setActivity({
                details: 'Đang khám phá Vũ Trụ MHEnt 🌌',
                state: 'Đại Sảnh MHEnt Universe • Trực Tuyến',
                type: 0,
                largeImage: 'https://www.mhentuniverse.com/assets/avt-web.jpg',
                largeImageText: 'MHEnt Universe Portal',
                buttons: [
                    { label: 'Khám phá Universe 🌌', url: 'https://www.mhentuniverse.com' },
                    { label: 'Tham gia Discord 💬', url: DISCORD_INVITE_URL }
                ]
            });
        }

        // =========================================================
        // 🎵 HOOK PHÂN KHU ÂM NHẠC (MUSIC STUDIO / ROOM)
        // =========================================================

        hookMusic() {
            let lastSongKey = '';
            let lastPlayingState = null;

            const syncMusic = () => {
                const titleEl = document.getElementById('current-song-title');
                const artistEl = document.getElementById('current-song-artist');
                let songTitle = titleEl ? titleEl.textContent.trim() : '';
                let songArtist = artistEl ? artistEl.textContent.trim() : '';

                // Bỏ qua tiêu đề giữ chỗ mặc định
                if (songTitle === 'Chưa có bài hát nào' || songTitle === '' || songTitle.includes('Đang tải')) {
                    songTitle = '';
                }

                let isPlaying = false;
                let curTime = 0;
                let dur = 0;

                // Kiểm tra YouTube Player trong room.html
                if (window.player && typeof window.player.getPlayerState === 'function') {
                    try {
                        const st = window.player.getPlayerState();
                        // 1 = PLAYING, 3 = BUFFERING
                        isPlaying = (st === 1);
                        curTime = window.player.getCurrentTime() || 0;
                        dur = window.player.getDuration() || 0;
                    } catch (e) {}
                }

                // Kiểm tra thẻ HTML5 audio (nếu có trên trang)
                const audioEl = document.querySelector('audio');
                if (audioEl && !audioEl.paused && !isPlaying) {
                    isPlaying = true;
                    curTime = audioEl.currentTime || 0;
                    dur = audioEl.duration || 0;
                }

                const currentKey = `${songTitle}|${songArtist}|${isPlaying}`;
                if (currentKey !== lastSongKey || isPlaying !== lastPlayingState) {
                    lastSongKey = currentKey;
                    lastPlayingState = isPlaying;

                    if (isPlaying && songTitle) {
                        const nowSec = Math.floor(Date.now() / 1000);
                        const curSec = Math.floor(curTime);
                        const durSec = Math.floor(dur);

                        const act = {
                            details: songTitle.substring(0, 100),
                            state: `${songArtist || 'MHEnt Music'} • Trạm Phát Nhạc`,
                            type: 2, // 2: Listening to
                            largeImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3a7.png',
                            largeImageText: songTitle.substring(0, 60),
                            smallImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/25b6.png',
                            smallImageText: 'Đang phát • MHEnt Music',
                            buttons: [
                                { label: 'Nghe cùng tớ 🎧', url: window.location.href },
                                { label: 'MHEnt Music 🎵', url: 'https://www.mhentuniverse.com/music' }
                            ]
                        };

                        if (durSec > 0 && curSec < durSec) {
                            act.startTimestamp = nowSec - curSec;
                            act.endTimestamp = nowSec + (durSec - curSec);
                        } else {
                            act.startTimestamp = nowSec;
                        }

                        this.setActivity(act);
                    } else if (!isPlaying && songTitle) {
                        // Tạm dừng
                        this.setActivity({
                            details: songTitle.substring(0, 100),
                            state: `[Tạm dừng] ${songArtist || 'MHEnt Music'}`,
                            type: 2,
                            largeImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3a7.png',
                            largeImageText: songTitle.substring(0, 60),
                            smallImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/23f8.png',
                            smallImageText: 'Tạm dừng',
                            buttons: [
                                { label: 'Phòng nghe nhạc 🎧', url: window.location.href },
                                { label: 'MHEnt Music 🎵', url: 'https://www.mhentuniverse.com/music' }
                            ]
                        });
                    } else {
                        // Ambient Music Room
                        this.setActivity({
                            details: 'Trạm Âm Nhạc & Anisong',
                            state: 'MHEnt Music Studio • Không Gian Giai Điệu',
                            type: 0,
                            largeImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3b5.png',
                            largeImageText: 'MHEnt Music Studio',
                            buttons: [
                                { label: 'Vào nghe nhạc 🎶', url: 'https://www.mhentuniverse.com/music' },
                                { label: 'Gia nhập Discord 💬', url: DISCORD_INVITE_URL }
                            ]
                        });
                    }
                }
            };

            this.contextPoller = setInterval(syncMusic, 1200);
            setTimeout(syncMusic, 500);
        }

        // =========================================================
        // 🎬 HOOK PHÂN KHU ĐIỆN ẢNH (CINEMA / WATCH)
        // =========================================================

        hookCinema() {
            let lastVideoKey = '';

            const syncCinema = () => {
                const titleEl = document.getElementById('cinema-title') || document.getElementById('player-header-title');
                const epEl = document.getElementById('current-episode');
                const movieTitle = titleEl ? titleEl.textContent.trim() : '';
                const episode = epEl ? epEl.textContent.trim() : '';

                const videoEl = document.getElementById('main-player-video') || document.querySelector('video');
                const isPlaying = videoEl && !videoEl.paused && !videoEl.ended;

                const currentKey = `${movieTitle}|${episode}|${isPlaying}`;
                if (currentKey !== lastVideoKey) {
                    lastVideoKey = currentKey;

                    if (movieTitle && movieTitle !== 'Đang kết nối dữ liệu...' && movieTitle !== 'Đang tải...') {
                        const nowSec = Math.floor(Date.now() / 1000);
                        const curSec = videoEl ? Math.floor(videoEl.currentTime || 0) : 0;
                        const durSec = videoEl ? Math.floor(videoEl.duration || 0) : 0;

                        const act = {
                            details: movieTitle.substring(0, 100),
                            state: `${episode || 'Xem phim'} • MHEnt Cinema`,
                            type: 3, // 3: Watching
                            largeImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3ac.png',
                            largeImageText: 'MHEnt Cinema Universe',
                            smallImage: isPlaying
                                ? 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/25b6.png'
                                : 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/23f8.png',
                            smallImageText: isPlaying ? 'Đang xem' : 'Tạm dừng',
                            buttons: [
                                { label: 'Xem cùng tớ 🍿', url: window.location.href },
                                { label: 'MHEnt Cinema 🎬', url: 'https://www.mhentuniverse.com/cinema' }
                            ]
                        };

                        if (isPlaying && durSec > 0 && curSec < durSec) {
                            act.startTimestamp = nowSec - curSec;
                            act.endTimestamp = nowSec + (durSec - curSec);
                        } else {
                            act.startTimestamp = nowSec;
                        }

                        this.setActivity(act);
                    } else {
                        // Đang duyệt rạp phim
                        this.setActivity({
                            details: 'Rạp Chiếu Anime & Phim Ảnh',
                            state: 'Khám phá MHEnt Cinema Universe',
                            type: 0,
                            largeImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3ac.png',
                            largeImageText: 'MHEnt Cinema',
                            buttons: [
                                { label: 'Khám phá rạp phim 🎬', url: 'https://www.mhentuniverse.com/cinema' },
                                { label: 'Gia nhập Discord 💬', url: DISCORD_INVITE_URL }
                            ]
                        });
                    }
                }
            };

            this.contextPoller = setInterval(syncCinema, 2000);
            setTimeout(syncCinema, 600);
        }

        // =========================================================
        // 🎮 HOOK PHÂN KHU GAME CENTER
        // =========================================================

        hookGame() {
            const p = window.location.pathname.toLowerCase();
            let gameName = 'MHEnt Game Center';
            let gameIcon = '1f3ae.png';

            if (p.includes('/caro')) {
                gameName = 'Cờ Caro 5 Quân';
                gameIcon = '274c.png';
            } else if (p.includes('/chess')) {
                gameName = 'Cờ Vua Chiến Thuật';
                gameIcon = '265f.png';
            } else if (p.includes('/xiangqi')) {
                gameName = 'Cờ Tướng Kinh Điển';
                gameIcon = '1f409.png';
            }

            this.setActivity({
                details: gameName,
                state: 'Đang thách đấu trí tuệ • MHEnt Game',
                type: 0,
                largeImage: `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${gameIcon}`,
                largeImageText: gameName,
                smallImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f525.png',
                smallImageText: 'Game Live',
                buttons: [
                    { label: 'Thách đấu cùng tớ 🎮', url: window.location.href },
                    { label: 'MHEnt Game Center 🕹️', url: 'https://www.mhentuniverse.com/game' }
                ]
            });
        }

        // =========================================================
        // 🎨 GIAO DIỆN NÚT TRẠNG THÁI & MODAL POPUP DISCORD
        // =========================================================

        injectDiscordUI() {
            if (document.getElementById('mhent-discord-pill')) return;

            // CSS giao diện
            const style = document.createElement('style');
            style.textContent = `
                .discord-pill-widget {
                    position: fixed;
                    bottom: 24px;
                    left: 24px;
                    z-index: 9998;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(15, 23, 42, 0.88);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(88, 101, 242, 0.45);
                    color: #f8fafc;
                    padding: 8px 16px;
                    border-radius: 9999px;
                    font-size: 12.5px;
                    font-weight: 700;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    user-select: none;
                    font-family: inherit;
                }
                .discord-pill-widget:hover {
                    transform: translateY(-2px) scale(1.03);
                    border-color: #5865F2;
                    box-shadow: 0 12px 30px rgba(88, 101, 242, 0.4);
                }
                .discord-pill-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #64748b;
                    transition: background 0.3s;
                }
                .discord-pill-dot.online {
                    background: #22c55e;
                    box-shadow: 0 0 10px #22c55e;
                }
                .discord-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    z-index: 100000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.25s ease;
                }
                .discord-modal-overlay.active {
                    opacity: 1;
                    pointer-events: auto;
                }
                .discord-modal-card {
                    background: #0f172a;
                    border: 1.5px solid rgba(88, 101, 242, 0.4);
                    border-radius: 20px;
                    max-width: 470px;
                    width: 100%;
                    padding: 26px;
                    color: #f8fafc;
                    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
                    position: relative;
                    font-family: inherit;
                }
                .discord-preview-box {
                    background: #1e1f22;
                    border-radius: 12px;
                    padding: 14px;
                    margin: 16px 0;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    gap: 14px;
                    align-items: center;
                }
                .discord-preview-img {
                    width: 60px;
                    height: 60px;
                    border-radius: 10px;
                    background: #2b2d31;
                    object-fit: cover;
                }
                @media (max-width: 768px) {
                    .discord-pill-widget {
                        bottom: 80px;
                        left: 16px;
                        padding: 6px 12px;
                        font-size: 11.5px;
                    }
                }
            `;
            document.head.appendChild(style);

            // Nút Pill
            const pill = document.createElement('div');
            pill.id = 'mhent-discord-pill';
            pill.className = 'discord-pill-widget';
            pill.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                <span class="discord-pill-dot" id="discord-pill-dot"></span>
                <span id="discord-pill-text">Discord MHEnt</span>
            `;
            pill.addEventListener('click', () => this.openSettingsModal());
            document.body.appendChild(pill);

            this.updateUIPill();
        }

        updateUIPill() {
            const dot = document.getElementById('discord-pill-dot');
            const text = document.getElementById('discord-pill-text');
            if (!dot || !text) return;

            if (!this.isEnabled) {
                dot.className = 'discord-pill-dot';
                dot.style.background = '#ef4444';
                text.textContent = 'Discord (Đã tắt)';
                return;
            }

            if (this.isBridgeConnected) {
                dot.className = 'discord-pill-dot online';
                const name = this.discordUser ? (this.discordUser.global_name || this.discordUser.username) : '';
                text.textContent = name ? `Discord: ${name}` : 'Discord Đã Kết Nối';
            } else {
                dot.className = 'discord-pill-dot';
                dot.style.background = '#64748b';
                text.textContent = 'Discord Server';
            }
        }

        openSettingsModal() {
            let modal = document.getElementById('mhent-discord-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'mhent-discord-modal';
                modal.className = 'discord-modal-overlay';
                document.body.appendChild(modal);
            }

            const act = this.currentActivity || {
                details: 'MHEnt. Universe',
                state: 'Cổng Thông Tin Vũ Trụ Đa Phân Khu',
                largeImage: 'https://www.mhentuniverse.com/assets/avt-web.jpg'
            };

            const userText = this.discordUser
                ? `Đã đăng nhập: <strong>${this.discordUser.global_name || this.discordUser.username}</strong>`
                : (this.isBridgeConnected ? 'Đã kết nối Discord Desktop' : 'Chưa kết nối Bridge MHEnt Link');

            modal.innerHTML = `
                <div class="discord-modal-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 900;">Discord MHEnt Universe</h3>
                        </div>
                        <button id="btn-close-discord-modal" style="background: none; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; line-height: 1;">&times;</button>
                    </div>

                    <!-- Nút tham gia Discord Server chính thức -->
                    <a href="${DISCORD_INVITE_URL}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; box-sizing: border-box; background: #5865F2; color: #fff; font-weight: 800; font-size: 14px; text-decoration: none; padding: 12px; border-radius: 12px; margin-bottom: 16px; transition: transform 0.2s, background 0.2s;" onmouseover="this.style.background='#4752c4'" onmouseout="this.style.background='#5865F2'">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                        Tham Gia Máy Chủ Discord MHEnt (discord.gg/mhentuniverse)
                    </a>

                    <div style="background: rgba(88, 101, 242, 0.1); border: 1px solid rgba(88, 101, 242, 0.3); border-radius: 10px; padding: 10px 14px; font-size: 12.5px; display: flex; align-items: center; justify-content: space-between;">
                        <span>Trạng thái RPC: <strong>${this.isBridgeConnected ? '<span style="color:#22c55e;">● Đang phát</span>' : '<span style="color:#f59e0b;">● Đang chờ kết nối MHEnt Link</span>'}</strong></span>
                        <span style="font-size: 11.5px; color: #94a3b8;">${userText}</span>
                    </div>

                    <!-- Xem trước trên Discord -->
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #94a3b8; margin-top: 14px;">Xem trước hồ sơ Discord:</div>
                    <div class="discord-preview-box">
                        <img class="discord-preview-img" src="${act.largeImage || 'https://www.mhentuniverse.com/assets/avt-web.jpg'}" alt="Preview">
                        <div style="overflow: hidden; flex: 1;">
                            <div style="font-weight: 800; font-size: 14px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${act.details || 'MHEnt Universe 🌌'}
                            </div>
                            <div style="font-size: 12px; color: #94a3b8; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${act.state || 'Đang trực tuyến tại Vũ Trụ'}
                            </div>
                            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                                ⏱️ 00:10:00 elapsed • MHEnt Portal
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 16px;">
                        <button id="btn-toggle-discord" style="flex: 1; padding: 10px; border-radius: 10px; font-weight: 800; font-size: 13px; border: none; cursor: pointer; background: ${this.isEnabled ? '#ef4444' : '#22c55e'}; color: #fff;">
                            ${this.isEnabled ? 'Tắt Rich Presence' : 'Bật Rich Presence'}
                        </button>
                        <button id="btn-test-discord" style="flex: 1; padding: 10px; border-radius: 10px; font-weight: 800; font-size: 13px; border: none; cursor: pointer; background: #3b82f6; color: #fff;">
                            Phát Thử Presence
                        </button>
                    </div>

                    ${!this.isBridgeConnected ? `
                    <div style="margin-top: 14px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #cbd5e1; display: flex; align-items: center; justify-content: space-between;">
                        <span>Cần app kết nối để đồng bộ?</span>
                        <a href="${APPS_LINK_DOWNLOAD_URL}" target="_blank" style="color: #60a5fa; font-weight: 700; text-decoration: none;">Tải MHEnt Link &rarr;</a>
                    </div>
                    ` : ''}

                    <div style="margin-top: 14px; text-align: center; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                        <a href="https://accounts.mhentuniverse.com/profile" target="_blank" style="font-size: 11.5px; color: #7983f5; text-decoration: none; font-weight: 700;">
                            Quản lý hồ sơ MHEnt ID
                        </a>
                        <a href="${DISCORD_INVITE_URL}" target="_blank" style="font-size: 11.5px; color: #5865F2; text-decoration: none; font-weight: 700;">
                            Máy chủ Discord MHEnt
                        </a>
                    </div>
                </div>
            `;

            modal.classList.add('active');

            // Event Handlers
            document.getElementById('btn-close-discord-modal').onclick = () => modal.classList.remove('active');
            modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

            document.getElementById('btn-toggle-discord').onclick = () => {
                this.isEnabled = !this.isEnabled;
                localStorage.setItem('mhent_discord_rpc_enabled', this.isEnabled ? 'on' : 'off');
                if (!this.isEnabled) {
                    this.clearActivity();
                } else {
                    this.autoDetectPageContext();
                }
                modal.classList.remove('active');
                this.updateUIPill();
            };

            document.getElementById('btn-test-discord').onclick = () => {
                this.setActivity({
                    details: 'Thử nghiệm MHEnt Presence 🚀',
                    state: 'Đang kết nối Discord thành công!',
                    type: 0,
                    largeImage: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2728.png',
                    largeImageText: 'MHEnt Universe Active',
                    buttons: [
                        { label: 'Gia nhập Discord 💬', url: DISCORD_INVITE_URL },
                        { label: 'MHEnt Universe 🌌', url: 'https://www.mhentuniverse.com' }
                    ]
                });
                modal.classList.remove('active');
                if (typeof showToast === 'function') {
                    showToast('Discord Rich Presence', 'Đã phát tín hiệu thành công lên Discord Profile của bạn!', 'success');
                }
            };
        }
    }

    // Tự động khởi tạo Bridge khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            global.__mhentDiscord = new MHEntUniverseDiscordBridge();
        });
    } else {
        global.__mhentDiscord = new MHEntUniverseDiscordBridge();
    }

})(window);
