# Page Builder POC

A lightweight, proof-of-concept visual page builder inspired by Shopify Page Builder, Wix Studio, and Webflow. Built to demonstrate clean architecture, scalable component state management, and clear API boundaries.

## Tech Stack
- **Frontend**: Vue 3 (Composition API), Vite, Tailwind CSS v4, Pinia, VueDraggable
- **Backend**: Laravel 11, SQLite (easily swappable to MySQL via JSON casting)

## Current Features
- **Component Library**: Primitive building blocks (Heading, Text, Button, Image).
- **Page Canvas**: Interactive drag-and-drop surface.
- **Properties Panel**: Context-aware editing of selected components.
- **Live Preview**: Fetching and rendering the saved page natively without builder wrappers.
- **Reordering & Deletion**: Full control over the layout flow.
- **Laravel Persistence**: Saving and loading complex JSON component trees via REST API.

## Upcoming
- Templates
- Mobile/Responsive Preview Toggles
- Granular Font Customization
- Asset/Media Library Integration
- Multi-column Layouts & Grids

## Getting Started

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Start the API server: `php artisan serve` (Runs on `http://localhost:8000`)

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev` (Runs on `http://localhost:5173` or `5174`)

### Testing the Builder
- Open the frontend URL in your browser.
- Build your page using the sidebar and property editor.
- Click "Save Page" to persist to the Laravel backend.
- Click "Preview Mode" to view the rendered page.
