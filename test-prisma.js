const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');

const libsql = createClient({
  url: "file:./dev.db",
});
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

prisma.user.findFirst().then(console.log).catch(console.error);
