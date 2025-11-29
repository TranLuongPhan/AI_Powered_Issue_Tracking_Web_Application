# AI-Powered Issue Tracking Web Application

A modern, full-featured issue tracking system built with Next.js, featuring AI-powered project summaries, drag-and-drop Kanban boards, and comprehensive issue management capabilities.

## 🚀 Features

### Authentication & User Management
- **Multiple Authentication Methods**
  - Email/Password authentication
  - Google OAuth integration
  - Account linking for same email addresses
  - Auto-login after registration

- **Profile Management**
  - Edit name (1-50 characters validation)
  - Update profile image via URL
  - Changes reflect immediately
  - Profile page accessible from dashboard

- **Password Management**
  - Change password functionality
  - Current password verification
  - New password validation (6-100 characters)
  - Password confirmation matching
  - Disabled for OAuth-only users

### Issue Management
- **Create Issues**
  - Title and description
  - Status selection (Backlog, In Progress, Done)
  - Priority levels (HIGH, MEDIUM, LOW)
  - Auto-assignment to creator
  - Auto-creation of default project if missing

- **Issue Views**
  - **Kanban Board View**: Drag-and-drop interface with columns for Backlog, In Progress, and Done
  - **List View**: Detailed list of all issues
  - Toggle between views seamlessly
  - Real-time updates

- **Issue Editing**
  - Inline editing of title and description with auto-save
  - Status dropdown for quick updates
  - Priority dropdown for priority changes
  - Delete functionality with soft delete
  - Optimistic UI updates

- **Issue Search & Filtering (FR-036)**
  - **Search**: Title text search (case-insensitive)
  - **Filters**:
    - By status (Backlog / In Progress / Done)
    - By priority (HIGH / MEDIUM / LOW)
    - By assignee
    - Has due date checkbox
    - Due date range (from/to dates)
  - **Sorting**:
    - Creation date (newest/oldest)
    - Last modified date
    - Due date (earliest/latest)
    - Priority (HIGH → MEDIUM → LOW)
  - Filter panel with "Apply Filters" and "Clear All" buttons

### AI-Powered Features
- **AI Project Summary**
  - Generate AI-powered project overviews
  - Chat interface for asking questions about the project
  - Fallback summary when AI service is unavailable
  - Integration with OpenAI API
  - Real-time insights and recommendations

### Team & Project Management
- **Team Management**
  - Create teams
  - View team members and project counts
  - Personal Team auto-created on signup
  - Team member roles (OWNER, ADMIN, MEMBER)

- **Project Management**
  - Default "My Project" created automatically
  - Projects associated with teams
  - Auto-creation if project is missing

### UI/UX Features
- **Dark Theme**: Modern dark UI throughout the application
- **Responsive Design**: Works on various screen sizes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Optimistic Updates**: Instant UI feedback
- **Keyboard Shortcuts**: Ctrl+Enter to submit AI chat

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **React** - UI library
- **TypeScript** - Type safety
- **NextAuth.js** - Authentication
- **@dnd-kit** - Drag-and-drop functionality
- **OpenAI API** - AI-powered summaries

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database (Supabase)
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL** (via Supabase)
- **Prisma** as ORM
- Soft delete support
- Relationship management

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Supabase recommended)
- OpenAI API key (for AI features)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TranLuongPhan/AI_Powered_Issue_Tracking_Web_Application.git
   cd AI_Powered_Issue_Tracking_Web_Application
   ```

2. **Install dependencies**
```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your_postgresql_connection_string"
   DIRECT_URL="your_direct_postgresql_connection_string"

   # NextAuth
   AUTH_SECRET="your_auth_secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth
   AUTH_GOOGLE_ID="your_google_client_id"
   AUTH_GOOGLE_SECRET="your_google_client_secret"

   # OpenAI (for AI features)
   OPENAI_API_KEY="your_openai_api_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   └── summary/        # AI summary endpoint
