# HospitalGuru — Pending Setup Tasks

## 🔴 Razorpay Setup (required for credit system to work)
1. Sign up at https://dashboard.razorpay.com
2. Go to Settings → API Keys → Generate Test Key
3. Add to Vercel Environment Variables:
   - `RAZORPAY_KEY_ID`  → rzp_test_xxx
   - `RAZORPAY_KEY_SECRET` → xxx
4. When going live: generate Live keys and swap them in Vercel

## 🟡 Vercel Environment Variables (must be set for production)
Make sure these are all in Vercel → Settings → Environment Variables:
- `EMAIL_USER`           = shezansiddiqui7@gmail.com
- `EMAIL_APP_PASSWORD`   = asqb vqeg qfru kyrs
- `NEXT_PUBLIC_APP_URL`  = https://hospitalguru.com
- `ADMIN_PASSWORD`       = (set a strong password)
- `FREE_LEADS_QUOTA`     = 2 (testing) → bump to 50 for production
- `RAZORPAY_KEY_ID`      = (from step above)
- `RAZORPAY_KEY_SECRET`  = (from step above)

## 🟢 Before Going Live
- [ ] Switch `FREE_LEADS_QUOTA` from 2 → 50 in Vercel
- [ ] Swap Razorpay test keys for live keys in Vercel
- [ ] Replace dummy emails in `src/data/network.ts` with real hospital contacts
- [ ] Set a strong `ADMIN_PASSWORD` in Vercel
