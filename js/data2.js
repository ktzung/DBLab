/* DBLab course data — phần 2: bài 7–12 */
(function () {
  "use strict";

  const L = window.DBLAB.lessons;

  L["group-by"] = {
    id: "group-by",
    module: "query",
    title: "GROUP BY và HAVING",
    shortTitle: "GROUP BY",
    subtitle: "GROUP BY gom các hàng có cùng giá trị thành một nhóm, rồi hàm tổng hợp tính trên từng nhóm. HAVING lọc nhóm sau khi đã tính, còn WHERE lọc hàng trước khi gom.",
    blurb: "Từ nhiều hàng thành một dòng thống kê đáng tin.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["GROUP BY", "HAVING", "COUNT", "AVG", "tổng hợp"],
    metrics: [
      { key: "nhom", label: "Số nhóm", tone: "blue" },
      { key: "ham", label: "Hàm dùng", tone: "violet" },
      { key: "loc", label: "Điều kiện nhóm", tone: "yellow" },
      { key: "dong", label: "Dòng kết quả", tone: "green" }
    ],
    nodes: [
      { id: "diem", type: "table", x: 50, y: 180, w: 190, h: 82, label: "diem", sub: "26 dòng" },
      { id: "where", type: "rule", x: 300, y: 70, w: 150, h: 60, label: "WHERE", sub: "lọc hàng" },
      { id: "group", type: "group", x: 300, y: 200, w: 150, h: 64, label: "GROUP BY", sub: "mamh" },
      { id: "agg", type: "query", x: 300, y: 320, w: 150, h: 60, label: "AVG, COUNT", sub: "tính mỗi nhóm" },
      { id: "having", type: "rule", x: 530, y: 200, w: 150, h: 60, label: "HAVING", sub: "COUNT ≥ 2" },
      { id: "result", type: "table", x: 730, y: 200, w: 140, h: 82, label: "Kết quả", sub: "6 môn" }
    ],
    edges: [
      { id: "d-w", from: "diem", to: "where", kind: "request", label: "hàng", bow: 12 },
      { id: "d-g", from: "diem", to: "group", kind: "data", label: "gom" },
      { id: "g-a", from: "group", to: "agg", kind: "data", label: "nhóm", bow: -10 },
      { id: "a-h", from: "agg", to: "having", kind: "response", label: "số liệu" },
      { id: "h-r", from: "having", to: "result", kind: "response", label: "giữ nhóm" }
    ],
    learn: [
      "Viết GROUP BY theo đúng cột phân nhóm.",
      "Dùng COUNT, SUM, AVG, MIN, MAX trên mỗi nhóm.",
      "Phân biệt WHERE (lọc hàng) và HAVING (lọc nhóm).",
      "Tránh chọn cột không nằm trong GROUP BY."
    ],
    steps: [
      {
        short: "Gom nhóm",
        type: "TỔNG QUAN",
        title: "Một dòng cho mỗi nhóm",
        body: "<code>GROUP BY mamh</code> gom 26 dòng điểm thành các nhóm theo môn. Kết quả chỉ còn một dòng mỗi môn — kèm các số liệu tổng hợp tính trong nhóm đó.",
        focus: ["diem", "group"],
        edges: ["d-g"],
        metrics: { nhom: "6", ham: "COUNT", loc: "Không", dong: "6" },
        changes: ["26 dòng gom thành 6 nhóm", "Mỗi nhóm đại diện một môn"],
        note: "Mọi cột trong SELECT phải nằm trong GROUP BY hoặc trong hàm tổng hợp. Nếu không, database không biết lấy giá trị nào."
      },
      {
        short: "Hàm tổng hợp",
        type: "KỸ THUẬT",
        title: "Tính trong từng nhóm",
        body: "<code>COUNT(*) AS so_sv, ROUND(AVG(diem),2) AS diem_tb</code> tính số dòng và điểm trung bình cho mỗi môn. Hàm tổng hợp nhận nhiều hàng, trả về một giá trị cho mỗi nhóm.",
        focus: ["agg", "group"],
        edges: ["g-a"],
        metrics: { nhom: "6", ham: "AVG, COUNT", loc: "Không", dong: "6" },
        changes: ["Mỗi nhóm có số sinh viên", "Mỗi nhóm có điểm trung bình"],
        note: "COUNT(*) đếm cả dòng có NULL; COUNT(cot) bỏ qua NULL. Chọn đúng hàm đếm là một kỹ năng riêng."
      },
      {
        short: "WHERE vs HAVING",
        type: "KỸ THUẬT",
        title: "Lọc trước hay lọc sau",
        body: "<code>WHERE hocky = 1</code> bỏ dòng trước khi gom; <code>HAVING COUNT(*) >= 2</code> bỏ nhóm sau khi gom. Dùng nhầm chỗ sẽ ra lỗi hoặc ra số liệu khác hẳn ý định.",
        focus: ["where", "having"],
        edges: ["d-w", "a-h"],
        metrics: { nhom: "6", ham: "COUNT", loc: "HAVING ≥ 2", dong: "5" },
        changes: ["WHERE chạy trước GROUP BY", "HAVING chạy sau khi tính"],
        note: "Quy tắc nhớ: điều kiện trên từng hàng → WHERE; điều kiện trên kết quả tổng hợp → HAVING."
      },
      {
        short: "Sắp nhóm",
        type: "KỸ THUẬT",
        title: "ORDER BY sau khi gom",
        body: "Sau GROUP BY, ORDER BY có thể dùng bí danh của cột tổng hợp: <code>ORDER BY diem_tb DESC</code>. Kết quả là bảng xếp hạng môn theo điểm trung bình, không phải theo từng sinh viên.",
        focus: ["result", "agg"],
        edges: ["h-r"],
        metrics: { nhom: "6", ham: "AVG", loc: "Không", dong: "6" },
        changes: ["Xếp hạng theo điểm trung bình", "Không cần lặp lại biểu thức"],
        note: "Đừng sắp xếp theo cột không có trong GROUP BY — kết quả không xác định giữa các database."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Gom đúng, lọc đúng chỗ",
        body: "GROUP BY tạo nhóm, hàm tổng hợp tính mỗi nhóm, HAVING lọc nhóm và ORDER BY sắp kết quả. Bốn bước này là nền của mọi báo cáo thống kê.",
        focus: "all",
        edges: "all",
        metrics: { nhom: "6", ham: "AVG, COUNT", loc: "HAVING", dong: "5" },
        changes: ["Báo cáo theo nhóm rõ ràng", "Số liệu không bị lẫn hàng"],
        note: "Tiếp theo: subquery — dùng kết quả của câu này làm đầu vào cho câu khác."
      }
    ]
  };

  L["subquery"] = {
    id: "subquery",
    module: "query",
    title: "Truy vấn con",
    shortTitle: "Subquery",
    subtitle: "Subquery là một câu SELECT lồng trong câu khác: có thể trả về một giá trị, một danh sách hoặc một bảng tạm. Nó giúp chia bài toán khó thành hai bước dễ kiểm chứng.",
    blurb: "Hỏi từng bước, ghép kết quả — thay vì một câu khổng lồ.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["subquery", "IN", "EXISTS", "derived table", "scalar"],
    metrics: [
      { key: "loai", label: "Kiểu trả về", tone: "blue" },
      { key: "tang", label: "Số tầng", tone: "violet" },
      { key: "chi", label: "Chạy bao lần", tone: "yellow" },
      { key: "doc", label: "Dễ đọc", tone: "green" }
    ],
    nodes: [
      { id: "outer", type: "query", x: 60, y: 190, w: 170, h: 66, label: "SELECT ngoài", sub: "sinhvien" },
      { id: "inner", type: "query", x: 330, y: 90, w: 190, h: 66, label: "SELECT trong", sub: "AVG(diem)" },
      { id: "table", type: "table", x: 330, y: 300, w: 190, h: 82, label: "diem", sub: "nguồn tính" },
      { id: "value", type: "key", x: 600, y: 90, w: 150, h: 60, label: "Một giá trị", sub: "6.42" },
      { id: "result", type: "table", x: 600, y: 250, w: 190, h: 82, label: "Kết quả", sub: "sinh viên giỏi" }
    ],
    edges: [
      { id: "o-i", from: "outer", to: "inner", kind: "request", label: "lồng", bow: 12 },
      { id: "i-t", from: "inner", to: "table", kind: "request", label: "đọc", bow: -12 },
      { id: "i-v", from: "inner", to: "value", kind: "response", label: "trả" },
      { id: "o-r", from: "outer", to: "result", kind: "response", label: "lọc" },
      { id: "v-o", from: "value", to: "outer", kind: "data", label: "so sánh", bow: -20 }
    ],
    learn: [
      "Phân biệt subquery vô hướng, danh sách và bảng tạm.",
      "Dùng IN, EXISTS và phép so sánh với subquery.",
      "Đặt subquery trong FROM như một bảng tạm.",
      "Biết khi nào nên viết JOIN thay cho subquery."
    ],
    steps: [
      {
        short: "Một giá trị",
        type: "TỔNG QUAN",
        title: "Subquery vô hướng",
        body: "<code>WHERE diem > (SELECT AVG(diem) FROM diem)</code> dùng một giá trị tính từ bảng điểm để lọc sinh viên. Subquery vô hướng phải trả về đúng một hàng, một cột.",
        focus: ["outer", "inner", "value"],
        edges: ["o-i", "i-v", "v-o"],
        metrics: { loai: "Một giá trị", tang: "2", chi: "Một lần", doc: "Tốt" },
        changes: ["Ngưỡng được tính từ dữ liệu", "Không cần nhập số tay"],
        note: "Nếu subquery vô hướng trả về nhiều hàng, database báo lỗi. Đây là lỗi hay gặp khi quên điều kiện."
      },
      {
        short: "Danh sách",
        type: "KỸ THUẬT",
        title: "IN và NOT IN",
        body: "<code>WHERE mamh IN (SELECT mamh FROM monhoc WHERE sotc >= 4)</code> lọc theo danh sách mã môn do câu trong trả về. Cẩn thận với NOT IN khi danh sách có NULL: kết quả có thể rỗng ngoài ý muốn.",
        focus: ["inner", "table"],
        edges: ["i-t"],
        metrics: { loai: "Danh sách", tang: "2", chi: "Một lần", doc: "Tốt" },
        changes: ["Lọc theo tập mã môn", "Danh sách sinh từ dữ liệu"],
        note: "NOT IN gặp NULL sẽ trả UNKNOWN cho mọi hàng, nên không hàng nào khớp. Dùng NOT EXISTS nếu dữ liệu có thể chứa NULL."
      },
      {
        short: "Tồn tại",
        type: "KỸ THUẬT",
        title: "EXISTS hỏi có hay không",
        body: "<code>WHERE EXISTS (SELECT 1 FROM diem d WHERE d.masv = s.masv)</code> kiểm tra mỗi sinh viên có ít nhất một dòng điểm. EXISTS dừng ngay khi tìm thấy, nên thường nhanh với dữ liệu lớn.",
        focus: ["outer", "inner"],
        edges: ["o-i", "i-t"],
        metrics: { loai: "Đúng/sai", tang: "2", chi: "Theo hàng", doc: "Trung bình" },
        changes: ["Lọc sinh viên đã có điểm", "Không cần DISTINCT"],
        note: "Subquery tương quan tham chiếu cột của câu ngoài, nên về lý thuyết chạy lại cho từng hàng. Hãy kiểm tra query plan khi dữ liệu lớn."
      },
      {
        short: "Bảng tạm",
        type: "KỸ THUẬT",
        title: "Subquery trong FROM",
        body: "<code>FROM (SELECT makhoa, COUNT(*) AS so_sv FROM sinhvien GROUP BY makhoa) t</code> tạo bảng tạm có bí danh. Bạn có thể tiếp tục JOIN hoặc lọc trên bảng tạm này như một bảng thật.",
        focus: ["inner", "result"],
        edges: ["o-r"],
        metrics: { loai: "Bảng tạm", tang: "2", chi: "Một lần", doc: "Trung bình" },
        changes: ["Tính trước rồi nối tiếp", "Bí danh là bắt buộc"],
        note: "Nếu bảng tạm quá lớn, hãy cân nhắc JOIN trực tiếp hoặc view — database có thể tối ưu tốt hơn."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Chia để trị",
        body: "Subquery cho phép tính một bước rồi dùng kết quả ở bước sau. Viết đúng kiểu trả về — giá trị, danh sách hay bảng — và kiểm tra NULL là đủ để tránh phần lớn bẫy.",
        focus: "all",
        edges: "all",
        metrics: { loai: "Đủ ba kiểu", tang: "2", chi: "Tùy kiểu", doc: "Tốt" },
        changes: ["Bài toán chia thành bước", "Dễ kiểm chứng từng phần"],
        note: "Tiếp theo: window function — tính xếp hạng mà không làm mất từng hàng."
      }
    ]
  };

  L["window"] = {
    id: "window",
    module: "query",
    title: "Hàm cửa sổ",
    shortTitle: "Window",
    subtitle: "Hàm cửa sổ tính trên một nhóm hàng nhưng vẫn giữ từng hàng trong kết quả. Đây là cách chuẩn để xếp hạng, tính lũy kế và so sánh với hàng trước mà không cần subquery lồng nhiều tầng.",
    blurb: "Xếp hạng và lũy kế mà không mất chi tiết.",
    duration: "15 phút",
    level: "Nâng cao",
    tags: ["window function", "ROW_NUMBER", "RANK", "OVER", "PARTITION BY"],
    metrics: [
      { key: "giu", label: "Giữ hàng", tone: "green" },
      { key: "chia", label: "PARTITION", tone: "blue" },
      { key: "xep", label: "Xếp hạng", tone: "violet" },
      { key: "luyke", label: "Lũy kế", tone: "yellow" }
    ],
    nodes: [
      { id: "diem", type: "table", x: 50, y: 190, w: 180, h: 82, label: "diem", sub: "26 hàng" },
      { id: "window", type: "window", x: 290, y: 200, w: 170, h: 66, label: "OVER", sub: "PARTITION BY mamh" },
      { id: "rank", type: "index", x: 290, y: 80, w: 150, h: 60, label: "RANK", sub: "theo diem" },
      { id: "sum", type: "group", x: 290, y: 320, w: 170, h: 60, label: "SUM lũy kế", sub: "ROWS trước" },
      { id: "result", type: "table", x: 540, y: 190, w: 260, h: 96, label: "Kết quả giữ 26 hàng", sub: "masv · mamh · diem · hang" }
    ],
    edges: [
      { id: "d-w", from: "diem", to: "window", kind: "data", label: "cửa sổ" },
      { id: "w-r", from: "window", to: "rank", kind: "request", label: "xếp", bow: 10 },
      { id: "w-s", from: "window", to: "sum", kind: "request", label: "cộng", bow: -10 },
      { id: "w-res", from: "window", to: "result", kind: "response", label: "thêm cột" }
    ],
    learn: [
      "Đọc cú pháp hàm cửa sổ OVER (PARTITION BY … ORDER BY …).",
      "Phân biệt ROW_NUMBER, RANK và DENSE_RANK.",
      "Tính tổng lũy kế bằng khung ROWS.",
      "Biết vì sao window không làm giảm số hàng."
    ],
    steps: [
      {
        short: "Khác GROUP BY",
        type: "TỔNG QUAN",
        title: "Tính mà không gom",
        body: "GROUP BY trả một dòng mỗi nhóm; window function trả đủ từng hàng và thêm cột tính toán. <code>RANK() OVER (PARTITION BY mamh ORDER BY diem DESC)</code> gắn thứ hạng cho mỗi dòng điểm.",
        focus: ["diem", "window", "result"],
        edges: ["d-w", "w-res"],
        metrics: { giu: "26 hàng", chia: "Theo môn", xep: "Có", luyke: "Không" },
        changes: ["Kết quả vẫn 26 hàng", "Thêm cột thứ hạng"],
        note: "Nếu chỉ cần một dòng mỗi nhóm, dùng GROUP BY. Nếu cần giữ chi tiết từng hàng, dùng window."
      },
      {
        short: "Xếp hạng",
        type: "KỸ THUẬT",
        title: "ROW_NUMBER và RANK",
        body: "<code>ROW_NUMBER()</code> luôn đánh số 1,2,3…; <code>RANK()</code> cho đồng hạng cùng số và nhảy cóc; <code>DENSE_RANK()</code> cho đồng hạng nhưng không nhảy. Chọn hàm theo cách bạn muốn xử lý hòa điểm.",
        focus: ["rank", "window"],
        edges: ["w-r"],
        metrics: { giu: "26 hàng", chia: "Theo môn", xep: "RANK", luyke: "Không" },
        changes: ["Điểm bằng nhau đồng hạng", "Thứ tự ổn định trong môn"],
        note: "Hòa điểm là chuyện thường. Hãy thêm khóa phụ trong ORDER BY (ví dụ masv) để kết quả tái lập được."
      },
      {
        short: "Chia vùng",
        type: "KỸ THUẬT",
        title: "PARTITION BY",
        body: "<code>PARTITION BY mamh</code> chia dữ liệu thành từng môn, xếp hạng lại từ 1 trong mỗi môn. Không có PARTITION BY, cả bảng là một cửa sổ và thứ hạng trải trên toàn trường.",
        focus: ["window"],
        edges: ["d-w", "w-r"],
        metrics: { giu: "26 hàng", chia: "6 môn", xep: "Theo môn", luyke: "Không" },
        changes: ["Mỗi môn có hạng 1 riêng", "Dễ tìm thủ khoa từng môn"],
        note: "PARTITION BY giống GROUP BY ở chỗ chia nhóm, nhưng khác ở chỗ không thu gọn hàng."
      },
      {
        short: "Lũy kế",
        type: "KỸ THUẬT",
        title: "Khung ROWS",
        body: "<code>SUM(diem) OVER (PARTITION BY masv ORDER BY hocky ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)</code> cộng dồn theo học kỳ. Khung xác định những hàng nào tham gia tính cho hàng hiện tại.",
        focus: ["sum", "window"],
        edges: ["w-s"],
        metrics: { giu: "26 hàng", chia: "Theo SV", xep: "Không", luyke: "Có" },
        changes: ["Mỗi hàng có tổng đến hiện tại", "Thấy tiến bộ theo học kỳ"],
        note: "Khung mặc định khi có ORDER BY là từ đầu đến hàng hiện tại. Muốn tổng toàn phần, bỏ ORDER BY hoặc khai báo khung rõ ràng."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Cửa sổ là ống kính",
        body: "Window function nhìn qua một cửa sổ quanh mỗi hàng: cùng môn, cùng sinh viên, hay vài hàng lân cận. Nó thay thế nhiều subquery rườm rà bằng một biểu thức dễ đọc.",
        focus: "all",
        edges: "all",
        metrics: { giu: "26 hàng", chia: "Theo môn", xep: "RANK", luyke: "Có" },
        changes: ["Xếp hạng và lũy kế trong một câu", "Giữ nguyên chi tiết"],
        note: "Tiếp theo: module Thiết kế — bắt đầu từ sơ đồ thực thể liên kết (ER)."
      }
    ]
  };

  L["er"] = {
    id: "er",
    module: "design",
    title: "Sơ đồ thực thể liên kết",
    shortTitle: "Sơ đồ ER",
    subtitle: "Sơ đồ ER mô tả thực thể, thuộc tính và quan hệ trước khi viết CREATE TABLE. Vẽ đúng bản số (1–1, 1–N, N–N) giúp bạn chọn khóa ngoại và bảng nối đúng ngay từ đầu.",
    blurb: "Vẽ nghiệp vụ trước khi viết DDL.",
    duration: "13 phút",
    level: "Trung cấp",
    tags: ["ER", "thực thể", "thuộc tính", "bản số", "quan hệ"],
    metrics: [
      { key: "thucthe", label: "Thực thể", tone: "blue" },
      { key: "thuoctinh", label: "Thuộc tính", tone: "violet" },
      { key: "quanhe", label: "Quan hệ", tone: "green" },
      { key: "banso", label: "Bản số", tone: "yellow" }
    ],
    nodes: [
      { id: "sv", type: "table", x: 60, y: 120, w: 180, h: 82, label: "SINHVIEN", sub: "masv, hoten" },
      { id: "khoa", type: "table", x: 60, y: 310, w: 180, h: 82, label: "KHOA", sub: "makhoa, tenkhoa" },
      { id: "thuoc", type: "type", x: 320, y: 60, w: 160, h: 62, label: "Thuộc tính", sub: "namsinh" },
      { id: "rel", type: "link", x: 320, y: 210, w: 170, h: 66, label: "thuộc", sub: "1 khoa — N sinh viên" },
      { id: "rule", type: "rule", x: 560, y: 210, w: 150, h: 62, label: "Bản số", sub: "1 : N" },
      { id: "schema", type: "table", x: 560, y: 340, w: 240, h: 80, label: "Lược đồ bảng", sub: "sinhvien(makhoa FK)" }
    ],
    edges: [
      { id: "sv-thuoc", from: "sv", to: "thuoc", kind: "data", label: "có", bow: 12 },
      { id: "sv-rel", from: "sv", to: "rel", kind: "data", label: "tham gia" },
      { id: "k-rel", from: "khoa", to: "rel", kind: "data", label: "tham gia", bow: -12 },
      { id: "rel-rule", from: "rel", to: "rule", kind: "request", label: "xác định" },
      { id: "rel-schema", from: "rel", to: "schema", kind: "response", label: "sinh DDL" }
    ],
    learn: [
      "Xác định thực thể, thuộc tính và khóa của từng thực thể.",
      "Đọc và ghi bản số 1–1, 1–N, N–N.",
      "Chuyển quan hệ 1–N thành khóa ngoại.",
      "Nhận ra quan hệ N–N cần bảng nối."
    ],
    steps: [
      {
        short: "Thực thể",
        type: "TỔNG QUAN",
        title: "Danh từ quan trọng",
        body: "Trong câu “sinh viên thuộc khoa và đăng ký môn học”, ba danh từ là ba thực thể: SINHVIEN, KHOA, MONHOC. Mỗi thực thể có thuộc tính và một khóa định danh.",
        focus: ["sv", "khoa"],
        edges: ["sv-thuoc", "k-rel"],
        metrics: { thucthe: "3", thuoctinh: "12", quanhe: "2", banso: "Chưa vẽ" },
        changes: ["Liệt kê thực thể từ yêu cầu", "Mỗi thực thể có khóa"],
        note: "Đừng biến mọi danh từ thành bảng. “Địa chỉ” có thể là thuộc tính; “đơn hàng” thường là thực thể."
      },
      {
        short: "Thuộc tính",
        type: "KỸ THUẬT",
        title: "Cột thuộc về ai",
        body: "<code>hoten</code>, <code>namsinh</code> thuộc SINHVIEN; <code>tenkhoa</code> thuộc KHOA. Một thuộc tính chỉ nên thuộc đúng một thực thể — nếu nó phụ thuộc thực thể khác, hãy kiểm tra lại quan hệ.",
        focus: ["thuoc", "sv"],
        edges: ["sv-thuoc"],
        metrics: { thucthe: "3", thuoctinh: "12", quanhe: "2", banso: "Chưa vẽ" },
        changes: ["Thuộc tính gắn đúng thực thể", "Tránh trùng lặp dữ liệu"],
        note: "Thuộc tính đa trị như “danh sách môn” không thuộc mô hình quan hệ. Hãy tách thành quan hệ riêng."
      },
      {
        short: "Bản số",
        type: "KỸ THUẬT",
        title: "Một hay nhiều",
        body: "Một khoa có nhiều sinh viên, mỗi sinh viên thuộc một khoa: quan hệ 1–N. Một sinh viên học nhiều môn, mỗi môn có nhiều sinh viên: quan hệ N–N. Bản số quyết định cách hiện thực.",
        focus: ["rel", "rule"],
        edges: ["sv-rel", "k-rel", "rel-rule"],
        metrics: { thucthe: "3", thuoctinh: "12", quanhe: "2", banso: "1–N, N–N" },
        changes: ["Xác định bản số cho từng quan hệ", "Chuẩn bị chọn khóa ngoại"],
        note: "Đọc bản số theo cả hai chiều. Câu “một khoa có bao nhiêu sinh viên” và “một sinh viên thuộc mấy khoa” có thể khác nhau."
      },
      {
        short: "Sinh lược đồ",
        type: "KỸ THUẬT",
        title: "Từ hình vẽ ra bảng",
        body: "Quan hệ 1–N biến thành khóa ngoại ở phía N: <code>sinhvien(makhoa)</code>. Quan hệ N–N cần bảng nối riêng. Quan hệ 1–1 có thể gộp hoặc tách tùy tần suất truy cập.",
        focus: ["schema", "rel"],
        edges: ["rel-schema"],
        metrics: { thucthe: "3", thuoctinh: "12", quanhe: "2", banso: "1–N, N–N" },
        changes: ["Mỗi quan hệ có cách hiện thực", "Lược đồ khớp sơ đồ"],
        note: "Vẽ ER không phải thủ tục giấy tờ. Nó là bản nháp rẻ nhất để phát hiện quan hệ sai trước khi tạo bảng."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Hình vẽ dẫn đường",
        body: "Thực thể → thuộc tính → quan hệ → bản số → lược đồ. Đi đúng thứ tự này giúp bạn không phát minh bảng thừa và không bỏ sót khóa ngoại.",
        focus: "all",
        edges: "all",
        metrics: { thucthe: "3", thuoctinh: "12", quanhe: "2", banso: "Đủ" },
        changes: ["Sơ đồ ăn khớp lược đồ", "Sẵn sàng chuẩn hóa"],
        note: "Tiếp theo: chuẩn hóa — kiểm tra lược đồ vừa vẽ có bị trùng lặp hay không."
      }
    ]
  };

  L["chuan-hoa"] = {
    id: "chuan-hoa",
    module: "design",
    title: "Chuẩn hóa 1NF–3NF",
    shortTitle: "Chuẩn hóa",
    subtitle: "Chuẩn hóa là quá trình tách bảng để mỗi sự thật chỉ được lưu một lần. 1NF loại giá trị đa trị, 2NF loại phụ thuộc một phần, 3NF loại phụ thuộc bắc cầu.",
    blurb: "Một sự thật, một chỗ lưu — hết mâu thuẫn.",
    duration: "15 phút",
    level: "Trung cấp",
    tags: ["1NF", "2NF", "3NF", "phụ thuộc hàm", "trùng lặp"],
    metrics: [
      { key: "nf1", label: "1NF", tone: "blue" },
      { key: "nf2", label: "2NF", tone: "violet" },
      { key: "nf3", label: "3NF", tone: "green" },
      { key: "lap", label: "Dư thừa", tone: "coral" }
    ],
    nodes: [
      { id: "raw", type: "table", x: 50, y: 190, w: 210, h: 92, label: "Bảng thô", sub: "môn1, môn2 trong một ô" },
      { id: "nf1", type: "rule", x: 310, y: 90, w: 150, h: 60, label: "1NF", sub: "giá trị nguyên tử" },
      { id: "nf2", type: "rule", x: 310, y: 200, w: 150, h: 60, label: "2NF", sub: "không phụ thuộc một phần" },
      { id: "nf3", type: "rule", x: 310, y: 310, w: 150, h: 60, label: "3NF", sub: "không bắc cầu" },
      { id: "sv", type: "table", x: 540, y: 70, w: 160, h: 78, label: "sinhvien", sub: "thông tin cá nhân" },
      { id: "dk", type: "table", x: 540, y: 200, w: 160, h: 78, label: "dangky", sub: "masv, mamh" },
      { id: "mh", type: "table", x: 540, y: 330, w: 160, h: 78, label: "monhoc", sub: "tên môn, số TC" }
    ],
    edges: [
      { id: "raw-1", from: "raw", to: "nf1", kind: "request", label: "tách ô", bow: 10 },
      { id: "1-2", from: "nf1", to: "nf2", kind: "data", label: "tiếp" },
      { id: "2-3", from: "nf2", to: "nf3", kind: "data", label: "tiếp", bow: 10 },
      { id: "nf-1", from: "nf3", to: "sv", kind: "response", label: "tách", bow: -14 },
      { id: "nf-2", from: "nf3", to: "dk", kind: "response", label: "tách" },
      { id: "nf-3", from: "nf3", to: "mh", kind: "response", label: "tách", bow: 14 }
    ],
    learn: [
      "Nhận diện giá trị đa trị và sửa về 1NF.",
      "Phát hiện phụ thuộc hàm một phần (2NF).",
      "Phát hiện phụ thuộc bắc cầu (3NF).",
      "Cân bằng chuẩn hóa với nhu cầu đọc nhanh."
    ],
    steps: [
      {
        short: "Vì sao",
        type: "TỔNG QUAN",
        title: "Dư thừa sinh mâu thuẫn",
        body: "Nếu tên khoa được chép vào mọi hàng sinh viên, một lần đổi tên phải sửa nhiều nơi. Quên một chỗ là dữ liệu tự mâu thuẫn. Chuẩn hóa tách dữ liệu để mỗi sự thật chỉ có một chỗ lưu.",
        focus: ["raw"],
        edges: ["raw-1"],
        metrics: { nf1: "Chưa", nf2: "Chưa", nf3: "Chưa", lap: "Cao" },
        changes: ["Nhận ra dư thừa", "Đếm chỗ có thể lệch nhau"],
        note: "Chuẩn hóa không phải mục tiêu tối thượng. Nó là cách giảm rủi ro; đôi khi đọc nhanh cần chấp nhận dư thừa có kiểm soát."
      },
      {
        short: "1NF",
        type: "KỸ THUẬT",
        title: "Ô phải nguyên tử",
        body: "Một ô chứa “Toán, Lý” vi phạm 1NF. Hãy tách mỗi môn thành một hàng trong bảng đăng ký. Sau bước này, mỗi ô chỉ chứa một giá trị và mỗi hàng có khóa xác định.",
        focus: ["nf1", "raw"],
        edges: ["raw-1", "1-2"],
        metrics: { nf1: "Đạt", nf2: "Chưa", nf3: "Chưa", lap: "Cao" },
        changes: ["Không còn danh sách trong ô", "Có khóa cho từng hàng"],
        note: "1NF cũng yêu cầu không có cột lặp kiểu mon1, mon2, mon3. Số cột cố định luôn thiếu khi nghiệp vụ tăng."
      },
      {
        short: "2NF",
        type: "KỸ THUẬT",
        title: "Không phụ thuộc một phần",
        body: "Trong bảng đăng ký có khóa ghép (masv, mamh), cột <code>tenmh</code> chỉ phụ thuộc <code>mamh</code> — một phần của khóa. Đó là vi phạm 2NF; hãy đưa tên môn sang bảng MONHOC.",
        focus: ["nf2", "dk", "mh"],
        edges: ["2-3", "nf-3"],
        metrics: { nf1: "Đạt", nf2: "Đạt", nf3: "Chưa", lap: "Trung bình" },
        changes: ["Tên môn không lặp theo từng đăng ký", "Một môn sửa một chỗ"],
        note: "2NF chỉ có ý nghĩa khi khóa chính là khóa ghép. Với khóa đơn, một bảng đạt 1NF thường đã đạt 2NF."
      },
      {
        short: "3NF",
        type: "KỸ THUẬT",
        title: "Không phụ thuộc bắc cầu",
        body: "Nếu bảng sinh viên có <code>makhoa</code> và cả <code>tenkhoa</code>, thì tenkhoa phụ thuộc makhoa, makhoa phụ thuộc masv — một phụ thuộc bắc cầu. Tách KHOA ra để tên khoa chỉ lưu một lần.",
        focus: ["nf3", "sv"],
        edges: ["nf-1", "nf-2"],
        metrics: { nf1: "Đạt", nf2: "Đạt", nf3: "Đạt", lap: "Thấp" },
        changes: ["Tên khoa chỉ ở bảng khoa", "Sinh viên giữ mã khoa"],
        note: "3NF là mức thực dụng cho phần lớn ứng dụng nghiệp vụ: đủ sạch để tránh mâu thuẫn, vẫn dễ truy vấn."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Tách đúng chỗ, nối khi cần",
        body: "1NF làm ô nguyên tử, 2NF bỏ phụ thuộc một phần, 3NF bỏ phụ thuộc bắc cầu. Sau chuẩn hóa, JOIN là cái giá nhỏ để đổi lấy dữ liệu nhất quán.",
        focus: "all",
        edges: "all",
        metrics: { nf1: "Đạt", nf2: "Đạt", nf3: "Đạt", lap: "Thấp" },
        changes: ["Lược đồ sạch", "Sửa một chỗ, đúng mọi nơi"],
        note: "Tiếp theo: quan hệ N–N — vì sao bảng nối là bắt buộc, không phải tùy chọn."
      }
    ]
  };

  L["n-n"] = {
    id: "n-n",
    module: "design",
    title: "Quan hệ nhiều–nhiều",
    shortTitle: "Quan hệ N–N",
    subtitle: "Quan hệ N–N không thể biểu diễn bằng một khóa ngoại. Bạn cần bảng nối, thường mang khóa ghép của hai bên cộng thêm thuộc tính riêng của quan hệ như học kỳ hay điểm.",
    blurb: "Bảng nối: nơi quan hệ có thuộc tính riêng.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["N-N", "bảng nối", "khóa ghép", "thuộc tính quan hệ"],
    metrics: [
      { key: "ben", label: "Hai bên", tone: "blue" },
      { key: "noi", label: "Bảng nối", tone: "violet" },
      { key: "khoa", label: "Khóa ghép", tone: "yellow" },
      { key: "thuoctinh", label: "Thuộc tính riêng", tone: "green" }
    ],
    nodes: [
      { id: "sv", type: "table", x: 50, y: 90, w: 180, h: 80, label: "sinhvien", sub: "masv" },
      { id: "mh", type: "table", x: 50, y: 330, w: 180, h: 80, label: "monhoc", sub: "mamh" },
      { id: "bridge", type: "link", x: 320, y: 200, w: 190, h: 92, label: "dangky", sub: "masv + mamh + hocky" },
      { id: "attr", type: "key", x: 590, y: 90, w: 170, h: 62, label: "diem", sub: "thuộc quan hệ" },
      { id: "result", type: "table", x: 570, y: 300, w: 250, h: 86, label: "Bảng điểm", sub: "hoten · tenmh · diem" }
    ],
    edges: [
      { id: "sv-b", from: "sv", to: "bridge", kind: "data", label: "N" },
      { id: "mh-b", from: "mh", to: "bridge", kind: "data", label: "N", bow: 14 },
      { id: "b-attr", from: "bridge", to: "attr", kind: "request", label: "mang theo", bow: 10 },
      { id: "b-r", from: "bridge", to: "result", kind: "response", label: "nối 3 bảng" }
    ],
    learn: [
      "Nhận ra quan hệ N–N trong yêu cầu nghiệp vụ.",
      "Tạo bảng nối với khóa ghép hai bên.",
      "Đặt thuộc tính riêng của quan hệ vào bảng nối.",
      "Viết truy vấn ba bảng để lấy dữ liệu đầy đủ."
    ],
    steps: [
      {
        short: "Vì sao cần",
        type: "TỔNG QUAN",
        title: "Không nhét vừa một cột",
        body: "Một sinh viên học nhiều môn, một môn có nhiều sinh viên. Nếu thêm <code>mamh</code> vào bảng sinh viên, mỗi sinh viên chỉ học được một môn. Cần một bảng thứ ba để chứa từng cặp.",
        focus: ["sv", "mh", "bridge"],
        edges: ["sv-b", "mh-b"],
        metrics: { ben: "2", noi: "dangky", khoa: "masv + mamh", thuoctinh: "diem, hocky" },
        changes: ["Mỗi cặp là một hàng", "Sinh viên học nhiều môn"],
        note: "Bảng nối còn gọi là bảng kết hợp, bảng cầu. Tên nên phản ánh hành động: dangky, thamgia, muon."
      },
      {
        short: "Khóa ghép",
        type: "KỸ THUẬT",
        title: "Hai khóa ngoại làm khóa chính",
        body: "Bảng <code>dangky</code> có khóa chính (masv, mamh, hocky): hai khóa ngoại cộng học kỳ. Tổ hợp này duy nhất, còn từng cột thì lặp bình thường.",
        focus: ["bridge"],
        edges: ["sv-b", "mh-b"],
        metrics: { ben: "2", noi: "dangky", khoa: "Ghép 3 cột", thuoctinh: "diem" },
        changes: ["Không đăng ký trùng một môn trong kỳ", "Hai khóa ngoại được bảo vệ"],
        note: "Nếu nghiệp vụ cho phép học lại, học kỳ phải nằm trong khóa. Nếu không, bạn sẽ chặn nhầm lần học thứ hai."
      },
      {
        short: "Thuộc tính quan hệ",
        type: "KỸ THUẬT",
        title: "Điểm thuộc về cặp",
        body: "<code>diem</code> không thuộc sinh viên, cũng không thuộc môn — nó thuộc lần đăng ký. Đặt điểm trong bảng nối là cách mô hình hóa đúng bản chất của quan hệ.",
        focus: ["attr", "bridge"],
        edges: ["b-attr"],
        metrics: { ben: "2", noi: "dangky", khoa: "Ghép", thuoctinh: "diem" },
        changes: ["Điểm gắn với cặp SV–môn", "Không có cột điểm ở hai bảng chính"],
        note: "Câu hỏi kiểm tra: “Nếu xóa quan hệ này, thuộc tính có mất nghĩa không?” Nếu có, nó thuộc bảng nối."
      },
      {
        short: "Truy vấn",
        type: "KỸ THUẬT",
        title: "Nối ba bảng",
        body: "Để in bảng điểm có tên người và tên môn, nối <code>dangky</code> với <code>sinhvien</code> và <code>monhoc</code>. Bảng nối là cầu, không phải bảng thừa.",
        focus: ["result", "bridge"],
        edges: ["b-r"],
        metrics: { ben: "3 bảng", noi: "dangky", khoa: "Ghép", thuoctinh: "diem" },
        changes: ["Kết quả đầy đủ tên và điểm", "JOIN qua bảng nối"],
        note: "Nếu thấy mình viết JOIN qua bảng nối quá thường xuyên, có thể cân nhắc view để gói lại truy vấn."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Bảng nối là công dân hạng nhất",
        body: "Quan hệ N–N cần bảng nối có khóa ghép và có thể có thuộc tính riêng. Đừng tránh nó bằng cột danh sách — bạn sẽ mất khả năng ràng buộc và truy vấn.",
        focus: "all",
        edges: "all",
        metrics: { ben: "2", noi: "dangky", khoa: "Ghép", thuoctinh: "diem" },
        changes: ["Mô hình đúng nghiệp vụ", "Sẵn sàng mở rộng"],
        note: "Tiếp theo: khóa tự nhiên và khóa thay thế — chọn gì cho bảng nối và bảng nghiệp vụ."
      }
    ]
  };
})();
