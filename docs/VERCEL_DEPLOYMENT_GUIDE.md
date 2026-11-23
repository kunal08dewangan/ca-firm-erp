# Complete Guide: Publishing CA Firm Website & ERP to Vercel

This guide explains how to deploy your real CA Firm Website and ERP management system to **Vercel** with a free, permanent **PostgreSQL** cloud database.

---

## Why PostgreSQL is Required for Vercel

Local development uses SQLite (`dev.db`). However, Vercel runs in a **serverless cloud environment** where the filesystem is read-only and resets with each request. To ensure that your real clients, GST filings, vouchers, and uploaded documents are stored permanently in production, Vercel requires an external cloud PostgreSQL database.

---

## Step 1: Create a Free Cloud PostgreSQL Database (Takes 2 Minutes)

Choose either **Neon** (Recommended - fastest setup) or **Supabase**:

### Option A: Neon.tech (Recommended)
1. Go to [https://neon.tech](https://neon.tech) and create a free account.
2. Click **Create Project**, name it `ca-firm-erp`.
3. Neon will show you a connection string like:
   ```text
   postgresql://neondb_owner:npg_xyz123@ep-proud-flower-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Copy this string. This is your `DATABASE_URL`.

---

## Step 2: Switch Database Provider to PostgreSQL

In your project terminal, run our automatic switch command:

```bash
npm run use:postgres
```

This automatically updates `prisma/schema.prisma` datasource to `postgresql` and regenerates the Prisma client.

---

## Step 3: Initialize Cloud Database & Your Real Admin Account

Temporarily paste your Neon/Supabase connection string into your local `.env`:

```env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require"
```

Then run in your terminal:

```bash
# 1. Push schema tables to your cloud PostgreSQL database
npx prisma db push

# 2. Initialize your clean production CA administrator account
node scripts/reset-for-real-work.js
```

You will see:
```text
✓ All tables initialized
✓ Admin created: gajendradewangan@gmail.com (CA Gajendra Dewangan)
```

---

## Step 4: Push Code to GitHub

1. Create a **Private Repository** on [GitHub](https://github.com/new) named `ca-firm-erp`.
2. Push your project from your terminal:

```bash
git init
git add .
git commit -m "Production Ready CA Firm ERP"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/ca-firm-erp.git
git push -u origin main
```

---

## Step 5: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com) (sign in with your GitHub account).
2. Click **"Add New..."** -> **"Project"**.
3. Import your **`ca-firm-erp`** GitHub repository.
4. In the **Environment Variables** section, add the following keys:

| Variable Name | Value |
| :--- | :--- |
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `SESSION_SECRET` | `ca_erp_secure_super_secret_jwt_and_session_token_key_2026_xyz` |
| `ADMIN_DEFAULT_EMAIL` | `gajendradewangan@gmail.com` |
| `ADMIN_DEFAULT_PASSWORD` | `AdminSecure@CA2026!` (or your chosen password) |
| `NEXT_PUBLIC_APP_NAME` | `G. Dewangan & Associates \| Chartered Accountants` |
| `NEXT_PUBLIC_FIRM_NAME` | `G. Dewangan & Associates` |
| `NEXT_PUBLIC_LEAD_PARTNER` | `CA Gajendra Dewangan` |
| `NEXT_PUBLIC_ICAI_MEMBERSHIP_NO` | `084920` |
| `NEXT_PUBLIC_ICAI_REG_NO` | `018472C` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `gajendradewangan@gmail.com` |
| `NEXT_PUBLIC_CONTACT_PHONE` | `+91 78984 87448` |
| `NEXT_PUBLIC_OFFICE_ADDRESS` | `Bhilai, Durg, Chhattisgarh` |

5. Click **"Deploy"**.

---

## Step 6: Connect Your Custom Domain (Optional)

1. Once deployed, Vercel gives you a free live URL: `https://ca-firm-erp.vercel.app`.
2. In Vercel Project Settings -> **Domains**, you can add your custom CA domain (e.g., `gdewangan.in` or `dewanganca.com`).
3. Add the DNS CNAME record pointed by Vercel. SSL certificates are generated automatically for free!
