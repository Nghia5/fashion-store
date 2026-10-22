const fs = require("fs");
const path = require("path");

const usePostgres = Boolean(process.env.DB_HOST || process.env.DB_CLIENT === "postgres");

let getPool;
let query;
let sqlExport = {};

if (usePostgres) {
  // ==========================================
  // POSTGRESQL MODE (Used on EC2 / Docker)
  // ==========================================
  const { Pool, types } = require("pg");

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
    for (const m of text.matchAll(/\bas\s+\[?([A-Za-z_][A-Za-z0-9_]*)\]?/gi)) addNames(m[1]);
    sqlText = sqlText.replace(/\bNEWID\s*\(\s*\)/gi, "RANDOM()");
    const topM = sqlText.match(/^\s*SELECT\s+(DISTINCT\s+)?TOP\s*\(?\s*(\d+|\$\d+)\s*\)?\s+/i);
    if (topM) {
      sqlText = sqlText.replace(topM[0], "SELECT " + (topM[1] || "")).replace(/;\s*$/, "") + " LIMIT " + topM[2];
    }
    return { sqlText, values: names.map((n) => (params[n] === undefined ? null : params[n])) };
  }

  async function pgQuery(text, params = {}) {
    const { sqlText, values } = prepare(text, params);
    const res = await pool.query(sqlText, values);
    const rows = res.rows.map((row) => {
      const o = {};
      for (const k in row) o[caseMap.get(k) || k] = row[k];
      return o;
    });
    return { recordset: rows, recordsets: [rows], rowsAffected: [res.rowCount] };
  }

  const wrapper = {
    request() {
      const params = {};
      const req = {
        input(name, a, b) { params[name] = b === undefined ? a : b; return req; },
        query(text) { return pgQuery(text, params); },
      };
      return req;
    },
  };

  let ready = null;
  getPool = function() {
    if (!ready) {
      ready = pool.query("SELECT 1").then(() => {
        console.log("PostgreSQL connected: " + pool.options.host + " / " + pool.options.database);
        return wrapper;
      }).catch((e) => { ready = null; throw e; });
    }
    return ready;
  };
  query = pgQuery;
} else {
  // ==========================================
  // SQL SERVER (MSSQL) MODE (Used locally)
  // ==========================================
  const sql = require("mssql");
  sqlExport = sql;

  const config = {
    user: process.env.DB_USER || "fashionapp",
    password: process.env.DB_PASS || "FashionApp@2024",
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_NAME || "FashionStoreDB",
    options: {
      trustServerCertificate: true,
      enableArithAbort: true,
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  };

  let mssqlPool = null;

  getPool = async function() {
    if (!mssqlPool) {
      mssqlPool = await sql.connect(config);
      console.log("SQL Server Connected: " + config.server + " / " + config.database);
    }
    return mssqlPool;
  };

  query = async function(text, params = {}) {
    let mssqlText = text.replace(
      /INSERT\s+INTO\s+([A-Za-z0-9_]+)\s*\((.*?)\)\s+VALUES\s*\((.*?)\)\s+RETURNING\s+([A-Za-z0-9_]+)/gi,
      "INSERT INTO $1 ($2) OUTPUT INSERTED.$4 VALUES ($3)"
    );
    const p = await getPool();
    const request = p.request();
    Object.entries(params).forEach(([key, val]) => {
      if (val === null || val === undefined) {
        request.input(key, sql.NVarChar, null);
      } else {
        request.input(key, val);
      }
    });
    return request.query(mssqlText);
  };
}

module.exports = { getPool, query, sql: sqlExport };
