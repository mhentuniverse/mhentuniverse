/**
 * ==============================================================================
 * 🌐 MHEnt Universe - Global Internationalization (i18n) Engine (v1.0)
 * Ngôn ngữ hỗ trợ (Theo thứ tự ưu tiên):
 *   1. 🇻🇳 Tiếng Việt (vi) - Mặc định
 *   2. 🇯🇵 日本語 (ja)      - Tiếng Nhật (Ưu tiên số 2)
 *   3. 🇺🇸 English (en)    - Tiếng Anh
 *
 * Tự động đồng bộ Cookie .mhentuniverse.com cho toàn bộ Subdomain (Study, Accounts...)
 * Tự động chèn CSS & Menu Dropdown chuyển ngữ hiện đại, tương thích Dark/Light Theme.
 * ==============================================================================
 */

(function (window, document) {
    'use strict';

    const SUPPORTED_LANGS = ['vi', 'ja', 'en'];
    const LANG_INFO = {
        vi: { code: 'VI', name: 'Tiếng Việt', flag: '🇻🇳' },
        ja: { code: 'JA', name: '日本語', flag: '🇯🇵' },
        en: { code: 'EN', name: 'English', flag: '🇺🇸' }
    };

    // Từ điển chung toàn hệ sinh thái MHEnt Universe
    const CORE_TRANSLATIONS = {
        vi: {
            // Navbar
            'nav.hub': 'Đại Sảnh',
            'nav.cinema': 'Cinema',
            'nav.tools': 'Bộ Công Cụ',
            'nav.teach': 'Giáo Dục',
            'nav.about': 'Về chúng tớ',
            'nav.login': 'Đăng nhập',
            'nav.logout': 'Đăng xuất',
            'nav.profile': 'Hồ sơ chung',
            'nav.settings': 'Cài đặt',
            'nav.admin': 'Trạm Chỉ Huy (GV)',
            'nav.theme': 'Tắt/Mở đèn',
            'nav.lang': 'Đổi ngôn ngữ',

            // App Switcher
            'app.hub': 'Đại Sảnh',
            'app.cinema': 'Cinema',
            'app.manga': 'Manga',
            'app.novel': 'Novel',
            'app.music': 'Music',
            'app.arena': 'Arena',
            'app.edu': 'Edu',
            'app.game': 'Game',

            // Portal / Home Hub
            'portal.hero_title': 'Miyazaki Haruto Entertainment Universe',
            'portal.hero_desc': 'Đế chế Đa Vũ Trụ Giải Trí',
            'portal.cinema_desc': 'Rạp chiếu phim Anime, Series & Movie chất lượng cao với Hệ sinh thái Đa Nhóm Dịch.',
            'portal.manga_desc': 'Thư viện truyện tranh cuộn dọc siêu mượt mà. (Sắp ra mắt...)',
            'portal.novel_desc': 'Góc đọc truyện chữ tối giản, bảo vệ mắt. (Sắp ra mắt...)',
            'portal.music_desc': 'Trạm phát Anisong, OST và Drama CD cực chill. (Sắp ra mắt...)',
            'portal.arena_desc': 'Sân chơi Quiz, giải trí tương tác, sự kiện & minigame hấp dẫn.',
            'portal.edu_desc': 'Nền tảng học tập tương tác, phát triển kỹ năng và kiến thức.',
            'portal.game_desc': 'Hệ sinh thái e-Sport và minigame giải trí đa người chơi thời gian thực.',

            // Edu / Teach Hub
            'edu.home': 'Trang Chủ',
            'edu.tools': 'Bộ Công Cụ',
            'edu.hero_title': 'MHEnt. Education',
            'edu.hero_subtitle': 'Không Gian Giảng Dạy & Công Cụ Tương Tác',
            'edu.bingo_card_title': 'Đại Tiệc Bingo',
            'edu.bingo_card_desc': 'Vòng quay bốc từ vựng ngẫu nhiên, âm thanh kịch tính, máy chiếu trực quan và in phiếu tự động.',

            // Bingo Master
            'bingo.title': 'Bingo Master',
            'bingo.subtitle': 'Classroom Edition',
            'bingo.called': 'Đã gọi:',
            'bingo.remain': 'Còn lại:',
            'bingo.btn_draw': 'Bốc Từ Tiếp Theo',
            'bingo.btn_bingo': 'Có Bạn Bingo!',
            'bingo.recent_calls': '5 từ vừa gọi gần nhất:',
            'bingo.no_calls': 'Chưa có từ nào được bốc...',
            'bingo.radar_title': 'Bảng Radar Từ Vựng',
            'bingo.ready_title': 'SẴN SÀNG! 🎲',
            'bingo.ready_desc': 'Nhấn BỐC TỪ TIẾP THEO hoặc phím Space để bắt đầu',
            'bingo.replay_speech': 'Phát âm lại',
            'bingo.print_sheets': 'In Phiếu Bingo',
            'bingo.mode_suspense': 'Chế độ kịch tính',
            'bingo.hint_draw': 'Bốc từ',
            'bingo.hint_bingo': 'Báo Bingo',
            'bingo.hint_replay': 'Phát âm lại',
            'bingo.hint_fullscreen': 'Toàn màn hình',
            'bingo.hint_reset': 'Chơi lại',

            // Bingo Modals & Dialogs
            'bingo.settings_title': 'Cài Đặt Danh Sách Từ Vựng',
            'bingo.cloud_load_title': 'Nạp giáo án từ Đám mây (MHEnt Cloud ID):',
            'bingo.cloud_input_placeholder': 'Dán mã ID hoặc link chứa ?id=...',
            'bingo.cloud_fetch_btn': 'Tải bài',
            'bingo.presets_title': 'Mẫu gợi ý bài học nhanh:',
            'bingo.preset_verbs': '🏃 25 Động từ thông dụng',
            'bingo.preset_adjectives': '✨ 25 Tính từ miêu tả',
            'bingo.preset_classroom': '🏫 25 Đồ dùng & Trường học',
            'bingo.input_label': 'Danh sách từ vựng (Mỗi dòng một từ, có thể thêm nghĩa: Từ | Nghĩa):',
            'bingo.roll_time_title': 'Thời gian quay kịch tính',
            'bingo.roll_fast': '⚡ Nhanh (1.8 giây)',
            'bingo.roll_standard': '🎯 Chuẩn kịch tính (3.0 giây)',
            'bingo.roll_intense': '🔥 Cực căng thẳng (4.5 giây)',
            'bingo.mystery_title': 'Thẻ Sự Kiện Bất Ngờ',
            'bingo.mystery_checkbox': 'Kích hoạt Thần May Mắn (10%)',
            'bingo.save_and_start': 'Lưu & Bắt Đầu Ván Mới',
            'bingo.win_title': 'BINGO! CHIẾN THẮNG!',
            'bingo.win_subtitle': 'Chúc mừng bạn học sinh đã xuất sắc hoàn thành hàng Bingo đầu tiên! 🌟',
            'bingo.verify_title': 'Xác minh 5 từ trên phiếu của học sinh:',
            'bingo.verify_prompt': 'Chọn 5 từ để kiểm tra',
            'bingo.verify_search': 'Gõ từ của học sinh để đối chiếu...',
            'bingo.confetti_more': 'Bắn Thêm Pháo Hoa!',
            'bingo.continue_game': 'Tiếp tục trò chơi',
            'bingo.print_modal_title': 'Tạo Phiếu Bingo Phát Cho Học Sinh',
            'bingo.print_modal_desc': 'Hệ thống hỗ trợ in phiếu đẹp mắt theo chuẩn 5x5 (25 ô) kèm ô trung tâm ⭐ FREE STAR.',
            'bingo.print_blank_btn': '📝 Phiếu Trống (Học sinh tự điền từ)',
            'bingo.print_random_btn': '🎲 Phiếu Điền Sẵn (Trộn từ tự động)',
            'bingo.print_do_print': 'Mở Hộp Thoại In Ngay',

            // Mega Footer
            'footer.slogan': 'Đế chế Đa Vũ Trụ Giải Trí Số & Sáng Tạo Nghệ Thuật. Kết nối cộng đồng anime, âm nhạc, văn hóa đại chúng và công nghệ giáo dục thông minh.',
            'footer.corp': 'Vận hành bởi <strong>Miyazaki Haruto Entertainment Co., Ltd.</strong><br>Hệ sinh thái phi lợi nhuận phục vụ cộng đồng đam mê giải trí & học thuật.',
            'footer.status': 'MHEnt Cloud: Mọi phân khu trực tuyến',
            'footer.ent_heading': 'Vũ Trụ Giải Trí',
            'footer.study_heading': 'Không Gian Học Tập',
            'footer.legal_heading': 'Hệ Thống & Pháp Lý',
            'footer.terms': 'Điều khoản dịch vụ',
            'footer.privacy': 'Chính sách bảo mật',
            'footer.about_report': 'Về chúng tớ & Báo cáo lỗi',
            'footer.community': 'Cộng đồng MHEnt Universe',
            'footer.rights': 'Tất cả các quyền được bảo lưu.',

            // Common Actions
            'action.save': 'Lưu',
            'action.cancel': 'Hủy',
            'action.close': 'Đóng',
            'action.confirm': 'Xác nhận',
            'action.back': 'Quay lại',
            'action.copy': 'Sao chép',
            'action.copied': 'Đã sao chép!',
            'action.search': 'Tìm kiếm...',
            'action.loading': 'Đang tải...'
        },

        ja: {
            // Navbar
            'nav.hub': 'メインロビー',
            'nav.cinema': 'シネマ',
            'nav.tools': 'ツールハブ',
            'nav.teach': '教育ハブ',
            'nav.about': '会社概要',
            'nav.login': 'ログイン',
            'nav.logout': 'ログアウト',
            'nav.profile': 'プロフィール',
            'nav.settings': '設定',
            'nav.admin': '教員管制塔',
            'nav.theme': 'ダークモード切替',
            'nav.lang': '言語切替',

            // App Switcher
            'app.hub': 'ロビー',
            'app.cinema': 'シネマ',
            'app.manga': 'マンガ',
            'app.novel': 'ノベル',
            'app.music': '音楽',
            'app.arena': 'アリーナ',
            'app.edu': '教育',
            'app.game': 'ゲーム',

            // Portal / Home Hub
            'portal.hero_title': 'Miyazaki Haruto Entertainment Universe',
            'portal.hero_desc': 'デジタルエンターテインメントマルチバース',
            'portal.cinema_desc': '高品質アニメ・シリーズ・映画とマルチ翻訳チームエコシステム。',
            'portal.manga_desc': '縦スクロール対応の快適な漫画ライブラリ。（近日公開...）',
            'portal.novel_desc': '目に優しいミニマルなライトノベル読書スペース。（近日公開...）',
            'portal.music_desc': 'アニソン、OST、ドラマCDのチルな配信ステーション。（近日公開...）',
            'portal.arena_desc': 'クイズ、インタラクティブ体験、イベント＆楽しいミニゲーム。',
            'portal.edu_desc': 'インタラクティブな学習プラットフォーム、スキルと知識の開発。',
            'portal.game_desc': 'リアルタイムマルチプレイヤーeスポーツ＆ミニゲームエコシステム。',

            // Edu / Teach Hub
            'edu.home': 'ホーム',
            'edu.tools': 'ツール一覧',
            'edu.hero_title': 'MHEnt. Education',
            'edu.hero_subtitle': 'インタラクティブ授業＆教育ツールハブ',
            'edu.bingo_card_title': 'ビンゴパーティー',
            'edu.bingo_card_desc': '単語ランダム抽選、迫真サウンド、プロジェクター表示、自動ビンゴカード印刷。',

            // Bingo Master
            'bingo.title': 'ビンゴマスター',
            'bingo.subtitle': '教室エディション',
            'bingo.called': '出た単語:',
            'bingo.remain': '残り:',
            'bingo.btn_draw': '次の単語を引く',
            'bingo.btn_bingo': 'ビンゴ達成！',
            'bingo.recent_calls': '直近に出た5単語:',
            'bingo.no_calls': 'まだ単語は引かれていません...',
            'bingo.radar_title': '単語レーダーボード',
            'bingo.ready_title': '準備完了！🎲',
            'bingo.ready_desc': '「次の単語を引く」またはSpaceキーを押してスタート',
            'bingo.replay_speech': 'もう一度発音',
            'bingo.print_sheets': 'ビンゴカード印刷',
            'bingo.mode_suspense': 'サスペンスモード',
            'bingo.hint_draw': '単語を引く',
            'bingo.hint_bingo': 'ビンゴ報告',
            'bingo.hint_replay': '再発音',
            'bingo.hint_fullscreen': '全画面',
            'bingo.hint_reset': 'リセット',

            // Bingo Modals & Dialogs
            'bingo.settings_title': '語彙リスト設定',
            'bingo.cloud_load_title': 'クラウドから教材を読み込む (MHEnt Cloud ID):',
            'bingo.cloud_input_placeholder': 'IDまたは?id=を含むリンクを貼り付け...',
            'bingo.cloud_fetch_btn': '読み込む',
            'bingo.presets_title': 'クイックプリセット:',
            'bingo.preset_verbs': '🏃 よく使う動詞25選',
            'bingo.preset_adjectives': '✨ 描写の形容詞25選',
            'bingo.preset_classroom': '🏫 文房具・学校用語25選',
            'bingo.input_label': '語彙リスト (1行に1単語、意味も追加可能: 単語 | 意味):',
            'bingo.roll_time_title': '抽選演出の長さ',
            'bingo.roll_fast': '⚡ 高速 (1.8秒)',
            'bingo.roll_standard': '🎯 標準サスペンス (3.0秒)',
            'bingo.roll_intense': '🔥 激アツ (4.5秒)',
            'bingo.mystery_title': 'サプライズイベントカード',
            'bingo.mystery_checkbox': 'ラッキーイベント有効化 (10%)',
            'bingo.save_and_start': '保存して新しいゲームを開始',
            'bingo.win_title': 'BINGO! おめでとう！',
            'bingo.win_subtitle': '最初のビンゴラインを見事達成した生徒の皆さん、おめでとうございます！🌟',
            'bingo.verify_title': '生徒のカード上の5単語を確認:',
            'bingo.verify_prompt': '確認する単語を5つ選択',
            'bingo.verify_search': '生徒の単語を入力して照合...',
            'bingo.confetti_more': '紙吹雪をもっと飛ばす！',
            'bingo.continue_game': 'ゲームを続ける',
            'bingo.print_modal_title': '生徒用ビンゴカード作成',
            'bingo.print_modal_desc': '5×5（25マス、中央⭐FREE STAR付き）の高品質ビンゴカードを作成・印刷できます。',
            'bingo.print_blank_btn': '📝 空白カード (生徒が自分で記入)',
            'bingo.print_random_btn': '🎲 自動シャッフルカード (印刷用)',
            'bingo.print_do_print': '印刷ダイアログを開く',

            // Mega Footer
            'footer.slogan': 'デジタルエンターテインメントと芸術創造のマルチバース。アニメ、音楽、大衆文化、そしてスマート教育をつなぐ。',
            'footer.corp': '運営：<strong>Miyazaki Haruto Entertainment Co., Ltd.</strong><br>エンタメと学問を愛するコミュニティのための非営利エコシステム。',
            'footer.status': 'MHEnt Cloud: 全システム正常稼働中',
            'footer.ent_heading': 'エンタメ宇宙',
            'footer.study_heading': '学習スペース',
            'footer.legal_heading': 'システム＆法務',
            'footer.terms': '利用規約',
            'footer.privacy': 'プライバシーポリシー',
            'footer.about_report': '私たちについて＆不具合報告',
            'footer.community': 'MHEnt Universe コミュニティ',
            'footer.rights': '無断転載を禁じます。',

            // Common Actions
            'action.save': '保存',
            'action.cancel': 'キャンセル',
            'action.close': '閉じる',
            'action.confirm': '確認',
            'action.back': '戻る',
            'action.copy': 'コピー',
            'action.copied': 'コピーしました！',
            'action.search': '検索...',
            'action.loading': '読み込み中...'
        },

        en: {
            // Navbar
            'nav.hub': 'Main Hub',
            'nav.cinema': 'Cinema',
            'nav.tools': 'Tools Hub',
            'nav.teach': 'Education',
            'nav.about': 'About Us',
            'nav.login': 'Sign In',
            'nav.logout': 'Sign Out',
            'nav.profile': 'Profile',
            'nav.settings': 'Settings',
            'nav.admin': 'Teacher Panel',
            'nav.theme': 'Toggle Theme',
            'nav.lang': 'Change Language',

            // App Switcher
            'app.hub': 'Lobby',
            'app.cinema': 'Cinema',
            'app.manga': 'Manga',
            'app.novel': 'Novel',
            'app.music': 'Music',
            'app.arena': 'Arena',
            'app.edu': 'Edu',
            'app.game': 'Game',

            // Portal / Home Hub
            'portal.hero_title': 'Miyazaki Haruto Entertainment Universe',
            'portal.hero_desc': 'Digital Entertainment Multiverse',
            'portal.cinema_desc': 'High quality Anime, Series & Movies with Multi-fansub ecosystem.',
            'portal.manga_desc': 'Ultra-smooth vertical scrolling comic library. (Coming soon...)',
            'portal.novel_desc': 'Minimalist, eye-friendly light novel reading space. (Coming soon...)',
            'portal.music_desc': 'Chill streaming station for Anisong, OST and Drama CDs. (Coming soon...)',
            'portal.arena_desc': 'Interactive quiz arena, entertainment, events & engaging minigames.',
            'portal.edu_desc': 'Interactive learning platform, skills & knowledge development.',
            'portal.game_desc': 'Real-time multiplayer e-Sports & mini-games ecosystem.',

            // Edu / Teach Hub
            'edu.home': 'Home',
            'edu.tools': 'Tools Hub',
            'edu.hero_title': 'MHEnt. Education',
            'edu.hero_subtitle': 'Interactive Teaching & Learning Hub',
            'edu.bingo_card_title': 'Bingo Party',
            'edu.bingo_card_desc': 'Random word draw, suspenseful audio, projection screen, and auto printable sheets.',

            // Bingo Master
            'bingo.title': 'Bingo Master',
            'bingo.subtitle': 'Classroom Edition',
            'bingo.called': 'Called:',
            'bingo.remain': 'Remaining:',
            'bingo.btn_draw': 'Draw Next Word',
            'bingo.btn_bingo': 'Bingo Alert!',
            'bingo.recent_calls': '5 Most Recent Words:',
            'bingo.no_calls': 'No words called yet...',
            'bingo.radar_title': 'Word Radar Board',
            'bingo.ready_title': 'READY! 🎲',
            'bingo.ready_desc': 'Press Draw Next Word or Spacebar to begin',
            'bingo.replay_speech': 'Replay Audio',
            'bingo.print_sheets': 'Print Bingo Sheets',
            'bingo.mode_suspense': 'Suspense Mode',
            'bingo.hint_draw': 'Draw Word',
            'bingo.hint_bingo': 'Bingo Alert',
            'bingo.hint_replay': 'Replay',
            'bingo.hint_fullscreen': 'Fullscreen',
            'bingo.hint_reset': 'Reset',

            // Bingo Modals & Dialogs
            'bingo.settings_title': 'Vocabulary List Settings',
            'bingo.cloud_load_title': 'Load Lesson from Cloud (MHEnt Cloud ID):',
            'bingo.cloud_input_placeholder': 'Paste Cloud ID or link containing ?id=...',
            'bingo.cloud_fetch_btn': 'Fetch Lesson',
            'bingo.presets_title': 'Quick Lesson Presets:',
            'bingo.preset_verbs': '🏃 25 Common Verbs',
            'bingo.preset_adjectives': '✨ 25 Descriptive Adjectives',
            'bingo.preset_classroom': '🏫 25 Classroom & School Items',
            'bingo.input_label': 'Vocabulary List (One word per line, optional meaning: Word | Meaning):',
            'bingo.roll_time_title': 'Suspense Roll Duration',
            'bingo.roll_fast': '⚡ Fast (1.8s)',
            'bingo.roll_standard': '🎯 Standard Suspense (3.0s)',
            'bingo.roll_intense': '🔥 Intense (4.5s)',
            'bingo.mystery_title': 'Surprise Mystery Event',
            'bingo.mystery_checkbox': 'Enable Lucky Events (10%)',
            'bingo.save_and_start': 'Save & Start New Game',
            'bingo.win_title': 'BINGO! VICTORY!',
            'bingo.win_subtitle': 'Congratulations to the student who completed the first Bingo line! 🌟',
            'bingo.verify_title': 'Verify 5 words on student\'s sheet:',
            'bingo.verify_prompt': 'Select 5 words to check',
            'bingo.verify_search': 'Type student\'s word to verify...',
            'bingo.confetti_more': 'Fire More Confetti!',
            'bingo.continue_game': 'Continue Game',
            'bingo.print_modal_title': 'Create Printable Bingo Sheets',
            'bingo.print_modal_desc': 'Professional 5x5 (25 cells) sheets with center ⭐ FREE STAR ready to print.',
            'bingo.print_blank_btn': '📝 Blank Sheet (Students fill in)',
            'bingo.print_random_btn': '🎲 Shuffled Sheet (Auto-filled)',
            'bingo.print_do_print': 'Open Print Dialog',

            // Mega Footer
            'footer.slogan': 'Digital Entertainment & Art Creation Multiverse. Connecting anime, music, pop culture, and smart interactive education.',
            'footer.corp': 'Operated by <strong>Miyazaki Haruto Entertainment Co., Ltd.</strong><br>A non-profit ecosystem serving academic and entertainment communities.',
            'footer.status': 'MHEnt Cloud: All systems operational',
            'footer.ent_heading': 'Entertainment Universe',
            'footer.study_heading': 'Study Space',
            'footer.legal_heading': 'System & Legal',
            'footer.terms': 'Terms of Service',
            'footer.privacy': 'Privacy Policy',
            'footer.about_report': 'About Us & Bug Report',
            'footer.community': 'MHEnt Universe Community',
            'footer.rights': 'All rights reserved.',

            // Common Actions
            'action.save': 'Save',
            'action.cancel': 'Cancel',
            'action.close': 'Close',
            'action.confirm': 'Confirm',
            'action.back': 'Back',
            'action.copy': 'Copy',
            'action.copied': 'Copied!',
            'action.search': 'Search...',
            'action.loading': 'Loading...'
        }
    };

    // Helper: Cookie
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return match ? decodeURIComponent(match[3]) : null;
    }

    function setCookie(name, val) {
        const isMHEntDomain = window.location.hostname.endsWith('mhentuniverse.com');
        const domainStr = isMHEntDomain ? '; domain=.mhentuniverse.com' : '';
        document.cookie = `${name}=${encodeURIComponent(val)}${domainStr}; path=/; max-age=31536000; SameSite=Lax`;
    }

    // Detect initial language
    function detectLanguage() {
        // 1. URL query parameter (?lang=ja, ?lang=en, ?lang=vi)
        try {
            const q = new URLSearchParams(window.location.search);
            const urlLang = q.get('lang');
            if (urlLang && SUPPORTED_LANGS.includes(urlLang.toLowerCase())) {
                return urlLang.toLowerCase();
            }
        } catch (e) {}

        // 2. Cookie (Shared across all subdomains)
        const cookieLang = getCookie('mhent_lang');
        if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) return cookieLang;

        // 3. LocalStorage
        try {
            const localLang = localStorage.getItem('mhent_lang');
            if (localLang && SUPPORTED_LANGS.includes(localLang)) return localLang;
        } catch (e) {}

        // 4. Default: vi
        return 'vi';
    }

    let currentLang = detectLanguage();

    // Inject self-contained styles for switcher & dropdown
    function injectSwitcherStyles() {
        if (document.getElementById('mhent-i18n-styles')) return;
        const style = document.createElement('style');
        style.id = 'mhent-i18n-styles';
        style.textContent = `
            .mhent-lang-container {
                position: relative;
                display: inline-flex;
                align-items: center;
                margin: 0 4px;
            }
            .mhent-lang-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                padding: 6px 10px;
                height: 38px;
                border-radius: 12px;
                cursor: pointer;
                background: var(--bg-glass, rgba(255, 255, 255, 0.08));
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
                color: var(--text-primary, #ffffff);
                font-family: inherit;
                font-weight: 800;
                font-size: 13px;
                transition: all 0.2s ease;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
            }
            .mhent-lang-btn:hover {
                background: var(--bg-glass-strong, rgba(255, 255, 255, 0.16));
                border-color: var(--theme-accent, #38bdf8);
                transform: translateY(-1px);
            }
            .mhent-lang-dropdown {
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                min-width: 155px;
                padding: 6px;
                border-radius: 14px;
                background: var(--bg-glass-strong, #0f172a);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
                box-shadow: 0 12px 36px rgba(0,0,0,0.28);
                z-index: 10000;
                display: none;
                flex-direction: column;
                gap: 4px;
            }
            .mhent-lang-dropdown.show {
                display: flex !important;
                animation: mhentLangFadeIn 0.2s ease;
            }
            @keyframes mhentLangFadeIn {
                from { opacity: 0; transform: translateY(-6px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .mhent-lang-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                border-radius: 8px;
                font-weight: 800;
                font-size: 13.5px;
                cursor: pointer;
                color: var(--text-primary, #cbd5e1);
                transition: all 0.15s ease;
                user-select: none;
            }
            .mhent-lang-item:hover {
                background: rgba(125, 125, 125, 0.14);
                color: var(--theme-accent, #38bdf8);
            }
            .mhent-lang-item.active {
                background: rgba(56, 189, 248, 0.18);
                color: var(--theme-accent, #38bdf8);
                font-weight: 900;
            }
        `;
        document.head.appendChild(style);
    }

    // The MHEntI18n API Object
    const MHEntI18n = {
        currentLang: currentLang,
        supportedLangs: SUPPORTED_LANGS,
        langInfo: LANG_INFO,
        dict: CORE_TRANSLATIONS,

        getLang() {
            return currentLang;
        },

        setLang(newLang) {
            if (!SUPPORTED_LANGS.includes(newLang)) return;
            currentLang = newLang;
            this.currentLang = newLang;

            // Save state
            try {
                localStorage.setItem('mhent_lang', newLang);
            } catch (e) {}
            setCookie('mhent_lang', newLang);

            // Update html lang attribute
            document.documentElement.lang = newLang;

            // Translate elements on page
            this.translatePage();

            // Update Switcher UI
            this.updateSwitcherUI();

            // Emit event for custom reactive components
            window.dispatchEvent(new CustomEvent('mhent:langchange', { detail: { lang: newLang } }));
        },

        t(key, defaultVal = '') {
            const lang = currentLang;
            if (this.dict[lang] && this.dict[lang][key] !== undefined) {
                return this.dict[lang][key];
            }
            if (this.dict['vi'] && this.dict['vi'][key] !== undefined) {
                return this.dict['vi'][key];
            }
            return defaultVal || key;
        },

        addTranslations(lang, newDict) {
            if (!this.dict[lang]) this.dict[lang] = {};
            Object.assign(this.dict[lang], newDict);
            if (lang === currentLang) {
                this.translatePage();
            }
        },

        translatePage() {
            // Text nodes
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const translation = this.t(key);
                if (translation && translation !== key) {
                    el.innerText = translation;
                }
            });

            // HTML nodes
            document.querySelectorAll('[data-i18n-html]').forEach(el => {
                const key = el.getAttribute('data-i18n-html');
                const translation = this.t(key);
                if (translation && translation !== key) {
                    el.innerHTML = translation;
                }
            });

            // Placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                const translation = this.t(key);
                if (translation && translation !== key) {
                    el.setAttribute('placeholder', translation);
                }
            });

            // Titles
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                const translation = this.t(key);
                if (translation && translation !== key) {
                    el.setAttribute('title', translation);
                }
            });
        },

        updateSwitcherUI() {
            const info = LANG_INFO[currentLang] || LANG_INFO.vi;
            const flagEl = document.getElementById('lang-current-flag');
            const codeEl = document.getElementById('lang-current-code');
            if (flagEl) flagEl.innerText = info.flag;
            if (codeEl) codeEl.innerText = info.code;

            // Highlight in dropdown
            document.querySelectorAll('.mhent-lang-item').forEach(el => {
                if (el.dataset.lang === currentLang) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
        },

        toggleDropdown() {
            const menu = document.getElementById('dropdown-lang-menu');
            if (menu) menu.classList.toggle('show');

            // Close other dropdowns
            const acc = document.getElementById('dropdown-account');
            const switcher = document.getElementById('dropdown-app-switcher');
            if (acc) acc.classList.remove('show');
            if (switcher) switcher.classList.remove('show');
        },

        // Auto mount switcher onto Navbar or dedicated slot
        mountNavbarSwitcher() {
            injectSwitcherStyles();

            if (document.getElementById('mhent-lang-container')) {
                this.updateSwitcherUI();
                return;
            }

            // Find slot or target element
            const slot = document.getElementById('lang-switcher-slot');
            const themeBtn = document.getElementById('btn-theme-toggle');
            const navRight = document.querySelector('.nav-right') || document.querySelector('.top-actions');
            const targetParent = slot || (themeBtn ? themeBtn.parentElement : navRight);

            if (!targetParent) return;

            const container = document.createElement('div');
            container.id = 'mhent-lang-container';
            container.className = 'mhent-lang-container';

            const info = LANG_INFO[currentLang] || LANG_INFO.vi;

            container.innerHTML = `
                <button id="btn-lang-toggle" class="mhent-lang-btn" type="button" onclick="MHEntI18n.toggleDropdown()" title="Đổi ngôn ngữ / 言語切替 / Language">
                    <span id="lang-current-flag" style="font-size: 15px; line-height: 1;">${info.flag}</span>
                    <span id="lang-current-code" style="font-size: 12px; font-weight: 900; letter-spacing: 0.5px;">${info.code}</span>
                </button>
                <div id="dropdown-lang-menu" class="mhent-lang-dropdown">
                    <div class="mhent-lang-item ${currentLang === 'vi' ? 'active' : ''}" data-lang="vi" onclick="MHEntI18n.setLang('vi'); MHEntI18n.toggleDropdown();">
                        <span style="font-size: 16px;">🇻🇳</span>
                        <span>Tiếng Việt</span>
                    </div>
                    <div class="mhent-lang-item ${currentLang === 'ja' ? 'active' : ''}" data-lang="ja" onclick="MHEntI18n.setLang('ja'); MHEntI18n.toggleDropdown();">
                        <span style="font-size: 16px;">🇯🇵</span>
                        <span>日本語</span>
                    </div>
                    <div class="mhent-lang-item ${currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="MHEntI18n.setLang('en'); MHEntI18n.toggleDropdown();">
                        <span style="font-size: 16px;">🇺🇸</span>
                        <span>English</span>
                    </div>
                </div>
            `;

            if (slot) {
                slot.appendChild(container);
            } else if (themeBtn && themeBtn.parentElement === targetParent) {
                targetParent.insertBefore(container, themeBtn);
            } else {
                targetParent.appendChild(container);
            }

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#mhent-lang-container')) {
                    const menu = document.getElementById('dropdown-lang-menu');
                    if (menu && menu.classList.contains('show')) {
                        menu.classList.remove('show');
                    }
                }
            });
        }
    };

    // Expose to window
    window.MHEntI18n = MHEntI18n;

    // Apply immediately to HTML
    document.documentElement.lang = currentLang;

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            MHEntI18n.mountNavbarSwitcher();
            MHEntI18n.translatePage();
        });
    } else {
        MHEntI18n.mountNavbarSwitcher();
        MHEntI18n.translatePage();
    }

})(window, document);
