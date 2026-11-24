/* DBLab — engine SQL tối giản chạy trong trình duyệt.
   Hỗ trợ SELECT, WHERE, JOIN/LEFT JOIN, GROUP BY, HAVING, ORDER BY, LIMIT,
   hàm tổng hợp và một số hàm vô hướng. Không có backend, không CDN. */
window.DBEngine = (function () {
  "use strict";

  const AGG = new Set(["COUNT", "SUM", "AVG", "MIN", "MAX"]);
  const SCALAR = new Set(["UPPER", "LOWER", "LENGTH", "ROUND", "ABS", "COALESCE", "SUBSTR"]);
  const RESERVED = new Set([
    "SELECT", "DISTINCT", "FROM", "WHERE", "GROUP", "BY", "HAVING", "ORDER",
    "LIMIT", "OFFSET", "JOIN", "INNER", "LEFT", "OUTER", "ON", "AS", "AND", "OR",
    "NOT", "IN", "IS", "NULL", "LIKE", "BETWEEN", "ASC", "DESC", "TRUE", "FALSE"
  ]);

  class SqlError extends Error {
    constructor(message, pos) {
      super(message);
      this.name = "SqlError";
      this.pos = typeof pos === "number" ? pos : null;
    }
  }

  /* ---------- Tokenizer ---------- */
  function tokenize(sql) {
    const tokens = [];
    let i = 0;
    const n = sql.length;
    while (i < n) {
      const c = sql[i];
      if (c === " " || c === "\n" || c === "\r" || c === "\t") { i += 1; continue; }
      if (c === "-" && sql[i + 1] === "-") {
        while (i < n && sql[i] !== "\n") i += 1;
        continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        let j = i + 1;
        while (j < n && /[A-Za-z0-9_$]/.test(sql[j])) j += 1;
        const word = sql.slice(i, j);
        tokens.push({ t: "word", v: word, upper: word.toUpperCase(), pos: i });
        i = j;
        continue;
      }
      if (/[0-9]/.test(c)) {
        let j = i;
        while (j < n && /[0-9]/.test(sql[j])) j += 1;
        if (sql[j] === "." && /[0-9]/.test(sql[j + 1] || "")) {
          j += 1;
          while (j < n && /[0-9]/.test(sql[j])) j += 1;
        }
        tokens.push({ t: "num", v: Number(sql.slice(i, j)), pos: i });
        i = j;
        continue;
      }
      if (c === "'") {
        let j = i + 1;
        let value = "";
        while (j < n) {
          if (sql[j] === "'" && sql[j + 1] === "'") { value += "'"; j += 2; continue; }
          if (sql[j] === "'") { j += 1; break; }
          value += sql[j];
          j += 1;
        }
        if (j > n || sql[j - 1] !== "'") throw new SqlError("Chuỗi chưa đóng dấu nháy đơn.", i);
        tokens.push({ t: "str", v: value, pos: i });
        i = j;
        continue;
      }
      const two = sql.slice(i, i + 2);
      if (two === "<=" || two === ">=" || two === "<>" || two === "!=") {
        tokens.push({ t: "op", v: two === "!=" ? "<>" : two, pos: i });
        i += 2;
        continue;
      }
      if ("=<>+-*/%()',.;".includes(c)) {
        const type = "(),;.".includes(c) ? "punc" : "op";
        tokens.push({ t: type, v: c, pos: i });
        i += 1;
        continue;
      }
      throw new SqlError(`Ký tự không hợp lệ “${c}”.`, i);
    }
    tokens.push({ t: "eof", v: "", pos: n });
    return tokens;
  }

  /* ---------- Parser ---------- */
  class Parser {
    constructor(tokens) { this.tokens = tokens; this.i = 0; }
    peek(offset) { return this.tokens[this.i + (offset || 0)]; }
    next() { const t = this.tokens[this.i]; this.i += 1; return t; }
    isWord(word, offset) { const t = this.peek(offset); return t.t === "word" && t.upper === word; }
    eatWord(word) { if (this.isWord(word)) { this.i += 1; return true; } return false; }
    expectWord(word) {
      if (!this.eatWord(word)) {
        const t = this.peek();
        throw new SqlError(`Cần “${word}” nhưng gặp “${t.v || "hết câu lệnh"}”.`, t.pos);
      }
    }
    isPunc(ch, offset) { const t = this.peek(offset); return t.t === "punc" && t.v === ch; }
    eatPunc(ch) { if (this.isPunc(ch)) { this.i += 1; return true; } return false; }
    expectPunc(ch) {
      if (!this.eatPunc(ch)) {
        const t = this.peek();
        throw new SqlError(`Thiếu dấu “${ch}” trước “${t.v || "hết câu lệnh"}”.`, t.pos);
      }
    }
    isOp(op, offset) { const t = this.peek(offset); return t.t === "op" && t.v === op; }

    parseQuery() {
      if (!this.isWord("SELECT")) {
        const t = this.peek();
        throw new SqlError("Câu lệnh cần bắt đầu bằng SELECT.", t.pos);
      }
      const select = this.parseSelect();
      this.eatPunc(";");
      if (this.peek().t !== "eof") {
        throw new SqlError("Chỉ hỗ trợ một câu SELECT mỗi lần chạy.", this.peek().pos);
      }
      return select;
    }

    parseSelect() {
      this.expectWord("SELECT");
      const distinct = this.eatWord("DISTINCT");
      const items = [];
      do {
        items.push(this.parseSelectItem());
      } while (this.eatPunc(","));
      this.expectWord("FROM");
      const from = this.parseFromItem();
      const joins = [];
      for (;;) {
        let type = "INNER";
        if (this.isWord("INNER")) { this.i += 1; this.expectWord("JOIN"); }
        else if (this.isWord("LEFT")) { this.i += 1; this.eatWord("OUTER"); this.expectWord("JOIN"); type = "LEFT"; }
        else if (this.isWord("JOIN")) { this.i += 1; }
        else break;
        const right = this.parseFromItem();
        this.expectWord("ON");
        const on = this.parseExpr();
        joins.push({ type, right, on });
      }
      let where = null;
      if (this.eatWord("WHERE")) where = this.parseExpr();
      let groupBy = [];
      if (this.isWord("GROUP")) {
        this.i += 1;
        this.expectWord("BY");
        do { groupBy.push(this.parseExpr()); } while (this.eatPunc(","));
      }
      let having = null;
      if (this.eatWord("HAVING")) having = this.parseExpr();
      const orderBy = [];
      if (this.isWord("ORDER")) {
        this.i += 1;
        this.expectWord("BY");
        do {
          const expr = this.parseExpr();
          let dir = "ASC";
          if (this.eatWord("DESC")) dir = "DESC";
          else this.eatWord("ASC");
          orderBy.push({ expr, dir });
        } while (this.eatPunc(","));
      }
      let limit = null;
      let offset = 0;
      if (this.eatWord("LIMIT")) {
        const t = this.next();
        if (t.t !== "num" || !Number.isInteger(t.v)) throw new SqlError("LIMIT cần một số nguyên.", t.pos);
        limit = t.v;
        if (this.eatWord("OFFSET")) {
          const o = this.next();
          if (o.t !== "num" || !Number.isInteger(o.v)) throw new SqlError("OFFSET cần một số nguyên.", o.pos);
          offset = o.v;
        }
      }
      return { type: "select", distinct, items, from, joins, where, groupBy, having, orderBy, limit, offset };
    }

    parseSelectItem() {
      if (this.isOp("*")) { this.i += 1; return { star: true }; }
      const t = this.peek();
      if (t.t === "word" && this.isPunc(".", 1) && this.peek(2).v === "*") {
        const qual = t.v;
        this.i += 3;
        return { star: true, qual };
      }
      const expr = this.parseExpr();
      let alias = null;
      if (this.eatWord("AS")) {
        const a = this.next();
        if (a.t !== "word") throw new SqlError("Sau AS cần tên cột.", a.pos);
        alias = a.v;
      }
      return { expr, alias };
    }

    parseFromItem() {
      if (this.eatPunc("(")) {
        const sub = this.parseSelect();
        this.expectPunc(")");
        let alias = null;
        if (this.eatWord("AS")) alias = this.next().v;
        else if (this.peek().t === "word" && !RESERVED.has(this.peek().upper)) alias = this.next().v;
        if (!alias) throw new SqlError("Truy vấn con trong FROM cần bí danh.", this.peek().pos);
        return { sub, alias };
      }
      const t = this.next();
      if (t.t !== "word") throw new SqlError("Sau FROM cần tên bảng.", t.pos);
      const table = t.v;
      let alias = table;
      if (this.eatWord("AS")) {
        const a = this.next();
        if (a.t !== "word") throw new SqlError("Sau AS cần bí danh.", a.pos);
        alias = a.v;
      } else if (this.peek().t === "word" && !RESERVED.has(this.peek().upper)) {
        alias = this.next().v;
      }
      return { table, alias };
    }

    parseExpr() { return this.parseOr(); }
    parseOr() {
      let left = this.parseAnd();
      while (this.eatWord("OR")) left = { k: "or", l: left, r: this.parseAnd() };
      return left;
    }
    parseAnd() {
      let left = this.parseNot();
      while (this.eatWord("AND")) left = { k: "and", l: left, r: this.parseNot() };
      return left;
    }
    parseNot() {
      if (this.eatWord("NOT")) return { k: "not", e: this.parseNot() };
      return this.parseCompare();
    }
    parseCompare() {
      let left = this.parseAdd();
      for (;;) {
        const t = this.peek();
        if (t.t === "op" && ["=", "<>", "<", "<=", ">", ">="].includes(t.v)) {
          this.i += 1;
          left = { k: "cmp", op: t.v, l: left, r: this.parseAdd() };
          continue;
        }
        if (this.isWord("IS")) {
          this.i += 1;
          const not = this.eatWord("NOT");
          this.expectWord("NULL");
          left = { k: "isnull", e: left, not };
          continue;
        }
        let not = false;
        if (this.isWord("NOT") && (this.isWord("LIKE", 1) || this.isWord("IN", 1) || this.isWord("BETWEEN", 1))) {
          this.i += 1;
          not = true;
        }
        if (this.eatWord("LIKE")) { left = { k: "like", e: left, pat: this.parseAdd(), not }; continue; }
        if (this.eatWord("BETWEEN")) {
          const lo = this.parseAdd();
          this.expectWord("AND");
          left = { k: "between", e: left, lo, hi: this.parseAdd(), not };
          continue;
        }
        if (this.eatWord("IN")) {
          this.expectPunc("(");
          const list = [];
          if (!this.isPunc(")")) {
            do { list.push(this.parseExpr()); } while (this.eatPunc(","));
          }
          this.expectPunc(")");
          left = { k: "in", e: left, list, not };
          continue;
        }
        return left;
      }
    }
    parseAdd() {
      let left = this.parseMul();
      for (;;) {
        if (this.isOp("+") || this.isOp("-")) {
          const op = this.next().v;
          left = { k: "arith", op, l: left, r: this.parseMul() };
          continue;
        }
        return left;
      }
    }
    parseMul() {
      let left = this.parseUnary();
      for (;;) {
        if (this.isOp("*") || this.isOp("/") || this.isOp("%")) {
          const op = this.next().v;
          left = { k: "arith", op, l: left, r: this.parseUnary() };
          continue;
        }
        return left;
      }
    }
    parseUnary() {
      if (this.isOp("-") || this.isOp("+")) {
        const op = this.next().v;
        return { k: "unary", op, e: this.parseUnary() };
      }
      return this.parsePrimary();
    }
    parsePrimary() {
      const t = this.next();
      if (t.t === "num") return { k: "num", v: t.v };
      if (t.t === "str") return { k: "str", v: t.v };
      if (t.t === "punc" && t.v === "(") {
        const e = this.parseExpr();
        this.expectPunc(")");
        return e;
      }
      if (t.t === "word") {
        if (t.upper === "NULL") return { k: "null" };
        if (t.upper === "TRUE") return { k: "bool", v: true };
        if (t.upper === "FALSE") return { k: "bool", v: false };
        if (this.isPunc("(")) {
          this.i += 1;
          const name = t.upper;
          if (!AGG.has(name) && !SCALAR.has(name)) throw new SqlError(`Hàm “${t.v}” chưa được hỗ trợ.`, t.pos);
          if (this.isOp("*")) {
            this.i += 1;
            this.expectPunc(")");
            if (name !== "COUNT") throw new SqlError(`Chỉ COUNT được dùng với *.`, t.pos);
            return { k: "func", name, star: true, args: [], pos: t.pos };
          }
          const args = [];
          if (!this.isPunc(")")) {
            do { args.push(this.parseExpr()); } while (this.eatPunc(","));
          }
          this.expectPunc(")");
          return { k: "func", name, args, star: false, pos: t.pos };
        }
        if (this.eatPunc(".")) {
          const col = this.next();
          if (col.t !== "word") throw new SqlError("Sau dấu chấm cần tên cột.", col.pos);
          return { k: "col", qual: t.v, name: col.v, pos: t.pos };
        }
        return { k: "col", qual: null, name: t.v, pos: t.pos };
      }
      throw new SqlError(`Không hiểu “${t.v || "hết câu lệnh"}”.`, t.pos);
    }
  }

  /* ---------- Helpers ---------- */
  function walk(node, fn) {
    if (!node) return;
    fn(node);
    if (node.l) walk(node.l, fn);
    if (node.r) walk(node.r, fn);
    if (node.e) walk(node.e, fn);
    if (node.pat) walk(node.pat, fn);
    if (node.lo) walk(node.lo, fn);
    if (node.hi) walk(node.hi, fn);
    if (node.args) node.args.forEach((a) => walk(a, fn));
    if (node.list) node.list.forEach((a) => walk(a, fn));
  }

  function hasAggregate(node) {
    let found = false;
    walk(node, (n) => { if (n.k === "func" && AGG.has(n.name)) found = true; });
    return found;
  }

  function quoteLike(pattern) {
    const escaped = String(pattern).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("^" + escaped.replace(/%/g, ".*").replace(/_/g, ".") + "$", "i");
  }

  function compareValues(a, b) {
    if (a === b) return 0;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b), "vi");
  }

  function truthy(v) { return v === true; }

  /* ---------- Database ---------- */
  function createDatabase(seed) {
    const db = { tables: {}, order: [] };
    seed.tables.forEach((table) => {
      const cols = table.columns.map((c) => c.name);
      db.tables[table.name] = {
        name: table.name,
        label: table.label || table.name,
        columns: table.columns.map((c) => ({ ...c })),
        columnNames: cols,
        rows: table.rows.map((row) => {
          const obj = {};
          cols.forEach((col, i) => { obj[col] = row[i] === undefined ? null : row[i]; });
          return obj;
        })
      };
      db.order.push(table.name);
    });
    return db;
  }

  function tableOf(db, name) {
    const key = Object.keys(db.tables).find((k) => k.toLowerCase() === String(name).toLowerCase());
    return key ? db.tables[key] : null;
  }

  /* ---------- Execution ---------- */
  function sourceMetadata(from, db) {
    if (from.sub) {
      const result = execSelect(from.sub, db);
      return { alias: from.alias, columns: result.labels, rows: result.rows.map((r) => {
        const obj = {};
        result.labels.forEach((label, i) => { obj[label] = r[i]; });
        return obj;
      }) };
    }
    const table = tableOf(db, from.table);
    if (!table) throw new SqlError(`Bảng “${from.table}” không tồn tại.`);
    return { alias: from.alias, columns: table.columnNames, rows: table.rows };
  }

  function buildContexts(select, db) {
    const base = sourceMetadata(select.from, db);
    const meta = [{ alias: base.alias, columns: base.columns }];
    let contexts = base.rows.map((row) => ({ sources: [{ alias: base.alias, table: select.from.table || null, row }] }));
    select.joins.forEach((join) => {
      const right = sourceMetadata(join.right, db);
      meta.push({ alias: right.alias, columns: right.columns });
      const next = [];
      contexts.forEach((ctx) => {
        let matched = false;
        right.rows.forEach((row) => {
            const combo = {
            sources: ctx.sources.concat([{ alias: right.alias, table: join.right.table || null, row }])
          };
          if (truthy(evalNode(join.on, combo))) {
            matched = true;
            next.push(combo);
          }
        });
        if (!matched && join.type === "LEFT") {
          const empty = {};
          right.columns.forEach((c) => { empty[c] = null; });
          next.push({
            sources: ctx.sources.concat([{ alias: right.alias, table: join.right.table || null, row: empty }])
          });
        }
      });
      contexts = next;
    });
    return { contexts, meta };
  }

  function resolveColumn(node, ctx, groupMode, groupCols) {
    const qual = node.qual ? node.qual.toLowerCase() : null;
    const name = node.name.toLowerCase();
    if (groupMode && !node._inAgg && groupCols && !groupCols.has(name)) {
      throw new SqlError(`Cột “${node.name}” phải nằm trong GROUP BY hoặc trong hàm tổng hợp.`, node.pos);
    }
    const matches = [];
    ctx.sources.forEach((src) => {
      if (qual) {
        const aliasHit = src.alias.toLowerCase() === qual;
        const tableHit = src.table && src.table.toLowerCase() === qual;
        if (!aliasHit && !tableHit) return;
      }
      const key = Object.keys(src.row).find((k) => k.toLowerCase() === name);
      if (key !== undefined) matches.push({ src, key });
    });
    if (!matches.length) {
      throw new SqlError(qual ? `Không tìm thấy cột “${node.name}” trong bảng “${node.qual}”.` : `Cột “${node.name}” không tồn tại.`, node.pos);
    }
    if (matches.length > 1) {
      throw new SqlError(`Cột “${node.name}” xuất hiện ở nhiều bảng, hãy ghi rõ tên bảng.`, node.pos);
    }
    return matches[0].src.row[matches[0].key];
  }

  function evalNode(node, ctx, opts) {
    const o = opts || {};
    switch (node.k) {
      case "num": case "str": case "bool": return node.v;
      case "null": return null;
      case "col": {
        if (o.groupMode) node._inAgg = Boolean(o.inAgg);
        return resolveColumn(node, ctx, o.groupMode, o.groupCols);
      }
      case "unary": {
        const v = evalNode(node.e, ctx, o);
        if (v == null) return null;
        return node.op === "-" ? -Number(v) : Number(v);
      }
      case "arith": {
        const a = evalNode(node.l, ctx, o);
        const b = evalNode(node.r, ctx, o);
        if (a == null || b == null) return null;
        if (node.op === "+") return Number(a) + Number(b);
        if (node.op === "-") return Number(a) - Number(b);
        if (node.op === "*") return Number(a) * Number(b);
        if (node.op === "/") return Number(b) === 0 ? null : Number(a) / Number(b);
        return Number(b) === 0 ? null : Number(a) % Number(b);
      }
      case "cmp": {
        const a = evalNode(node.l, ctx, o);
        const b = evalNode(node.r, ctx, o);
        if (a == null || b == null) return null;
        const c = compareValues(a, b);
        return node.op === "=" ? c === 0
          : node.op === "<>" ? c !== 0
          : node.op === "<" ? c < 0
          : node.op === "<=" ? c <= 0
          : node.op === ">" ? c > 0
          : c >= 0;
      }
      case "and": {
        const a = evalNode(node.l, ctx, o);
        if (a === false) return false;
        const b = evalNode(node.r, ctx, o);
        if (b === false) return false;
        if (a == null || b == null) return null;
        return true;
      }
      case "or": {
        const a = evalNode(node.l, ctx, o);
        if (a === true) return true;
        const b = evalNode(node.r, ctx, o);
        if (b === true) return true;
        if (a == null || b == null) return null;
        return false;
      }
      case "not": {
        const v = evalNode(node.e, ctx, o);
        return v == null ? null : !v;
      }
      case "isnull": {
        const v = evalNode(node.e, ctx, o);
        return node.not ? v != null : v == null;
      }
      case "like": {
        const v = evalNode(node.e, ctx, o);
        const p = evalNode(node.pat, ctx, o);
        if (v == null || p == null) return null;
        const hit = quoteLike(p).test(String(v));
        return node.not ? !hit : hit;
      }
      case "between": {
        const v = evalNode(node.e, ctx, o);
        const lo = evalNode(node.lo, ctx, o);
        const hi = evalNode(node.hi, ctx, o);
        if (v == null || lo == null || hi == null) return null;
        const inside = compareValues(v, lo) >= 0 && compareValues(v, hi) <= 0;
        return node.not ? !inside : inside;
      }
      case "in": {
        const v = evalNode(node.e, ctx, o);
        if (v == null) return null;
        let found = false;
        let hasNull = false;
        node.list.forEach((item) => {
          const x = evalNode(item, ctx, o);
          if (x == null) hasNull = true;
          else if (compareValues(v, x) === 0) found = true;
        });
        if (!found && hasNull && !node.not) return null;
        return node.not ? !found : found;
      }
      case "func": {
        if (AGG.has(node.name)) {
          if (!ctx.group) throw new SqlError(`Hàm tổng hợp ${node.name} cần ngữ cảnh nhóm; hãy dùng GROUP BY.`, node.pos);
          const rows = ctx.group;
          if (node.name === "COUNT") {
            if (node.star) return rows.length;
            let count = 0;
            rows.forEach((rowCtx) => {
              if (evalNode(node.args[0], rowCtx, { ...o, groupMode: false }) != null) count += 1;
            });
            return count;
          }
          const values = [];
          rows.forEach((rowCtx) => {
            const v = evalNode(node.args[0], rowCtx, { ...o, groupMode: false });
            if (v != null) values.push(v);
          });
          if (!values.length) return null;
          if (node.name === "SUM") return values.reduce((sum, v) => sum + Number(v), 0);
          if (node.name === "AVG") return values.reduce((sum, v) => sum + Number(v), 0) / values.length;
          if (node.name === "MIN") return values.reduce((a, b) => (compareValues(b, a) < 0 ? b : a));
          return values.reduce((a, b) => (compareValues(b, a) > 0 ? b : a));
        }
        const args = node.args.map((arg) => evalNode(arg, ctx, o));
        switch (node.name) {
          case "UPPER": return args[0] == null ? null : String(args[0]).toUpperCase();
          case "LOWER": return args[0] == null ? null : String(args[0]).toLowerCase();
          case "LENGTH": return args[0] == null ? null : String(args[0]).length;
          case "ABS": return args[0] == null ? null : Math.abs(Number(args[0]));
          case "ROUND": {
            if (args[0] == null) return null;
            const digits = args[1] == null ? 0 : Number(args[1]);
            const factor = Math.pow(10, digits);
            return Math.round(Number(args[0]) * factor) / factor;
          }
          case "COALESCE": {
            for (const a of args) if (a != null) return a;
            return null;
          }
          case "SUBSTR": {
            if (args[0] == null) return null;
            const start = Number(args[1] || 1);
            const len = args[2] == null ? undefined : Number(args[2]);
            return String(args[0]).substr(Math.max(0, start - 1), len);
          }
          default: throw new SqlError(`Hàm ${node.name} chưa được hỗ trợ.`, node.pos);
        }
      }
      default:
        throw new SqlError("Biểu thức chưa được hỗ trợ.");
    }
  }

  function labelOf(item) {
    if (item.alias) return item.alias;
    const e = item.expr;
    if (e.k === "col") return e.name;
    if (e.k === "func") return e.name;
    return "biểu thức";
  }

  function resultKey(values) {
    return JSON.stringify(values.map((v) => (v === null ? null : typeof v + ":" + String(v))));
  }

  function execSelect(select, db) {
    const { contexts } = buildContexts(select, db);
    const baseMeta = sourceMetadata(select.from, db);
    const meta = [{ alias: baseMeta.alias, columns: baseMeta.columns }];
    select.joins.forEach((j) => {
      const m = sourceMetadata(j.right, db);
      meta.push({ alias: m.alias, columns: m.columns });
    });

    let rowsCtx = select.where
      ? contexts.filter((ctx) => truthy(evalNode(select.where, ctx)))
      : contexts;

    const aggregate = select.groupBy.length > 0
      || select.items.some((it) => it.expr && hasAggregate(it.expr))
      || (select.having && hasAggregate(select.having));

    const groupCols = new Set();
    select.groupBy.forEach((g) => {
      walk(g, (n) => { if (n.k === "col") groupCols.add(n.name.toLowerCase()); });
    });

    let units;
    if (aggregate) {
      if (select.groupBy.length) {
        const map = new Map();
        rowsCtx.forEach((ctx) => {
          const key = JSON.stringify(select.groupBy.map((g) => evalNode(g, ctx)));
          if (!map.has(key)) map.set(key, []);
          map.get(key).push(ctx);
        });
        units = Array.from(map.values()).map((group) => ({ group, ctx: group[0] }));
      } else {
        units = [{ group: rowsCtx, ctx: rowsCtx[0] || { sources: [] } }];
      }
    } else {
      units = rowsCtx.map((ctx) => ({ group: null, ctx }));
    }

    if (select.having) {
      units = units.filter((unit) => truthy(evalNode(select.having, {
        ...unit.ctx,
        group: unit.group
      }, { groupMode: aggregate, groupCols })));
    }

    const labels = [];
    const starSources = meta.filter((m) => !select.items.some((it) => it.star && it.qual)
      || select.items.some((it) => it.star && (!it.qual || it.qual.toLowerCase() === m.alias.toLowerCase())));
    select.items.forEach((it) => {
      if (!it.star) { labels.push(labelOf(it)); return; }
      const chosen = it.qual
        ? meta.filter((m) => m.alias.toLowerCase() === it.qual.toLowerCase())
        : starSources;
      if (!chosen.length) throw new SqlError(`Không tìm thấy bảng “${it.qual}”.`);
      chosen.forEach((m) => m.columns.forEach((c) => labels.push(c)));
    });

    let out = units.map((unit) => {
      const ctx = { ...unit.ctx, group: unit.group };
      const opts = aggregate ? { groupMode: true, groupCols } : {};
      const values = [];
      select.items.forEach((it) => {
        if (!it.star) {
          values.push(evalNode(it.expr, ctx, opts));
          return;
        }
        const chosen = it.qual
          ? meta.filter((m) => m.alias.toLowerCase() === it.qual.toLowerCase())
          : meta;
        chosen.forEach((m) => m.columns.forEach((c) => {
          const node = { k: "col", qual: m.alias, name: c, pos: 0 };
          values.push(evalNode(node, ctx, opts));
        }));
      });
      return { values, ctx, group: unit.group };
    });

    if (select.orderBy.length) {
      out = out.slice().sort((a, b) => {
        for (const item of select.orderBy) {
          let va;
          let vb;
          const simple = item.expr.k === "col" && !item.expr.qual;
          const labelIndex = simple ? labels.findIndex((l) => l.toLowerCase() === item.expr.name.toLowerCase()) : -1;
          if (labelIndex >= 0) {
            va = a.values[labelIndex];
            vb = b.values[labelIndex];
          } else {
            const opts = aggregate ? { groupMode: true, groupCols } : {};
            va = evalNode(item.expr, a.ctx, opts);
            vb = evalNode(item.expr, b.ctx, opts);
          }
          if (va == null && vb == null) continue;
          if (va == null) return 1;
          if (vb == null) return -1;
          const c = compareValues(va, vb);
          if (c !== 0) return item.dir === "DESC" ? -c : c;
        }
        return 0;
      });
    }

    if (select.distinct) {
      const seen = new Set();
      out = out.filter((row) => {
        const key = resultKey(row.values);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    let values = out.map((r) => r.values);
    if (select.limit != null) values = values.slice(select.offset || 0, (select.offset || 0) + select.limit);
    else if (select.offset) values = values.slice(select.offset);

    return { labels, rows: values };
  }

  function now() {
    return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
  }

  function run(sql, db) {
    const started = now();
    const tokens = tokenize(sql);
    const parser = new Parser(tokens);
    const ast = parser.parseQuery();
    const result = execSelect(ast, db);
    const elapsed = now() - started;
    return { columns: result.labels, rows: result.rows, elapsed };
  }

  function sameResult(a, b, ordered) {
    if (!a || !b || a.columns.length !== b.columns.length || a.rows.length !== b.rows.length) return false;
    const norm = (rows) => rows.map((r) => JSON.stringify(r.map((v) => {
      if (v == null) return null;
      if (typeof v === "number") return Math.round(v * 1e6) / 1e6;
      return String(v);
    })));
    const ra = norm(a.rows);
    const rb = norm(b.rows);
    if (!ordered) { ra.sort(); rb.sort(); }
    return ra.every((r, i) => r === rb[i]);
  }

  function errorLocation(sql, pos) {
    if (pos == null) return null;
    const before = sql.slice(0, pos);
    const line = before.split("\n").length;
    const col = pos - before.lastIndexOf("\n");
    return { line, col };
  }

  return { run, createDatabase, sameResult, errorLocation, SqlError };
})();
