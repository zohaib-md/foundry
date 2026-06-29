# Foundry

[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

A robust, proof-of-concept visual page builder engineered for seamless component state management and sophisticated user interface design. Foundry bridges the gap between high-fidelity design surfaces and raw codebase architecture.

---

## Overview

Foundry provides a deterministic, highly reactive drag-and-drop environment. By strictly separating the frontend rendering engine from the backend persistence layer, it enables dynamic serialization of complex component trees into a relational database. It is inspired by the modular architecture found in modern enterprise platforms like Webflow and Wix Studio.

## Architecture & Features

- **Component-Driven State:** Utilizes Pinia for centralized, predictable state mutations across the drag-and-drop canvas.
- **Dynamic Serialization:** Converts deeply nested Vue component instances into optimized JSON payloads for REST API persistence.
- **Context-Aware Property Mutators:** A reactive property panel that binds directly to the active component's underlying state array.
- **Neumorphic UI Engine:** An integrated, seamless light and dark mode engine built entirely on native Tailwind CSS v4 variables.
- **Independent Preview Generation:** Bypasses the editor wrapper to securely fetch and hydrate raw component state into standalone client-facing views.
- **Optimized Persistence:** Implements intelligent, debounced API calls to prevent layout-shift and ensure zero-data-loss synchronicity between the client and server.

## Technology Stack

* **Frontend Environment:** Vue 3 (Composition API), Vite, Tailwind CSS v4, Pinia, VueDraggable
* **Backend API:** Laravel 11, PostgreSQL (Production) / SQLite (Local)
* **Infrastructure:** Dockerized environments orchestrated via Nixpacks on Railway.

## Development Environment Setup

### 1. API Services (Laravel)
Navigate to the backend directory to initialize the application, map the environment, and execute the schema migrations:
```bash
cd backend
composer install
php artisan migrate
php artisan serve
```
*The local API will instantiate on `http://localhost:8000`*

### 2. Client Build (Vue / Vite)
The frontend relies on Vite for hot-module replacement (HMR) and optimized asset compilation. Install dependencies and initialize the bundler:
```bash
cd backend
npm install
npm run dev
```

## Production Deployment (Railway)

Foundry is structured to support continuous deployment pipelines on cloud-native platforms like Railway.

**Deployment Configuration:**
1. **Repository Root:** Override the default build path and set the Root Directory to `/backend`.
2. **Environment Synchronization:** Inject the following critical environment variables:
   - `NIXPACKS_PHP_VERSION=8.4` (Aligns the container runtime with the `composer.lock` specifications).
   - `APP_ENV=production` and `APP_DEBUG=false`.
   - `LOG_CHANNEL=stderr` (Forcs application logs to stream directly to standard output).
3. **Database Provisioning:** Attach a PostgreSQL volume and map the connection payload to the `DB_URL` environment variable. 
4. **Proxy Trust:** The Laravel kernel is pre-configured to trust load balancers (`trustProxies`), eliminating SSL termination/mixed-content failures in cloud environments.
