# HandyDevTools - Developer Tools Collection

## Overview

HandyDevTools is a comprehensive web application providing developer-focused utility tools for common tasks like encoding/decoding, formatting, conversion, and text manipulation. The application features a modern React frontend with a unified layout showing tools in a left sidebar with the active tool displayed on the right side.

## Recent Changes (July 15, 2025)

- **App Rename**: Changed from "DevUtils" to "HandyDevTools" per user request
- **Layout Redesign**: Completely redesigned UI to use a left sidebar navigation with tools list and main content area for active tool
- **Color Fixes**: Updated header background colors for better visibility (gray-100/gray-800 instead of white)
- **Navigation Simplification**: Removed card-based tool layout, simplified to sidebar list navigation
- **Mobile Support**: Added responsive mobile menu overlay for tool navigation
- **JSONPath Search**: Added real-time JSONPath search functionality to JSON Format/Validate tool
- **Static Site Conversion**: Removed backend dependencies, converted to pure static site for GitHub Pages deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing with unified MainLayout component
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theming support
- **Layout**: Sidebar-based navigation with persistent tool list and dynamic content area
- **State Management**: Local React state for UI, no server state needed (client-side tools)
- **Theme System**: Context-based light/dark mode with localStorage persistence

### Static Site Architecture
- **Deployment**: Pure static site, no backend required
- **Hosting**: Compatible with GitHub Pages, Netlify, Vercel, etc.
- **Processing**: All tools work client-side in the browser
- **Storage**: Local storage for theme preferences only
- **Performance**: Fast loading with no server dependencies

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components and tool implementations
│   │   ├── pages/        # Route components
│   │   ├── lib/          # Utilities and configurations
│   │   └── hooks/        # Custom React hooks
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database abstraction layer
│   └── vite.ts       # Development server integration
├── shared/           # Shared types and schemas
└── migrations/       # Database migrations
```

## Key Components

### Tool System
- **Tool Registry**: Centralized configuration in `tools-config.ts` defining available tools
- **Dynamic Loading**: Tools are dynamically imported and rendered based on URL parameters
- **Component Architecture**: Each tool is a self-contained React component
- **Layout System**: Consistent `ToolLayout` wrapper providing common functionality

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Centralized schema definitions in `shared/schema.ts`
- **Migrations**: Automated database schema management
- **Storage Interface**: Abstract storage layer supporting both in-memory and database implementations

### UI Framework
- **Design System**: shadcn/ui components with Tailwind CSS
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme Support**: CSS custom properties for consistent theming
- **Component Library**: Comprehensive set of form controls, layouts, and interactive elements

## Data Flow

### Frontend Data Flow
1. User navigates to tool via routing system
2. Tool component loads and initializes state
3. User interactions trigger local state updates
4. Results are computed client-side for most tools
5. Theme and preferences persist to localStorage

### Backend Data Flow
1. Express middleware handles request processing
2. Route handlers implement business logic
3. Storage layer abstracts database operations
4. Responses return JSON data to frontend
5. Session management maintains user state

### Development Flow
1. Vite serves frontend with hot module replacement
2. Express server provides API endpoints
3. Development middleware integrates frontend and backend
4. Database changes managed through Drizzle migrations

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Framework**: Radix UI primitives, Tailwind CSS
- **Backend**: Express, Drizzle ORM, Neon Database
- **Development**: Vite, TypeScript, tsx

### Tool-Specific Libraries
- **Cryptography**: crypto-js for hashing operations
- **Date Handling**: date-fns for time manipulation
- **Validation**: Zod for schema validation
- **Utilities**: Various encoding/decoding libraries

### Build Dependencies
- **Bundling**: Vite for frontend, esbuild for backend
- **Type Checking**: TypeScript compiler
- **CSS Processing**: PostCSS with Tailwind CSS

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Single Output**: Combined distribution ready for deployment

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable
- **Sessions**: PostgreSQL-backed session storage
- **Production**: Node.js serves both API and static files

### Development vs Production
- **Development**: Vite dev server with HMR, separate frontend/backend processes
- **Production**: Single Node.js process serving bundled application
- **Database**: Consistent PostgreSQL usage across environments

### Scalability Considerations
- **Stateless Design**: Session data in database enables horizontal scaling
- **Static Assets**: Frontend builds to static files for CDN deployment
- **Database Connection**: Serverless-friendly database connection pooling