# Zeedpay merchant wallet

## Run

```bash
npm install
npm start
```

Configure the existing payment, Supabase, and PostgreSQL environment variables before deployment. The server serves `auth.html` at `/` and `index.html` at `/index.html`.

Referral bonuses, deposit commissions, commission withdrawals, profile updates, payment links, and wallet ledger data are persisted in PostgreSQL.
