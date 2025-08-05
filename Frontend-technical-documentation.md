# Frontend Technical Documentation

## Overview
CazuelaChapina is a management platform for Guatemalan tamale businesses. This document describes the final production frontend built with React, Vite and TailwindCSS. It communicates with a .NET 8 API using JSON Web Tokens (JWT) and implements role‑based access, real‑time notifications and responsive layouts.

## Stack
- **React 18** with **Vite** for fast bundling and module hot reload.
- **TailwindCSS** for utility‑first styling.
- **React Router** for declarative navigation.
- **Axios** for HTTP requests with JWT interceptors.
- **Firebase Cloud Messaging** for push notifications.
- **Recharts** for data visualization.
- **React Hook Form** and **Yup** for forms and validation.

## Architecture
### Directory Structure
```
src/
├─ components/        Reusable UI widgets (Sidebar, Navbar, modals, etc.)
├─ contexts/          Global React contexts (authentication, theme)
├─ pages/             Page components for each business module
├─ routes/            Route configuration and guards
├─ services/          Axios instances and API abstractions
├─ utils/             Reusable helpers and constants
├─ test/              Vitest unit tests
```
The structure keeps views, logic and utilities modular for maintainability.

### Routing & Permissions
Routing is handled by **React Router**. `ProtectedRoute` checks authentication and required permissions before rendering a page. The sidebar menu is generated dynamically from the user’s permission set, ensuring only authorized modules are visible.

### State Management
Global state uses the **Context API**. `AuthContext` stores user data, decodes JWTs and registers the device token for FCM. `ThemeContext` persists dark/light mode preference and exposes a toggle. Forms rely on **React Hook Form** for controlled inputs and performant validation with **Yup**.

### API Layer
All HTTP calls go through the `services/` folder. An Axios instance attaches the JWT stored in `localStorage` to every request and handles `401/403/422` responses globally, surfacing helpful messages with React Toastify or SweetAlert2.

### Notifications
The app integrates **Firebase Cloud Messaging**. On login, the client requests browser notification permission and registers the returned device token with the backend to receive push notifications in real time.

### Styling & Theming
Styling uses TailwindCSS utilities. Components are designed mobile‑first and adapt at predefined breakpoints. `ThemeContext` adds dark mode support by toggling Tailwind’s `dark` variant.

## Environment Variables
Create a `.env` file with the following keys:
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

## Build & Deployment
Install dependencies and run in development mode:
```
npm install
npm run dev
```
For a production bundle:
```
npm run build
npm run preview
```
The optimized assets are output to the `dist/` directory and can be served by any static host.

## Testing
Unit tests use **Vitest**. Execute all tests with `npm test`. Additional tests can be added under `src/test/` to cover components, hooks and services.

## Author
Selvin Santiago Pu Chiguil
Full‑stack web developer based in Guatemala
[Selvin.san90@gmail.com](mailto:Selvin.san90@gmail.com)

