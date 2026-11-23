# CA Firm Website + Complete CA Management ERP
## Technical Architecture & Implementation Blueprint

**Version:** 1.0.0  
**Target Audience:** Chartered Accountants, Full-Stack Developers, Database Architects, Security Engineers  
**Regulatory Standards:** Indian IT Act, ICAI Guidance Notes, GSTN Specifications, CBDT Income Tax Rules  

Refer to the complete architectural blueprint in [ca_erp_system_architecture.md](file:///Users/konal/.gemini/antigravity/brain/ee4507aa-3fea-47be-89df-78ee723c4c46/ca_erp_system_architecture.md).

### Summary of Architectural Pillars:
1. **Design System & UI/UX:** Clean, uncluttered Navy Blue (`#17365D`) and White theme with Slate typography, fully responsive across desktop, tablet, and mobile with natural vertical scrolling.
2. **Next.js 14+ App Router Architecture:** Clean separation of Public Website `(public)` with SSR/SEO and Authenticated Back-Office ERP `(admin)`.
3. **Database Architecture:** PostgreSQL with Prisma ORM modeling 30+ relational entities with Decimal(15,2) precision for all monetary values.
4. **Defense-in-Depth Security:** Argon2id password hashing, RFC 6238 TOTP 2FA, HttpOnly/SameSite session cookies, AES-256-GCM encryption for PAN/Bank PII, strict server-side authorization guards, and immutable audit logs.
5. **Business Engines:**
   - Double-entry bookkeeping engine with debit/credit balance constraint and reversal entries.
   - Indian GST engine with Place of Supply, Section 17(5) blocked ITC classification, and GSTR-2B reconciliation.
   - Income tax engine comparing Old vs. New Tax Regimes (Section 115BAC), deductions, and rebate u/s 87A.
   - Document vault with signed expiring URLs and billing with GST compliant invoices (SAC 998222).
