<div align="center">
  
# 🏗️ Foundry
**The Next-Generation Visual Page Builder**

[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

*A powerful, proof-of-concept visual page builder inspired by Webflow, Wix Studio, and Shopify.*

</div>

---

## ✨ Overview

Foundry is a lightweight yet incredibly robust drag-and-drop page builder. Built to demonstrate clean architecture, scalable component state management, and clear API boundaries, Foundry bridges the gap between high-fidelity design tools and raw code.

## 🚀 Key Features

- **🎨 Pre-Made Templates:** Jumpstart your designs with beautiful, high-converting templates (Portfolio, E-commerce, Photography, Corporate, etc.).
- **🌗 Premium Neumorphic Theming:** Flawless light and dark mode integration featuring a sweeping dynamic transition effect.
- **🧱 Dynamic Component Library:** Drag and drop primitive building blocks including Headings, Text, Buttons, Images, and more.
- **🧠 Intelligent Saving:** Auto-sync your complex JSON component trees to the database with a highly optimized, debounced save system.
- **🔗 Independent Shareable Previews:** Generate secure, standalone preview URLs to share drafts with clients outside of the editor environment.
- **🎛️ Context-Aware Property Panel:** Click any component on the canvas to instantly edit its specific properties, styles, and alignments.

## 🛠️ Tech Stack

Foundry is engineered as a seamless monolith combining a modern frontend engine with a robust backend API.

* **Frontend:** Vue 3 (Composition API), Vite, Tailwind CSS v4, Pinia, VueDraggable
* **Backend:** Laravel 11, PostgreSQL (Production) / SQLite (Local)
* **Deployment & CI/CD:** Railway (Nixpacks)

## 🏎️ Getting Started

### 1. Backend Setup (Laravel)
Navigate to the backend directory and fire up the server:
```bash
cd backend
composer install
php artisan migrate
php artisan serve
```
*The API will run on `http://localhost:8000`*

### 2. Frontend Setup (Vue)
Since the frontend is bundled natively inside the Laravel application using Vite, you simply need to install the Node dependencies and run the hot-reloading dev server:
```bash
cd backend
npm install
npm run dev
```

### 3. Build & Create!
Open `http://localhost:8000` in your browser. Select a template, drag components onto the canvas, edit their properties, and watch the magic happen. 

## 🌍 Production Deployment

Foundry is fully configured for continuous deployment on **Railway**.
- Set the Root Directory to `/backend`
- Pass the `NIXPACKS_PHP_VERSION=8.4` environment variable.
- Connect a PostgreSQL database and inject the `DATABASE_URL` via Shared Variables.
- Laravel will automatically run `php artisan migrate --force` and serve the optimized, compiled application!

---
<div align="center">
  <i>Engineered with ❤️ for creators, designers, and developers.</i>
</div>
