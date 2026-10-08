const sql = require("mssql");

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

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log("SQL Server Connected: " + config.server + " / " + config.database);
  }
  return pool;
}

async function query(text, params = {}) {
  const p = await getPool();
  const request = p.request();
  Object.entries(params).forEach(([key, val]) => {
    if (val === null || val === undefined) {
      request.input(key, sql.NVarChar, null);
    } else {
      request.input(key, val);
    }
  });
  return request.query(text);
}

module.exports = { getPool, query, sql };
