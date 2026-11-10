/**
 * ==============================================================================
 * 🌐 MHEnt Universe - Global Internationalization (i18n) Engine (v2.1 Deep Translation)
 * Ngôn ngữ hỗ trợ (Theo thứ tự ưu tiên):
 *   1. 🇻🇳 Tiếng Việt (vi) - Mặc định
 *   2. 🇯🇵 日本語 (ja)      - Tiếng Nhật (Ưu tiên số 2 theo yêu cầu)
 *   3. 🇺🇸 English (en)    - Tiếng Anh
 *
 * Tự động đồng bộ Cookie .mhentuniverse.com cho toàn bộ Subdomain (Study, Accounts, Tools...)
 * Tự động nhận diện ngữ cảnh & Chuyển ngữ toàn diện toàn bộ Website MHEnt Universe.
 * Hỗ trợ dịch động qua translateText() cho Toast, Popup, AISA & DOM Injection.
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
        "nav.home": "Trang Chủ",
        "nav.hub": "Đại Sảnh",
        "nav.cinema": "Cinema",
        "nav.tools": "Bộ Công Cụ",
        "nav.teach": "Giáo Dục",
        "nav.about": "Về chúng tớ",
        "nav.login": "Đăng nhập",
        "nav.logout": "Đăng xuất",
        "nav.profile": "Hồ sơ",
        "nav.profile_general": "Hồ sơ chung",
        "nav.settings": "Cài đặt",
        "nav.admin": "Admin Panel",
        "nav.teacher_panel": "Trạm Chỉ Huy (GV)",
        "nav.theme": "Tắt/Mở đèn",
        "nav.lang": "Đổi ngôn ngữ",
        "nav.back": "Quay lại",
        "nav.home_teach": "Về trang chủ Teach",
        "nav.gateway": "Gateway",
        "nav.checkin": "Check-in Hub",
        "nav.forms": "Forms & Sheet",
        "app.hub": "Đại Sảnh",
        "app.cinema": "Cinema",
        "app.manga": "Manga",
        "app.novel": "Novel",
        "app.music": "Music",
        "app.arena": "Arena",
        "app.edu": "Edu",
        "app.game": "Game",
        "action.save": "Lưu",
        "action.cancel": "Hủy",
        "action.close": "Đóng",
        "action.confirm": "Xác nhận",
        "action.back": "Quay lại",
        "action.next": "Tiếp theo",
        "action.copy": "Sao chép",
        "action.copied": "Đã sao chép!",
        "action.search": "Tìm kiếm...",
        "action.loading": "Đang tải...",
        "action.delete": "Xóa",
        "action.edit": "Chỉnh sửa",
        "action.add": "Thêm",
        "action.refresh": "Tải lại",
        "action.reset": "Chơi lại",
        "action.download": "Tải xuống",
        "action.upload": "Tải lên",
        "action.fullscreen": "Toàn màn hình",
        "action.continue": "Tiếp tục",
        "action.view": "Xem",
        "action.detail": "Chi tiết",
        "action.filter": "Lọc",
        "action.select_all": "Chọn tất cả",
        "action.share": "Chia sẻ",
        "portal.hero_title": "Miyazaki Haruto Entertainment Universe",
        "portal.hero_desc": "Đế chế Đa Vũ Trụ Giải Trí",
        "portal.cinema_desc": "Rạp chiếu phim Anime, Series & Movie chất lượng cao với Hệ sinh thái Đa Nhóm Dịch.",
        "portal.manga_desc": "Thư viện truyện tranh cuộn dọc siêu mượt mà. (Sắp ra mắt...)",
        "portal.novel_desc": "Góc đọc truyện chữ tối giản, bảo vệ mắt. (Sắp ra mắt...)",
        "portal.music_desc": "Trạm phát Anisong, OST và Drama CD cực chill. (Sắp ra mắt...)",
        "portal.arena_desc": "Sân chơi Quiz, giải trí tương tác, sự kiện & minigame hấp dẫn.",
        "portal.edu_desc": "Nền tảng học tập tương tác, phát triển kỹ năng và kiến thức.",
        "portal.game_desc": "Hệ sinh thái e-Sport và minigame giải trí đa người chơi thời gian thực.",
        "edu.home": "Trang Chủ",
        "edu.tools": "Bộ Công Cụ",
        "edu.hero_title": "MHEnt. Education",
        "edu.hero_subtitle": "Không Gian Giảng Dạy & Công Cụ Tương Tác",
        "edu.bingo_card_title": "Đại Tiệc Bingo",
        "edu.bingo_card_desc": "Vòng quay bốc từ vựng ngẫu nhiên, âm thanh kịch tính, máy chiếu trực quan và in phiếu tự động.",
        "edu.vocab_card_title": "Đấu Trường Từ Vựng",
        "edu.baam_card_title": "Hộp Quà Nhân Phẩm",
        "edu.spin_card_title": "Vòng Quay Định Mệnh",
        "edu.tug_card_title": "Kéo Co Từ Vựng",
        "edu.bomb_card_title": "Bom Hẹn Giờ",
        "edu.blast_card_title": "Blast Block",
        "edu.racing_card_title": "Đua Xe Flashcard",
        "edu.unscram_card_title": "Word Tornado",
        "admin.cloud_title": "Quản lý Đám mây (MHEnt. Database)",
        "admin.cloud_reload": "Tải lại",
        "admin.cloud_placeholder": "-- Chọn bộ dữ liệu đã lưu --",
        "admin.cloud_create": "Tạo mới Đám Mây",
        "admin.cloud_save_changes": "Lưu thay đổi",
        "admin.cloud_delete": "Xóa Khỏi Mây",
        "admin.cloud_get_link": "Lấy Link Chơi",
        "admin.open_presenter": "MỞ MÀN HÌNH TRÌNH CHIẾU DÀNH CHO HỌC SINH",
        "admin.open_bingo_screen": "MỞ MÀN HÌNH TRÌNH CHIẾU BINGO (MÁY CHIẾU)",
        "admin.tab_table": "Nhập theo Bảng",
        "admin.tab_excel": "Dán từ Excel",
        "admin.col_word": "Từ vựng",
        "admin.col_meaning": "Ý nghĩa",
        "admin.add_word_row": "Thêm từ mới",
        "admin.save_and_open": "LƯU DANH SÁCH & MỞ MÀN CHIẾU BINGO NGAY",
        "admin.auth_checking": "ĐANG KIỂM TRA QUYỀN GIÁO VIÊN...",
        "teach.waiting_teacher": "Đang chờ kết nối từ Máy tính Giáo viên...",
        "teach.find_word_meaning": "HÃY TÌM TỪ CÓ NGHĨA LÀ",
        "teach.normal_mode": "CHẾ ĐỘ BÌNH THƯỜNG",
        "teach.fog_toggle": "Bật Sương mù",
        "teach.next_word": "Tiếp theo",
        "teach.waiting_question": "Chờ giáo viên chọn câu hỏi...",
        "bingo.title": "Bingo Master",
        "bingo.subtitle": "Classroom Edition",
        "bingo.called": "Đã gọi:",
        "bingo.remain": "Còn lại:",
        "bingo.btn_draw": "Bốc Từ Tiếp Theo",
        "bingo.btn_bingo": "Có Bạn Bingo!",
        "bingo.recent_calls": "5 từ vừa gọi gần nhất:",
        "bingo.no_calls": "Chưa có từ nào được bốc...",
        "bingo.radar_title": "Bảng Radar Từ Vựng",
        "bingo.ready_title": "SẴN SÀNG! 🎲",
        "bingo.ready_desc": "Nhấn BỐC TỪ TIẾP THEO hoặc phím Space để bắt đầu",
        "bingo.replay_speech": "Phát âm lại",
        "bingo.print_sheets": "In Phiếu Bingo",
        "bingo.mode_suspense": "Chế độ kịch tính",
        "bingo.hint_draw": "Bốc từ",
        "bingo.hint_bingo": "Báo Bingo",
        "bingo.hint_replay": "Phát âm lại",
        "bingo.hint_fullscreen": "Toàn màn hình",
        "bingo.hint_reset": "Chơi lại",
        "bingo.settings_title": "Cài Đặt Danh Sách Từ Vựng",
        "bingo.cloud_load_title": "Nạp giáo án từ Đám mây (MHEnt Cloud ID):",
        "bingo.cloud_input_placeholder": "Dán mã ID hoặc link chứa ?id=...",
        "bingo.cloud_fetch_btn": "Tải bài",
        "bingo.presets_title": "Mẫu gợi ý bài học nhanh:",
        "bingo.preset_verbs": "🏃 25 Động từ thông dụng",
        "bingo.preset_adjectives": "✨ 25 Tính từ miêu tả",
        "bingo.preset_classroom": "🏫 25 Đồ dùng & Trường học",
        "bingo.input_label": "Danh sách từ vựng (Mỗi dòng một từ, có thể thêm nghĩa: Từ | Nghĩa):",
        "bingo.roll_time_title": "Thời gian quay kịch tính",
        "bingo.roll_fast": "⚡ Nhanh (1.8 giây)",
        "bingo.roll_standard": "🎯 Chuẩn kịch tính (3.0 giây)",
        "bingo.roll_intense": "🔥 Cực căng thẳng (4.5 giây)",
        "bingo.mystery_title": "Thẻ Sự Kiện Bất Ngờ",
        "bingo.mystery_checkbox": "Kích hoạt Thần May Mắn (10%)",
        "bingo.save_and_start": "Lưu & Bắt Đầu Ván Mới",
        "bingo.win_title": "BINGO! CHIẾN THẮNG!",
        "bingo.win_subtitle": "Chúc mừng bạn học sinh đã xuất sắc hoàn thành hàng Bingo đầu tiên! 🌟",
        "bingo.verify_title": "Xác minh 5 từ trên phiếu của học sinh:",
        "bingo.verify_prompt": "Chọn 5 từ để kiểm tra",
        "bingo.verify_search": "Gõ từ của học sinh để đối chiếu...",
        "bingo.confetti_more": "Bắn Thêm Pháo Hoa!",
        "bingo.continue_game": "Tiếp tục trò chơi",
        "bingo.print_modal_title": "Tạo Phiếu Bingo Phát Cho Học Sinh",
        "bingo.print_modal_desc": "Hệ thống hỗ trợ in phiếu đẹp mắt theo chuẩn 5x5 (25 ô) kèm ô trung tâm ⭐ FREE STAR.",
        "bingo.print_blank_btn": "📝 Phiếu Trống (Học sinh tự điền từ)",
        "bingo.print_random_btn": "🎲 Phiếu Điền Sẵn (Trộn từ tự động)",
        "bingo.print_do_print": "Mở Hộp Thoại In Ngay",
        "tools.title": "MHEnt. Gateway & Smart Links",
        "tools.shorten_input_placeholder": "Dán liên kết bất kỳ vào đây... (https://...)",
        "tools.btn_quick_redirect": "Chuyển Hướng Nhanh",
        "tools.btn_smart_schedule": "Hẹn Giờ Thông Minh",
        "tools.btn_lock_id": "Khóa MHEnt ID",
        "tools.label_slug": "Định danh slug (tùy chọn):",
        "tools.label_title": "Tên tiêu đề (tùy chọn):",
        "tools.label_btn_text": "Chữ trên nút (tùy chọn):",
        "tools.btn_create": "Tạo Liên Kết Rút Gọn Ngay",
        "tools.stat_total_links": "TỔNG LIÊN KẾT",
        "tools.stat_open_free": "ĐANG MỞ TỰ DO",
        "tools.stat_locked_id": "KHÓA MHENT ID",
        "tools.stat_total_clicks": "TỔNG LƯỢT CLICK",
        "tools.list_title": "Danh Sách Liên Kết Đã Tạo",
        "cinema.watch_title": "Rạp Chiếu Phim MHEnt",
        "cinema.search_placeholder": "Tìm kiếm anime, movie, OVA...",
        "cinema.latest_episodes": "Tập Mới Cập Nhật",
        "cinema.trending": "Thịnh Hành",
        "cinema.episodes_list": "Danh Sách Tập",
        "cinema.server_select": "Chọn Máy Chủ",
        "cinema.room_party": "Phòng Xem Chung (Watch Party)",
        "cinema.cinema_mode": "Chế độ rạp phim",
        "arena.title": "Đấu Trường MHEnt Arena",
        "arena.join_game": "Tham Gia Đấu Trường",
        "arena.enter_pin": "Nhập mã PIN hoặc Room ID...",
        "arena.leaderboard": "Bảng Xếp Hạng",
        "arena.question": "Câu hỏi",
        "arena.time": "Thời gian",
        "arena.score": "Điểm",
        "game.chess_title": "Cờ Vua (Chess) - MHEnt",
        "game.xiangqi_title": "Cờ Tướng (Xiangqi) - MHEnt",
        "game.new_game": "Ván Mới",
        "game.undo": "Đi lại",
        "game.ai_level": "Cấp độ AI",
        "game.turn_white": "Lượt Trắng",
        "game.turn_black": "Lượt Đen",
        "game.turn_red": "Lượt Đỏ",
        "game.checkmate": "Chiếu Bí!",
        "auth.title": "Đăng Nhập Cổng MHEnt ID",
        "auth.email_label": "Địa chỉ Email:",
        "auth.password_label": "Mật khẩu:",
        "auth.btn_google": "Đăng nhập bằng Google",
        "auth.forgot_password": "Quên mật khẩu?",
        "profile.title": "Hồ Sơ Tài Khoản MHEnt",
        "profile.save_changes": "Cập Nhật Thông Tin",
        "about.page_title": "Về Chúng Tớ - MHEnt. Universe",
        "terms.page_title": "Điều Khoản Dịch Vụ",
        "privacy.page_title": "Chính Sách Bảo Mật",
        "404.title": "404 - Không Tìm Thấy Trang",
        "404.desc": "Vũ trụ này dường như chưa được khai phá hoặc đã bị dời đi nơi khác.",
        "404.back_btn": "Trở Về Đại Sảnh",
        "footer.slogan": "Đế chế Đa Vũ Trụ Giải Trí Số & Sáng Tạo Nghệ Thuật. Kết nối cộng đồng anime, âm nhạc, văn hóa đại chúng và công nghệ giáo dục thông minh.",
        "footer.corp": "Vận hành bởi <strong>Miyazaki Haruto Entertainment Co., Ltd.</strong><br>Hệ sinh thái phi lợi nhuận phục vụ cộng đồng đam mê giải trí & học thuật.",
        "footer.status": "MHEnt Cloud: Mọi phân khu trực tuyến",
        "footer.ent_heading": "Vũ Trụ Giải Trí",
        "footer.study_heading": "Không Gian Học Tập",
        "footer.legal_heading": "Hệ Thống & Pháp Lý",
        "footer.terms": "Điều khoản dịch vụ",
        "footer.privacy": "Chính sách bảo mật",
        "footer.about_report": "Về chúng tớ & Báo cáo lỗi",
        "footer.community": "Cộng đồng MHEnt Universe",
        "footer.rights": "Tất cả các quyền được bảo lưu.",
        "cinema.hero_quote": "Vũ trụ điện ảnh thu nhỏ – Trải nghiệm bản dịch tâm huyết từ MHEnt. và hơn cả thế! 🎬",
        "cinema.explore_now": "Khám phá ngay",
        "cinema.now_showing": "Phim đang chiếu",
        "cinema.continue_watching": "Tiếp tục xem",
        "cinema.search_prompt": "Tên phim cậu muốn tìm là gì...",
        "cinema.list_nav": "Danh sách Phim",
        "cinema.watch_movie_btn": "▶ Xem phim",
        "cinema.library_nav": "Thư viện",
        "cinema.tag_all": "Tất cả",
        "cinema.tag_magic": "Phép thuật",
        "cinema.tag_action": "Hành động",
        "cinema.tag_slice_of_life": "Đời thường",
        "cinema.tag_idol": "Idol",
        "cinema.tag_movie": "Movie",
        "cinema.tag_theatrical": "Phim rạp",
        "cinema.tag_comedy": "Hài hước",
        "cinema.tag_school": "Học đường",
        "cinema.no_results_title": "Ui, rạp chưa chiếu phim này rùi... 🥲",
        "cinema.no_results_desc": "Cậu thử đổi từ khóa hoặc bỏ bớt tag xem sao nhé!",
        "cinema.gate_privilege": "ĐẶC QUYỀN HỘI VIÊN MHENT",
        "cinema.gate_title": "CỔNG SOÁT VÉ ĐIỆN ẢNH",
        "cinema.gate_desc": "Chào mừng cậu đến với MHEnt. Cinema. Khu phức hợp rạp chiếu phim kỹ thuật số dành riêng cho cư dân MHEnt Universe. Vui lòng xuất trình Thẻ Hội Viên MHEnt ID để vào rạp thưởng thức những thước phim đỉnh cao!",
        "cinema.gate_show_ticket": "Xuất Trình Thẻ Hội Viên / Đăng Nhập",
        "cinema.gate_back_hub": "Về Đại Sảnh MHEnt",
        "cinema.gate_opening": "Đang mở cổng rạp chiếu phim...",
        "arena.nav_contests": "Danh Sách Cuộc Thi",
        "arena.hero_subtitle": "Hệ thống thi trắc nghiệm trực tuyến – Nhanh chóng, minh bạch & chính xác!",
        "arena.hero_subtitle_dash": "Hệ thống thi trắc nghiệm trực tuyến - Nhanh chóng, minh bạch & chính xác!",
        "arena.join_input_placeholder": "Nhập mã cuộc thi (Ví dụ: HOITHIDOAN)",
        "arena.btn_join_action": "Tham gia",
        "arena.open_contests_heading": "Các hội thi đang mở",
        "arena.status_open": "Đang mở",
        "arena.status_test": "Đang Test",
        "arena.status_closed": "Đã đóng",
        "arena.unit_questions": "câu",
        "arena.unit_minutes": "phút",
        "arena.no_quizzes": "Hiện tại chưa có hội thi nào mở. Cậu quay lại sau nha!",
        "arena.server_error": "Lỗi kết nối máy chủ! Vui lòng thử lại sau.",
        "arena.error_no_code": "Cậu chưa nhập mã cuộc thi!",
        "arena.loading_vault": "Đang tải dữ liệu từ Két sắt MHEnt...",
        "aisa.tooltip_study": "🌸 Học bài cùng AISA nhen!",
        "aisa.tooltip_workspace": "✨ AISA túc trực hỗ trợ công việc!",
        "aisa.tooltip_cinema": "🎬 Xem phim cùng AISA!",
        "aisa.tooltip_arena": "⚡ Đấu trí cùng AISA Arena!",
        "aisa.tooltip_game": "🎮 Chơi cờ cùng AISA!",
        "aisa.tooltip_portal": "🪐 Trò chuyện cùng AISA Universe!",
        "aisa.input_placeholder": "Hỏi AISA điều gì đó...",
        "aisa.modal_title": "Trợ Lý Ảo AISA",
        "toast.notice": "Thông báo",
        "toast.error": "Lỗi",
        "toast.success": "Thành công",
        "toast.warning": "Cảnh báo",
        "toast.music_soon": "Vũ trụ Âm nhạc đang được xây dựng, chờ xíu nha!",
        "toast.manga_soon": "Vũ trụ Manga đang xây dựng!",
        "toast.manga_soon_alt": "Vũ trụ Truyện Tranh đang được xây dựng, chờ xíu nha!",
        "toast.novel_soon": "Vũ trụ Novel đang xây dựng!",
        "toast.novel_soon_alt": "Vũ trụ Tiểu thuyết đang được xây dựng, chờ xíu nha!",
        "toast.manga_studio_soon": "Manga Studio sắp ra mắt!",
        "toast.novel_studio_soon": "Light Novel sắp ra mắt!",
        "toast.music_studio_soon": "Music Studio sắp ra mắt!",
        "ui.error_title": "Ối, Lỗi Rùi!",
        "ui.success_title": "Thành Công!",
        "ui.btn_awesome": "Tuyệt vời",
        "tools.hero_subtitle": "Kho tiện ích thông minh, tối ưu quy trình làm việc cho toàn hệ sinh thái MHEnt.",
        "tools.explore_btn": "Khám phá công cụ",
        "tools.list_heading": "Danh sách Công cụ",
        "tools.forms_title": "Forms & Sheet (Biểu mẫu & Bảng tính)",
        "tools.forms_desc": "Tạo biểu mẫu đa năng, thu thập danh sách trực tuyến, chỉnh sửa thời gian thực trên MHEnt Sheet và xuất Excel (.xlsx).",
        "tools.inventory_title": "Inventory (Trạm Kiểm Kiện)",
        "tools.inventory_desc": "Quản lý kho hàng, theo dõi số lượng, tự động tính toán doanh thu và xuất báo cáo.",
        "tools.checkin_title": "Check-in Hub (Trạm Điểm Danh)",
        "tools.checkin_desc": "Hệ thống soát vé & điểm danh toàn năng: Quét mã QR siêu tốc, Kiosk tự phục vụ, màn chiếu Live QR và vé điện tử E-Ticket.",
        "tools.gateway_title": "MHEnt Gateway (Cổng Rút Gọn & Điều Hướng)",
        "tools.gateway_desc": "Bảo vệ link tải Drive/tài nguyên: Tùy biến mở công khai theo lịch trình, khóa yêu cầu đăng nhập MHEnt ID, đếm click thời gian thực."
},
        ja: {
        "nav.home": "ホーム",
        "nav.hub": "メインロビー",
        "nav.cinema": "シネマ",
        "nav.tools": "ツールハブ",
        "nav.teach": "教育ハブ",
        "nav.about": "会社概要",
        "nav.login": "ログイン",
        "nav.logout": "ログアウト",
        "nav.profile": "プロフィール",
        "nav.profile_general": "プロフィール",
        "nav.settings": "設定",
        "nav.admin": "管理パネル",
        "nav.teacher_panel": "教員管制塔",
        "nav.theme": "ダークモード切替",
        "nav.lang": "言語切替",
        "nav.back": "戻る",
        "nav.home_teach": "教育ホームへ",
        "nav.gateway": "ゲートウェイ",
        "nav.checkin": "チェックインハブ",
        "nav.forms": "フォーム＆シート",
        "app.hub": "ロビー",
        "app.cinema": "シネマ",
        "app.manga": "マンガ",
        "app.novel": "ノベル",
        "app.music": "音楽",
        "app.arena": "アリーナ",
        "app.edu": "教育",
        "app.game": "ゲーム",
        "action.save": "保存",
        "action.cancel": "キャンセル",
        "action.close": "閉じる",
        "action.confirm": "確認",
        "action.back": "戻る",
        "action.next": "次へ",
        "action.copy": "コピー",
        "action.copied": "コピーしました！",
        "action.search": "検索...",
        "action.loading": "読み込み中...",
        "action.delete": "削除",
        "action.edit": "編集",
        "action.add": "追加",
        "action.refresh": "再読み込み",
        "action.reset": "リセット",
        "action.download": "ダウンロード",
        "action.upload": "アップロード",
        "action.fullscreen": "全画面",
        "action.continue": "続ける",
        "action.view": "見る",
        "action.detail": "詳細",
        "action.filter": "絞り込み",
        "action.select_all": "すべて選択",
        "action.share": "共有",
        "portal.hero_title": "Miyazaki Haruto Entertainment Universe",
        "portal.hero_desc": "デジタルエンターテインメントマルチバース",
        "portal.cinema_desc": "高品質アニメ・シリーズ・映画とマルチ翻訳チームエコシステム。",
        "portal.manga_desc": "縦スクロール対応の快適な漫画ライブラリ。（近日公開...）",
        "portal.novel_desc": "目に優しいミニマルなライトノベル読書スペース。（近日公開...）",
        "portal.music_desc": "アニソン、OST、ドラマCDのチルな配信ステーション。（近日公開...）",
        "portal.arena_desc": "クイズ、インタラクティブ体験、イベント＆楽しいミニゲーム。",
        "portal.edu_desc": "インタラクティブな学習プラットフォーム、スキルと知識の開発。",
        "portal.game_desc": "リアルタイムマルチプレイヤーeスポーツ＆ミニゲームエコシステム。",
        "edu.home": "ホーム",
        "edu.tools": "ツール一覧",
        "edu.hero_title": "MHEnt. Education",
        "edu.hero_subtitle": "インタラクティブ授業＆教育ツールハブ",
        "edu.bingo_card_title": "ビンゴパーティー",
        "edu.bingo_card_desc": "単語ランダム抽選、迫真サウンド、プロジェクター表示、自動ビンゴカード印刷。",
        "edu.vocab_card_title": "単語アリーナ",
        "edu.baam_card_title": "ラッキーボックス",
        "edu.spin_card_title": "運命のルーレット",
        "edu.tug_card_title": "単語綱引き",
        "edu.bomb_card_title": "タイムボム",
        "edu.blast_card_title": "ブラストブロック",
        "edu.racing_card_title": "フラッシュカードレース",
        "edu.unscram_card_title": "単語トルネード",
        "admin.cloud_title": "クラウド管理 (MHEnt. Database)",
        "admin.cloud_reload": "再読み込み",
        "admin.cloud_placeholder": "-- 保存済みデータを選択 --",
        "admin.cloud_create": "クラウドに新規作成",
        "admin.cloud_save_changes": "変更を保存",
        "admin.cloud_delete": "クラウドから削除",
        "admin.cloud_get_link": "ゲームリンク取得",
        "admin.open_presenter": "生徒用プロジェクター画面を開く",
        "admin.open_bingo_screen": "ビンゴプロジェクター画面を開く",
        "admin.tab_table": "テーブル入力",
        "admin.tab_excel": "Excel貼り付け",
        "admin.col_word": "単語",
        "admin.col_meaning": "意味",
        "admin.add_word_row": "新しい単語を追加",
        "admin.save_and_open": "リストを保存してビンゴ画面を開く",
        "admin.auth_checking": "教員権限を確認中...",
        "teach.waiting_teacher": "教員PCからの接続を待機中...",
        "teach.find_word_meaning": "次の意味の単語を見つけてください",
        "teach.normal_mode": "通常モード",
        "teach.fog_toggle": "フォグ切替",
        "teach.next_word": "次へ",
        "teach.waiting_question": "教員が問題を選択するのを待っています...",
        "bingo.title": "ビンゴマスター",
        "bingo.subtitle": "教室エディション",
        "bingo.called": "出た単語:",
        "bingo.remain": "残り:",
        "bingo.btn_draw": "次の単語を引く",
        "bingo.btn_bingo": "ビンゴ達成！",
        "bingo.recent_calls": "直近に出た5単語:",
        "bingo.no_calls": "まだ単語は引かれていません...",
        "bingo.radar_title": "単語レーダーボード",
        "bingo.ready_title": "準備完了！🎲",
        "bingo.ready_desc": "「次の単語を引く」またはSpaceキーを押してスタート",
        "bingo.replay_speech": "もう一度発音",
        "bingo.print_sheets": "ビンゴカード印刷",
        "bingo.mode_suspense": "サスペンスモード",
        "bingo.hint_draw": "単語を引く",
        "bingo.hint_bingo": "ビンゴ報告",
        "bingo.hint_replay": "再発音",
        "bingo.hint_fullscreen": "全画面",
        "bingo.hint_reset": "リセット",
        "bingo.settings_title": "語彙リスト設定",
        "bingo.cloud_load_title": "クラウドから教材を読み込む (MHEnt Cloud ID):",
        "bingo.cloud_input_placeholder": "IDまたは?id=を含むリンクを貼り付け...",
        "bingo.cloud_fetch_btn": "読み込む",
        "bingo.presets_title": "クイックプリセット:",
        "bingo.preset_verbs": "🏃 よく使う動詞25選",
        "bingo.preset_adjectives": "✨ 描写の形容詞25選",
        "bingo.preset_classroom": "🏫 文房具・学校用語25選",
        "bingo.input_label": "語彙リスト (1行に1単語、意味も追加可能: 単語 | 意味):",
        "bingo.roll_time_title": "抽選演出の長さ",
        "bingo.roll_fast": "⚡ 高速 (1.8秒)",
        "bingo.roll_standard": "🎯 標準サスペンス (3.0秒)",
        "bingo.roll_intense": "🔥 激アツ (4.5秒)",
        "bingo.mystery_title": "サプライズイベントカード",
        "bingo.mystery_checkbox": "ラッキーイベント有効化 (10%)",
        "bingo.save_and_start": "保存して新しいゲームを開始",
        "bingo.win_title": "BINGO! おめでとう！",
        "bingo.win_subtitle": "最初のビンゴラインを見事達成した生徒の皆さん、おめでとうございます！🌟",
        "bingo.verify_title": "生徒のカード上の5単語を確認:",
        "bingo.verify_prompt": "確認する単語を5つ選択",
        "bingo.verify_search": "生徒の単語を入力して照合...",
        "bingo.confetti_more": "紙吹雪をもっと飛ばす！",
        "bingo.continue_game": "ゲームを続ける",
        "bingo.print_modal_title": "生徒用ビンゴカード作成",
        "bingo.print_modal_desc": "5×5（25マス、中央⭐FREE STAR付き）の高品質ビンゴカードを作成・印刷できます。",
        "bingo.print_blank_btn": "📝 空白カード (生徒が自分で記入)",
        "bingo.print_random_btn": "🎲 自動シャッフルカード (印刷用)",
        "bingo.print_do_print": "印刷ダイアログを開く",
        "tools.title": "MHEnt. ゲートウェイ＆スマート短縮リンク",
        "tools.shorten_input_placeholder": "リンクをここに貼り付けてください... (https://...)",
        "tools.btn_quick_redirect": "高速リダイレクト",
        "tools.btn_smart_schedule": "スマート予約",
        "tools.btn_lock_id": "MHEnt IDロック",
        "tools.label_slug": "スラッグ識別名 (任意):",
        "tools.label_title": "タイトル名 (任意):",
        "tools.label_btn_text": "ボタンのテキスト (任意):",
        "tools.btn_create": "短縮リンクを今すぐ作成",
        "tools.stat_total_links": "総リンク数",
        "tools.stat_open_free": "自由公開中",
        "tools.stat_locked_id": "IDロック中",
        "tools.stat_total_clicks": "総クリック数",
        "tools.list_title": "作成済みリンク一覧",
        "cinema.watch_title": "MHEnt シネマ",
        "cinema.search_placeholder": "アニメ、映画、OVAを検索...",
        "cinema.latest_episodes": "新着エピソード",
        "cinema.trending": "トレンド・人気作品",
        "cinema.episodes_list": "エピソード一覧",
        "cinema.server_select": "サーバー選択",
        "cinema.room_party": "同時視聴ルーム (Watch Party)",
        "cinema.cinema_mode": "シアターモード",
        "arena.title": "MHEnt アリーナ",
        "arena.join_game": "アリーナに参加",
        "arena.enter_pin": "PINコードまたはルームIDを入力...",
        "arena.leaderboard": "リーダーボード",
        "arena.question": "問題",
        "arena.time": "時間",
        "arena.score": "スコア",
        "game.chess_title": "チェス (Chess) - MHEnt",
        "game.xiangqi_title": "中国将棋 (象棋) - MHEnt",
        "game.new_game": "新しい対局",
        "game.undo": "待った (一手戻す)",
        "game.ai_level": "AI難易度",
        "game.turn_white": "白の手番",
        "game.turn_black": "黒の手番",
        "game.turn_red": "赤の手番",
        "game.checkmate": "チェックメイト！",
        "auth.title": "MHEnt ID ログインポータル",
        "auth.email_label": "メールアドレス:",
        "auth.password_label": "パスワード:",
        "auth.btn_google": "Googleでログイン",
        "auth.forgot_password": "パスワードをお忘れですか？",
        "profile.title": "MHEnt アカウントプロフィール",
        "profile.save_changes": "情報を更新",
        "about.page_title": "私たちについて - MHEnt. Universe",
        "terms.page_title": "利用規約",
        "privacy.page_title": "プライバシーポリシー",
        "404.title": "404 - ページが見つかりません",
        "404.desc": "この宇宙はまだ開拓されていないか、別の場所へ移動しました。",
        "404.back_btn": "メインロビーへ戻る",
        "footer.slogan": "デジタルエンターテインメントと芸術創造のマルチバース。アニメ、音楽、大衆文化、そしてスマート教育をつなぐ。",
        "footer.corp": "運営：<strong>Miyazaki Haruto Entertainment Co., Ltd.</strong><br>エンタメと学問を愛するコミュニティのための非営利エコシステム。",
        "footer.status": "MHEnt Cloud: 全システム正常稼働中",
        "footer.ent_heading": "エンタメ宇宙",
        "footer.study_heading": "学習スペース",
        "footer.legal_heading": "システム＆法務",
        "footer.terms": "利用規約",
        "footer.privacy": "プライバシーポリシー",
        "footer.about_report": "私たちについて＆不具合報告",
        "footer.community": "MHEnt Universe コミュニティ",
        "footer.rights": "無断転載を禁じます。",
        "cinema.hero_quote": "映画の小宇宙 – MHEntの情熱が詰まった翻訳体験、それ以上の感動を！🎬",
        "cinema.explore_now": "今すぐ探索",
        "cinema.now_showing": "上映中の作品",
        "cinema.continue_watching": "続きを見る",
        "cinema.search_prompt": "探したい映画のタイトルは...",
        "cinema.list_nav": "作品リスト",
        "cinema.watch_movie_btn": "▶ 今すぐ見る",
        "cinema.library_nav": "マイライブラリ",
        "cinema.tag_all": "すべて",
        "cinema.tag_magic": "魔法",
        "cinema.tag_action": "アクション",
        "cinema.tag_slice_of_life": "日常",
        "cinema.tag_idol": "アイドル",
        "cinema.tag_movie": "劇場版",
        "cinema.tag_theatrical": "劇場版",
        "cinema.tag_comedy": "コメディ",
        "cinema.tag_school": "学園",
        "cinema.no_results_title": "お探しの作品は見つかりませんでした... 🥲",
        "cinema.no_results_desc": "キーワードを変更するか、タグを外してみてください！",
        "cinema.gate_privilege": "MHENTメンバー特別特典",
        "cinema.gate_title": "シネマ改札ゲート",
        "cinema.gate_desc": "MHEnt. Cinemaへようこそ。MHEnt Universe住民専用のデジタルシネマコンプレックスです。MHEnt IDメンバーカードをご提示いただき、最高の映像をお楽しみください！",
        "cinema.gate_show_ticket": "会員証を提示 / ログイン",
        "cinema.gate_back_hub": "MHEntロビーへ戻る",
        "cinema.gate_opening": "映画館のゲートを開いています...",
        "arena.nav_contests": "コンテスト一覧",
        "arena.hero_subtitle": "オンライン試験システム – スピーディー、公正、正確！",
        "arena.hero_subtitle_dash": "オンライン試験システム – スピーディー、公正、正確！",
        "arena.join_input_placeholder": "コンテストコードを入力 (例: HOITHIDOAN)",
        "arena.btn_join_action": "参加する",
        "arena.open_contests_heading": "開催中のコンテスト",
        "arena.status_open": "開催中",
        "arena.status_test": "テスト中",
        "arena.status_closed": "終了",
        "arena.unit_questions": "問",
        "arena.unit_minutes": "分",
        "arena.no_quizzes": "現在開催中のコンテストはありません。また後で確認してください！",
        "arena.server_error": "サーバー接続エラー！後ほど再度お試しください。",
        "arena.error_no_code": "コンテストコードを入力してください！",
        "arena.loading_vault": "MHEnt金庫からデータを読み込み中...",
        "aisa.tooltip_study": "🌸 AISAと一緒に勉強しよう！",
        "aisa.tooltip_workspace": "✨ AISAが仕事をお手伝いします！",
        "aisa.tooltip_cinema": "🎬 AISAと一緒に映画を見よう！",
        "aisa.tooltip_arena": "⚡ AISA Arenaで頭脳対戦！",
        "aisa.tooltip_game": "🎮 AISAと対局しよう！",
        "aisa.tooltip_portal": "🪐 AISA Universeとおしゃべりしよう！",
        "aisa.input_placeholder": "AISAに何か聞いてみてね...",
        "aisa.modal_title": "AIアシスタント AISA",
        "toast.notice": "お知らせ",
        "toast.error": "エラー",
        "toast.success": "成功",
        "toast.warning": "警告",
        "toast.music_soon": "音楽宇宙は現在準備中です。少々お待ちください！",
        "toast.manga_soon": "マンガ宇宙は準備中です！",
        "toast.manga_soon_alt": "マンガ宇宙は現在準備中です。少々お待ちください！",
        "toast.novel_soon": "小説宇宙は準備中です！",
        "toast.novel_soon_alt": "小説宇宙は現在準備中です。少々お待ちください！",
        "toast.manga_studio_soon": "マンガスタジオは近日公開！",
        "toast.novel_studio_soon": "ライトノベルは近日公開！",
        "toast.music_studio_soon": "音楽スタジオは近日公開！",
        "ui.error_title": "エラーが発生しました！",
        "ui.success_title": "成功しました！",
        "ui.btn_awesome": "素晴らしい",
        "tools.hero_subtitle": "スマートなツールハブ、MHEntエコシステムのワークフローを最適化。",
        "tools.explore_btn": "ツールを探索",
        "tools.list_heading": "ツール一覧",
        "tools.forms_title": "Forms & Sheet（フォーム＆シート）",
        "tools.forms_desc": "高機能フォーム作成、オンライン名簿収集、MHEnt Sheetでのリアルタイム編集、Excel（.xlsx）出力に対応。",
        "tools.inventory_title": "Inventory（在庫・出荷管理）",
        "tools.inventory_desc": "在庫管理、数量トラッキング、売上自動集計、レポート出力。",
        "tools.checkin_title": "Check-in Hub（チェックインハブ）",
        "tools.checkin_desc": "万能チェックイン＆改札システム：超高速QRスキャン、セルフキオスク、ライブQR投影、Eチケット発券。",
        "tools.gateway_title": "MHEnt Gateway（スマートリンク＆リダイレクト）",
        "tools.gateway_desc": "Drive/リソース保護リンク：スケジュール公開、MHEnt IDログイン必須ロック、リアルタイムクリック測定。"
},
        en: {
        "nav.home": "Home",
        "nav.hub": "Main Hub",
        "nav.cinema": "Cinema",
        "nav.tools": "Tools Hub",
        "nav.teach": "Education",
        "nav.about": "About Us",
        "nav.login": "Sign In",
        "nav.logout": "Sign Out",
        "nav.profile": "Profile",
        "nav.profile_general": "Profile",
        "nav.settings": "Settings",
        "nav.admin": "Admin Panel",
        "nav.teacher_panel": "Teacher Panel",
        "nav.theme": "Toggle Theme",
        "nav.lang": "Change Language",
        "nav.back": "Back",
        "nav.home_teach": "Teach Home",
        "nav.gateway": "Gateway",
        "nav.checkin": "Check-in Hub",
        "nav.forms": "Forms & Sheet",
        "app.hub": "Lobby",
        "app.cinema": "Cinema",
        "app.manga": "Manga",
        "app.novel": "Novel",
        "app.music": "Music",
        "app.arena": "Arena",
        "app.edu": "Edu",
        "app.game": "Game",
        "action.save": "Save",
        "action.cancel": "Cancel",
        "action.close": "Close",
        "action.confirm": "Confirm",
        "action.back": "Back",
        "action.next": "Next",
        "action.copy": "Copy",
        "action.copied": "Copied!",
        "action.search": "Search...",
        "action.loading": "Loading...",
        "action.delete": "Delete",
        "action.edit": "Edit",
        "action.add": "Add",
        "action.refresh": "Reload",
        "action.reset": "Reset",
        "action.download": "Download",
        "action.upload": "Upload",
        "action.fullscreen": "Fullscreen",
        "action.continue": "Continue",
        "action.view": "View",
        "action.detail": "Details",
        "action.filter": "Filter",
        "action.select_all": "Select All",
        "action.share": "Share",
        "portal.hero_title": "Miyazaki Haruto Entertainment Universe",
        "portal.hero_desc": "Digital Entertainment Multiverse",
        "portal.cinema_desc": "High quality Anime, Series & Movies with Multi-fansub ecosystem.",
        "portal.manga_desc": "Ultra-smooth vertical scrolling comic library. (Coming soon...)",
        "portal.novel_desc": "Minimalist, eye-friendly light novel reading space. (Coming soon...)",
        "portal.music_desc": "Chill streaming station for Anisong, OST and Drama CDs. (Coming soon...)",
        "portal.arena_desc": "Interactive quiz arena, entertainment, events & engaging minigames.",
        "portal.edu_desc": "Interactive learning platform, skills & knowledge development.",
        "portal.game_desc": "Real-time multiplayer e-Sports & mini-games ecosystem.",
        "edu.home": "Home",
        "edu.tools": "Tools Hub",
        "edu.hero_title": "MHEnt. Education",
        "edu.hero_subtitle": "Interactive Teaching & Learning Hub",
        "edu.bingo_card_title": "Bingo Party",
        "edu.bingo_card_desc": "Random word draw, suspenseful audio, projection screen, and auto printable sheets.",
        "edu.vocab_card_title": "Vocabulary Arena",
        "edu.baam_card_title": "Lucky Mystery Box",
        "edu.spin_card_title": "Wheel of Fortune",
        "edu.tug_card_title": "Vocabulary Tug of War",
        "edu.bomb_card_title": "Time Bomb",
        "edu.blast_card_title": "Blast Block",
        "edu.racing_card_title": "Flashcard Racing",
        "edu.unscram_card_title": "Word Tornado",
        "admin.cloud_title": "Cloud Management (MHEnt. Database)",
        "admin.cloud_reload": "Reload",
        "admin.cloud_placeholder": "-- Select Saved Lesson --",
        "admin.cloud_create": "Create on Cloud",
        "admin.cloud_save_changes": "Save Changes",
        "admin.cloud_delete": "Delete from Cloud",
        "admin.cloud_get_link": "Get Game Link",
        "admin.open_presenter": "OPEN STUDENT PRESENTATION SCREEN",
        "admin.open_bingo_screen": "OPEN BINGO PRESENTATION SCREEN (PROJECTOR)",
        "admin.tab_table": "Table Input",
        "admin.tab_excel": "Paste from Excel",
        "admin.col_word": "Vocabulary",
        "admin.col_meaning": "Meaning",
        "admin.add_word_row": "Add New Word",
        "admin.save_and_open": "SAVE LIST & OPEN BINGO SCREEN NOW",
        "admin.auth_checking": "CHECKING TEACHER PERMISSIONS...",
        "teach.waiting_teacher": "Waiting for connection from Teacher Computer...",
        "teach.find_word_meaning": "FIND THE WORD THAT MEANS",
        "teach.normal_mode": "NORMAL MODE",
        "teach.fog_toggle": "Toggle Fog",
        "teach.next_word": "Next",
        "teach.waiting_question": "Waiting for teacher to select a question...",
        "bingo.title": "Bingo Master",
        "bingo.subtitle": "Classroom Edition",
        "bingo.called": "Called:",
        "bingo.remain": "Remaining:",
        "bingo.btn_draw": "Draw Next Word",
        "bingo.btn_bingo": "Bingo Alert!",
        "bingo.recent_calls": "5 Most Recent Words:",
        "bingo.no_calls": "No words called yet...",
        "bingo.radar_title": "Word Radar Board",
        "bingo.ready_title": "READY! 🎲",
        "bingo.ready_desc": "Press Draw Next Word or Spacebar to begin",
        "bingo.replay_speech": "Replay Audio",
        "bingo.print_sheets": "Print Bingo Sheets",
        "bingo.mode_suspense": "Suspense Mode",
        "bingo.hint_draw": "Draw Word",
        "bingo.hint_bingo": "Bingo Alert",
        "bingo.hint_replay": "Replay",
        "bingo.hint_fullscreen": "Fullscreen",
        "bingo.hint_reset": "Reset",
        "bingo.settings_title": "Vocabulary List Settings",
        "bingo.cloud_load_title": "Load Lesson from Cloud (MHEnt Cloud ID):",
        "bingo.cloud_input_placeholder": "Paste Cloud ID or link containing ?id=...",
        "bingo.cloud_fetch_btn": "Fetch Lesson",
        "bingo.presets_title": "Quick Lesson Presets:",
        "bingo.preset_verbs": "🏃 25 Common Verbs",
        "bingo.preset_adjectives": "✨ 25 Descriptive Adjectives",
        "bingo.preset_classroom": "🏫 25 Classroom & School Items",
        "bingo.input_label": "Vocabulary List (One word per line, optional meaning: Word | Meaning):",
        "bingo.roll_time_title": "Suspense Roll Duration",
        "bingo.roll_fast": "⚡ Fast (1.8s)",
        "bingo.roll_standard": "🎯 Standard Suspense (3.0s)",
        "bingo.roll_intense": "🔥 Intense (4.5s)",
        "bingo.mystery_title": "Surprise Mystery Event",
        "bingo.mystery_checkbox": "Enable Lucky Events (10%)",
        "bingo.save_and_start": "Save & Start New Game",
        "bingo.win_title": "BINGO! VICTORY!",
        "bingo.win_subtitle": "Congratulations to the student who completed the first Bingo line! 🌟",
        "bingo.verify_title": "Verify 5 words on student's sheet:",
        "bingo.verify_prompt": "Select 5 words to check",
        "bingo.verify_search": "Type student's word to verify...",
        "bingo.confetti_more": "Fire More Confetti!",
        "bingo.continue_game": "Continue Game",
        "bingo.print_modal_title": "Create Printable Bingo Sheets",
        "bingo.print_modal_desc": "Professional 5x5 (25 cells) sheets with center ⭐ FREE STAR ready to print.",
        "bingo.print_blank_btn": "📝 Blank Sheet (Students fill in)",
        "bingo.print_random_btn": "🎲 Shuffled Sheet (Auto-filled)",
        "bingo.print_do_print": "Open Print Dialog",
        "tools.title": "MHEnt. Gateway & Smart Links",
        "tools.shorten_input_placeholder": "Paste any link here... (https://...)",
        "tools.btn_quick_redirect": "Quick Redirect",
        "tools.btn_smart_schedule": "Smart Schedule",
        "tools.btn_lock_id": "Lock MHEnt ID",
        "tools.label_slug": "Slug identifier (optional):",
        "tools.label_title": "Title name (optional):",
        "tools.label_btn_text": "Button label (optional):",
        "tools.btn_create": "Create Shortened Link Now",
        "tools.stat_total_links": "TOTAL LINKS",
        "tools.stat_open_free": "OPEN FREE",
        "tools.stat_locked_id": "LOCKED MHENT ID",
        "tools.stat_total_clicks": "TOTAL CLICKS",
        "tools.list_title": "Created Links List",
        "cinema.watch_title": "MHEnt Cinema",
        "cinema.search_placeholder": "Search anime, movie, OVA...",
        "cinema.latest_episodes": "Latest Episodes",
        "cinema.trending": "Trending Now",
        "cinema.episodes_list": "Episodes List",
        "cinema.server_select": "Select Server",
        "cinema.room_party": "Watch Party Room",
        "cinema.cinema_mode": "Cinema Mode",
        "arena.title": "MHEnt Arena",
        "arena.join_game": "Join Arena",
        "arena.enter_pin": "Enter PIN or Room ID...",
        "arena.leaderboard": "Leaderboard",
        "arena.question": "Question",
        "arena.time": "Time",
        "arena.score": "Score",
        "game.chess_title": "Chess - MHEnt",
        "game.xiangqi_title": "Xiangqi (Chinese Chess) - MHEnt",
        "game.new_game": "New Game",
        "game.undo": "Undo Move",
        "game.ai_level": "AI Level",
        "game.turn_white": "White's Turn",
        "game.turn_black": "Black's Turn",
        "game.turn_red": "Red's Turn",
        "game.checkmate": "Checkmate!",
        "auth.title": "MHEnt ID Sign In Portal",
        "auth.email_label": "Email Address:",
        "auth.password_label": "Password:",
        "auth.btn_google": "Sign in with Google",
        "auth.forgot_password": "Forgot password?",
        "profile.title": "MHEnt Account Profile",
        "profile.save_changes": "Update Information",
        "about.page_title": "About Us - MHEnt. Universe",
        "terms.page_title": "Terms of Service",
        "privacy.page_title": "Privacy Policy",
        "404.title": "404 - Page Not Found",
        "404.desc": "This universe does not exist or has moved elsewhere.",
        "404.back_btn": "Back to Main Hub",
        "footer.slogan": "Digital Entertainment & Art Creation Multiverse. Connecting anime, music, pop culture, and smart interactive education.",
        "footer.corp": "Operated by <strong>Miyazaki Haruto Entertainment Co., Ltd.</strong><br>A non-profit ecosystem serving academic and entertainment communities.",
        "footer.status": "MHEnt Cloud: All systems operational",
        "footer.ent_heading": "Entertainment Universe",
        "footer.study_heading": "Study Space",
        "footer.legal_heading": "System & Legal",
        "footer.terms": "Terms of Service",
        "footer.privacy": "Privacy Policy",
        "footer.about_report": "About Us & Bug Report",
        "footer.community": "MHEnt Universe Community",
        "footer.rights": "All rights reserved.",
        "cinema.hero_quote": "Miniature Cinematic Universe – Experience passionate translations from MHEnt. and beyond! 🎬",
        "cinema.explore_now": "Explore Now",
        "cinema.now_showing": "Now Showing",
        "cinema.continue_watching": "Continue Watching",
        "cinema.search_prompt": "What anime or movie are you looking for...",
        "cinema.list_nav": "Movie List",
        "cinema.watch_movie_btn": "▶ Watch Now",
        "cinema.library_nav": "Library",
        "cinema.tag_all": "All",
        "cinema.tag_magic": "Magic",
        "cinema.tag_action": "Action",
        "cinema.tag_slice_of_life": "Slice of Life",
        "cinema.tag_idol": "Idol",
        "cinema.tag_movie": "Movie",
        "cinema.tag_theatrical": "Theatrical Movie",
        "cinema.tag_comedy": "Comedy",
        "cinema.tag_school": "School",
        "cinema.no_results_title": "Oops, this anime/movie isn't showing yet... 🥲",
        "cinema.no_results_desc": "Try changing keywords or removing filters!",
        "cinema.gate_privilege": "MHENT MEMBER PRIVILEGE",
        "cinema.gate_title": "CINEMA TICKET GATE",
        "cinema.gate_desc": "Welcome to MHEnt. Cinema. A digital cinema complex exclusively for MHEnt Universe residents. Please present your MHEnt ID Membership Card to enjoy premium films!",
        "cinema.gate_show_ticket": "Present Member Card / Login",
        "cinema.gate_back_hub": "Back to MHEnt Hub",
        "cinema.gate_opening": "Opening the cinema gate...",
        "arena.nav_contests": "Contests List",
        "arena.hero_subtitle": "Online Quiz System – Fast, transparent & accurate!",
        "arena.hero_subtitle_dash": "Online Quiz System – Fast, transparent & accurate!",
        "arena.join_input_placeholder": "Enter contest code (e.g., HOITHIDOAN)",
        "arena.btn_join_action": "Join",
        "arena.open_contests_heading": "Open Contests",
        "arena.status_open": "Open",
        "arena.status_test": "Testing",
        "arena.status_closed": "Closed",
        "arena.unit_questions": "questions",
        "arena.unit_minutes": "mins",
        "arena.no_quizzes": "No contests are currently open. Please check back later!",
        "arena.server_error": "Server connection error! Please try again later.",
        "arena.error_no_code": "Please enter the contest code!",
        "arena.loading_vault": "Loading data from MHEnt Vault...",
        "aisa.tooltip_study": "🌸 Study with AISA!",
        "aisa.tooltip_workspace": "✨ AISA is on duty to support you!",
        "aisa.tooltip_cinema": "🎬 Watch movies with AISA!",
        "aisa.tooltip_arena": "⚡ Compete in AISA Arena!",
        "aisa.tooltip_game": "🎮 Play board games with AISA!",
        "aisa.tooltip_portal": "🪐 Chat with AISA Universe!",
        "aisa.input_placeholder": "Ask AISA anything...",
        "aisa.modal_title": "AISA Virtual Assistant",
        "toast.notice": "Notice",
        "toast.error": "Error",
        "toast.success": "Success",
        "toast.warning": "Warning",
        "toast.music_soon": "Music universe is under construction, please check back soon!",
        "toast.manga_soon": "Manga universe is under construction!",
        "toast.manga_soon_alt": "Manga universe is under construction, please check back soon!",
        "toast.novel_soon": "Novel universe is under construction!",
        "toast.novel_soon_alt": "Novel universe is under construction, please check back soon!",
        "toast.manga_studio_soon": "Manga Studio is coming soon!",
        "toast.novel_studio_soon": "Light Novel is coming soon!",
        "toast.music_studio_soon": "Music Studio is coming soon!",
        "ui.error_title": "Oops, an error occurred!",
        "ui.success_title": "Success!",
        "ui.btn_awesome": "Awesome",
        "tools.hero_subtitle": "Smart utility hub, optimizing workflows for the entire MHEnt ecosystem.",
        "tools.explore_btn": "Explore Tools",
        "tools.list_heading": "Tools List",
        "tools.forms_title": "Forms & Sheet (Forms & Spreadsheet)",
        "tools.forms_desc": "Create versatile forms, collect responses online, edit real-time on MHEnt Sheet, and export to Excel (.xlsx).",
        "tools.inventory_title": "Inventory (Stock & Warehouse Hub)",
        "tools.inventory_desc": "Manage warehouse stock, track quantities, auto-calculate revenue, and export reports.",
        "tools.checkin_title": "Check-in Hub (Attendance & Ticketing)",
        "tools.checkin_desc": "All-in-one check-in & ticketing: High-speed QR scanning, self-service Kiosk, Live QR screen, and E-Tickets.",
        "tools.gateway_title": "MHEnt Gateway (URL Shortener & Routing)",
        "tools.gateway_desc": "Protect Drive/resource links: Scheduled public access, MHEnt ID login lock, and real-time click tracking."
}
    };

    function normalizeText(str) {
        if (!str || typeof str !== 'string') return '';
        return str
            .replace(/<[^>]+>/g, '')
            .replace(/[\u2010-\u2015]/g, '-')
            .replace(/[\s\u00A0]+/g, ' ')
            .trim()
            .toLowerCase();
    }

    // Tạo bản đồ tra cứu ngược từ cụm từ Tiếng Việt -> Khóa (Reverse Lookup Map)
    const REVERSE_MAP = {};
    Object.entries(CORE_TRANSLATIONS.vi).forEach(([k, v]) => {
        if (typeof v === 'string') {
            const raw = v.replace(/<[^>]+>/g, '').trim().toLowerCase();
            const norm = normalizeText(v);
            if (raw && raw.length >= 2) REVERSE_MAP[raw] = k;
            if (norm && norm.length >= 2) REVERSE_MAP[norm] = k;

            // Bỏ emoji ở đầu hoặc cuối nếu có
            const noEmoji = norm.replace(/^[\p{Emoji}\s]+/gu, '').replace(/[\p{Emoji}\s]+$/gu, '').trim();
            if (noEmoji && noEmoji.length >= 2 && !REVERSE_MAP[noEmoji]) {
                REVERSE_MAP[noEmoji] = k;
            }
        }
    });

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
                box-sizing: border-box;
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
                text-decoration: none;
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

    function lookupKey(rawStr) {
        if (!rawStr || typeof rawStr !== 'string') return null;
        const raw = rawStr.trim().toLowerCase();
        if (REVERSE_MAP[raw]) return REVERSE_MAP[raw];
        const norm = normalizeText(rawStr);
        if (REVERSE_MAP[norm]) return REVERSE_MAP[norm];
        const noEmoji = norm.replace(/^[\p{Emoji}\s]+/gu, '').replace(/[\p{Emoji}\s]+$/gu, '').trim();
        if (REVERSE_MAP[noEmoji]) return REVERSE_MAP[noEmoji];
        return null;
    }

    // Auto-discover and tag common elements
    function autoDiscoverAndTag(root = document.body) {
        if (!root || !root.querySelectorAll) return;

        // 1. Inputs with placeholder
        root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            if (el.hasAttribute('data-i18n-placeholder')) return;
            const ph = el.getAttribute('placeholder');
            const key = lookupKey(ph);
            if (key) {
                el.setAttribute('data-i18n-placeholder', key);
            }
        });

        // 2. Elements with title
        root.querySelectorAll('[title]').forEach(el => {
            if (el.hasAttribute('data-i18n-title')) return;
            const tt = el.getAttribute('title');
            const key = lookupKey(tt);
            if (key) {
                el.setAttribute('data-i18n-title', key);
            }
        });

        // 3. Common UI text elements
        const candidates = root.querySelectorAll('a, button, span, h1, h2, h3, h4, h5, p, th, td, label, .nav-links li, .dropdown-item, .footer-nav-link, .app-name, .portal-title, .admin-menu-item, .stat-title, .page-title, .preset-pill, .badge, .btn-admin, .btn-login, .filter-btn, .quiz-status, .meta-item, .small-description, .watch-link, .cw-action, .cw-subtitle, .cw-tag, .feature-title, .feature-desc');
        
        candidates.forEach(el => {
            if (el.hasAttribute('data-i18n') || el.hasAttribute('data-i18n-skip')) return;

            // If it is a leaf element with only text
            if (el.childElementCount === 0) {
                const text = el.innerText.trim();
                const key = lookupKey(text);
                if (key) {
                    el.setAttribute('data-i18n-orig', text);
                    el.setAttribute('data-i18n', key);
                }
            } else {
                // If it has children (e.g. icon/SVG + text), inspect text nodes
                for (let i = 0; i < el.childNodes.length; i++) {
                    const node = el.childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.nodeValue.trim();
                        const key = lookupKey(text);
                        if (key && text.length >= 2) {
                            const span = document.createElement('span');
                            span.setAttribute('data-i18n', key);
                            span.setAttribute('data-i18n-orig', text);
                            span.innerText = text;
                            el.replaceChild(span, node);
                            break;
                        }
                    }
                }
            }
        });
    }

    // The MHEntI18n API Object
    const MHEntI18n = {
        currentLang: currentLang,
        supportedLangs: SUPPORTED_LANGS,
        langInfo: LANG_INFO,
        dict: CORE_TRANSLATIONS,
        reverseMap: REVERSE_MAP,

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

        translateText(rawText) {
            if (!rawText || typeof rawText !== 'string') return rawText;
            if (currentLang === 'vi') return rawText;
            const key = lookupKey(rawText);
            if (key) {
                const tr = this.t(key);
                if (tr && tr !== key) return tr;
            }
            return rawText;
        },

        addTranslations(lang, newDict) {
            if (!this.dict[lang]) this.dict[lang] = {};
            Object.assign(this.dict[lang], newDict);
            if (lang === currentLang) {
                this.translatePage();
            }
        },

        translatePage() {
            // First run auto-discover to tag untagged common phrases
            autoDiscoverAndTag();

            // Text nodes
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (currentLang === 'vi' && el.hasAttribute('data-i18n-orig')) {
                    el.innerText = el.getAttribute('data-i18n-orig');
                } else {
                    const translation = this.t(key);
                    if (translation && translation !== key) {
                        el.innerText = translation;
                    }
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
            const navRight = document.querySelector('.nav-right') || document.querySelector('.top-actions') || document.querySelector('.topbar .right-group') || document.querySelector('.topbar') || document.querySelector('.navbar');
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

    // Setup MutationObserver for dynamic modal content
    let observerTimeout = null;
    const observer = new MutationObserver(() => {
        if (observerTimeout) clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            if (MHEntI18n.getLang() !== 'vi') {
                MHEntI18n.translatePage();
            }
        }, 150);
    });

    function init() {
        MHEntI18n.mountNavbarSwitcher();
        MHEntI18n.translatePage();
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window, document);
