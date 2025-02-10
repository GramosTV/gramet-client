# 🌐 Next.js Multi-Locale E-commerce Project - Gramet

This project is a multi-locale e-commerce application built with Next.js. It offers internationalized pages, user authentication, cart management, and an admin panel for product and order management. The application leverages React context for authentication and shopping cart state, and uses a middleware for route protection and JWT validation.

## ✨ Features

- **🌍 Internationalization (i18n):**

  - Localization for route segments using a configurable prefix.
  - Custom routing using [next-intl](https://next-intl.js.org/) with `i18n/routing.ts`.
  - Dynamic loading of locale messages in layouts.

- **🔒 User Authentication:**

  - Auth context implemented in `context/AuthContext.tsx` using JWT tokens.
  - Automatic user state population based on cookies.
  - Middleware protection for routes such as `/checkout` and `/admin-panel`.

- **🛒 Shopping Cart:**
  - Cart context implemented in `context/CartContext.tsx`.
  - Integration with API endpoints to fetch and update cart data.
- **🛠️ Admin Panel:**
  - Restricts access to users with an administrator role.
  - Middleware checks JWT tokens and refreshes tokens when needed.
- **📱 Responsive UI Components:**
  - Shared components such as Header, Footer, Carousel, etc.
  - Global styles and Tailwind CSS for responsive design.

## 🗂️ Project Structure

```plaintext
├── app/
│   ├── [locale]/
│   │   ├── admin-panel/
│   │   ├── checkout/
│   │   ├── forgot-password/
│   │   ├── layout.tsx          // Main locale layout (server component)
│   │   └── ...                 // Other locale-specific pages and layouts
│   ├── common/
│   │   └── ...                 // Shared types, enums, and interfaces
│   ├── components/
│   │   └── ...                 // UI components (Header, Footer, etc.)
│   ├── favicon.ico
│   ├── lib/
│   │   └── ...                 // API helper functions and utilities
│   └── styles/
│       └── ...                 // Global and component-specific styles
├── context/
│   ├── AuthContext.tsx         // Authentication context
│   └── CartContext.tsx         // Shopping cart context
├── i18n/
│   ├── request.ts              // Next-intl server configuration
│   └── routing.ts              // Locale routing configuration
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── images/
│   │   └── carousel/           // Carousel images
│   │       └── ...
│   ├── models/
│   │   └── ...                 // 3D models for testing
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── middleware.ts               // Custom middleware for route protection and JWT handling
└── i18n.ts                     // Global internationalization configuration
```

## ⚙️ Installation

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://your-repository-url.git
   cd your-repository-directory
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Environment Configuration:**

   Create a .env file at the root of your project and add required variables such as:

   ```env
   JWT_SECRET=your_jwt_secret
   API_URL=https://api.yourservice.com
   ```

   Adjust additional environment variables as needed.

## 🚀 Running the Project

### Development

Start the development server:

```sh
npm run dev
```

### Production

Build and start the production server:

```sh
npm run build
npm start
```

## 🛡️ Middleware Overview

The middleware.ts file handles:

- **Locale detection and routing:** Uses next-intl middleware to support multiple locales.
- **Authentication protection:**
  - Redirects authenticated users away from `/login` and `/register`.
  - Protects `/checkout` routes from unauthenticated access.
  - Secures `/admin-panel` routes by verifying JWT tokens and checking the user’s role.
- **Token Refresh:** When an access token expires, the middleware attempts to refresh it using the refresh token.

## 🌐 Internationalization

- The routing.ts defines supported locales (`pl` and `en`) and provides navigation helpers.
- The request.ts file configures the server settings for locale detection, time zone, and message loading.
- The layout.tsx dynamically imports the correct locale messages and establishes a layout that includes React Query and a client-side locale layout.

## 🤝 Contributing

Contributions are welcome. Please follow the project’s coding standards and run tests before submitting pull requests.

## 📄 License

MIT
