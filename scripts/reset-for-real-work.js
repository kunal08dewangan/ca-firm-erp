const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function cleanAndInitProduction() {
  console.log("==================================================================");
  console.log("      INITIALIZING PRODUCTION ERP FOR REAL CA PRACTICE WORK       ");
  console.log("==================================================================\n");

  console.log("1. Removing all demo & mock records...");
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.task.deleteMany();
  await prisma.document.deleteMany();
  await prisma.rocRecord.deleteMany();
  await prisma.auditObservation.deleteMany();
  await prisma.auditChecklist.deleteMany();
  await prisma.auditRecord.deleteMany();
  await prisma.tdsEntry.deleteMany();
  await prisma.voucherEntry.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.account.deleteMany();
  await prisma.itrFiling.deleteMany();
  await prisma.taxComputation.deleteMany();
  await prisma.deductionEntry.deleteMany();
  await prisma.incomeEntry.deleteMany();
  await prisma.itrProfile.deleteMany();
  await prisma.gstReturn.deleteMany();
  await prisma.gstPurchaseEntry.deleteMany();
  await prisma.gstSalesEntry.deleteMany();
  await prisma.gstRegistration.deleteMany();
  await prisma.business.deleteMany();
  await prisma.client.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.auditLog.deleteMany();
  console.log("✓ All mock clients, transactions, invoices, and vouchers removed.");

  // Read details from environment or use defaults
  const realEmail = process.env.ADMIN_DEFAULT_EMAIL || "gajendradewangan@gmail.com";
  const realPassword = process.env.ADMIN_DEFAULT_PASSWORD || "AdminSecure@CA2026!";
  const realFullName = process.env.NEXT_PUBLIC_LEAD_PARTNER || "Gajendra Dewangan";

  console.log(`\n2. Creating your official Administrator account (${realEmail})...`);
  const passwordHash = await bcrypt.hash(realPassword, 12);

  // Delete any existing admin accounts and create the clean real admin
  await prisma.admin.deleteMany();

  const realAdmin = await prisma.admin.create({
    data: {
      email: realEmail.trim().toLowerCase(),
      passwordHash: passwordHash,
      fullName: realFullName.trim(),
      membershipNo: null,
      role: "TAX_CONSULTANT",
      twoFactorEnabled: false,
    },
  });

  // Log initialization event in immutable audit log
  await prisma.auditLog.create({
    data: {
      adminId: realAdmin.id,
      action: "PRODUCTION_INITIALIZED",
      module: "SYSTEM",
      recordId: realAdmin.id,
      diff: `Production CA Management ERP initialized for ${realAdmin.fullName} (${realAdmin.email})`,
    },
  });

  console.log("\n==================================================================");
  console.log("🎉 PRODUCTION SETUP COMPLETE — READY FOR YOUR REAL WORK!");
  console.log("==================================================================");
  console.log(` Admin Portal URL:  http://localhost:3000/admin-login`);
  console.log(` Login Email:       ${realAdmin.email}`);
  console.log(` Login Password:    ${realPassword}`);
  console.log(` Practicing CA:     ${realAdmin.fullName}`);
  console.log("==================================================================");
  console.log("Database is 100% clean. You can now add your real clients,");
  console.log("GST registrations, PAN numbers, and live practice vouchers!\n");
}

cleanAndInitProduction()
  .catch((e) => {
    console.error("Setup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