│   │   │   ├── issues/             # Issue CRUD endpoints
│   │   │   ├── profile/            # Profile management endpoints
│   │   │   ├── register/           # User registration
│   │   │   └── teams/              # Team management endpoints
│   │   ├── dashboard/              # Main dashboard page
│   │   ├── login/                  # Login page
│   │   ├── profile/                # Profile management page
│   │   ├── register/               # Registration page
│   │   ├── teams/                  # Team management page
│   │   └── page.tsx                # Landing page
│   ├── auth.ts                     # NextAuth configuration
│   ├── components/
│   │   ├── KanbanBoard.tsx         # Kanban board component
│   │   └── LogoutButton.tsx        # Logout button component
│   └── lib/
│       └── prisma.ts               # Prisma client
├── prisma/
│   └── schema.prisma               # Database schema
└── public/                        # Static assets
```

## 🔐 Authentication

### Supported Methods
1. **Email/Password**: Traditional credentials-based authentication
2. **Google OAuth**: One-click Google sign-in

### User Registration
- Email validation (max 255 characters, valid email format)
- Password validation (6-100 characters)
- Name validation (1-50 characters)
- Auto-creation of default team and project
- Automatic login after successful registration

## 📊 Database Schema

### Models
- **User**: User accounts with authentication
- **Account**: OAuth account linking
- **Session**: User sessions
- **Team**: Team/organization management
- **TeamMember**: Team membership with roles
- **Project**: Projects within teams
- **Issue**: Issue tracking with status, priority, assignee
- **Comment**: Issue comments (schema ready)

### Key Relationships
- Users belong to Teams via TeamMember
- Projects belong to Teams
- Issues belong to Projects
- Issues have Creators and Assignees (Users)
- Soft delete support on Team, Project, Issue, Comment

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables from `.env` are set in your deployment platform:
- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL` (production URL)
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `OPENAI_API_KEY`

## 📝 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `POST /api/auth/signout` - Sign out (handled by NextAuth)

### Issues
- `GET /api/issues` - Get all issues (with search/filter/sort params)
- `POST /api/issues` - Create new issue
- `PUT /api/issues` - Update issue
- `DELETE /api/issues` - Soft delete issue

### Profile
- `GET /api/profile/check-password` - Check if user has password
- `PUT /api/profile` - Update profile
- `PUT /api/profile/password` - Change password

### Teams
- `GET /api/teams` - Get user's teams
- `POST /api/teams` - Create new team

### AI
- `POST /api/ai/summary` - Generate AI project summary

## 🎨 UI Components

### Kanban Board
- Drag-and-drop functionality
- Three columns: Backlog, In Progress, Done
- Inline editing of title, description, status, priority
- Delete button on each card
- Drag handle for easy movement

### Dashboard
- Issue creation form
- AI summary section with chat interface
- View toggle (Board/List)
- Search and filter panel
- Refresh button

## 🔒 Security Features

- Password hashing with bcrypt
- Session management with NextAuth
- CSRF protection
- Input validation on frontend and backend
- Soft delete for data recovery
- Authentication required for all API endpoints

## 📱 User Flows

### New User Registration
1. User registers with email/password or Google OAuth
2. System creates:
   - User account
   - Personal Team
   - Default "My Project"
3. User is automatically logged in
4. User can immediately create issues

### Issue Creation Flow
1. User fills out issue form
2. If project doesn't exist, system auto-creates it
3. Issue is created and assigned to creator
4. Issue appears in Kanban board and list view

### Search & Filter Flow
1. User clicks "🔍 Filters" button
2. Filter panel opens
3. User sets search query and/or filters
4. User clicks "Apply Filters"
5. Issues are fetched with applied filters
6. Results update in real-time

## 🐛 Known Issues & Limitations

- Label filtering not yet implemented (schema ready)
- Assignee filter needs user list population
- AI features require OpenAI API key with quota

## 🚧 Future Enhancements

- [ ] Issue labels/tags
- [ ] Issue comments functionality
- [ ] File attachments
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Issue templates
- [ ] Bulk operations
- [ ] Export functionality

## 📄 License

This project is part of a contest submission.

## 👤 Author

**Tran Luong Phan**
- GitHub: [@TranLuongPhan](https://github.com/TranLuongPhan)
- Email: luongphantran1997@gmail.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for excellent ORM
- Vercel for seamless deployment
- OpenAI for AI capabilities
- Supabase for PostgreSQL hosting

---

**Note**: This application is built as an MVP (Minimum Viable Product) for a contest. Some features may be simplified but the core functionality is fully operational.
