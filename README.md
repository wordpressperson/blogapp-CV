**Here is the clean, ready-to-use Markdown** you can copy and paste directly into your public repository.

Create a new file in the root of your project called **`TECHNICAL-DOC.md`** (or add it to your `README.md`).

```markdown
# Blog Application – Technical Documentation

**Project Name:** Blog App (CV)  
**Repository:** https://github.com/wordpressperson/blogapp-CV/  
**Live URL:** https://blogapp-cv.onrender.com  
**Last Updated:** April 2026

---

## 1. Project Overview

A simple, modern blog CMS with the following features:
- Public viewing of articles (requires login)
- Admin-only: Create, Edit, and Delete articles
- Passwordless authentication using **magic links** (email-only)
- Role-based access control (`user` vs `admin`)
- Deployed on Render (free tier)

The application uses a classic **MERN** stack with custom JWT + magic-link authentication.

---

## 2. Tech Stack

| Layer       | Technology                          | Notes                              |
|-------------|-------------------------------------|------------------------------------|
| Frontend    | React 16 + React Router v5          | Create React App                   |
| Styling     | Styled-components + Bootstrap 4     | Custom CSS variables               |
| Backend     | Node.js + Express                   | REST API                           |
| Database    | MongoDB Atlas + Mongoose            | NoSQL                              |
| Authentication | JWT + Magic Links               | SendGrid for email delivery        |
| Hosting     | Render (separate frontend + backend)| Free tier                          |

---

## 3. Folder Structure
blogapp-CV/
├── client/                     ← React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── LoginModal.js
│   │   │   ├── Articles.js
│   │   │   ├── AddArticle.js
│   │   │   └── EditArticle.js
│   │   ├── context/AuthContext.js
│   │   ├── pages/AuthVerify.js
│   │   └── index.js
│   └── package.json
│
├── server/                     ← Express Backend
│   ├── models/
│   │   ├── User.js
│   │   └── Article.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── articles.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
├── .env (local only)
└── TECHNICAL-DOC.md---

## 4. Authentication Flow (Magic Links)

1. User enters email in the login modal.
2. Frontend sends `POST /api/auth/send-magic`.
3. Backend creates user (if new) with default role `user`.
4. Generates short-lived JWT (15 minutes) and sends magic link via **SendGrid**.
5. User clicks link → `/auth/verify?token=...`
6. Backend verifies token and issues long-lived JWT (7 days) containing `{ id, email, role }`.
7. Frontend stores token in `localStorage` and updates `AuthContext`.

**Security**: All create/edit/delete operations are protected on both frontend (UI) and backend (middleware).

---

## 5. Role-Based Access

- **Frontend**: `isAdmin` from `AuthContext` controls visibility of buttons and navbar links.
- **Backend**: `protect` + `adminOnly` middleware on all mutating routes.
- Admin status is set manually in MongoDB Atlas (`users` collection).

---

## 6. Deployment on Render

Two separate services:

- **Frontend**: Static Site (Root: `client`)
- **Backend**: Web Service (Root: `server`)

**Key Environment Variables (Backend service)**:
- `JWT_SECRET`
- `FRONTEND_URL` (e.g. `https://blogapp-cv.onrender.com`)
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `MONGO_URI`

**Note**: Render free tier blocks SMTP ports → SendGrid (HTTP API) is required.

---

## 7. Common Issues & Solutions

| Issue                                                      | Cause                                                                 | Solution |
|------------------------------------------------------------|-----------------------------------------------------------------------|----------|
| Magic link shows double slash (`//auth/verify`)            | `FRONTEND_URL` ends with a trailing slash (`/`)                       | Add `.replace(/\/$/, '')` when building the magic link in `auth.js` |
| "Sending..." button hangs forever                          | `req.body` is `undefined`                                             | Ensure `app.use(express.json())` is placed **before** mounting any routes in `server.js` |
| No articles appear after successful login                  | Race condition between `AuthVerify` and `App.js` modal logic          | Use `window.location.href = '/'` with a small `setTimeout` in `AuthVerify.js` |
| React Hooks error (`useState` / `useEffect` called conditionally) | Hooks called after an early `return` statement                   | Move all `useState` and `useEffect` hooks to the **top** of the component, before any early returns |
| 502 Bad Gateway when sending magic link                    | Render free tier blocking SMTP ports (465 & 587)                      | Switch to SendGrid HTTP API instead of Nodemailer SMTP |
| Login modal disappears when clicking into the email input  | Event bubbling from overlay to modal content                          | Use `e.stopPropagation()` on the modal content div |
| Add / Edit / Delete buttons visible to normal users        | Missing or incorrect `isAdmin` check                                  | Wrap buttons with `{isAdmin && (...)}` and ensure hooks are called before any early return |
| Magic link verification fails or loops                     | Old `AuthVerify.js` logic or route syntax mismatch                    | Update `AuthVerify.js` to use `window.location.href = '/'` after successful login |
| CORS or 404 errors on API calls                            | Frontend calling wrong base URL                                       | Use relative paths (`/api/...`) in production |

---

## 8. Security & Best Practices

- No passwords stored in database
- JWT stored in `localStorage` (acceptable for SPA)
- All admin routes protected on backend
- Magic links expire in 15 minutes
- Role checks enforced on both client and server

---

## 9. Future Improvements

- Upgrade frontend to React 18 + `react-scripts@5`
- Add refresh token rotation
- Implement rate limiting on magic link endpoint
- Add article image upload
- Consider moving to a single service platform (Railway / Fly.io)

---
