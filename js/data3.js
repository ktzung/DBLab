/* DBLab course data — phần 3: bài 13–18, luyện tập và cheatsheets */
(function () {
  "use strict";

  const DB = window.DBLAB;
  const L = DB.lessons;

  L["khoa-tu-nhien"] = {
    id: "khoa-tu-nhien",
    module: "design",
    title: "Khóa tự nhiên và thay thế",
    shortTitle: "Chọn khóa",
    subtitle: "Khóa tự nhiên lấy từ nghiệp vụ như mã sinh viên hay số căn cước; khóa thay thế là id kỹ thuật không đổi nghĩa. Bảng nối và bảng nghiệp vụ thường cần hai loại khóa cùng lúc.",
    blurb: "Khóa ổn định là món quà cho tương lai.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["surrogate key", "natural key", "UUID", "identity"],
    metrics: [
      { key: "onhdinh", label: "Ổn định", tone: "green" },
      { key: "ynghia", label: "Mang nghĩa", tone: "blue" },
      { key: "dodai", label: "Độ dài", tone: "violet" },
      { key: "unique", label: "UNIQUE", tone: "yellow" }
    ],
    nodes: [
      { id: "table", type: "table", x: 50, y: 190, w: 200, h: 92, label: "sinhvien", sub: "id · masv · email" },
      { id: "surrogate", type: "key", x: 300, y: 80, w: 170, h: 64, label: "id BIGINT", sub: "thay thế" },
      { id: "natural", type: "key", x: 300, y: 210, w: 170, h: 64, label: "masv", sub: "tự nhiên" },
      { id: "business", type: "rule", x: 300, y: 340, w: 170, h: 62, label: "UNIQUE email", sub: "ràng buộc nghiệp vụ" },
      { id: "fk", type: "link", x: 560, y: 210, w: 220, h: 70, label: "Bảng khác tham chiếu id", sub: "đổi email không ảnh hưởng" }
    ],
    edges: [
      { id: "t-s", from: "table", to: "surrogate", kind: "data", label: "PK", bow: 10 },
      { id: "t-n", from: "table", to: "natural", kind: "request", label: "mã nghiệp vụ" },
      { id: "t-b", from: "table", to: "business", kind: "request", label: "bảo vệ", bow: -10 },
      { id: "n-fk", from: "natural", to: "fk", kind: "data", label: "nếu dùng làm PK" },
      { id: "s-fk", from: "surrogate", to: "fk", kind: "response", label: "ổn định hơn", bow: -30 }
    ],
    learn: [
      "Phân biệt khóa tự nhiên và khóa thay thế.",
      "Đánh giá rủi ro khi khóa chính mang ý nghĩa nghiệp vụ.",
      "Dùng UNIQUE bảo vệ mã nghiệp vụ.",
      "Chọn BIGINT/UUID cho khóa kỹ thuật."
    ],
    steps: [
      {
        short: "Hai lựa chọn",
        type: "TỔNG QUAN",
        title: "Mã nghiệp vụ hay id kỹ thuật",
        body: "<code>masv</code> là khóa tự nhiên: nó có nghĩa với con người. <code>id</code> là khóa thay thế: chỉ máy dùng, không ai đọc. Cả hai đều duy nhất, nhưng chỉ một loại chịu được thay đổi nghiệp vụ.",
        focus: ["table", "surrogate", "natural"],
        edges: ["t-s", "t-n"],
        metrics: { onhdinh: "id", ynghia: "masv", dodai: "8 byte", unique: "Cả hai" },
        changes: ["Bảng có hai cột định danh", "Mỗi cột có vai trò riêng"],
        note: "Không cần chọn một trong hai. Nhiều hệ thống dùng id làm khóa chính và giữ mã nghiệp vụ với UNIQUE."
      },
      {
        short: "Rủi ro",
        type: "KỸ THUẬT",
        title: "Khi mã nghiệp vụ đổi",
        body: "Email, số điện thoại hay mã sinh viên đều có thể thay đổi. Nếu chúng là khóa chính, mọi khóa ngoại trỏ tới phải cập nhật theo — hoặc tệ hơn, dữ liệu cũ trỏ sai.",
        focus: ["natural", "fk"],
        edges: ["n-fk"],
        metrics: { onhdinh: "Thấp", ynghia: "Cao", dodai: "Chuỗi", unique: "Có điều kiện" },
        changes: ["Đổi email kéo theo sửa khóa ngoại", "Rủi ro dữ liệu lệch"],
        note: "Nếu buộc phải dùng khóa tự nhiên, hãy khai báo ON UPDATE CASCADE và ghi rõ trong tài liệu thiết kế."
      },
      {
        short: "Khóa thay thế",
        type: "KỸ THUẬT",
        title: "id không bao giờ đổi",
        body: "<code>id BIGINT GENERATED ALWAYS AS IDENTITY</code> hoặc UUID v4 cho khóa không đổi. Bảng khác tham chiếu id; email vẫn có UNIQUE để bảo vệ nghiệp vụ, nhưng đổi email chỉ sửa một cột.",
        focus: ["surrogate", "business"],
        edges: ["t-s", "t-b"],
        metrics: { onhdinh: "Cao", ynghia: "Không", dodai: "8 hoặc 16 byte", unique: "Có" },
        changes: ["Đổi email không chạm khóa ngoại", "Nghiệp vụ vẫn được bảo vệ"],
        note: "UUID tiện khi sinh khóa ở client hoặc gộp nhiều nguồn, nhưng index lớn hơn BIGINT. Đừng chọn theo cảm tính."
      },
      {
        short: "Bảng nối",
        type: "KỸ THUẬT",
        title: "Khóa ghép hay id riêng",
        body: "Bảng <code>dangky</code> có thể dùng khóa ghép (masv, mamh, hocky), hoặc thêm <code>id</code> riêng và đặt UNIQUE trên tổ hợp. Khóa ghép tiết kiệm cột; id riêng tiện khi bảng khác cần tham chiếu tới đăng ký.",
        focus: ["table", "fk"],
        edges: ["s-fk"],
        metrics: { onhdinh: "Cao", ynghia: "Tùy", dodai: "Tùy", unique: "Tổ hợp" },
        changes: ["Chọn theo nhu cầu tham chiếu", "UNIQUE giữ tính đúng"],
        note: "Nếu bảng nối sẽ có bảng con riêng (ví dụ nhật ký sửa điểm), thêm id riêng thường dễ hơn."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Ổn định trước, nghĩa sau",
        body: "Khóa chính nên ổn định và nhỏ: id hoặc UUID. Mã nghiệp vụ vẫn quan trọng, nhưng hãy bảo vệ bằng UNIQUE thay vì biến nó thành khóa chính.",
        focus: "all",
        edges: "all",
        metrics: { onhdinh: "Cao", ynghia: "UNIQUE", dodai: "Nhỏ", unique: "Có" },
        changes: ["Lược đồ chịu được thay đổi", "Nghiệp vụ vẫn ràng buộc"],
        note: "Tiếp theo: module Vận hành — bắt đầu từ index, công cụ làm truy vấn nhanh."
      }
    ]
  };

  L["index"] = {
    id: "index",
    module: "operation",
    title: "Index",
    shortTitle: "Index",
    subtitle: "Index là cấu trúc phụ giúp database tìm hàng mà không quét cả bảng. Đổi lại, mỗi index làm chậm ghi và tốn dung lượng — nên chỉ đánh index cho cột thật sự được lọc, nối hoặc sắp xếp.",
    blurb: "Tìm nhanh hơn, ghi chậm hơn — chọn điểm cân bằng.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["index", "B-tree", "composite", "covering", "selectivity"],
    metrics: [
      { key: "doc", label: "Đọc khi tìm", tone: "green" },
      { key: "ghi", label: "Chi phí ghi", tone: "coral" },
      { key: "chon", label: "Độ chọn lọc", tone: "blue" },
      { key: "dung", label: "Dung lượng", tone: "yellow" }
    ],
    nodes: [
      { id: "table", type: "table", x: 50, y: 190, w: 190, h: 84, label: "sinhvien", sub: "12.000 hàng" },
      { id: "scan", type: "disk", x: 50, y: 340, w: 190, h: 70, label: "Quét bảng", sub: "12.000 lần đọc" },
      { id: "btree", type: "index", x: 320, y: 190, w: 190, h: 84, label: "B-tree", sub: "theo makhoa" },
      { id: "query", type: "query", x: 560, y: 90, w: 150, h: 60, label: "WHERE", sub: "makhoa = 'CNTT'" },
      { id: "rows", type: "row", x: 560, y: 250, w: 190, h: 70, label: "3 hàng khớp", sub: "3 lần đọc" }
    ],
    edges: [
      { id: "t-scan", from: "table", to: "scan", kind: "data", label: "không index", bow: 10 },
      { id: "t-b", from: "table", to: "btree", kind: "data", label: "xây index" },
      { id: "q-b", from: "query", to: "btree", kind: "request", label: "tra" },
      { id: "b-rows", from: "btree", to: "rows", kind: "response", label: "nhảy tới" }
    ],
    learn: [
      "Giải thích index giúp giảm số trang phải đọc.",
      "Biết index làm chậm INSERT, UPDATE, DELETE.",
      "Chọn thứ tự cột cho index tổ hợp.",
      "Nhận ra khi nào index không được dùng."
    ],
    steps: [
      {
        short: "Vì sao",
        type: "TỔNG QUAN",
        title: "Mục lục cho bảng",
        body: "Không có index, tìm <code>makhoa = 'CNTT'</code> phải đọc từng hàng. Với index B-tree, database đi thẳng tới nhóm khóa cần tìm, chỉ đọc vài hàng liên quan.",
        focus: ["table", "scan", "btree"],
        edges: ["t-scan", "t-b"],
        metrics: { doc: "3 trang", ghi: "Chậm hơn", chon: "Cao", dung: "+ vài MB" },
        changes: ["Từ quét toàn bảng sang tra index", "Số hàng đọc giảm mạnh"],
        note: "Index không miễn phí. Nó là một cấu trúc dữ liệu thật, được cập nhật mỗi lần bảng thay đổi."
      },
      {
        short: "Chọn cột",
        type: "KỸ THUẬT",
        title: "Lọc, nối, sắp xếp",
        body: "Đánh index cho cột xuất hiện trong WHERE, JOIN và ORDER BY. Khóa ngoại nên có index vì JOIN và kiểm tra ràng buộc đều tra theo nó. Cột ít giá trị khác nhau như giới tính thường không đáng index.",
        focus: ["query", "btree"],
        edges: ["q-b"],
        metrics: { doc: "Thấp", ghi: "Chậm hơn", chon: "Theo cột", dung: "Tăng" },
        changes: ["Index nhắm đúng truy vấn", "Không index tràn lan"],
        note: "Mỗi index thêm chi phí ghi. Một bảng có 10 index có thể chậm ghi gấp nhiều lần so với 2 index."
      },
      {
        short: "Tổ hợp",
        type: "KỸ THUẬT",
        title: "Thứ tự cột quan trọng",
        body: "Index <code>(makhoa, namsinh)</code> dùng được cho lọc theo makhoa, hoặc makhoa + namsinh, nhưng không dùng được khi chỉ lọc namsinh. Cột lọc đẳng thức nên đứng trước, cột miền đứng sau.",
        focus: ["btree", "rows"],
        edges: ["b-rows"],
        metrics: { doc: "Thấp", ghi: "Chậm hơn", chon: "Tổ hợp", dung: "Vừa" },
        changes: ["Index phục vụ nhiều mẫu lọc", "Hiểu vì sao index bị bỏ qua"],
        note: "Quy tắc tiền tố: index tổ hợp chỉ hữu ích khi điều kiện dùng các cột đầu tiên theo đúng thứ tự."
      },
      {
        short: "Giới hạn",
        type: "KỸ THUẬT",
        title: "Khi index không cứu",
        body: "<code>LIKE '%an%'</code>, bọc cột trong hàm như <code>UPPER(hoten)</code>, hoặc so sánh kiểu dữ liệu lệch nhau thường khiến index bị bỏ. Hãy viết điều kiện “sạch” hoặc tạo index biểu thức nếu database hỗ trợ.",
        focus: ["scan", "query"],
        edges: ["t-scan"],
        metrics: { doc: "Cao trở lại", ghi: "Không đổi", chon: "Thấp", dung: "Không giúp" },
        changes: ["Index tồn tại nhưng không dùng", "Cần viết lại điều kiện"],
        note: "Đừng thêm index để “chắc”. Hãy đọc query plan để biết database có thật sự dùng nó hay không."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Index là đầu tư có lãi suất",
        body: "Index giảm chi phí đọc nhưng tăng chi phí ghi và dung lượng. Đánh index theo truy vấn thật, kiểm tra bằng query plan, và dọn những index không còn dùng.",
        focus: "all",
        edges: "all",
        metrics: { doc: "Thấp", ghi: "Có giá", chon: "Cao", dung: "Kiểm soát" },
        changes: ["Truy vấn nhanh có căn cứ", "Không index mù quáng"],
        note: "Tiếp theo: transaction — nhóm thao tác phải thành công hoặc thất bại cùng nhau."
      }
    ]
  };

  L["transaction"] = {
    id: "transaction",
    module: "operation",
    title: "Giao dịch và ACID",
    shortTitle: "Transaction",
    subtitle: "Transaction gói nhiều thao tác thành một đơn vị: hoặc tất cả cùng xảy ra, hoặc không thao tác nào có hiệu lực. ACID mô tả bốn bảo đảm mà giao dịch mang lại.",
    blurb: "Chuyển tiền không được trừ mà không cộng.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["transaction", "ACID", "COMMIT", "ROLLBACK", "WAL"],
    metrics: [
      { key: "nguyentu", label: "Nguyên tử", tone: "blue" },
      { key: "nhatquan", label: "Nhất quán", tone: "green" },
      { key: "cachly", label: "Cách ly", tone: "violet" },
      { key: "ben", label: "Bền", tone: "yellow" }
    ],
    nodes: [
      { id: "begin", type: "tx", x: 50, y: 200, w: 150, h: 66, label: "BEGIN", sub: "mở giao dịch" },
      { id: "table", type: "table", x: 280, y: 200, w: 190, h: 84, label: "taikhoan", sub: "A · B" },
      { id: "wal", type: "disk", x: 540, y: 90, w: 170, h: 70, label: "WAL", sub: "ghi trước" },
      { id: "commit", type: "check", x: 540, y: 280, w: 150, h: 62, label: "COMMIT", sub: "áp dụng" },
      { id: "rollback", type: "rule", x: 750, y: 280, w: 120, h: 62, label: "ROLLBACK", sub: "hủy" }
    ],
    edges: [
      { id: "b-t", from: "begin", to: "table", kind: "request", label: "trừ A" },
      { id: "t-wal", from: "table", to: "wal", kind: "data", label: "ghi log", bow: 10 },
      { id: "t-c", from: "table", to: "commit", kind: "response", label: "cộng B", bow: -10 },
      { id: "c-rb", from: "commit", to: "rollback", kind: "request", label: "nếu lỗi" }
    ],
    learn: [
      "Xác định ranh giới một giao dịch.",
      "Giải thích bốn chữ ACID bằng ví dụ chuyển tiền.",
      "Dùng COMMIT và ROLLBACK đúng chỗ.",
      "Hiểu vì sao WAL giúp giao dịch bền."
    ],
    steps: [
      {
        short: "Đơn vị công việc",
        type: "TỔNG QUAN",
        title: "Trừ và cộng là một",
        body: "Chuyển 100 từ A sang B gồm hai lệnh: trừ A, cộng B. Nếu lệnh thứ hai lỗi mà lệnh đầu đã lưu, tiền biến mất. Transaction buộc hai lệnh cùng thành công hoặc cùng bị hủy.",
        focus: ["begin", "table"],
        edges: ["b-t"],
        metrics: { nguyentu: "Có", nhatquan: "Có", cachly: "Theo mức", ben: "Có" },
        changes: ["Hai lệnh trong một giao dịch", "Không còn trạng thái nửa vời"],
        note: "Ranh giới giao dịch là quyết định nghiệp vụ. Đừng gói cả phiên làm việc dài vào một transaction."
      },
      {
        short: "Nguyên tử",
        type: "KỸ THUẬT",
        title: "Tất cả hoặc không gì",
        body: "Nếu bất kỳ lệnh nào trong transaction lỗi, <code>ROLLBACK</code> đưa dữ liệu về trạng thái trước BEGIN. Không có chuyện “trừ rồi nhưng chưa cộng”.",
        focus: ["begin", "rollback"],
        edges: ["c-rb"],
        metrics: { nguyentu: "Đảm bảo", nhatquan: "Có", cachly: "Theo mức", ben: "Có" },
        changes: ["Lỗi là hủy toàn bộ", "Dữ liệu không lơ lửng"],
        note: "Trong nhiều database, lỗi nghiêm trọng tự động đánh dấu transaction cần rollback. Đừng cố chạy tiếp."
      },
      {
        short: "Bền vững",
        type: "KỸ THUẬT",
        title: "COMMIT là lời hứa",
        body: "Khi <code>COMMIT</code> trả về thành công, dữ liệu đã được ghi đủ để sống sót qua mất điện. Write-ahead log ghi thay đổi trước khi áp vào bảng, cho phép phục hồi sau sự cố.",
        focus: ["commit", "wal"],
        edges: ["t-wal", "t-c"],
        metrics: { nguyentu: "Có", nhatquan: "Có", cachly: "Theo mức", ben: "Đảm bảo" },
        changes: ["COMMIT xong là chắc chắn", "Log hỗ trợ phục hồi"],
        note: "Đừng coi COMMIT là “gần xong”. Sau commit, thay đổi là sự thật; muốn sửa phải viết giao dịch mới."
      },
      {
        short: "Nhất quán",
        type: "KỸ THUẬT",
        title: "Ràng buộc kiểm trong giao dịch",
        body: "Khóa ngoại, UNIQUE và CHECK được kiểm tra trong transaction. Nếu một lệnh vi phạm, giao dịch không thể commit — dữ liệu luôn thỏa ràng buộc đã khai báo.",
        focus: ["table", "commit"],
        edges: ["b-t", "t-c"],
        metrics: { nguyentu: "Có", nhatquan: "Đảm bảo", cachly: "Theo mức", ben: "Có" },
        changes: ["Ràng buộc áp dụng cho cả nhóm", "Không commit dữ liệu sai"],
        note: "Nhất quán chỉ mạnh bằng ràng buộc bạn khai báo. Dữ liệu sai nghiệp vụ mà không có CHECK thì database không tự biết."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "ACID không phải khẩu hiệu",
        body: "Nguyên tử, nhất quán, cách ly và bền vững là bốn lời hứa cụ thể. Hiểu chúng giúp bạn đặt ranh giới giao dịch đúng và tránh những lỗi dữ liệu đắt tiền.",
        focus: "all",
        edges: "all",
        metrics: { nguyentu: "Có", nhatquan: "Có", cachly: "Mức phù hợp", ben: "Có" },
        changes: ["Giao dịch có ranh giới rõ", "Sự cố không làm mất tiền"],
        note: "Tiếp theo: mức cách ly — khi hai giao dịch cùng chạm một hàng."
      }
    ]
  };

  L["isolation"] = {
    id: "isolation",
    module: "operation",
    title: "Mức cách ly",
    shortTitle: "Isolation",
    subtitle: "Khi nhiều giao dịch chạy cùng lúc, mức cách ly quyết định chúng được thấy dữ liệu của nhau đến đâu. Đổi lại, mức càng chặt càng ít bất thường nhưng càng dễ chờ khóa.",
    blurb: "Đọc bẩn, đọc lặp và mất cập nhật — chọn mức đủ dùng.",
    duration: "14 phút",
    level: "Nâng cao",
    tags: ["isolation", "dirty read", "phantom", "serializable", "MVCC"],
    metrics: [
      { key: "docban", label: "Đọc bẩn", tone: "coral" },
      { key: "lapp", label: "Đọc lặp", tone: "yellow" },
      { key: "ma", label: "Mất cập nhật", tone: "violet" },
      { key: "cho", label: "Chờ khóa", tone: "blue" }
    ],
    nodes: [
      { id: "txa", type: "tx", x: 60, y: 110, w: 160, h: 66, label: "Giao dịch A", sub: "đọc số dư" },
      { id: "txb", type: "tx", x: 60, y: 300, w: 160, h: 66, label: "Giao dịch B", sub: "cập nhật" },
      { id: "lock", type: "lock", x: 320, y: 200, w: 160, h: 70, label: "Khóa hàng", sub: "hoặc phiên bản" },
      { id: "level", type: "rule", x: 560, y: 90, w: 170, h: 64, label: "Mức cách ly", sub: "READ COMMITTED" },
      { id: "result", type: "check", x: 560, y: 280, w: 170, h: 64, label: "Kết quả", sub: "không bất thường" }
    ],
    edges: [
      { id: "a-l", from: "txa", to: "lock", kind: "request", label: "đọc", bow: -10 },
      { id: "b-l", from: "txb", to: "lock", kind: "request", label: "ghi", bow: 10 },
      { id: "l-lv", from: "lock", to: "level", kind: "data", label: "áp quy tắc" },
      { id: "lv-r", from: "level", to: "result", kind: "response", label: "cho phép" }
    ],
    learn: [
      "Kể tên bốn mức cách ly phổ biến.",
      "Nhận diện dirty read, non-repeatable read và phantom.",
      "Chọn mức cách ly theo nghiệp vụ.",
      "Hiểu MVCC giúp đọc không chặn ghi."
    ],
    steps: [
      {
        short: "Vì sao",
        type: "TỔNG QUAN",
        title: "Hai người cùng sửa",
        body: "Khi A đang đọc số dư và B đang cập nhật, A có được thấy giá trị chưa commit của B không? Mức cách ly trả lời câu hỏi đó. Mức thấp nhanh hơn nhưng dễ thấy dữ liệu nửa vời.",
        focus: ["txa", "txb", "lock"],
        edges: ["a-l", "b-l"],
        metrics: { docban: "Tùy mức", lapp: "Tùy mức", ma: "Tùy mức", cho: "Thấp" },
        changes: ["Xác định điều được phép thấy", "Chọn giữa tốc độ và chắc chắn"],
        note: "Mặc định của nhiều database là READ COMMITTED. Đừng giả định mức mạnh hơn nếu chưa kiểm tra."
      },
      {
        short: "Bất thường",
        type: "KỸ THUẬT",
        title: "Ba cái bẫy quen thuộc",
        body: "<strong>Dirty read</strong>: đọc dữ liệu chưa commit. <strong>Non-repeatable read</strong>: đọc lại cùng hàng thấy giá trị khác. <strong>Phantom</strong>: đọc lại cùng điều kiện thấy thêm hàng mới.",
        focus: ["txa", "level"],
        edges: ["l-lv"],
        metrics: { docban: "Có thể", lapp: "Có thể", ma: "Có thể", cho: "Trung bình" },
        changes: ["Gọi đúng tên hiện tượng", "Biết mức nào chặn cái gì"],
        note: "READ UNCOMMITTED cho dirty read; READ COMMITTED chặn nó; REPEATABLE READ chặn thêm non-repeatable; SERIALIZABLE chặn phantom."
      },
      {
        short: "Chọn mức",
        type: "KỸ THUẬT",
        title: "Đủ chặt, không quá chậm",
        body: "Báo cáo có thể chấp nhận READ COMMITTED. Chuyển tiền hay đặt chỗ cần REPEATABLE READ hoặc khóa rõ ràng. SERIALIZABLE an toàn nhất nhưng dễ chờ và có thể phải thử lại giao dịch.",
        focus: ["level", "result"],
        edges: ["lv-r"],
        metrics: { docban: "Chặn", lapp: "Chặn", ma: "Chặn", cho: "Cao hơn" },
        changes: ["Mức khớp nghiệp vụ", "Chấp nhận đánh đổi hiệu năng"],
        note: "Với nghiệp vụ “kiểm tra rồi ghi”, hãy nghĩ tới khóa hàng hoặc điều kiện cập nhật nguyên tử thay vì chỉ nâng mức cách ly."
      },
      {
        short: "MVCC",
        type: "KỸ THUẬT",
        title: "Đọc không chặn ghi",
        body: "Nhiều database dùng đa phiên bản: mỗi giao dịch thấy một ảnh dữ liệu tại thời điểm bắt đầu. Nhờ vậy đọc không phải chờ ghi, nhưng bạn cần hiểu “ảnh” đó cũ hơn dữ liệu hiện tại bao lâu.",
        focus: ["lock", "result"],
        edges: ["b-l", "lv-r"],
        metrics: { docban: "Không", lapp: "Theo ảnh", ma: "Cần khóa", cho: "Thấp" },
        changes: ["Đọc song song với ghi", "Cần kiểm tra phiên bản"],
        note: "MVCC không xóa bỏ mọi tranh chấp. Hai giao dịch cùng sửa một hàng vẫn cần khóa hoặc kiểm tra phiên bản khi ghi."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Cách ly là hợp đồng",
        body: "Mức cách ly nói rõ bạn được thấy gì khi có tranh chấp. Chọn theo nghiệp vụ, viết rõ trong tài liệu, và kiểm thử các tình huống hai người cùng thao tác.",
        focus: "all",
        edges: "all",
        metrics: { docban: "Chặn", lapp: "Tùy mức", ma: "Có khóa", cho: "Kiểm soát" },
        changes: ["Hiểu rủi ro từng mức", "Chọn đúng cho nghiệp vụ"],
        note: "Tiếp theo: đọc query plan để biết database thật sự chạy truy vấn thế nào."
      }
    ]
  };

  L["query-plan"] = {
    id: "query-plan",
    module: "operation",
    title: "Query plan",
    shortTitle: "Query plan",
    subtitle: "Query plan là kế hoạch database chọn để chạy câu lệnh: quét bảng, dùng index, nối kiểu nào và theo thứ tự ra sao. Đọc plan là cách duy nhất biết tối ưu có tác dụng thật hay không.",
    blurb: "Đừng đoán chỗ chậm — đọc kế hoạch chạy.",
    duration: "13 phút",
    level: "Nâng cao",
    tags: ["EXPLAIN", "seq scan", "index scan", "hash join", "cost"],
    metrics: [
      { key: "nut", label: "Nút plan", tone: "blue" },
      { key: "scan", label: "Kiểu quét", tone: "violet" },
      { key: "uoc", label: "Hàng ước tính", tone: "yellow" },
      { key: "that", label: "Hàng thật", tone: "green" }
    ],
    nodes: [
      { id: "query", type: "query", x: 50, y: 200, w: 160, h: 66, label: "Câu SQL", sub: "JOIN + WHERE" },
      { id: "plan", type: "plan", x: 280, y: 200, w: 170, h: 76, label: "EXPLAIN", sub: "kế hoạch" },
      { id: "scan", type: "index", x: 520, y: 90, w: 170, h: 64, label: "Index Scan", sub: "makhoa" },
      { id: "seq", type: "disk", x: 520, y: 300, w: 170, h: 64, label: "Seq Scan", sub: "toàn bảng" },
      { id: "join", type: "join", x: 750, y: 200, w: 120, h: 64, label: "Hash Join", sub: "ghép" }
    ],
    edges: [
      { id: "q-p", from: "query", to: "plan", kind: "request", label: "phân tích" },
      { id: "p-s", from: "plan", to: "scan", kind: "response", label: "chọn", bow: 10 },
      { id: "p-seq", from: "plan", to: "seq", kind: "response", label: "hoặc", bow: -10 },
      { id: "s-j", from: "scan", to: "join", kind: "data", label: "kết quả" }
    ],
    learn: [
      "Chạy EXPLAIN và đọc cây kế hoạch.",
      "Phân biệt seq scan và index scan.",
      "So sánh hàng ước tính với hàng thật.",
      "Biết khi nào statistics cần cập nhật."
    ],
    steps: [
      {
        short: "Xem kế hoạch",
        type: "TỔNG QUAN",
        title: "EXPLAIN trước khi đoán",
        body: "<code>EXPLAIN (ANALYZE, BUFFERS)</code> in ra cây thao tác kèm thời gian thật. Đọc từ lá lên gốc để biết bảng nào được đọc trước, bằng cách nào và tốn bao nhiêu.",
        focus: ["query", "plan"],
        edges: ["q-p"],
        metrics: { nut: "4", scan: "Index", uoc: "26", that: "26" },
        changes: ["Thấy đường đi thật của câu lệnh", "Có số liệu thay vì cảm giác"],
        note: "EXPLAIN chỉ in kế hoạch; EXPLAIN ANALYZE chạy thật. Cẩn thận với lệnh ghi khi dùng ANALYZE."
      },
      {
        short: "Kiểu quét",
        type: "KỸ THUẬT",
        title: "Seq scan hay index scan",
        body: "Seq scan đọc cả bảng — tốt khi lấy phần lớn dữ liệu. Index scan nhảy theo khóa — tốt khi lọc ít hàng. Planner chọn theo ước lượng chi phí, không theo cảm tính của bạn.",
        focus: ["scan", "seq"],
        edges: ["p-s", "p-seq"],
        metrics: { nut: "3", scan: "So sánh", uoc: "12.000", that: "3" },
        changes: ["Hiểu vì sao planner chọn quét", "Biết khi index bị bỏ"],
        note: "Bảng nhỏ thường bị seq scan dù có index — điều đó đúng, vì đọc cả bảng rẻ hơn nhảy index."
      },
      {
        short: "Ước lượng",
        type: "KỸ THUẬT",
        title: "Ước tính lệch là dấu hiệu",
        body: "Plan hiển thị hàng ước tính và hàng thật. Lệch vài lần có thể bỏ qua; lệch hàng nghìn lần thường do statistics cũ hoặc điều kiện khó đoán, khiến planner chọn sai đường.",
        focus: ["plan", "scan"],
        edges: ["q-p", "p-s"],
        metrics: { nut: "3", scan: "Index", uoc: "50", that: "9.800" },
        changes: ["Phát hiện ước lượng sai", "Cân nhắc ANALYZE bảng"],
        note: "Nếu ước lượng sai vì điều kiện phức tạp, có thể dùng extended statistics hoặc viết lại truy vấn đơn giản hơn."
      },
      {
        short: "Nối bảng",
        type: "KỸ THUẬT",
        title: "Nested loop, hash, merge",
        body: "Nested loop tốt khi một bên rất nhỏ; hash join tốt khi hai bên lớn và không có thứ tự; merge join tốt khi hai bên đã sắp theo khóa nối. Planner thường đổi kiểu nối khi dữ liệu tăng.",
        focus: ["join"],
        edges: ["s-j"],
        metrics: { nut: "4", scan: "Index", uoc: "26", that: "26" },
        changes: ["Hiểu lựa chọn nối", "Biết vì sao plan đổi theo dữ liệu"],
        note: "Đừng ép planner bằng hint trừ khi đã đo. Dữ liệu thay đổi, hint cũ có thể thành lỗi hiệu năng."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Đo trước, sửa sau",
        body: "Query plan cho biết database đọc gì, nối kiểu gì và tốn bao nhiêu. Dùng nó để kiểm chứng index, phát hiện ước lượng sai và tránh tối ưu theo lời đồn.",
        focus: "all",
        edges: "all",
        metrics: { nut: "Đọc được", scan: "Đúng kiểu", uoc: "Sát thật", that: "Có số" },
        changes: ["Tối ưu dựa trên bằng chứng", "Biết khi nào cần index mới"],
        note: "Tiếp theo: sao lưu và phân quyền — hai việc âm thầm giữ hệ thống sống sót."
      }
    ]
  };

  L["backup-quyen"] = {
    id: "backup-quyen",
    module: "operation",
    title: "Sao lưu và phân quyền",
    shortTitle: "Backup & quyền",
    subtitle: "Sao lưu bảo vệ dữ liệu khỏi mất mát; phân quyền bảo vệ dữ liệu khỏi truy cập sai. Cả hai phải được thiết kế trước sự cố, không phải sau khi đã mất dữ liệu.",
    blurb: "Bản sao lưu chưa thử phục hồi chưa phải bản sao lưu.",
    duration: "13 phút",
    level: "Trung cấp",
    tags: ["backup", "restore", "RPO", "RTO", "least privilege", "role"],
    metrics: [
      { key: "rpo", label: "RPO", tone: "blue" },
      { key: "rto", label: "RTO", tone: "yellow" },
      { key: "quyen", label: "Quyền tối thiểu", tone: "green" },
      { key: "thu", label: "Đã thử phục hồi", tone: "violet" }
    ],
    nodes: [
      { id: "db", type: "disk", x: 50, y: 200, w: 170, h: 70, label: "Database", sub: "dữ liệu sống" },
      { id: "backup", type: "file", x: 290, y: 90, w: 170, h: 66, label: "Sao lưu", sub: "hằng ngày" },
      { id: "restore", type: "check", x: 290, y: 300, w: 170, h: 66, label: "Phục hồi", sub: "đã thử" },
      { id: "app", type: "user", x: 550, y: 90, w: 160, h: 64, label: "Ứng dụng", sub: "role app_rw" },
      { id: "rule", type: "lock", x: 550, y: 300, w: 160, h: 64, label: "Quyền", sub: "chỉ SELECT/INSERT" }
    ],
    edges: [
      { id: "db-b", from: "db", to: "backup", kind: "data", label: "chép", bow: 10 },
      { id: "b-r", from: "backup", to: "restore", kind: "response", label: "khôi phục" },
      { id: "db-app", from: "db", to: "app", kind: "request", label: "kết nối" },
      { id: "app-rule", from: "app", to: "rule", kind: "data", label: "được cấp" }
    ],
    learn: [
      "Phân biệt sao lưu logic và vật lý.",
      "Hiểu RPO và RTO khi chọn lịch sao lưu.",
      "Thử phục hồi định kỳ, không chỉ sao lưu.",
      "Cấp quyền tối thiểu theo vai trò."
    ],
    steps: [
      {
        short: "Sao lưu",
        type: "TỔNG QUAN",
        title: "Bản sao ở nơi khác",
        body: "Sao lưu logic xuất dữ liệu và cấu trúc; sao lưu vật lý chép tệp của database. Cả hai đều phải nằm ở nơi khác ổ đĩa gốc, và phải có lịch rõ ràng — hằng ngày, hằng giờ hay liên tục.",
        focus: ["db", "backup"],
        edges: ["db-b"],
        metrics: { rpo: "24 giờ", rto: "2 giờ", quyen: "Tách biệt", thu: "Chưa" },
        changes: ["Có bản sao ngoài máy chính", "Lịch sao lưu được ghi lại"],
        note: "Sao lưu nằm cùng ổ với dữ liệu gốc không bảo vệ được khi ổ hỏng. Hãy kiểm tra vị trí lưu thật."
      },
      {
        short: "RPO & RTO",
        type: "KỸ THUẬT",
        title: "Mất bao nhiêu, chờ bao lâu",
        body: "<strong>RPO</strong> là lượng dữ liệu tối đa có thể mất; <strong>RTO</strong> là thời gian tối đa để chạy lại. Nghiệp vụ ngân hàng cần RPO gần 0; blog cá nhân có thể chấp nhận mất một ngày.",
        focus: ["backup", "restore"],
        edges: ["b-r"],
        metrics: { rpo: "Theo nghiệp vụ", rto: "Theo nghiệp vụ", quyen: "Tách biệt", thu: "Định kỳ" },
        changes: ["Mục tiêu khôi phục rõ ràng", "Lịch sao lưu khớp mục tiêu"],
        note: "RPO/RTO là quyết định của chủ nghiệp vụ, không phải của quản trị viên database. Hãy viết ra và thống nhất."
      },
      {
        short: "Thử phục hồi",
        type: "KỸ THUẬT",
        title: "Restore mới là bài kiểm tra",
        body: "Mỗi tháng hãy phục hồi bản sao lưu vào môi trường tạm và chạy vài truy vấn kiểm tra. Sao lưu hỏng, thiếu bảng hoặc thiếu quyền thường chỉ lộ ra ở bước này.",
        focus: ["restore"],
        edges: ["b-r"],
        metrics: { rpo: "Đã đo", rto: "Đã đo", quyen: "Tách biệt", thu: "Hằng tháng" },
        changes: ["Biết bản sao dùng được", "Phát hiện lỗi trước sự cố"],
        note: "Ghi lại thời gian phục hồi thật. Con số này là RTO thực tế, không phải con số bạn hy vọng."
      },
      {
        short: "Phân quyền",
        type: "KỸ THUẬT",
        title: "Quyền tối thiểu",
        body: "Ứng dụng chỉ cần SELECT/INSERT/UPDATE trên bảng nghiệp vụ, không cần DROP TABLE. Tạo role riêng cho ứng dụng, role riêng cho báo cáo chỉ đọc, và không dùng tài khoản admin cho dịch vụ.",
        focus: ["app", "rule"],
        edges: ["db-app", "app-rule"],
        metrics: { rpo: "24 giờ", rto: "2 giờ", quyen: "Tối thiểu", thu: "Hằng tháng" },
        changes: ["Ứng dụng không thể xóa bảng", "Sự cố bị giới hạn phạm vi"],
        note: "Quyền thừa là lỗ hổng âm thầm. Nếu một dịch vụ bị chiếm, quyền của nó quyết định thiệt hại tối đa."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Chuẩn bị trước khi cần",
        body: "Sao lưu có lịch, có RPO/RTO, có thử phục hồi; phân quyền theo vai trò và tối thiểu. Hai thói quen này không làm ứng dụng nhanh hơn, nhưng quyết định bạn có dữ liệu để chạy tiếp hay không.",
        focus: "all",
        edges: "all",
        metrics: { rpo: "Đạt mục tiêu", rto: "Đã đo", quyen: "Tối thiểu", thu: "Có bằng chứng" },
        changes: ["Kế hoạch sống sót rõ ràng", "Quyền hạn được kiểm soát"],
        note: "Hết lộ trình 18 bài. Mở SQL Workbench để luyện 6 nhiệm vụ, hoặc vào Luyện tập cho các tình huống thực tế."
      }
    ]
  };

  DB.practice = [
    {
      tag: "JOIN",
      title: "Báo cáo thiếu sinh viên",
      scenario: "Phòng đào tạo in danh sách sinh viên kèm điểm trung bình. Báo cáo chỉ có 11 dòng trong khi hệ thống có 12 sinh viên. Câu truy vấn dùng JOIN giữa sinhvien và diem. Nguyên nhân khả dĩ nhất là gì?",
      metrics: [
        { label: "Sinh viên", value: "12" },
        { label: "Dòng báo cáo", value: "11", danger: true },
        { label: "Sinh viên chưa có điểm", value: "1" }
      ],
      options: [
        "Bảng diem thiếu khóa chính nên JOIN bỏ dòng",
        "INNER JOIN bỏ sinh viên chưa có dòng điểm nào; cần LEFT JOIN",
        "ORDER BY làm mất một dòng khi trùng điểm",
        "COUNT(*) không đếm được sinh viên chưa có điểm"
      ],
      correct: 1,
      explain: "INNER JOIN chỉ giữ cặp khớp. Sinh viên chưa có điểm không có cặp nào nên biến mất. Dùng LEFT JOIN từ sinhvien và đếm theo masv để giữ đủ 12 dòng, hiển thị NULL hoặc 0 cho người chưa có điểm."
    },
    {
      tag: "GROUP BY",
      title: "Điểm trung bình bị đội lên",
      scenario: "Một báo cáo tính điểm trung bình theo môn bằng cách nối diem với monhoc, nhưng một số môn có nhiều dòng điểm bị nhân bản. Kết quả trung bình cao hơn dữ liệu gốc. Bước nào cần kiểm tra trước?",
      metrics: [
        { label: "Bảng nối", value: "diem × monhoc" },
        { label: "Số dòng sau nối", value: "tăng", danger: true },
        { label: "Khóa nối", value: "mamh" }
      ],
      options: [
        "Đổi AVG thành SUM để tránh chia sai",
        "Thêm DISTINCT vào mọi cột trước khi tính",
        "Kiểm tra điều kiện ON có tạo quan hệ 1–N ngoài ý muốn, rồi tính trên bảng gốc",
        "Tăng LIMIT để lấy đủ dòng"
      ],
      correct: 2,
      explain: "Khi JOIN sai khóa hoặc nối thêm bảng một–nhiều, mỗi dòng điểm có thể nhân bản, làm AVG lệch. Hãy kiểm tra số dòng trước và sau JOIN; nếu chỉ cần thống kê theo môn, tính trực tiếp trên bảng diem rồi nối tên môn sau."
    },
    {
      tag: "Khóa ngoại",
      title: "Không chèn được sinh viên mới",
      scenario: "Ứng dụng báo lỗi khi thêm sinh viên có makhoa = 'MT'. Bảng khoa chưa có dòng nào mã MT. Đây là hành vi gì và nên xử lý thế nào?",
      metrics: [
        { label: "Mã khoa", value: "MT" },
        { label: "Dòng khoa MT", value: "0", danger: true },
        { label: "Ràng buộc", value: "FK" }
      ],
      options: [
        "Khóa ngoại đang bảo vệ toàn vẹn; hãy tạo khoa MT trước hoặc sửa mã",
        "Tắt khóa ngoại để chèn nhanh",
        "Đổi makhoa thành NULL để bỏ qua kiểm tra",
        "Xóa bảng khoa rồi tạo lại"
      ],
      correct: 0,
      explain: "Đây là toàn vẹn tham chiếu hoạt động đúng: không thể trỏ tới khoa không tồn tại. Cách đúng là thêm khoa MT vào bảng cha (hoặc sửa dữ liệu đầu vào), không phải vô hiệu hóa ràng buộc."
    },
    {
      tag: "Index",
      title: "Danh sách theo khoa chậm dần",
      scenario: "Trang danh sách lọc theo makhoa ngày càng chậm khi bảng sinhvien tăng lên hàng chục nghìn dòng. Câu truy vấn lọc đúng một khoa và sắp theo hoten. Thay đổi nào có tác động lớn nhất?",
      metrics: [
        { label: "Số dòng", value: "48.000" },
        { label: "Thời gian", value: "1,8 s", danger: true },
        { label: "Bộ lọc", value: "makhoa" }
      ],
      options: [
        "Thêm LIMIT 10 để che vấn đề",
        "Đổi tên cột cho ngắn hơn",
        "Tăng bộ nhớ ứng dụng",
        "Đánh index tổ hợp trên (makhoa, hoten)"
      ],
      correct: 3,
      explain: "Index tổ hợp (makhoa, hoten) vừa lọc theo khoa vừa hỗ trợ sắp xếp theo tên, giảm mạnh số trang phải đọc. Hãy kiểm tra bằng EXPLAIN ANALYZE trước và sau, thay vì thêm index mù quáng."
    },
    {
      tag: "Transaction",
      title: "Chuyển tiền bị trừ một chiều",
      scenario: "Sự cố mạng xảy ra giữa lệnh trừ tài khoản A và lệnh cộng tài khoản B. Sau khi hệ thống chạy lại, A bị trừ nhưng B không được cộng. Lỗi thiết kế nào khả dĩ nhất?",
      metrics: [
        { label: "Lệnh trừ", value: "đã commit", danger: true },
        { label: "Lệnh cộng", value: "chưa chạy" },
        { label: "Ranh giới", value: "sai" }
      ],
      options: [
        "Dùng sai kiểu dữ liệu cho số tiền",
        "Hai lệnh không nằm trong cùng một transaction nên không cùng commit/rollback",
        "Thiếu index trên cột số dư",
        "Mức cách ly quá cao"
      ],
      correct: 1,
      explain: "Hai thao tác phải nằm trong một giao dịch: trừ A, cộng B, kiểm tra ràng buộc, rồi COMMIT. Nếu lỗi giữa chừng thì ROLLBACK cả hai. Tách thành hai giao dịch tạo trạng thái nửa vời đúng như mô tả."
    },
    {
      tag: "NULL",
      title: "NOT IN trả về rỗng",
      scenario: "Câu truy vấn tìm sinh viên chưa đăng ký môn nào bằng NOT IN (SELECT mamh FROM dangky). Kết quả rỗng dù chắc chắn có sinh viên chưa đăng ký. Nguyên nhân là gì?",
      metrics: [
        { label: "Kiểu lọc", value: "NOT IN" },
        { label: "NULL trong danh sách", value: "có", danger: true },
        { label: "Kết quả", value: "0 dòng" }
      ],
      options: [
        "NOT IN không hỗ trợ subquery",
        "Bảng dangky thiếu khóa chính",
        "Danh sách con chứa NULL làm mọi so sánh thành UNKNOWN, nên không hàng nào khớp",
        "Cần thêm ORDER BY trước NOT IN"
      ],
      correct: 2,
      explain: "Với NOT IN, nếu danh sách có NULL thì biểu thức không bao giờ là TRUE. Dùng NOT EXISTS với điều kiện tương quan, hoặc LEFT JOIN rồi WHERE ... IS NULL, để kết quả đúng như mong đợi."
    },
    {
      tag: "Thiết kế",
      title: "Đổi email làm vỡ liên kết",
      scenario: "Hệ thống dùng email làm khóa chính của bảng nguoidung. Khi một người đổi email, nhiều bảng khác phải cập nhật theo và có lần bị lệch. Cách sửa bền vững nhất?",
      metrics: [
        { label: "Khóa chính", value: "email", danger: true },
        { label: "Bảng tham chiếu", value: "6" },
        { label: "Tần suất đổi", value: "thường" }
      ],
      options: [
        "Thêm cột id làm khóa chính, giữ email với UNIQUE",
        "Cấm người dùng đổi email",
        "Chép email vào mọi bảng để tránh JOIN",
        "Đổi email thành kiểu số"
      ],
      correct: 0,
      explain: "Khóa chính nên ổn định. Dùng id (BIGINT hoặc UUID) làm khóa, đặt UNIQUE trên email để bảo vệ nghiệp vụ. Khi email đổi, chỉ một cột thay đổi; khóa ngoại ở các bảng khác không bị ảnh hưởng."
    },
    {
      tag: "Chuẩn hóa",
      title: "Tên môn sửa hai nơi",
      scenario: "Bảng dangky lưu cả mamh và tenmh. Khi đổi tên một môn, có dòng đã sửa, có dòng chưa, báo cáo hiển thị hai tên khác nhau cho cùng một môn. Đây là vi phạm dạng chuẩn nào?",
      metrics: [
        { label: "Bảng", value: "dangky" },
        { label: "Phụ thuộc", value: "mamh → tenmh", danger: true },
        { label: "Số tên môn", value: "2" }
      ],
      options: [
        "1NF vì có cột lặp",
        "2NF vì tenmh phụ thuộc một phần của khóa ghép",
        "3NF vì tenmh phụ thuộc bắc cầu qua mamh",
        "Không vi phạm, chỉ là lỗi nhập liệu"
      ],
      correct: 1,
      explain: "Trong bảng có khóa ghép (masv, mamh), cột tenmh chỉ phụ thuộc mamh — một phần khóa — nên vi phạm 2NF. Tách MONHOC(mamh, tenmh) và để dangky chỉ giữ mamh; tên môn chỉ tồn tại một nơi."
    }
  ];

  DB.cheatsheets = [
    {
      id: "syntax",
      num: "01",
      title: "Cú pháp SQL",
      intro: "Các mẫu câu thường dùng với bảng mẫu của DBLab: khoa, giangvien, monhoc, sinhvien, diem.",
      cards: [
        {
          title: "Thứ tự mệnh đề",
          html: `<pre><code>SELECT cot, ham()
FROM bang
JOIN bang2 ON ...
WHERE dieu_kien
GROUP BY cot
HAVING dieu_kien_nhom
ORDER BY cot
LIMIT n OFFSET m;</code></pre><p>Viết theo đúng thứ tự này. WHERE lọc hàng trước khi gom; HAVING lọc nhóm sau khi gom.</p>`
        },
        {
          title: "Lọc cơ bản",
          html: `<pre><code>WHERE makhoa = 'CNTT'
  AND namsinh BETWEEN 2004 AND 2006
  AND hoten LIKE 'Nguyen%'
  AND makhoa IN ('CNTT','KT')</code></pre><p>Dùng <code>IS NULL</code> / <code>IS NOT NULL</code> thay cho <code>= NULL</code>.</p>`
        },
        {
          title: "JOIN",
          html: `<pre><code>SELECT s.hoten, d.diem
FROM sinhvien s
JOIN diem d ON d.masv = s.masv;

SELECT s.hoten, d.diem
FROM sinhvien s
LEFT JOIN diem d ON d.masv = s.masv
WHERE d.masv IS NULL;</code></pre><p>INNER giữ cặp khớp; LEFT giữ cả bên trái; WHERE ... IS NULL tìm dữ liệu thiếu.</p>`
        },
        {
          title: "Tổng hợp",
          html: `<pre><code>SELECT mamh,
       COUNT(*) AS so_sv,
       ROUND(AVG(diem), 2) AS diem_tb
FROM diem
GROUP BY mamh
HAVING COUNT(*) &gt;= 2
ORDER BY diem_tb DESC;</code></pre><p>COUNT(*) đếm dòng; COUNT(cot) bỏ NULL. Mọi cột chọn phải có trong GROUP BY hoặc trong hàm tổng hợp.</p>`
        },
        {
          title: "Hàm cửa sổ",
          html: `<pre><code>SELECT masv, mamh, diem,
       RANK() OVER (
         PARTITION BY mamh
         ORDER BY diem DESC
       ) AS hang
FROM diem;</code></pre><p>Window giữ đủ từng hàng. ROW_NUMBER luôn 1,2,3; RANK đồng hạng có nhảy; DENSE_RANK không nhảy.</p>`
        },
        {
          title: "Bẫy thường gặp",
          html: "<ul><li><code>NOT IN</code> gặp NULL trả về rỗng — dùng <code>NOT EXISTS</code>.</li><li>JOIN thiếu điều kiện ON tạo tích Descartes.</li><li><code>LIMIT</code> không có <code>ORDER BY</code> cho kết quả bất kỳ.</li><li>So sánh chuỗi với số có thể khiến index bị bỏ.</li></ul>"
        }
      ]
    },
    {
      id: "design",
      num: "02",
      title: "Thiết kế lược đồ",
      intro: "Danh sách kiểm tra trước khi viết CREATE TABLE: khóa, ràng buộc, chuẩn hóa và kiểu dữ liệu.",
      cards: [
        {
          title: "Chọn khóa",
          html: "<ul><li>Khóa chính: duy nhất, không NULL, ít đổi.</li><li>Ưu tiên id BIGINT hoặc UUID; mã nghiệp vụ đặt UNIQUE.</li><li>Bảng nối dùng khóa ghép hoặc id riêng + UNIQUE tổ hợp.</li><li>Khóa ngoại luôn khai báo, kèm chính sách ON DELETE rõ ràng.</li></ul>"
        },
        {
          title: "Kiểu dữ liệu",
          html: "<ul><li>Tiền: NUMERIC/DECIMAL, không dùng FLOAT.</li><li>Thời gian: TIMESTAMP WITH TIME ZONE.</li><li>Cờ: BOOLEAN, không dùng chuỗi 'Y'/'N'.</li><li>Chuỗi có giới hạn: VARCHAR(n) hợp lý; đừng dùng TEXT cho mọi thứ.</li></ul>"
        },
        {
          title: "Chuẩn hóa nhanh",
          html: "<ol><li>Mỗi ô một giá trị (1NF).</li><li>Không cột phụ thuộc một phần khóa ghép (2NF).</li><li>Không cột phụ thuộc bắc cầu qua cột khác (3NF).</li><li>Kiểm tra: sửa một sự thật có phải sửa nhiều hàng không?</li></ol>"
        },
        {
          title: "ER → DDL",
          html: `<pre><code>CREATE TABLE khoa (
  makhoa  VARCHAR(8) PRIMARY KEY,
  tenkhoa VARCHAR(80) NOT NULL
);

CREATE TABLE sinhvien (
  masv    VARCHAR(8) PRIMARY KEY,
  hoten   VARCHAR(80) NOT NULL,
  makhoa  VARCHAR(8) NOT NULL
          REFERENCES khoa(makhoa)
);</code></pre>`
        },
        {
          title: "Đặt tên",
          html: "<ul><li>Bảng: danh từ số nhiều hoặc tên nghiệp vụ thống nhất (sinhvien, dangky).</li><li>Cột: snake_case, không viết tắt khó hiểu.</li><li>Khóa ngoại: cùng tên với cột được tham chiếu (makhoa).</li><li>Index: idx_bang_cot; ràng buộc: uq_, ck_, fk_.</li></ul>"
        },
        {
          title: "Câu hỏi kiểm tra",
          html: "<ul><li>Mỗi hàng đại diện đúng một thực thể chưa?</li><li>Có sự thật nào lưu ở hai nơi không?</li><li>Xóa bảng cha thì bảng con xử lý thế nào?</li><li>Có cột nào cho phép NULL mà nghiệp vụ luôn cần giá trị?</li></ul>"
        }
      ]
    },
    {
      id: "ops",
      num: "03",
      title: "Vận hành",
      intro: "Index, giao dịch, cách ly, query plan, sao lưu và phân quyền — những việc giữ hệ thống nhanh và sống sót.",
      cards: [
        {
          title: "Đánh index",
          html: "<ul><li>Index cho cột trong WHERE, JOIN, ORDER BY.</li><li>Khóa ngoại nên có index.</li><li>Index tổ hợp: cột đẳng thức trước, cột miền sau.</li><li>Tránh index cột ít giá trị khác nhau; tránh index tràn lan vì ghi sẽ chậm.</li></ul>"
        },
        {
          title: "Transaction",
          html: `<pre><code>BEGIN;
UPDATE taikhoan SET so_du = so_du - 100 WHERE id = 1;
UPDATE taikhoan SET so_du = so_du + 100 WHERE id = 2;
COMMIT;  -- hoặc ROLLBACK khi lỗi</code></pre><p>Một giao dịch = một đơn vị công việc. Đừng gói phiên làm việc dài vào transaction.</p>`
        },
        {
          title: "Mức cách ly",
          html: "<ul><li>READ UNCOMMITTED: có thể đọc bẩn.</li><li>READ COMMITTED: chặn đọc bẩn (mặc định phổ biến).</li><li>REPEATABLE READ: đọc lại ổn định trong giao dịch.</li><li>SERIALIZABLE: chặt nhất, dễ chờ và cần thử lại.</li></ul>"
        },
        {
          title: "Đọc query plan",
          html: `<pre><code>EXPLAIN (ANALYZE, BUFFERS)
SELECT ...;</code></pre><ul><li>Seq Scan: đọc cả bảng — tốt khi lấy phần lớn dữ liệu.</li><li>Index Scan: nhảy theo khóa — tốt khi lọc ít hàng.</li><li>Ước tính lệch xa thực tế: cập nhật statistics (ANALYZE).</li></ul>`
        },
        {
          title: "Sao lưu",
          html: "<ul><li>RPO: mất tối đa bao nhiêu dữ liệu.</li><li>RTO: chờ tối đa bao lâu để chạy lại.</li><li>Sao lưu ở nơi khác ổ gốc; mã hóa khi ra ngoài.</li><li>Thử phục hồi định kỳ và ghi lại thời gian thật.</li></ul>"
        },
        {
          title: "Phân quyền",
          html: "<ul><li>Role riêng cho ứng dụng, báo cáo, quản trị.</li><li>Ứng dụng: chỉ SELECT/INSERT/UPDATE trên bảng cần thiết.</li><li>Không dùng tài khoản admin cho dịch vụ.</li><li>Rà quyền thừa định kỳ; thu hồi khi đổi vai trò.</li></ul>"
        }
      ]
    }
  ];
})();
