# Sprint Board Lite

A modern task management application built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

### ✅ Must-haves (All Implemented)
1. **Authentication (Mocked)**
   - `/login` route with any non-empty email/password
   - Fake token stored in localStorage and cookies
   - Protected `/board` route with middleware
   - Logout functionality

2. **Board Functionality**
   - Load tasks from mock API (json-server)
   - Drag & drop between columns using Framer Motion
   - Optimistic updates with rollback on API failures
   - Create task modal with title, description, priority
   - New tasks start in "Todo" column

3. **Search & Filter**
   - Client-side search by task title
   - Filter by priority (low, medium, high)

4. **UX Essentials**
   - Mobile-first responsive design
   - Loading skeletons
   - Error and empty states
   - Dark mode (persisted in localStorage)

### 🎲 Variant A-G: Undo Move
- After moving a task, shows a 5-second "Undo" toast
- Clicking "Undo" reverts the state and patches the server back
- Implements optimistic updates with rollback

### 🗄️ Mock API
- `json-server` with routes: `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id`
- 10% failure rate simulation for PATCH/POST requests
- Custom middleware for testing rollback functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API
- **Mock API**: json-server
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sprint-board-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Start the mock API server (in a separate terminal):
```bash
npm run server
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run server` - Start json-server mock API

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── board/             # Board page
│   ├── login/             # Login page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects)
├── components/            # Reusable components
│   └── toast.tsx          # Toast notifications
├── contexts/              # React Context providers
│   ├── auth-context.tsx   # Authentication
│   ├── theme-context.tsx  # Dark mode
│   └── toast-context.tsx  # Notifications
├── lib/                   # Utility libraries
│   └── api.ts            # API service
├── types/                 # TypeScript definitions
│   └── index.ts          # Type definitions
└── middleware.ts          # Route protection
```

## 🎯 Key Decisions

### Architecture
- **Next.js 15 App Router**: Modern file-based routing with server components
- **TypeScript**: Full type safety throughout the application
- **Context API**: Lightweight state management for auth, theme, and toasts
- **Framer Motion**: Smooth animations and drag interactions

### UX/UI
- **Mobile-first**: Responsive design that works on all devices
- **Dark mode**: Persisted theme preference
- **Loading states**: Skeleton loaders for better perceived performance
- **Error handling**: Graceful error states with retry options
- **Accessibility**: Proper ARIA labels and keyboard navigation

### API Design
- **Optimistic updates**: Immediate UI feedback with rollback on failure
- **Mock API**: json-server for development and testing
- **Failure simulation**: 10% random failures to test error handling
- **RESTful**: Standard HTTP methods for CRUD operations

## 🧪 Testing Features

### API Failure Simulation
The mock API randomly returns 500 errors for 10% of PATCH/POST requests to test:
- Optimistic update rollback
- Error toast notifications
- User feedback during failures

### Undo Functionality
- Move any task between columns
- 5-second undo toast appears
- Click "Undo" to revert the move
- Server is patched back to previous state

## 🚀 Deployment

The application is deployed on Vercel and can be accessed at:
[Deployment URL]

## 📝 What's Done vs Omitted

### ✅ Completed
- All must-have features implemented
- Variant A-G (Undo Move) fully functional
- Mock API with failure simulation
- Mobile-first responsive design
- Dark mode with persistence
- Loading and error states
- TypeScript throughout
- Framer Motion animations
- Toast notifications
- Route protection middleware

### ⚠️ Omitted/Simplified
- **Advanced drag & drop**: Used Framer Motion's basic drag instead of complex drop zones
- **Real-time updates**: No WebSocket implementation
- **Offline support**: No service worker or offline queue
- **Advanced filtering**: Basic priority filter only
- **User management**: Single user mock authentication
- **Data persistence**: No database, only json-server mock

## ⏱️ Time Spent

- **Project Setup**: 30 minutes
- **Authentication & Routing**: 45 minutes
- **Board UI & Components**: 60 minutes
- **Drag & Drop Implementation**: 45 minutes
- **API Integration**: 30 minutes
- **Toast System**: 20 minutes
- **Dark Mode**: 15 minutes
- **Error Handling**: 30 minutes
- **Testing & Polish**: 45 minutes
- **Documentation**: 30 minutes

**Total**: ~4 hours

## 🎨 Design Decisions

- **Color Scheme**: Blue primary with semantic colors for priorities
- **Typography**: Inter font for clean, modern look
- **Spacing**: Consistent 4px grid system
- **Animations**: Subtle, purposeful motion for better UX
- **Icons**: Lucide React for consistency and accessibility

## 🔮 Future Enhancements

- Real-time collaboration
- Advanced filtering and sorting
- Task templates
- Time tracking
- Export functionality
- Real authentication system
- Database integration
- Offline support
- Advanced drag & drop with drop zones
- Keyboard shortcuts

---

Built with ❤️ using Next.js 15, TypeScript, and Framer Motion
