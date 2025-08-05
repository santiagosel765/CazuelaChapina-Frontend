# CazuelaChapina – Frontend (React)

🥘 **CazuelaChapina** is the client‑side application for the CazuelaChapina platform, a management suite for Guatemalan tamale shops. The frontend is built with **React**, **Vite** and **TailwindCSS**, and communicates with a **.NET 8** REST API secured by JWT tokens. It delivers role‑based navigation, real‑time notifications and data‑driven dashboards for daily operations.

This repository contains the final, production‑ready version of the CazuelaChapina frontend.

---

## 🚀 Technologies Used

- **React + Vite** – modern tooling with fast refresh and automatic code‑splitting.
- **TailwindCSS** – utility‑first styling for rapid responsive design.
- **React Router** – declarative routing and protected routes.
- **Axios** – HTTP client with interceptors for JWT handling.
- **Firebase** – push notifications via FCM.
- **Recharts** – charts and graphs for the dashboard.
- **React Hook Form + Yup** – performant forms and validation.
- **React Toastify / SweetAlert2** – user feedback and alerts.

These tools were chosen for their developer productivity, strong ecosystem, and compatibility with the .NET 8 backend.

---

## 📁 Project Structure
```
src/
├─ components/        # Reusable UI (Sidebar, Navbar, layout wrappers…)
├─ contexts/          # Global React contexts (Auth, Theme)
├─ pages/             # Page components for each module
├─ routes/            # Routing configuration & route guards
├─ services/          # Axios API wrappers
├─ utils/             # Reusable helpers
├─ test/              # Vitest unit tests
```
Key directories such as `pages/`, `components/`, `services/`, `contexts/` and `routes/` keep concerns isolated and promote reusability.

---

## 🔐 Authentication & Permissions

- JWTs are stored in `localStorage` and automatically attached to requests.
- `AuthContext` decodes tokens, exposes user/role data and registers FCM device tokens.
- `ProtectedRoute` gates pages by authentication and required permissions.
- The sidebar builds its menu dynamically based on the user’s permissions, ensuring only authorized modules are visible.

---

## 📦 Implemented Modules

- **Login & authentication** – credential form with validation and session handling.
- **Tamales & beverages catalog** – CRUD interfaces for products.
- **Combo management** – create, edit and list combo offers.
- **Inventory & waste** – track stock levels and mermas.
- **Sales registration** – record and review daily sales.
- **Branches** – maintain branch information.
- **Dashboard** – business KPIs with interactive graphs.
- **FAQ with AI** – customer questions answered via an OpenRouter‑powered service.
- **Push notifications** – Firebase Cloud Messaging integration.

---

## 📱 Responsive Design

The UI is fully responsive for mobile, tablet and desktop:

- TailwindCSS breakpoints and flex utilities.
- Collapsible sidebar and fixed top navbar.
- Dark/light mode toggle via `ThemeContext`.

---

## ⚙️ Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Environment Variables
Create a `.env` file at the project root:
```
VITE_API_URL=http://localhost:5151/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### Development
```bash
npm install
npm run dev
```
The app runs on [http://localhost:5173](http://localhost:5173).

### Production Build
```bash
npm run build
npm run preview
```
The optimized app is generated in `dist/` and can be previewed locally before deployment.

### Firebase Messaging
Register the `firebase-messaging-sw.js` service worker at project root and configure Firebase Cloud Messaging credentials above to enable push notifications.

---

## 🧪 Testing

Unit tests are written with **Vitest**. Run all tests with:
```bash
npm test
```
Current tests cover permission utilities and can be extended for components and services.

---

## 📌 Security & Performance

- Axios interceptors surface `401`, `403` and `422` errors to the user.
- Tokens and FCM device IDs are kept in `localStorage` and registered securely.
- Vite’s code‑splitting and React hooks ensure fast, lazy evaluation; memoization is applied where beneficial.
- UI feedback uses non‑blocking notifications for a smooth experience.

---

## 📈 Dashboard Metrics

The dashboard highlights key indicators such as:

- Daily vs monthly sales totals.
- Top‑selling tamales.
- Beverage popularity by time of day.
- Spice level distribution.
- Profit by product category.
- Inventory waste (quantity & cost).

---

## 📔 Documentation

Further architectural details, component responsibilities and development guidelines are documented in [Frontend-technical-documentation.md](Frontend-technical-documentation.md).

## 👨‍💻 Author

Selvin Santiago Pu Chiguil
Full‑stack web developer based in Guatemala
[Selvin.san90@gmail.com](mailto:Selvin.san90@gmail.com)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Happy hacking!
