/* DBLab — dữ liệu mẫu cho SQL Workbench (trường học nhỏ) */
window.DB_SEED = (function () {
  "use strict";

  const tables = [
    {
      name: "khoa",
      label: "Khoa",
      columns: [
        { name: "makhoa", type: "TEXT", pk: true },
        { name: "tenkhoa", type: "TEXT", notnull: true },
        { name: "thanhlap", type: "INTEGER" }
      ],
      rows: [
        ["CNTT", "Công nghệ thông tin", 2005],
        ["KT", "Kế toán", 1998],
        ["NN", "Ngoại ngữ", 2001],
        ["DT", "Điện tử", 2010],
        ["MT", "Môi trường", 2015]
      ]
    },
    {
      name: "giangvien",
      label: "Giảng viên",
      columns: [
        { name: "magv", type: "TEXT", pk: true },
        { name: "hoten", type: "TEXT", notnull: true },
        { name: "makhoa", type: "TEXT", fk: "khoa.makhoa" },
        { name: "hocvi", type: "TEXT" },
        { name: "luong", type: "REAL" }
      ],
      rows: [
        ["GV01", "Nguyễn Minh An", "CNTT", "TS", 18.5],
        ["GV02", "Trần Thu Hà", "CNTT", "ThS", 14.2],
        ["GV03", "Lê Quốc Bảo", "KT", "TS", 17.0],
        ["GV04", "Phạm Ngọc Lan", "NN", "ThS", 13.5],
        ["GV05", "Đỗ Văn Hùng", "DT", "TS", 16.8],
        ["GV06", "Vũ Thanh Mai", "CNTT", "ThS", 13.9]
      ]
    },
    {
      name: "monhoc",
      label: "Môn học",
      columns: [
        { name: "mamh", type: "TEXT", pk: true },
        { name: "tenmh", type: "TEXT", notnull: true },
        { name: "sotc", type: "INTEGER", notnull: true },
        { name: "makhoa", type: "TEXT", fk: "khoa.makhoa" },
        { name: "magv", type: "TEXT", fk: "giangvien.magv" }
      ],
      rows: [
        ["CS101", "Nhập môn lập trình", 3, "CNTT", "GV01"],
        ["CS102", "Cấu trúc dữ liệu", 4, "CNTT", "GV02"],
        ["CS201", "Cơ sở dữ liệu", 3, "CNTT", "GV06"],
        ["CS202", "Mạng máy tính", 3, "CNTT", "GV01"],
        ["KT101", "Nguyên lý kế toán", 3, "KT", "GV03"],
        ["NN101", "Tiếng Anh cơ bản", 4, "NN", "GV04"],
        ["DT101", "Mạch điện tử", 3, "DT", "GV05"],
        ["CS301", "Trí tuệ nhân tạo", 3, "CNTT", "GV02"]
      ]
    },
    {
      name: "sinhvien",
      label: "Sinh viên",
      columns: [
        { name: "masv", type: "TEXT", pk: true },
        { name: "hoten", type: "TEXT", notnull: true },
        { name: "makhoa", type: "TEXT", fk: "khoa.makhoa" },
        { name: "namsinh", type: "INTEGER" },
        { name: "gioitinh", type: "TEXT" },
        { name: "email", type: "TEXT" }
      ],
      rows: [
        ["SV01", "Nguyễn Văn An", "CNTT", 2005, "Nam", "an.nv@sv.edu.vn"],
        ["SV02", "Trần Thị Bình", "CNTT", 2004, "Nữ", "binh.tt@sv.edu.vn"],
        ["SV03", "Lê Hoàng Cường", "CNTT", 2006, "Nam", "cuong.lh@sv.edu.vn"],
        ["SV04", "Phạm Thu Dung", "KT", 2005, "Nữ", "dung.pt@sv.edu.vn"],
        ["SV05", "Hoàng Minh Đức", "DT", 2004, "Nam", "duc.hm@sv.edu.vn"],
        ["SV06", "Vũ Thị Hà", "NN", 2005, "Nữ", "ha.vt@sv.edu.vn"],
        ["SV07", "Đặng Quốc Huy", "CNTT", 2003, "Nam", "huy.dq@sv.edu.vn"],
        ["SV08", "Bùi Ngọc Lan", "KT", 2006, "Nữ", null],
        ["SV09", "Ngô Thanh Mai", "CNTT", 2006, "Nữ", "mai.nt@sv.edu.vn"],
        ["SV10", "Trịnh Văn Nam", "DT", 2005, "Nam", "nam.tv@sv.edu.vn"],
        ["SV11", "Lý Thị Oanh", "NN", 2004, "Nữ", "oanh.lt@sv.edu.vn"],
        ["SV12", "Phan Đức Phúc", "CNTT", 2005, "Nam", "phuc.pd@sv.edu.vn"]
      ]
    },
    {
      name: "diem",
      label: "Điểm",
      columns: [
        { name: "masv", type: "TEXT", pk: true, fk: "sinhvien.masv" },
        { name: "mamh", type: "TEXT", pk: true, fk: "monhoc.mamh" },
        { name: "hocky", type: "INTEGER", pk: true },
        { name: "diem", type: "REAL", notnull: true }
      ],
      rows: [
        ["SV01", "CS101", 1, 8.5], ["SV01", "CS102", 2, 7.5], ["SV01", "CS201", 3, 9.0],
        ["SV02", "CS101", 1, 9.0], ["SV02", "CS102", 2, 8.0], ["SV02", "CS201", 3, 8.5],
        ["SV03", "CS101", 1, 6.5], ["SV03", "CS102", 2, 7.0], ["SV03", "CS201", 3, 8.0],
        ["SV04", "KT101", 1, 7.5], ["SV04", "NN101", 2, 8.0],
        ["SV05", "DT101", 1, 8.0], ["SV05", "CS101", 2, 6.0],
        ["SV06", "NN101", 1, 9.5], ["SV06", "CS101", 2, 7.0],
        ["SV07", "CS101", 1, 7.5], ["SV07", "CS202", 3, 8.5], ["SV07", "CS301", 4, 9.0],
        ["SV09", "CS101", 1, 8.0], ["SV09", "CS201", 3, 9.5],
        ["SV10", "DT101", 1, 7.0],
        ["SV11", "NN101", 1, 8.5], ["SV11", "CS101", 2, 7.5],
        ["SV12", "CS101", 1, 9.0], ["SV12", "CS201", 3, 7.0], ["SV12", "CS301", 4, 8.5]
      ]
    }
  ];

  const missions = [
    {
      id: "m1",
      title: "Sinh viên CNTT từ 2005",
      prompt: "Liệt kê họ tên và năm sinh của sinh viên khoa CNTT sinh từ năm 2005 trở lại đây, sắp xếp theo họ tên tăng dần.",
      sql: "SELECT hoten, namsinh FROM sinhvien WHERE makhoa = 'CNTT' AND namsinh >= 2005 ORDER BY hoten;",
      ordered: true,
      hint: "Dùng WHERE với hai điều kiện nối bằng AND, rồi ORDER BY hoten."
    },
    {
      id: "m2",
      title: "Điểm trung bình theo môn",
      prompt: "Tính điểm trung bình và số sinh viên của từng môn, chỉ giữ môn có ít nhất 2 lượt điểm. Đặt tên cột diem_tb và so_sv, sắp theo điểm trung bình giảm dần.",
      sql: "SELECT mamh, ROUND(AVG(diem), 2) AS diem_tb, COUNT(*) AS so_sv FROM diem GROUP BY mamh HAVING COUNT(*) >= 2 ORDER BY diem_tb DESC;",
      ordered: true,
      hint: "GROUP BY mamh, dùng AVG và COUNT. Điều kiện trên nhóm viết trong HAVING, không phải WHERE."
    },
    {
      id: "m3",
      title: "Ai chưa có điểm?",
      prompt: "Tìm mã và họ tên sinh viên chưa có bất kỳ dòng điểm nào. Sắp theo mã sinh viên.",
      sql: "SELECT s.masv, s.hoten FROM sinhvien s LEFT JOIN diem d ON s.masv = d.masv WHERE d.masv IS NULL ORDER BY s.masv;",
      ordered: true,
      hint: "LEFT JOIN giữ lại sinh viên không khớp; dòng không khớp có cột bên phải bằng NULL."
    },
    {
      id: "m4",
      title: "Môn học kèm tên khoa",
      prompt: "Liệt kê tên môn học và tên khoa quản lý, sắp theo mã môn.",
      sql: "SELECT m.tenmh, k.tenkhoa FROM monhoc m JOIN khoa k ON m.makhoa = k.makhoa ORDER BY m.mamh;",
      ordered: true,
      hint: "JOIN hai bảng theo makhoa. Dùng bí danh m và k cho gọn."
    },
    {
      id: "m5",
      title: "Ba điểm cao nhất môn CS201",
      prompt: "Lấy ba lượt điểm cao nhất của môn CS201, kèm họ tên sinh viên. Sắp theo điểm giảm dần.",
      sql: "SELECT s.hoten, d.diem FROM diem d JOIN sinhvien s ON s.masv = d.masv WHERE d.mamh = 'CS201' ORDER BY d.diem DESC LIMIT 3;",
      ordered: true,
      hint: "JOIN diem với sinhvien, lọc mamh, sắp giảm dần rồi LIMIT 3."
    },
    {
      id: "m6",
      title: "Sĩ số từng khoa",
      prompt: "Đếm số sinh viên của mỗi khoa, giữ cả khoa chưa có sinh viên. Hiển thị tenkhoa và so_sv, sắp theo so_sv giảm dần.",
      sql: "SELECT k.tenkhoa, COUNT(s.masv) AS so_sv FROM khoa k LEFT JOIN sinhvien s ON s.makhoa = k.makhoa GROUP BY k.tenkhoa ORDER BY so_sv DESC;",
      ordered: true,
      hint: "LEFT JOIN từ khoa sang sinhvien. COUNT(s.masv) bỏ qua NULL nên khoa rỗng trả 0."
    }
  ];

  const examples = [
    {
      id: "e1",
      label: "Xem 5 sinh viên",
      sql: "SELECT * FROM sinhvien LIMIT 5;"
    },
    {
      id: "e2",
      label: "Sinh viên trẻ nhất",
      sql: "SELECT hoten, namsinh FROM sinhvien ORDER BY namsinh DESC LIMIT 5;"
    },
    {
      id: "e3",
      label: "Sĩ số theo khoa",
      sql: "SELECT makhoa, COUNT(*) AS so_sv FROM sinhvien GROUP BY makhoa ORDER BY so_sv DESC;"
    },
    {
      id: "e4",
      label: "Bảng điểm nổi bật",
      sql: "SELECT s.hoten, m.tenmh, d.diem FROM diem d JOIN sinhvien s ON s.masv = d.masv JOIN monhoc m ON m.mamh = d.mamh ORDER BY d.diem DESC LIMIT 6;"
    }
  ];

  return { label: "Trường học nhỏ", tables, missions, examples };
})();
