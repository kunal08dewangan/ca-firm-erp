const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with professional CA firm data...");

  // Clean existing non-admin data for idempotent seeding
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

  // 1. Create Default CA Admin Account
  const passwordHash = await bcrypt.hash("AdminSecure@CA2026!", 12);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@cafirm.in" },
    update: {},
    create: {
      email: "admin@cafirm.in",
      passwordHash: passwordHash,
      fullName: "CA Vikramaditya Singhania, FCA, DISA",
      membershipNo: "084920",
      role: "CHARTERED_ACCOUNTANT",
      twoFactorEnabled: false,
    },
  });
  console.log(`✓ Admin user created: ${admin.email}`);

  // 2. Create Clients
  const client1 = await prisma.client.upsert({
    where: { panNormalized: "AAACS1234D" },
    update: {},
    create: {
      clientCode: "CL-2026-0001",
      name: "Sharma Infotech Solutions Pvt Ltd",
      clientType: "PRIVATE_LIMITED",
      pan: "AAACS1234D",
      panNormalized: "AAACS1234D",
      mobile: "+91 98112 34567",
      email: "accounts@sharmainfotech.com",
      addressLine1: "Tower B, 6th Floor, Cyber City",
      addressLine2: "DLF Phase 2",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      status: "ACTIVE",
      assignedCAId: admin.id,
      notes: "SaaS software product firm. Regular GST & Quarterly Advance Tax client.",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { panNormalized: "AAPPR9876E" },
    update: {},
    create: {
      clientCode: "CL-2026-0002",
      name: "Rajesh Kumar (M/s Rajesh Garments)",
      clientType: "PROPRIETORSHIP",
      pan: "AAPPR9876E",
      panNormalized: "AAPPR9876E",
      mobile: "+91 98200 45678",
      email: "rajesh@rajeshgarments.in",
      addressLine1: "Shop No. 14, Gandhi Cloth Market",
      city: "Delhi",
      state: "Delhi",
      pincode: "110006",
      status: "ACTIVE",
      assignedCAId: admin.id,
      notes: "Wholesale & retail textile dealer. GSTR-1, GSTR-3B & Tax Audit u/s 44AB.",
    },
  });

  const client3 = await prisma.client.upsert({
    where: { panNormalized: "AABFA4567F" },
    update: {},
    create: {
      clientCode: "CL-2026-0003",
      name: "Apex Healthcare & Diagnostic LLP",
      clientType: "LLP",
      pan: "AABFA4567F",
      panNormalized: "AABFA4567F",
      mobile: "+91 94480 87654",
      email: "compliance@apexdiagnostic.com",
      addressLine1: "Plot 24, Indiranagar 100ft Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      status: "ACTIVE",
      assignedCAId: admin.id,
      notes: "Pathology lab chain. ROC Form 11 & Form 8 compliance, GST exempt services + taxable diagnostic kits.",
    },
  });
  console.log("✓ Clients seeded");

  // 3. Businesses & GSTINs
  const biz1 = await prisma.business.create({
    data: {
      clientId: client1.id,
      tradeName: "Sharma Infotech Solutions",
      legalName: "Sharma Infotech Solutions Private Limited",
      constitution: "PRIVATE_LIMITED",
      cin: "U72200HR2018PTC078912",
      registeredState: "Haryana",
      natureOfBusiness: "Software Design and Cloud Consulting",
    },
  });

  const gstin1 = await prisma.gstRegistration.create({
    data: {
      businessId: biz1.id,
      gstin: "06AAACS1234D1Z8",
      stateCode: "06",
      tradeName: "Sharma Infotech Solutions - Haryana",
      registrationType: "REGULAR",
      status: "ACTIVE",
      registrationDate: new Date("2018-06-15"),
    },
  });

  const biz2 = await prisma.business.create({
    data: {
      clientId: client2.id,
      tradeName: "Rajesh Garments",
      legalName: "Rajesh Kumar",
      constitution: "PROPRIETORSHIP",
      registeredState: "Delhi",
      natureOfBusiness: "Retail & Wholesale of Ready-made Garments",
    },
  });

  const gstin2 = await prisma.gstRegistration.create({
    data: {
      businessId: biz2.id,
      gstin: "07AAPPR9876E1Z5",
      stateCode: "07",
      tradeName: "Rajesh Garments - Delhi",
      registrationType: "REGULAR",
      status: "ACTIVE",
      registrationDate: new Date("2019-09-01"),
    },
  });
  console.log("✓ Businesses & GST Registrations seeded");

  // 4. GST Sales & Purchases
  await prisma.gstSalesEntry.createMany({
    data: [
      {
        gstRegistrationId: gstin1.id,
        invoiceNumber: "INV-2026-0101",
        invoiceDate: new Date("2026-10-05"),
        invoiceType: "B2B",
        customerName: "Cognizant Solutions Pvt Ltd",
        customerGstin: "27AABCC8989Q1Z2",
        placeOfSupply: "27", // Maharashtra (Inter-state)
        supplyType: "INTER_STATE",
        hsnCode: "998314",
        taxableAmount: 450000.0,
        gstRate: 18.0,
        cgstAmount: 0.0,
        sgstAmount: 0.0,
        igstAmount: 81000.0,
        totalAmount: 531000.0,
        gstr1Period: "102026",
        isFiledGstr1: false,
      },
      {
        gstRegistrationId: gstin1.id,
        invoiceNumber: "INV-2026-0102",
        invoiceDate: new Date("2026-10-18"),
        invoiceType: "B2B",
        customerName: "Gurugram Tech Labs Ltd",
        customerGstin: "06AABCG5555M1Z1",
        placeOfSupply: "06", // Haryana (Intra-state)
        supplyType: "INTRA_STATE",
        hsnCode: "998313",
        taxableAmount: 200000.0,
        gstRate: 18.0,
        cgstAmount: 18000.0,
        sgstAmount: 18000.0,
        igstAmount: 0.0,
        totalAmount: 236000.0,
        gstr1Period: "102026",
        isFiledGstr1: false,
      },
    ],
  });

  await prisma.gstPurchaseEntry.createMany({
    data: [
      {
        gstRegistrationId: gstin1.id,
        supplierName: "AWS Cloud India Pvt Ltd",
        supplierGstin: "07AAACA4444N1Z3",
        invoiceNumber: "AWS-IN-98721",
        invoiceDate: new Date("2026-10-02"),
        placeOfSupply: "06",
        supplyType: "INTER_STATE",
        taxableAmount: 120000.0,
        gstRate: 18.0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 21600.0,
        totalAmount: 141600.0,
        itcEligibility: "INPUT_SERVICES",
        gstr2bPeriod: "102026",
        isMatched2B: true,
        matchStatus: "EXACT",
      },
      {
        gstRegistrationId: gstin1.id,
        supplierName: "Sterling Executive Lounge & Club",
        supplierGstin: "06AABCS9999K1Z6",
        invoiceNumber: "CLUB-8871",
        invoiceDate: new Date("2026-10-12"),
        placeOfSupply: "06",
        supplyType: "INTRA_STATE",
        taxableAmount: 45000.0,
        gstRate: 18.0,
        cgstAmount: 4050.0,
        sgstAmount: 4050.0,
        igstAmount: 0,
        totalAmount: 53100.0,
        itcEligibility: "INELIGIBLE_17_5", // Blocked under Sec 17(5)
        gstr2bPeriod: "102026",
        isMatched2B: true,
        matchStatus: "EXACT",
      },
    ],
  });

  // 5. GST Returns summary
  await prisma.gstReturn.createMany({
    data: [
      {
        gstRegistrationId: gstin1.id,
        returnType: "GSTR_1",
        financialYear: "2026-27",
        returnPeriod: "102026",
        dueDate: new Date("2026-11-11"),
        status: "NOT_FILED",
        totalTaxLiability: 99000.0,
        itcClaimed: 0,
      },
      {
        gstRegistrationId: gstin1.id,
        returnType: "GSTR_3B",
        financialYear: "2026-27",
        returnPeriod: "102026",
        dueDate: new Date("2026-11-20"),
        status: "NOT_FILED",
        totalTaxLiability: 99000.0,
        itcClaimed: 21600.0,
        taxPaidCash: 77400.0,
      },
    ],
  });
  console.log("✓ GST Entries & Returns seeded");

  // 6. Income Tax Profiles & Computations
  const itrProf1 = await prisma.itrProfile.create({
    data: {
      clientId: client2.id,
      financialYear: "2025-26",
      assessmentYear: "2026-27",
      itrForm: "ITR_3",
      chosenRegime: "NEW_REGIME_115BAC",
      residentialStatus: "RESIDENT",
      isSeniorCitizen: false,
    },
  });

  await prisma.incomeEntry.createMany({
    data: [
      {
        itrProfileId: itrProf1.id,
        head: "BUSINESS_PROFESSION",
        description: "Net Profit from Textile Wholesale & Retail Trading",
        grossAmount: 1450000.0,
        netAmount: 1450000.0,
      },
      {
        itrProfileId: itrProf1.id,
        head: "OTHER_SOURCES",
        description: "Bank Fixed Deposit Interest & Savings Interest",
        grossAmount: 48000.0,
        netAmount: 48000.0,
      },
    ],
  });

  await prisma.taxComputation.createMany({
    data: [
      {
        itrProfileId: itrProf1.id,
        regime: "NEW_REGIME_115BAC",
        grossTotalIncome: 1498000.0,
        totalDeductions: 0.0,
        totalTaxableIncome: 1498000.0,
        taxOnNormalIncome: 149600.0,
        rebate87A: 0.0,
        taxAfterRebate: 149600.0,
        surcharge: 0.0,
        marginalRelief: 0.0,
        healthEducationCess: 5984.0,
        totalTaxLiability: 155584.0,
        tdsCredit: 12000.0,
        advanceTaxPaid: 130000.0,
        netTaxPayable: 13584.0,
        refundDue: 0.0,
        isRecommendedRegime: true,
      },
      {
        itrProfileId: itrProf1.id,
        regime: "OLD_REGIME",
        grossTotalIncome: 1498000.0,
        totalDeductions: 150000.0, // 80C
        totalTaxableIncome: 1348000.0,
        taxOnNormalIncome: 216900.0,
        rebate87A: 0.0,
        taxAfterRebate: 216900.0,
        surcharge: 0.0,
        marginalRelief: 0.0,
        healthEducationCess: 8676.0,
        totalTaxLiability: 225576.0,
        tdsCredit: 12000.0,
        advanceTaxPaid: 130000.0,
        netTaxPayable: 83576.0,
        refundDue: 0.0,
        isRecommendedRegime: false,
      },
    ],
  });

  // 7. Chart of Accounts & Vouchers for Business 1
  const cashAcct = await prisma.account.create({
    data: {
      businessId: biz1.id,
      accountCode: "1001",
      accountName: "Cash on Hand",
      accountType: "ASSET",
      isDebitBalance: true,
      openingBalance: 25000.0,
      currentBalance: 25000.0,
      isSystemAccount: true,
    },
  });

  const bankAcct = await prisma.account.create({
    data: {
      businessId: biz1.id,
      accountCode: "1010",
      accountName: "HDFC Bank Current A/c - 50200012345",
      accountType: "ASSET",
      isDebitBalance: true,
      openingBalance: 1420000.0,
      currentBalance: 1740000.0,
      isSystemAccount: true,
    },
  });

  const debtorAcct = await prisma.account.create({
    data: {
      businessId: biz1.id,
      accountCode: "1100",
      accountName: "Cognizant Solutions Pvt Ltd (Debtor)",
      accountType: "ASSET",
      isDebitBalance: true,
      openingBalance: 0.0,
      currentBalance: 531000.0,
    },
  });

  const revenueAcct = await prisma.account.create({
    data: {
      businessId: biz1.id,
      accountCode: "4001",
      accountName: "Software Consulting Revenue",
      accountType: "REVENUE",
      isDebitBalance: false,
      openingBalance: 0.0,
      currentBalance: 450000.0,
    },
  });

  const igstOutputAcct = await prisma.account.create({
    data: {
      businessId: biz1.id,
      accountCode: "2110",
      accountName: "IGST Output Liability",
      accountType: "LIABILITY",
      isDebitBalance: false,
      openingBalance: 0.0,
      currentBalance: 81000.0,
    },
  });

  const capitalAcct = await prisma.account.create({
    data: {
      businessId: biz1.id,
      accountCode: "3001",
      accountName: "Shareholders Capital / Equity",
      accountType: "EQUITY",
      isDebitBalance: false,
      openingBalance: 1445000.0,
      currentBalance: 1445000.0,
      isSystemAccount: true,
    },
  });

  // Balanced Sales Voucher: Debit Debtor 5,31,000 | Credit Revenue 4,50,000 + Credit IGST 81,000
  const v1 = await prisma.voucher.create({
    data: {
      businessId: biz1.id,
      voucherType: "SALES",
      voucherNumber: "SV-2026-0001",
      voucherDate: new Date("2026-10-05"),
      narration: "Being Software services provided to Cognizant Solutions under Inv INV-2026-0101",
      status: "POSTED",
      totalDebit: 531000.0,
      totalCredit: 531000.0,
      entries: {
        create: [
          {
            accountId: debtorAcct.id,
            debit: 531000.0,
            credit: 0.0,
            particulars: "To Sales & IGST",
          },
          {
            accountId: revenueAcct.id,
            debit: 0.0,
            credit: 450000.0,
            particulars: "By Cognizant Solutions",
          },
          {
            accountId: igstOutputAcct.id,
            debit: 0.0,
            credit: 81000.0,
            particulars: "By IGST 18%",
          },
        ],
      },
    },
  });
  console.log(`✓ Accounting Voucher created with balanced Debit & Credit: ${v1.voucherNumber}`);

  // 8. Tasks & Compliance Deadlines
  await prisma.task.createMany({
    data: [
      {
        title: "File GSTR-1 for Sharma Infotech (Oct 2026)",
        description: "Verify B2B invoices and HSN summary before upload.",
        clientId: client1.id,
        assignedToId: admin.id,
        priority: "HIGH",
        status: "TODO",
        dueDate: new Date("2026-11-11"),
        category: "GST_FILING",
      },
      {
        title: "Finalize Tax Audit Form 3CD for Rajesh Garments",
        description: "Reconcile depreciation schedule and quantitative stock details.",
        clientId: client2.id,
        assignedToId: admin.id,
        priority: "URGENT",
        status: "IN_PROGRESS",
        dueDate: new Date("2026-11-15"),
        category: "AUDIT",
      },
      {
        title: "Advance Tax Q3 Calculation & Challan Generation",
        description: "Assess estimated net income for FY 2026-27 and compute 75% installment.",
        clientId: client1.id,
        assignedToId: admin.id,
        priority: "MEDIUM",
        status: "TODO",
        dueDate: new Date("2026-12-15"),
        category: "ITR",
      },
    ],
  });

  // 9. Invoices & Billing
  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0042",
      clientId: client1.id,
      invoiceDate: new Date("2026-10-01"),
      dueDate: new Date("2026-10-15"),
      subtotal: 35000.0,
      cgstRate: 9.0,
      cgstAmount: 3150.0,
      sgstRate: 9.0,
      sgstAmount: 3150.0,
      igstRate: 0.0,
      igstAmount: 0.0,
      totalAmount: 41300.0,
      paidAmount: 41300.0,
      balanceDue: 0.0,
      status: "PAID",
      items: {
        create: [
          {
            description: "Statutory Audit & Tax Filing Professional Fees Q2",
            sacCode: "998222",
            quantity: 1,
            unitPrice: 35000.0,
            amount: 35000.0,
          },
        ],
      },
      payments: {
        create: {
          paymentDate: new Date("2026-10-10"),
          amount: 41300.0,
          paymentMode: "NEFT_RTGS",
          referenceNo: "HDFCN26101099231",
        },
      },
    },
  });

  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0043",
      clientId: client2.id,
      invoiceDate: new Date("2026-10-20"),
      dueDate: new Date("2026-11-05"),
      subtotal: 18000.0,
      cgstRate: 9.0,
      cgstAmount: 1620.0,
      sgstRate: 9.0,
      sgstAmount: 1620.0,
      igstRate: 0.0,
      igstAmount: 0.0,
      totalAmount: 21240.0,
      paidAmount: 0.0,
      balanceDue: 21240.0,
      status: "ISSUED",
      items: {
        create: [
          {
            description: "Monthly GST Return Filing & Bookkeeping Retainer (Oct 2026)",
            sacCode: "998222",
            quantity: 1,
            unitPrice: 18000.0,
            amount: 18000.0,
          },
        ],
      },
    },
  });
  console.log("✓ Invoices & Billing seeded");

  // 10. Audit Records & Observations
  await prisma.auditRecord.create({
    data: {
      clientId: client1.id,
      auditType: "STATUTORY_AUDIT_MCA",
      financialYear: "2025-26",
      leadAuditor: "CA Vikramaditya Singhania",
      auditStatus: "FIELD_WORK",
      checklists: {
        create: [
          { itemText: "Bank Reconciliation Statement verified with all bank certificates", isCompleted: true },
          { itemText: "Fixed Assets Register physical verification report reconciled", isCompleted: true },
          { itemText: "Section 185/186 Loans & Investments compliance checked", isCompleted: false },
          { itemText: "MSME vendor payments within 45 days (Section 43B(h)) verification", isCompleted: true },
        ],
      },
      observations: {
        create: [
          {
            category: "STATUTORY_NON_COMPLIANCE",
            description: "Two MSME vendor payments delayed beyond 45 days. Disallowance u/s 43B(h) applicable unless paid before year-end.",
            severity: "HIGH",
            managementResponse: "Client instructed finance team to clear all pending MSME dues by this week.",
            isResolved: false,
          },
        ],
      },
    },
  });

  // 10b. TDS & TCS Entries
  await prisma.tdsEntry.createMany({
    data: [
      {
        clientId: client1.id,
        sectionCode: "194J",
        deducteePan: "AACCA1122D",
        deducteeName: "Alpha Cloud Consultants",
        paymentDate: new Date("2026-10-04"),
        taxableAmount: 100000.0,
        tdsRate: 10.0,
        tdsDeducted: 10000.0,
        challanNumber: "CHL-2026-9812",
        bsrCode: "0210045",
        depositDate: new Date("2026-10-07"),
        quarter: "Q3",
        financialYear: "2026-27",
      },
      {
        clientId: client1.id,
        sectionCode: "194C",
        deducteePan: "ABCPD4455K",
        deducteeName: "FastTrack Logistics & Couriers",
        paymentDate: new Date("2026-10-14"),
        taxableAmount: 50000.0,
        tdsRate: 2.0,
        tdsDeducted: 1000.0,
        quarter: "Q3",
        financialYear: "2026-27",
      },
    ],
  });

  // 10c. ROC Compliance Filings
  await prisma.rocRecord.createMany({
    data: [
      {
        businessId: biz1.id,
        formName: "AOC-4",
        financialYear: "2025-26",
        dueDate: new Date("2026-10-30"),
        filingDate: new Date("2026-10-28"),
        srnNumber: "F12345678",
        status: "COMPLETED",
      },
      {
        businessId: biz1.id,
        formName: "MGT-7",
        financialYear: "2025-26",
        dueDate: new Date("2026-11-29"),
        status: "PENDING",
      },
      {
        businessId: biz1.id,
        formName: "DIR-3_KYC",
        financialYear: "2026-27",
        dueDate: new Date("2026-09-30"),
        filingDate: new Date("2026-09-25"),
        srnNumber: "K98765432",
        status: "COMPLETED",
      },
    ],
  });

  // 10d. Document Vault Files
  await prisma.document.createMany({
    data: [
      {
        clientId: client1.id,
        title: "GSTR-3B_Oct2026_Acknowledgement.pdf",
        category: "GST",
        financialYear: "2026-27",
        fileUrl: `/vault/clients/${client1.id}/gst_3b_oct2026.pdf`,
        fileMimeType: "application/pdf",
        fileSizeBytes: 248590,
      },
      {
        clientId: client1.id,
        title: "Form_3CD_Tax_Audit_Report_FY2526.pdf",
        category: "BALANCE_SHEET",
        financialYear: "2025-26",
        fileUrl: `/vault/clients/${client1.id}/audit_3cd_2526.pdf`,
        fileMimeType: "application/pdf",
        fileSizeBytes: 1420800,
      },
      {
        clientId: client1.id,
        title: "Certificate_of_Incorporation_MCA.pdf",
        category: "PAN_AADHAAR",
        financialYear: "2026-27",
        fileUrl: `/vault/clients/${client1.id}/coi_mca.pdf`,
        fileMimeType: "application/pdf",
        fileSizeBytes: 512000,
      },
      {
        clientId: client2.id,
        title: "ITR-V_Acknowledgement_AY2026-27.pdf",
        category: "ITR",
        financialYear: "2026-27",
        fileUrl: `/vault/clients/${client2.id}/itr_v_ay2627.pdf`,
        fileMimeType: "application/pdf",
        fileSizeBytes: 198400,
      },
      {
        clientId: client2.id,
        title: "Permanent_Account_Number_Card.pdf",
        category: "PAN_AADHAAR",
        financialYear: "2026-27",
        fileUrl: `/vault/clients/${client2.id}/pan_card.pdf`,
        fileMimeType: "application/pdf",
        fileSizeBytes: 320000,
      },
    ],
  });
  console.log("✓ Audit, TDS, ROC & Document Vault seeded");

  // 11. Initial Public Enquiries & Appointments
  await prisma.enquiry.createMany({
    data: [
      {
        name: "Arun Mehra",
        email: "arun.mehra@techventures.in",
        mobile: "+91 99887 66554",
        serviceName: "Company Registration",
        message: "We want to incorporate an AI SaaS private limited company with 3 directors and register for DPIIT Startup India.",
        status: "NEW",
      },
      {
        name: "Pooja Deshmukh",
        email: "pooja.d@gmail.com",
        mobile: "+91 97654 32109",
        serviceName: "GST Services",
        message: "Need assistance with GST registration for e-commerce selling on Amazon and Flipkart.",
        status: "CONTACTED",
      },
    ],
  });

  await prisma.appointment.create({
    data: {
      name: "Rohan Kapoor",
      email: "rohan.kapoor@innovate.co",
      mobile: "+91 98765 12340",
      preferredDate: new Date("2026-11-26"),
      preferredTimeSlot: "11:00 AM - 12:00 PM",
      serviceRequired: "Income Tax Planning & Virtual CFO",
      notes: "Discussion on restructuring overseas royalty income and transfer pricing documentation.",
      status: "SCHEDULED",
    },
  });
  console.log("✓ Enquiries & Appointments seeded");

  console.log("\n=======================================================");
  console.log(" Database successfully seeded with full practice data! ");
  console.log(" Admin Login Credentials:");
  console.log(" Email:    admin@cafirm.in");
  console.log(" Password: AdminSecure@CA2026!");
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
