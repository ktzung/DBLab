/* DBLab course data — phần 1: module 01 và mở đầu module 02 */
window.DBLAB = (function () {
  "use strict";

  const modules = [
    {
      id: "foundation",
      num: "01",
      title: "Nền tảng",
      tone: "blue",
      blurb: "Nhìn một cơ sở dữ liệu như các bảng có khóa, hàng và ràng buộc — trước khi viết truy vấn đầu tiên.",
      lessons: ["bang-hang-cot", "khoa-chinh", "khoa-ngoai", "null-rang-buoc"]
    },
    {
      id: "query",
      num: "02",
      title: "Truy vấn",
      tone: "violet",
      blurb: "Hỏi dữ liệu đúng câu: lọc, nối, gom nhóm và xếp hạng mà không kéo cả bảng về máy.",
      lessons: ["select-where", "join", "group-by", "subquery", "window"]
    },
    {
      id: "design",
      num: "03",
      title: "Thiết kế",
      tone: "mint",
      blurb: "Từ yêu cầu nghiệp vụ đến lược đồ không trùng lặp, không mâu thuẫn và dễ mở rộng.",
      lessons: ["er", "chuan-hoa", "n-n", "khoa-tu-nhien"]
    },
    {
      id: "operation",
      num: "04",
      title: "Vận hành",
      tone: "coral",
      blurb: "Giữ dữ liệu nhanh, đúng và sống sót khi có sự cố: index, giao dịch, phân quyền và sao lưu.",
      lessons: ["index", "transaction", "isolation", "query-plan", "backup-quyen"]
    }
  ];

  const lessons = {
    "bang-hang-cot": {
      id: "bang-hang-cot",
      module: "foundation",
      title: "Bảng, hàng, cột",
      shortTitle: "Bảng & hàng",
      subtitle: "Cơ sở dữ liệu quan hệ lưu dữ liệu thành bảng: mỗi cột là một thuộc tính, mỗi hàng là một thực thể, mỗi ô là một giá trị. Hiểu đúng ba khái niệm này là nền của mọi câu SQL.",
      blurb: "Đơn vị nhỏ nhất của dữ liệu quan hệ, nhìn bằng mắt.",
      duration: "9 phút",
      level: "Nhập môn",
      tags: ["bảng", "hàng", "cột", "quan hệ"],
      metrics: [
        { key: "bang", label: "Số bảng", tone: "blue" },
        { key: "hang", label: "Số hàng", tone: "green" },
        { key: "cot", label: "Số cột", tone: "violet" },
        { key: "o", label: "Ô dữ liệu", tone: "yellow" }
      ],
      nodes: [
        { id: "table", type: "table", x: 60, y: 200, w: 190, h: 82, label: "Bảng sinhvien", sub: "6 cột · 12 hàng" },
        { id: "row", type: "row", x: 330, y: 70, w: 160, h: 64, label: "Một hàng", sub: "SV01, Nguyễn Văn An…" },
        { id: "col", type: "type", x: 330, y: 200, w: 160, h: 64, label: "Một cột", sub: "hoten kiểu TEXT" },
        { id: "cell", type: "key", x: 330, y: 330, w: 160, h: 64, label: "Một ô", sub: "giá trị cụ thể" },
        { id: "query", type: "query", x: 590, y: 200, w: 190, h: 64, label: "SELECT", sub: "chọn cột và hàng" },
        { id: "result", type: "table", x: 590, y: 330, w: 190, h: 64, label: "Kết quả", sub: "bảng tạm trả về" }
      ],
      edges: [
        { id: "t-row", from: "table", to: "row", kind: "data", label: "chứa", bow: 14 },
        { id: "t-col", from: "table", to: "col", kind: "data", label: "định nghĩa" },
        { id: "t-cell", from: "table", to: "cell", kind: "data", label: "giao", bow: -14 },
        { id: "q-table", from: "query", to: "table", kind: "request", label: "đọc" },
        { id: "q-result", from: "query", to: "result", kind: "response", label: "trả về" }
      ],
      learn: [
        "Phân biệt bảng, hàng, cột và ô dữ liệu.",
        "Giải thích vì sao mỗi hàng cần một định danh duy nhất.",
        "Đọc được lược đồ đơn giản: tên cột, kiểu dữ liệu, khóa.",
        "Viết câu SELECT đầu tiên để xem dữ liệu."
      ],
      steps: [
        {
          short: "Mô hình",
          type: "TỔNG QUAN",
          title: "Dữ liệu thành bảng",
          body: "Một bảng là tập hợp các hàng cùng cấu trúc. Mỗi <strong>cột</strong> mô tả một thuộc tính và có kiểu dữ liệu; mỗi <strong>hàng</strong> là một thực thể cụ thể; giao của hàng và cột là một <strong>ô</strong> chứa giá trị.",
          focus: ["table"],
          edges: ["t-row", "t-col"],
          metrics: { bang: "1", hang: "12", cot: "6", o: "72" },
          changes: ["Một bảng 12 hàng, 6 cột", "Mỗi hàng là một sinh viên"],
          note: "Bảng không có thứ tự hàng. Nếu cần thứ tự hiển thị, hãy dùng ORDER BY thay vì tin vào cảm giác."
        },
        {
          short: "Hàng",
          type: "KỸ THUẬT",
          title: "Mỗi hàng là một thực thể",
          body: "Hàng <code>SV01 · Nguyễn Văn An · CNTT · 2005</code> mô tả đúng một sinh viên. Nếu lưu hai hàng cho cùng một sinh viên, bạn không còn biết hàng nào là sự thật — vì vậy mỗi bảng cần <strong>khóa chính</strong>.",
          focus: ["table", "row"],
          edges: ["t-row"],
          metrics: { bang: "1", hang: "12", cot: "6", o: "72" },
          changes: ["Hàng gắn với một mã sinh viên", "Khóa chính chuẩn bị xuất hiện"],
          note: "Tên cột nên là danh từ số ít, viết thường, không dấu cách: hoten, namsinh, makhoa."
        },
        {
          short: "Cột",
          type: "KỸ THUẬT",
          title: "Cột quy định kiểu dữ liệu",
          body: "Cột <code>namsinh</code> nên là INTEGER, còn <code>hoten</code> là TEXT. Kiểu dữ liệu giúp database từ chối dữ liệu vô nghĩa ngay khi ghi, thay vì để lỗi xuất hiện lúc báo cáo.",
          focus: ["col"],
          edges: ["t-col"],
          metrics: { bang: "1", hang: "12", cot: "6", o: "72" },
          changes: ["Cột có kiểu dữ liệu", "Ô chỉ chứa giá trị hợp lệ"],
          note: "Đừng lưu mọi thứ dưới dạng chuỗi. Ngày cho kiểu ngày, tiền cho kiểu số chính xác, cờ đúng/sai cho kiểu logic."
        },
        {
          short: "Ô dữ liệu",
          type: "KỸ THUẬT",
          title: "Ô là nơi dữ liệu sống",
          body: "Mỗi ô chứa một giá trị nguyên tử: không danh sách, không nhiều ý nghĩa nhồi vào một chuỗi. Nếu một ô cần chứa nhiều giá trị, đó là dấu hiệu bạn nên tách bảng.",
          focus: ["cell"],
          edges: ["t-cell"],
          metrics: { bang: "1", hang: "12", cot: "6", o: "72" },
          changes: ["Giá trị nằm ở giao hàng × cột", "NULL nghĩa là chưa có giá trị"],
          note: "Ô chứa “CNTT, KT” là một mùi thiết kế: lọc theo khoa sẽ khó và dễ sai. Hãy tách thành quan hệ riêng."
        },
        {
          short: "Truy vấn",
          type: "TÓM TẮT",
          tone: "final",
          title: "SELECT trả về một bảng mới",
          body: "Câu <code>SELECT hoten, namsinh FROM sinhvien</code> đọc bảng và trả về một bảng kết quả. Bảng gốc không đổi; bạn chỉ đang hỏi một góc nhìn khác của dữ liệu.",
          focus: "all",
          edges: "all",
          metrics: { bang: "1", hang: "12", cot: "2", o: "24" },
          changes: ["Chọn 2 cột thay vì 6", "Kết quả vẫn 12 hàng"],
          note: "Tiếp theo: khóa chính là thứ giữ cho mỗi hàng đại diện cho đúng một thực thể."
        }
      ]
    },

    "khoa-chinh": {
      id: "khoa-chinh",
      module: "foundation",
      title: "Khóa chính",
      shortTitle: "Khóa chính",
      subtitle: "Khóa chính là một cột (hoặc nhóm cột) định danh duy nhất mỗi hàng. Không có khóa chính, bạn không thể chắc một bản ghi là ai, và mọi cập nhật đều có nguy cơ chạm nhầm.",
      blurb: "Một hàng, một định danh — không trùng, không NULL.",
      duration: "10 phút",
      level: "Nhập môn",
      tags: ["primary key", "unique", "identity", "surrogate"],
      metrics: [
        { key: "duynhat", label: "Duy nhất", tone: "green" },
        { key: "null", label: "Cho NULL", tone: "coral" },
        { key: "doisong", label: "Đổi được", tone: "yellow" },
        { key: "index", label: "Index kèm", tone: "violet" }
      ],
      nodes: [
        { id: "table", type: "table", x: 60, y: 200, w: 200, h: 84, label: "Bảng sinhvien", sub: "masv · hoten · makhoa" },
        { id: "pk", type: "key", x: 330, y: 200, w: 160, h: 64, label: "PK masv", sub: "SV01, SV02…" },
        { id: "ok", type: "row", x: 560, y: 90, w: 170, h: 64, label: "SV01", sub: "hợp lệ" },
        { id: "dup", type: "row", x: 560, y: 310, w: 170, h: 64, label: "SV01 lần 2", sub: "bị từ chối" },
        { id: "q", type: "query", x: 770, y: 200, w: 100, h: 64, label: "Tra cứu", sub: "theo khóa" }
      ],
      edges: [
        { id: "t-pk", from: "table", to: "pk", kind: "data", label: "ràng buộc" },
        { id: "pk-ok", from: "pk", to: "ok", kind: "response", label: "nhận", bow: 12 },
        { id: "pk-dup", from: "pk", to: "dup", kind: "request", label: "từ chối", bow: -12 },
        { id: "pk-q", from: "pk", to: "q", kind: "request", label: "index" }
      ],
      learn: [
        "Giải thích vì sao khóa chính phải duy nhất và khác NULL.",
        "Phân biệt khóa tự nhiên và khóa thay thế.",
        "Chọn khóa chính không thay đổi theo nghiệp vụ.",
        "Hiểu index đi kèm khóa chính để tra cứu nhanh."
      ],
      steps: [
        {
          short: "Định danh",
          type: "TỔNG QUAN",
          title: "Một hàng, một mã",
          body: "Khóa chính (<code>PRIMARY KEY</code>) là cột định danh duy nhất. Trong bảng sinh viên, <code>masv</code> là lựa chọn tự nhiên: hai sinh viên không thể có cùng mã, và mã không được để trống.",
          focus: ["table", "pk"],
          edges: ["t-pk"],
          metrics: { duynhat: "Có", null: "Không", doisong: "Hiếm", index: "Tự động" },
          changes: ["masv trở thành khóa chính", "Mỗi hàng có định danh"],
          note: "Khóa chính không chỉ là quy ước. Database thực sự từ chối hàng trùng hoặc hàng có khóa NULL."
        },
        {
          short: "Duy nhất",
          type: "KỸ THUẬT",
          title: "Trùng khóa là lỗi",
          body: "Nếu chèn thêm một hàng có <code>masv = 'SV01'</code>, database báo lỗi vi phạm khóa chính. Nhờ vậy, mọi câu <code>WHERE masv = 'SV01'</code> chỉ trả về tối đa một hàng.",
          focus: ["pk", "ok", "dup"],
          edges: ["pk-ok", "pk-dup"],
          metrics: { duynhat: "Có", null: "Không", doisong: "Hiếm", index: "Tự động" },
          changes: ["Hàng thứ hai bị từ chối", "Tra cứu theo mã là chính xác"],
          note: "Nếu nghiệp vụ cho phép nhiều bản ghi trùng, bạn cần khóa ghép hoặc bảng trung gian — không được bỏ khóa chính."
        },
        {
          short: "Khóa ghép",
          type: "KỸ THUẬT",
          title: "Khi một cột chưa đủ",
          body: "Bảng điểm cần cả <code>masv</code>, <code>mamh</code> và <code>hocky</code> mới xác định một lượt học. Khóa chính ghép gồm ba cột; từng cột có thể lặp, nhưng tổ hợp thì không.",
          focus: ["pk", "table"],
          edges: ["t-pk"],
          metrics: { duynhat: "Theo tổ hợp", null: "Không", doisong: "Hiếm", index: "Tự động" },
          changes: ["Khóa gồm 3 cột", "Một sinh viên học lại vẫn hợp lệ"],
          note: "Khóa ghép thường xuất hiện ở bảng nối giữa hai thực thể. Thứ tự cột trong khóa ảnh hưởng tới cách đánh index."
        },
        {
          short: "Tự nhiên hay thay thế",
          type: "KỸ THUẬT",
          title: "Chọn mã ổn định",
          body: "Mã sinh viên, số căn cước hay email đều có thể đổi theo thời gian. Một khóa thay thế như <code>id</code> tự tăng hoặc UUID ổn định hơn, còn mã nghiệp vụ giữ vai trò cột UNIQUE.",
          focus: ["pk", "q"],
          edges: ["pk-q"],
          metrics: { duynhat: "Có", null: "Không", doisong: "Không", index: "Tự động" },
          changes: ["Khóa không mang ý nghĩa nghiệp vụ", "Mã nghiệp vụ vẫn được bảo vệ bằng UNIQUE"],
          note: "Đừng dùng email làm khóa chính. Người dùng đổi email; khóa ngoại ở mọi bảng khác sẽ phải sửa theo."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Khóa chính là hợp đồng",
          body: "Một khóa chính tốt có ba tính chất: duy nhất, không NULL và ít thay đổi. Nó biến “một hàng nào đó” thành “đúng thực thể này”, và tạo index để tra cứu nhanh.",
          focus: "all",
          edges: "all",
          metrics: { duynhat: "Có", null: "Không", doisong: "Không", index: "Tự động" },
          changes: ["Hợp đồng định danh rõ ràng", "Các bảng khác có thể tham chiếu"],
          note: "Tiếp theo: khóa ngoại dùng chính khóa chính của bảng khác để nối hai bảng lại."
        }
      ]
    },

    "khoa-ngoai": {
      id: "khoa-ngoai",
      module: "foundation",
      title: "Khóa ngoại",
      shortTitle: "Khóa ngoại",
      subtitle: "Khóa ngoại nối một hàng ở bảng con với một hàng tồn tại ở bảng cha. Nó là thứ giữ cho dữ liệu không rơi vào trạng thái “sinh viên thuộc một khoa không tồn tại”.",
      blurb: "Quan hệ 1–N được bảo vệ bằng ràng buộc, không bằng lời hứa.",
      duration: "11 phút",
      level: "Nhập môn",
      tags: ["foreign key", "1-N", "referential integrity", "cascade"],
      metrics: [
        { key: "cha", label: "Bảng cha", tone: "blue" },
        { key: "con", label: "Bảng con", tone: "green" },
        { key: "moi", label: "Giá trị mồ côi", tone: "coral" },
        { key: "xoa", label: "Khi xóa cha", tone: "yellow" }
      ],
      nodes: [
        { id: "khoa", type: "table", x: 60, y: 190, w: 190, h: 84, label: "khoa", sub: "makhoa · tenkhoa" },
        { id: "fk", type: "link", x: 320, y: 190, w: 150, h: 64, label: "FK makhoa", sub: "trỏ sang khoa" },
        { id: "sv", type: "table", x: 540, y: 190, w: 200, h: 84, label: "sinhvien", sub: "masv · hoten · makhoa" },
        { id: "orphan", type: "row", x: 540, y: 340, w: 200, h: 60, label: "makhoa = XX", sub: "không tồn tại" },
        { id: "rule", type: "rule", x: 800, y: 190, w: 80, h: 64, label: "Từ chối", sub: "khi chèn" }
      ],
      edges: [
        { id: "k-fk", from: "khoa", to: "fk", kind: "data", label: "được tham chiếu" },
        { id: "fk-sv", from: "fk", to: "sv", kind: "request", label: "ràng buộc" },
        { id: "sv-orphan", from: "sv", to: "orphan", kind: "response", label: "nếu thiếu", bow: 14 },
        { id: "sv-rule", from: "sv", to: "rule", kind: "request", label: "kiểm tra" }
      ],
      learn: [
        "Giải thích quan hệ 1–N bằng khóa ngoại.",
        "Biết database từ chối giá trị không tồn tại ở bảng cha.",
        "Chọn hành vi ON DELETE phù hợp.",
        "Nhận ra dữ liệu mồ côi và cách phòng tránh."
      ],
      steps: [
        {
          short: "Quan hệ",
          type: "TỔNG QUAN",
          title: "Con trỏ sang bảng cha",
          body: "Mỗi sinh viên thuộc một khoa. Thay vì chép tên khoa vào từng hàng, bảng <code>sinhvien</code> giữ <code>makhoa</code> — một khóa ngoại trỏ tới <code>khoa.makhoa</code>.",
          focus: ["khoa", "fk", "sv"],
          edges: ["k-fk", "fk-sv"],
          metrics: { cha: "khoa", con: "sinhvien", moi: "0", xoa: "Chặn" },
          changes: ["Tên khoa chỉ lưu một lần", "Sinh viên tham chiếu bằng mã"],
          note: "Quan hệ 1–N: một khoa có nhiều sinh viên, nhưng mỗi sinh viên chỉ thuộc một khoa."
        },
        {
          short: "Toàn vẹn",
          type: "KỸ THUẬT",
          title: "Không có khoa lạ",
          body: "Nếu chèn sinh viên với <code>makhoa = 'XX'</code> trong khi khoa XX không tồn tại, database từ chối. Đây là <strong>toàn vẹn tham chiếu</strong>: bảng con không được trỏ vào khoảng không.",
          focus: ["fk", "sv", "orphan"],
          edges: ["fk-sv", "sv-orphan"],
          metrics: { cha: "khoa", con: "sinhvien", moi: "Bị chặn", xoa: "Chặn" },
          changes: ["Dữ liệu mồ côi không thể xuất hiện", "JOIN luôn tìm thấy khoa"],
          note: "Không có khóa ngoại, lỗi chỉ lộ ra khi báo cáo: một nhóm sinh viên biến mất khỏi thống kê theo khoa."
        },
        {
          short: "Xóa cha",
          type: "KỸ THUẬT",
          title: "Xóa khoa thì sao?",
          body: "Mặc định, xóa một khoa còn sinh viên sẽ bị chặn. Bạn có thể chọn <code>ON DELETE CASCADE</code> để xóa dây chuyền, hoặc <code>SET NULL</code> nếu cột cho phép NULL. Mỗi lựa chọn là một quyết định nghiệp vụ.",
          focus: ["khoa", "rule"],
          edges: ["k-fk", "sv-rule"],
          metrics: { cha: "khoa", con: "sinhvien", moi: "Bị chặn", xoa: "Chọn chính sách" },
          changes: ["Xóa bị chặn hoặc lan truyền", "Cần thống nhất với nghiệp vụ"],
          note: "CASCADE tiện nhưng nguy hiểm: xóa một hàng có thể xóa hàng loạt dữ liệu liên quan. Hãy dùng khi thật sự muốn."
        },
        {
          short: "Nối bảng",
          type: "KỸ THUẬT",
          title: "JOIN nhờ khóa ngoại",
          body: "Khóa ngoại cho phép viết <code>JOIN khoa ON sinhvien.makhoa = khoa.makhoa</code>. Nhờ ràng buộc, mỗi sinh viên luôn có một khoa để nối — trừ khi bạn dùng LEFT JOIN để tìm dữ liệu thiếu.",
          focus: ["khoa", "sv", "fk"],
          edges: ["k-fk", "fk-sv"],
          metrics: { cha: "khoa", con: "sinhvien", moi: "0", xoa: "Chặn" },
          changes: ["JOIN đáng tin hơn", "LEFT JOIN phát hiện bất thường"],
          note: "Xem lại bài JOIN: INNER JOIN bỏ hàng không khớp, LEFT JOIN giữ lại để bạn thấy chỗ thiếu."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Ràng buộc thay cho niềm tin",
          body: "Khóa ngoại biến quan hệ nghiệp vụ thành ràng buộc máy kiểm tra được. Nó ngăn dữ liệu mồ côi, giữ JOIN chính xác và buộc bạn quyết định rõ khi xóa dữ liệu cha.",
          focus: "all",
          edges: "all",
          metrics: { cha: "khoa", con: "sinhvien", moi: "0", xoa: "Có chính sách" },
          changes: ["Quan hệ được bảo vệ", "Xóa dữ liệu có chủ đích"],
          note: "Tiếp theo: NULL và các ràng buộc còn lại — những chi tiết nhỏ quyết định dữ liệu có đáng tin."
        }
      ]
    },

    "null-rang-buoc": {
      id: "null-rang-buoc",
      module: "foundation",
      title: "NULL và ràng buộc",
      shortTitle: "NULL & ràng buộc",
      subtitle: "NULL không phải số 0 hay chuỗi rỗng: nó là “chưa biết”. Cùng với NOT NULL, UNIQUE, CHECK và DEFAULT, NULL giúp mô tả chính xác dữ liệu được phép thiếu.",
      blurb: "Ba giá trị logic và những ràng buộc giữ dữ liệu trung thực.",
      duration: "12 phút",
      level: "Trung cấp",
      tags: ["NULL", "NOT NULL", "UNIQUE", "CHECK", "DEFAULT"],
      metrics: [
        { key: "null", label: "NULL", tone: "coral" },
        { key: "notnull", label: "NOT NULL", tone: "green" },
        { key: "unique", label: "UNIQUE", tone: "violet" },
        { key: "check", label: "CHECK", tone: "yellow" }
      ],
      nodes: [
        { id: "table", type: "table", x: 60, y: 190, w: 190, h: 84, label: "sinhvien", sub: "email · namsinh" },
        { id: "notnull", type: "rule", x: 310, y: 60, w: 160, h: 62, label: "NOT NULL", sub: "hoten bắt buộc" },
        { id: "unique", type: "rule", x: 310, y: 190, w: 160, h: 62, label: "UNIQUE", sub: "email không trùng" },
        { id: "check", type: "rule", x: 310, y: 320, w: 160, h: 62, label: "CHECK", sub: "namsinh > 1990" },
        { id: "null", type: "type", x: 560, y: 190, w: 160, h: 64, label: "NULL", sub: "chưa biết" },
        { id: "insert", type: "row", x: 780, y: 190, w: 90, h: 64, label: "INSERT", sub: "kiểm tra" }
      ],
      edges: [
        { id: "t-nn", from: "table", to: "notnull", kind: "data", label: "bắt buộc", bow: 10 },
        { id: "t-uq", from: "table", to: "unique", kind: "data" },
        { id: "t-ck", from: "table", to: "check", kind: "data", label: "miền giá trị", bow: -10 },
        { id: "t-null", from: "table", to: "null", kind: "request", label: "cho phép" },
        { id: "null-ins", from: "null", to: "insert", kind: "request", label: "ba giá trị" }
      ],
      learn: [
        "Phân biệt NULL với 0 và chuỗi rỗng.",
        "Viết điều kiện IS NULL thay vì = NULL.",
        "Chọn ràng buộc NOT NULL, UNIQUE, CHECK, DEFAULT.",
        "Hiểu vì sao phép so sánh với NULL trả về UNKNOWN."
      ],
      steps: [
        {
          short: "NULL là gì",
          type: "TỔNG QUAN",
          title: "Chưa biết, không phải rỗng",
          body: "<code>email = NULL</code> nghĩa là chưa có email, không phải email rỗng. Số 0 và chuỗi <code>''</code> là giá trị thật; NULL là sự vắng mặt của thông tin. Vì vậy đừng dùng NULL để biểu diễn “không áp dụng” nếu bạn cần phân biệt.",
          focus: ["null", "table"],
          edges: ["t-null"],
          metrics: { null: "Chưa biết", notnull: "1 cột", unique: "1 cột", check: "1 cột" },
          changes: ["NULL khác 0 và khác ''", "Cột cần quyết định có cho NULL"],
          note: "Trong bảng mẫu, một sinh viên có email NULL. Đây là dữ liệu hợp lệ, không phải lỗi."
        },
        {
          short: "Ba giá trị",
          type: "KỸ THUẬT",
          title: "Đúng, sai và chưa biết",
          body: "So sánh với NULL cho ra <strong>UNKNOWN</strong>, không phải FALSE. Vì vậy <code>WHERE email = NULL</code> không bao giờ khớp; phải viết <code>WHERE email IS NULL</code>. AND/OR/NOT cũng tuân theo logic ba giá trị.",
          focus: ["null", "insert"],
          edges: ["null-ins"],
          metrics: { null: "UNKNOWN", notnull: "1 cột", unique: "1 cột", check: "1 cột" },
          changes: ["= NULL luôn không khớp", "IS NULL mới đúng ý định"],
          note: "Mẹo nhớ: NULL không bằng chính nó. Muốn hỏi “có giá trị chưa?”, dùng IS NULL / IS NOT NULL."
        },
        {
          short: "NOT NULL",
          type: "KỸ THUẬT",
          title: "Bắt buộc phải có",
          body: "Cột <code>hoten</code> và <code>masv</code> nên là NOT NULL. Ràng buộc này chặn dữ liệu thiếu ngay tại cửa vào, thay vì để báo cáo hiển thị những hàng trống tên.",
          focus: ["notnull", "table"],
          edges: ["t-nn"],
          metrics: { null: "Bị chặn", notnull: "hoten, masv", unique: "1 cột", check: "1 cột" },
          changes: ["Không thể chèn hàng thiếu tên", "Lỗi xuất hiện sớm"],
          note: "Chỉ cho NULL khi thật sự “chưa biết”. Nếu nghiệp vụ luôn cần giá trị, NOT NULL là tài liệu sống."
        },
        {
          short: "UNIQUE & CHECK",
          type: "KỸ THUẬT",
          title: "Không trùng và đúng miền",
          body: "<code>UNIQUE</code> bảo vệ email không bị hai người dùng; <code>CHECK</code> chặn năm sinh vô lý như 1800. Cả hai đều là ràng buộc khai báo, database tự kiểm tra ở mọi lần ghi.",
          focus: ["unique", "check"],
          edges: ["t-uq", "t-ck"],
          metrics: { null: "Bị chặn", notnull: "hoten, masv", unique: "email", check: "namsinh" },
          changes: ["Email là duy nhất", "Năm sinh nằm trong miền hợp lý"],
          note: "UNIQUE thường cho phép nhiều NULL (tùy database). Nếu cần “có thì phải duy nhất, không có thì thôi”, đó chính là hành vi mong muốn."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Ràng buộc là tài liệu",
          body: "Kiểu dữ liệu, NOT NULL, UNIQUE, CHECK và DEFAULT cùng mô tả dữ liệu hợp lệ. Chúng biến quy ước trong đầu lập trình viên thành thứ database cưỡng chế cho mọi ứng dụng.",
          focus: "all",
          edges: "all",
          metrics: { null: "Có kiểm soát", notnull: "3 cột", unique: "1 cột", check: "1 cột" },
          changes: ["Dữ liệu xấu bị chặn sớm", "Ít phải kiểm tra thủ công"],
          note: "Tiếp theo: module Truy vấn — bắt đầu từ SELECT và WHERE để hỏi đúng dữ liệu."
        }
      ]
    },

    "select-where": {
      id: "select-where",
      module: "query",
      title: "SELECT và WHERE",
      shortTitle: "SELECT & WHERE",
      subtitle: "SELECT chọn cột, WHERE chọn hàng, ORDER BY sắp xếp và LIMIT cắt bớt. Bốn mệnh đề này tạo nên phần lớn truy vấn đọc dữ liệu hằng ngày.",
      blurb: "Câu truy vấn đầu tiên: lấy đúng cột, đúng hàng, đúng thứ tự.",
      duration: "12 phút",
      level: "Nhập môn",
      tags: ["SELECT", "WHERE", "ORDER BY", "LIMIT", "DISTINCT"],
      metrics: [
        { key: "cot", label: "Cột trả về", tone: "blue" },
        { key: "hang", label: "Hàng khớp", tone: "green" },
        { key: "sapxep", label: "Sắp xếp", tone: "violet" },
        { key: "gioihan", label: "Giới hạn", tone: "yellow" }
      ],
      nodes: [
        { id: "table", type: "table", x: 60, y: 190, w: 200, h: 84, label: "sinhvien", sub: "12 hàng" },
        { id: "select", type: "query", x: 320, y: 80, w: 150, h: 62, label: "SELECT", sub: "chọn cột" },
        { id: "where", type: "rule", x: 320, y: 190, w: 150, h: 62, label: "WHERE", sub: "lọc hàng" },
        { id: "order", type: "index", x: 320, y: 300, w: 150, h: 62, label: "ORDER BY", sub: "sắp xếp" },
        { id: "result", type: "table", x: 560, y: 190, w: 190, h: 84, label: "Kết quả", sub: "5 hàng · 2 cột" }
      ],
      edges: [
        { id: "t-sel", from: "table", to: "select", kind: "data", label: "cột", bow: 12 },
        { id: "t-where", from: "table", to: "where", kind: "request", label: "hàng" },
        { id: "t-order", from: "table", to: "order", kind: "data", label: "khóa sắp", bow: -12 },
        { id: "sel-res", from: "select", to: "result", kind: "response", label: "chiếu" },
        { id: "where-res", from: "where", to: "result", kind: "response", label: "lọc" }
      ],
      learn: [
        "Viết SELECT với danh sách cột cụ thể.",
        "Lọc hàng bằng WHERE với AND, OR, LIKE, IN, BETWEEN.",
        "Sắp xếp bằng ORDER BY và giới hạn bằng LIMIT.",
        "Loại trùng bằng DISTINCT và hiểu cái giá của nó."
      ],
      steps: [
        {
          short: "Chọn cột",
          type: "TỔNG QUAN",
          title: "Đừng luôn SELECT *",
          body: "<code>SELECT hoten, namsinh FROM sinhvien</code> chỉ trả hai cột. Chọn cột cụ thể giúp giảm dữ liệu truyền đi, tránh phụ thuộc cấu trúc và làm rõ ý định của truy vấn.",
          focus: ["table", "select"],
          edges: ["t-sel"],
          metrics: { cot: "2", hang: "12", sapxep: "Không", gioihan: "Không" },
          changes: ["Chỉ lấy hoten, namsinh", "Bảng gốc không đổi"],
          note: "SELECT * tiện khi khám phá, nhưng trong code sản phẩm hãy liệt kê cột để ứng dụng không vỡ khi bảng thêm cột."
        },
        {
          short: "Lọc hàng",
          type: "KỸ THUẬT",
          title: "WHERE là bộ lọc",
          body: "<code>WHERE makhoa = 'CNTT' AND namsinh >= 2005</code> chỉ giữ hàng thỏa cả hai điều kiện. Dùng AND khi cần đồng thời, OR khi cần một trong hai, và đặt ngoặc khi trộn nhiều điều kiện.",
          focus: ["where", "table"],
          edges: ["t-where"],
          metrics: { cot: "2", hang: "4", sapxep: "Không", gioihan: "Không" },
          changes: ["12 hàng còn 4", "Điều kiện áp dụng trước khi trả về"],
          note: "WHERE chạy trên hàng, không trên nhóm. Điều kiện kiểu COUNT(*) > 2 phải đặt trong HAVING."
        },
        {
          short: "Mẫu và miền",
          type: "KỸ THUẬT",
          title: "LIKE, IN, BETWEEN",
          body: "<code>LIKE 'CS%'</code> tìm theo mẫu, <code>IN ('CNTT','KT')</code> kiểm tra thuộc danh sách, <code>BETWEEN 2004 AND 2006</code> kiểm tra miền. Ba công cụ này giúp câu lệnh ngắn và dễ đọc hơn chuỗi OR dài.",
          focus: ["where"],
          edges: ["t-where"],
          metrics: { cot: "2", hang: "6", sapxep: "Không", gioihan: "Không" },
          changes: ["Lọc theo mẫu hoặc danh sách", "Ít lỗi hơn chuỗi OR"],
          note: "LIKE với % ở đầu thường không dùng được index. Nếu tìm kiếm văn bản nhiều, hãy nghĩ tới full-text search."
        },
        {
          short: "Thứ tự & giới hạn",
          type: "KỸ THUẬT",
          title: "ORDER BY và LIMIT",
          body: "<code>ORDER BY namsinh DESC, hoten ASC</code> sắp nhiều khóa; <code>LIMIT 5</code> chỉ lấy 5 hàng đầu. Khi phân trang, luôn có ORDER BY ổn định — nếu không, các trang có thể lặp hoặc thiếu hàng.",
          focus: ["order", "result"],
          edges: ["t-order", "sel-res"],
          metrics: { cot: "2", hang: "5", sapxep: "2 khóa", gioihan: "5" },
          changes: ["Kết quả có thứ tự", "Chỉ lấy 5 hàng"],
          note: "LIMIT không có ORDER BY trả về “một nhóm hàng bất kỳ”. Đừng dùng nó để lấy “5 hàng mới nhất”."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Bốn mệnh đề, một thói quen",
          body: "Chọn cột bằng SELECT, lọc hàng bằng WHERE, sắp bằng ORDER BY và cắt bằng LIMIT. Viết rõ ràng từng phần sẽ dễ đọc, dễ kiểm thử và dễ tối ưu sau này.",
          focus: "all",
          edges: "all",
          metrics: { cot: "2", hang: "4", sapxep: "1 khóa", gioihan: "5" },
          changes: ["Truy vấn có chủ đích", "Kết quả ổn định để phân trang"],
          note: "Tiếp theo: JOIN — lấy dữ liệu từ nhiều bảng trong cùng một câu truy vấn."
        }
      ]
    },

    "join": {
      id: "join",
      module: "query",
      title: "JOIN hai bảng",
      shortTitle: "JOIN",
      subtitle: "JOIN ghép hàng của hai bảng theo điều kiện nối. INNER JOIN chỉ giữ cặp khớp; LEFT JOIN giữ cả hàng bên trái để bạn thấy dữ liệu thiếu.",
      blurb: "Nối bảng đúng khóa, hiểu rõ hàng nào bị bỏ.",
      duration: "13 phút",
      level: "Trung cấp",
      tags: ["INNER JOIN", "LEFT JOIN", "ON", "khóa ngoại"],
      metrics: [
        { key: "trai", label: "Bảng trái", tone: "blue" },
        { key: "phai", label: "Bảng phải", tone: "green" },
        { key: "khop", label: "Cặp khớp", tone: "violet" },
        { key: "bo", label: "Hàng bị bỏ", tone: "coral" }
      ],
      nodes: [
        { id: "sv", type: "table", x: 60, y: 120, w: 190, h: 82, label: "sinhvien", sub: "12 hàng" },
        { id: "diem", type: "table", x: 60, y: 300, w: 190, h: 82, label: "diem", sub: "26 hàng" },
        { id: "join", type: "join", x: 330, y: 210, w: 160, h: 64, label: "JOIN", sub: "ON masv" },
        { id: "result", type: "table", x: 570, y: 210, w: 220, h: 84, label: "Kết quả", sub: "hoten · mamh · diem" },
        { id: "missing", type: "row", x: 570, y: 360, w: 220, h: 60, label: "SV08 không điểm", sub: "LEFT JOIN giữ lại" }
      ],
      edges: [
        { id: "sv-join", from: "sv", to: "join", kind: "data", label: "trái" },
        { id: "diem-join", from: "diem", to: "join", kind: "data", label: "phải", bow: 12 },
        { id: "join-res", from: "join", to: "result", kind: "response", label: "ghép" },
        { id: "join-miss", from: "join", to: "missing", kind: "request", label: "NULL", bow: -12 }
      ],
      learn: [
        "Viết INNER JOIN với điều kiện ON đúng khóa.",
        "Dùng bí danh bảng để câu lệnh dễ đọc.",
        "Phân biệt INNER JOIN và LEFT JOIN qua số hàng.",
        "Phát hiện hàng không khớp bằng IS NULL."
      ],
      steps: [
        {
          short: "Vì sao",
          type: "TỔNG QUAN",
          title: "Dữ liệu nằm ở nhiều bảng",
          body: "Tên sinh viên ở <code>sinhvien</code>, điểm ở <code>diem</code>. Để in bảng điểm có tên, phải nối hai bảng theo <code>masv</code>. JOIN không chép dữ liệu; nó tạo kết quả tạm từ các hàng khớp.",
          focus: ["sv", "diem", "join"],
          edges: ["sv-join", "diem-join"],
          metrics: { trai: "12 hàng", phai: "26 hàng", khop: "26 cặp", bo: "0" },
          changes: ["Hai bảng được nối theo masv", "Kết quả có cột từ cả hai"],
          note: "Điều kiện nối nên dùng khóa ngoại. Nối bằng tên hoặc chuỗi tự do dễ tạo quan hệ sai và trùng."
        },
        {
          short: "INNER",
          type: "KỸ THUẬT",
          title: "Chỉ giữ cặp khớp",
          body: "<code>FROM diem d JOIN sinhvien s ON s.masv = d.masv</code> trả về mỗi dòng điểm kèm tên sinh viên. Sinh viên chưa có điểm biến mất khỏi kết quả — đó là hành vi đúng của INNER JOIN.",
          focus: ["join", "result"],
          edges: ["sv-join", "join-res"],
          metrics: { trai: "12 hàng", phai: "26 hàng", khop: "26 cặp", bo: "0 điểm" },
          changes: ["26 dòng điểm có tên", "Sinh viên chưa học không xuất hiện"],
          note: "Nếu vô tình nối sai khóa, số hàng có thể tăng vọt. Luôn kiểm tra số hàng trước và sau khi JOIN."
        },
        {
          short: "LEFT",
          type: "KỸ THUẬT",
          title: "Giữ cả hàng bên trái",
          body: "<code>FROM sinhvien s LEFT JOIN diem d ON s.masv = d.masv</code> giữ đủ 12 sinh viên. Ai chưa có điểm sẽ có các cột bên phải bằng NULL. Dùng <code>WHERE d.masv IS NULL</code> để tìm đúng nhóm này.",
          focus: ["sv", "missing"],
          edges: ["join-miss"],
          metrics: { trai: "12 hàng", phai: "26 hàng", khop: "26 cặp", bo: "1 sinh viên" },
          changes: ["Giữ SV08 dù không có điểm", "Cột điểm bằng NULL"],
          note: "LEFT JOIN là công cụ tìm “dữ liệu thiếu”: khách chưa mua, bài chưa nộp, đơn chưa thanh toán."
        },
        {
          short: "Nhiều bảng",
          type: "KỸ THUẬT",
          title: "Nối ba bảng",
          body: "Bảng điểm chỉ có mã môn; muốn tên môn phải nối thêm <code>monhoc</code>. Chuỗi JOIN <code>diem → sinhvien → monhoc</code> vẫn đọc được nếu đặt bí danh và xuống dòng theo từng bước nối.",
          focus: ["sv", "diem", "result"],
          edges: ["sv-join", "join-res"],
          metrics: { trai: "3 bảng", phai: "26 dòng", khop: "26 cặp", bo: "0" },
          changes: ["Kết quả có tên người và tên môn", "JOIN theo chuỗi khóa ngoại"],
          note: "Mỗi JOIN làm tăng chi phí. Hãy chọn đúng bảng cần, đừng nối mọi bảng “cho chắc”."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "JOIN là phép nhân có điều kiện",
          body: "JOIN ghép hàng theo điều kiện ON. INNER giữ cặp khớp, LEFT giữ cả bên trái. Hiểu rõ hàng nào bị bỏ là cách tránh những báo cáo thiếu dữ liệu mà không ai phát hiện.",
          focus: "all",
          edges: "all",
          metrics: { trai: "12 hàng", phai: "26 hàng", khop: "26 cặp", bo: "1 sinh viên" },
          changes: ["Chọn loại JOIN theo câu hỏi", "Kiểm tra số hàng sau nối"],
          note: "Tiếp theo: GROUP BY — gom nhiều hàng thành một dòng thống kê."
        }
      ]
    }
  };

  return { modules, lessons };
})();
