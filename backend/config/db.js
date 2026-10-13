const { Pool, types } = require("pg");
const fs = require("fs");
const path = require("path");

// Giữ kiểu dữ liệu giống mssql: COUNT/SUM (bigint) và DECIMAL (numeric) trả về number
types.setTypeParser(20, (v) => parseInt(v, 10));
types.setTypeParser(1700, (v) => parseFloat(v));

const pool = new Pool({
  host: process.env.DB_HOST || "database",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "fashion",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "fashion",
  max: 10,
  idleTimeoutMillis: 30000,
});

// Postgres hạ chữ thường tên cột (Id -> id). Dựng bảng tra để trả lại PascalCase.
const caseMap = new Map();
function addNames(text) {
  for (const w of text.match(/[A-Za-z_][A-Za-z0-9_]*/g) || []) {
    if (/[A-Z]/.test(w) && /[a-z]/.test(w) && !caseMap.has(w.toLowerCase())) {
      caseMap.set(w.toLowerCase(), w);
    }
  }
}
try {
  addNames(fs.readFileSync(path.join(__dirname, "../database/schema.sql"), "utf8"));
} catch (_) {}

function prepare(text, params) {
  const names = [];
  let sqlText = text.replace(/(?<!@)@([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => {
    let i = names.indexOf(name);
    if (i === -1) { names.push(name); i = names.length - 1; }
    return "$" + (i + 1);
  });
  sqlText = sqlText
    .replace(/\bISNULL\s*\(/gi, "COALESCE(")
    .replace(/\bGETDATE\s*\(\s*\)/gi, "NOW()")
    .replace(/\bLEN\s*\(/gi, "LENGTH(");
  // alias dạng "as CategoryName" cũng cần giữ chữ hoa
  for (const m of text.matchAll(/\bas\s+\[?([A-Za-z_][A-Za-z0-9_]*)\]?/gi)) addNames(m[1]);
  sqlText = sqlText.replace(/\bNEWID\s*\(\s*\)/gi, "RANDOM()");
  const topM = sqlText.match(/^\s*SELECT\s+(DISTINCT\s+)?TOP\s*\(?\s*(\d+|\$\d+)\s*\)?\s+/i);
  if (topM) {
    sqlText = sqlText.replace(topM[0], "SELECT " + (topM[1] || "")).replace(/;\s*$/, "") + " LIMIT " + topM[2];
  }
  return { sqlText, values: names.map((n) => (params[n] === undefined ? null : params[n])) };
}

async function query(text, params = {}) {
  const { sqlText, values } = prepare(text, params);
  const res = await pool.query(sqlText, values);
  const rows = res.rows.map((row) => {
    const o = {};
    for (const k in row) o[caseMap.get(k) || k] = row[k];
    return o;
  });
  return { recordset: rows, recordsets: [rows], rowsAffected: [res.rowCount] };
}

// Giả lập pool.request().input(...).query(...) của mssql
const wrapper = {
  request() {
    const params = {};
    const req = {
      input(name, a, b) { params[name] = b === undefined ? a : b; return req; },
      query(text) { return query(text, params); },
    };
    return req;
  },
};

let ready = null;
function getPool() {
  if (!ready) {
    ready = pool.query("SELECT 1").then(() => {
      console.log("PostgreSQL connected: " + pool.options.host + " / " + pool.options.database);
      return wrapper;
    }).catch((e) => { ready = null; throw e; });
  }
  return ready;
}

module.exports = { getPool, query, sql: {} };
