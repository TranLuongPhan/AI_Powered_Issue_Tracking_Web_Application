# Test Environment Guide

This guide provides comprehensive instructions for setting up and testing the AI-Powered Issue Tracking Web Application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Test Accounts](#test-accounts)
4. [Testing Scenarios](#testing-scenarios)
5. [Feature Testing Checklist](#feature-testing-checklist)
6. [Troubleshooting](#troubleshooting)
7. [Test Data](#test-data)

## 🔧 Prerequisites

Before setting up the test environment, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (Supabase recommended for easy setup)
- Google Cloud Console account (for OAuth testing)
- OpenAI API key (for AI features testing)
- Git installed

## 🚀 Environment Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/TranLuongPhan/AI_Powered_Issue_Tracking_Web_Application.git
cd AI_Powered_Issue_Tracking_Web_Application
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth Configuration
AUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Get from Google Cloud Console)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# OpenAI API (For AI features)
OPENAI_API_KEY="your-openai-api-key"
```

**Note**: 
- Generate `AUTH_SECRET` using: `openssl rand -base64 32`
- For local testing, `NEXTAUTH_URL` should be `http://localhost:3000`
- For production, update `NEXTAUTH_URL` to your production URL

### Step 4: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### Step 5: Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 👤 Test Accounts

### Demo Account (Hardcoded)

**Email**: `litmerscontest2911@gmail.com`  
**Password**: `litmers123`

**Note**: This is a demo account that bypasses the database. It will show a warning banner on the dashboard.

### Creating Test Accounts

You can create test accounts through the registration page:

1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form:
   - **Name**: 1-50 characters
   - **Email**: Valid email format, max 255 characters
   - **Password**: 6-100 characters
3. Click "Sign Up"
4. You will be automatically logged in after registration

### Google OAuth Test Account

1. Ensure Google OAuth is configured in Google Cloud Console
2. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
3. Click "Sign up with Google" or "Sign in with Google"
4. Complete Google authentication flow

## 🧪 Testing Scenarios

### Scenario 1: New User Registration and First Issue

**Steps**:
1. Navigate to `/register`
2. Fill in registration form with valid data
3. Submit the form
4. Verify automatic login and redirect to dashboard
5. Verify default "Personal Team" and "My Project" are created
6. Create a new issue
7. Verify issue appears in both Board and List views

**Expected Results**:
- User is registered successfully
- User is automatically logged in
- Default team and project are created
- Issue can be created immediately
- Issue appears in Kanban board and list

### Scenario 2: Authentication Flow

**Test Email/Password Login**:
1. Navigate to `/login`
2. Enter valid credentials
3. Click "Login"
4. Verify redirect to dashboard

**Test Google OAuth**:
1. Navigate to `/login` or `/register`
2. Click "Sign in with Google" or "Sign up with Google"
3. Complete Google authentication
4. Verify redirect to dashboard

**Test Invalid Credentials**:
1. Enter incorrect email/password
2. Verify error message appears
3. Verify user is not logged in

### Scenario 3: Issue Management

**Create Issue**:
1. Log in to the application
2. Fill in issue creation form:
   - Title: "Test Issue"
   - Description: "This is a test issue"
   - Status: "Backlog"
   - Priority: "HIGH"
3. Click "Create Issue"
4. Verify issue appears in the Kanban board

**Edit Issue (Inline)**:
1. Click on an issue in the Kanban board or list
2. Edit the title directly in the input field
3. Edit the description in the textarea
4. Verify auto-save on blur
5. Refresh the page and verify changes persist

**Change Issue Status**:
1. Drag an issue from "Backlog" to "In Progress" in Kanban board
2. Verify issue moves to "In Progress" column
3. Use status dropdown to change to "Done"
4. Verify status updates immediately

**Change Issue Priority**:
1. Click on priority dropdown in an issue card
2. Select different priority (HIGH, MEDIUM, LOW)
3. Verify priority updates immediately

**Delete Issue**:
1. Click the "×" delete button on an issue card
2. Confirm deletion
3. Verify issue is removed from view
4. Verify soft delete (issue not permanently deleted)

### Scenario 4: Search and Filtering

**Title Search**:
1. Click "🔍 Filters" button
2. Enter search query in "Search by Title" field
3. Click "Apply Filters"
4. Verify only matching issues are displayed

**Status Filter**:
1. Open filter panel
2. Select "In Progress" from Status dropdown
3. Click "Apply Filters"
4. Verify only "In Progress" issues are shown

**Priority Filter**:
1. Open filter panel
2. Select "HIGH" from Priority dropdown
3. Click "Apply Filters"
4. Verify only HIGH priority issues are shown

**Combined Filters**:
1. Set search query: "test"
2. Set status: "Backlog"
3. Set priority: "MEDIUM"
4. Click "Apply Filters"
5. Verify results match all criteria

**Sorting**:
1. Open filter panel
2. Select "Priority" from Sort By dropdown
3. Select "Ascending" from Order dropdown
4. Click "Apply Filters"
5. Verify issues sorted by priority (LOW → MEDIUM → HIGH)

**Clear Filters**:
1. Apply multiple filters
2. Click "Clear All"
3. Verify all filters reset
4. Verify all issues are displayed

### Scenario 5: Kanban Board Drag and Drop

**Drag Issue Between Columns**:
1. Locate an issue in "Backlog" column
2. Click and hold the drag handle (6-dot icon)
3. Drag to "In Progress" column
4. Release to drop
5. Verify issue moves to new column
6. Verify status updates in database

**Edit While Dragging**:
1. Try to edit title/description while dragging
2. Verify editing works independently
3. Verify drag handle doesn't interfere with inputs

### Scenario 6: AI Project Summary

**Generate Default Summary**:
1. Navigate to dashboard
2. Create a few issues with different statuses and priorities
3. Click "Generate Summary" button
4. Verify AI summary appears
5. Verify summary includes issue statistics

**AI Chat**:
1. Type a question in the AI chat input: "What are the high priority issues?"
2. Click "Enter" or press Ctrl+Enter
3. Verify AI responds with relevant information
4. Verify input clears after submission

**AI Service Unavailable**:
1. If OpenAI API quota is exceeded
2. Click "Generate Summary"
3. Verify fallback summary is shown
4. Verify message indicates AI service is unavailable

### Scenario 7: Profile Management

**Update Profile**:
1. Navigate to `/profile`
2. Edit name field
3. Add profile image URL
4. Click "Update Profile"
5. Verify success message
6. Verify changes reflect immediately
7. Verify session updates

**Change Password** (for non-OAuth users):
1. Navigate to `/profile`
2. Enter current password
3. Enter new password (6-100 characters)
4. Confirm new password
5. Click "Change Password"
6. Verify success message
7. Log out and log in with new password

**Password Validation**:
1. Try to change password with incorrect current password
2. Verify error message appears
3. Try to change password with mismatched confirmation
4. Verify error message appears
5. Try password less than 6 characters
6. Verify validation error

### Scenario 8: Team Management

**Create Team**:
1. Navigate to `/teams`
2. Enter team name in "Create New Team" form
3. Click "Create Team"
4. Verify team appears in "Your Teams" list
5. Verify you are listed as OWNER

**View Teams**:
1. Navigate to `/teams`
2. Verify all teams you're a member of are displayed
3. Verify member and project counts are shown

### Scenario 9: View Switching

**Switch to List View**:
1. On dashboard, click "Switch to List View"
2. Verify issues display in list format
3. Verify all issue details are visible
4. Verify inline editing works in list view

**Switch to Board View**:
1. On dashboard, click "Switch to Board View"
2. Verify issues display in Kanban board
3. Verify drag and drop works
4. Verify columns are properly organized

### Scenario 10: Form Validation

**Registration Validation**:
1. Try to register with invalid email format
2. Verify error: "Please input valid Email, Password or Name"
3. Try password less than 6 characters
4. Verify validation error
5. Try name longer than 50 characters
6. Verify validation error

**Issue Creation Validation**:
1. Try to create issue without title
2. Verify form prevents submission
3. Try to create issue while not logged in
4. Verify error message appears

## ✅ Feature Testing Checklist

### Authentication
- [ ] Email/Password registration
- [ ] Email/Password login
- [ ] Google OAuth sign up
- [ ] Google OAuth sign in
- [ ] Account linking (same email)
- [ ] Auto-login after registration
- [ ] Logout functionality
- [ ] Session persistence

### Issue Management
- [ ] Create issue
- [ ] View issues in Board view
- [ ] View issues in List view
- [ ] Edit issue title (inline)
- [ ] Edit issue description (inline)
- [ ] Change issue status (dropdown)
- [ ] Change issue status (drag and drop)
- [ ] Change issue priority
- [ ] Delete issue
- [ ] Auto-save on blur
- [ ] Optimistic UI updates

### Search & Filtering
- [ ] Title text search
- [ ] Status filter
- [ ] Priority filter
- [ ] Assignee filter
- [ ] Has due date filter
- [ ] Due date range filter
- [ ] Sort by creation date
- [ ] Sort by last modified
- [ ] Sort by due date
- [ ] Sort by priority
- [ ] Clear all filters
- [ ] Filter panel toggle

### AI Features
- [ ] Generate default summary
- [ ] AI chat with custom questions
- [ ] Fallback summary when AI unavailable
- [ ] Input clearing after submission
- [ ] Keyboard shortcut (Ctrl+Enter)

### Profile Management
- [ ] Update name
- [ ] Update profile image
- [ ] Change password (non-OAuth users)
- [ ] Password validation
- [ ] Profile changes reflect immediately

### Team Management
- [ ] Create team
- [ ] View teams
- [ ] Team member counts
- [ ] Project counts

### UI/UX
- [ ] Dark theme consistency
- [ ] Responsive design
- [ ] Loading states
- [ ] Error messages
- [ ] Success messages
- [ ] Navigation alignment
- [ ] Button states (disabled/enabled)

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: `P1001: Can't reach database server`

**Solutions**:
1. Verify `DATABASE_URL` and `DIRECT_URL` are correct
2. Check if Supabase project is paused (restore if needed)
3. Verify database password is correct
4. Check network connectivity
5. Ensure connection string includes `?sslmode=require`

### Authentication Issues

**Problem**: Google OAuth not working

**Solutions**:
1. Verify `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are correct
2. Check authorized redirect URIs in Google Cloud Console:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
3. Verify `NEXTAUTH_URL` matches your environment
4. Check browser console for errors

**Problem**: "Project not found" error

**Solutions**:
1. The system should auto-create projects now
2. If error persists, manually trigger project creation by:
   - Logging out and logging back in
   - Or creating an issue (will auto-create project)

### Build Errors

**Problem**: TypeScript compilation errors

**Solutions**:
1. Run `npm install` to ensure all dependencies are installed
2. Run `npx prisma generate` to regenerate Prisma client
3. Check for missing state variables in components
4. Verify all imports are correct

**Problem**: Prisma schema errors

**Solutions**:
1. Verify `DATABASE_URL` is set correctly
2. Run `npx prisma db push` to sync schema
3. Check for syntax errors in `schema.prisma`

### Runtime Errors

**Problem**: Issues not loading

**Solutions**:
1. Check browser console for errors
2. Verify user is logged in
3. Check network tab for failed API requests
4. Verify database connection
5. Check if issues exist in database

**Problem**: Drag and drop not working

**Solutions**:
1. Verify `@dnd-kit` packages are installed
2. Check browser console for errors
3. Ensure drag handle is clicked (not input fields)
4. Verify columns are properly set up as droppable

## 📊 Test Data

### Sample Issues for Testing

Create these issues to test various scenarios:

1. **High Priority Backlog Issue**
   - Title: "Fix critical bug in authentication"
   - Description: "Users cannot log in with Google OAuth"
   - Status: Backlog
   - Priority: HIGH

2. **In Progress Medium Priority**
   - Title: "Implement user dashboard"
   - Description: "Create responsive dashboard layout"
   - Status: In Progress
   - Priority: MEDIUM

3. **Done Low Priority**
   - Title: "Update documentation"
   - Description: "Add API documentation"
   - Status: Done
   - Priority: LOW

4. **High Priority In Progress**
   - Title: "Optimize database queries"
   - Description: "Improve query performance"
   - Status: In Progress
   - Priority: HIGH

5. **Backlog Medium Priority**
   - Title: "Add unit tests"
   - Description: "Write tests for API endpoints"
   - Status: Backlog
   - Priority: MEDIUM

### Test Search Queries

- "bug" - Should find issues with "bug" in title
- "dashboard" - Should find dashboard-related issues
- "test" - Should find test-related issues
- "critical" - Should find critical issues

## 🔍 Testing Best Practices

1. **Test in Different Browsers**: Chrome, Firefox, Safari, Edge
2. **Test Responsive Design**: Mobile, tablet, desktop views
3. **Test Error Scenarios**: Invalid inputs, network failures
4. **Test Edge Cases**: Empty states, large datasets, special characters
5. **Test Performance**: Large number of issues, slow network
6. **Test Accessibility**: Keyboard navigation, screen readers
7. **Test Security**: Unauthorized access, XSS, CSRF protection

## 📝 Test Report Template

When reporting bugs or test results, include:

1. **Environment**:
   - Browser and version
   - Operating system
   - Node.js version
   - Database type

2. **Steps to Reproduce**:
   - Detailed step-by-step instructions
   - Screenshots if applicable

3. **Expected Result**:
   - What should happen

4. **Actual Result**:
   - What actually happened
   - Error messages
   - Console logs

5. **Severity**: Critical, High, Medium, Low

## 🚀 Quick Test Commands

```bash
# Run development server
npm run dev

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# View database in Prisma Studio
npx prisma studio

# Build for production
npm run build

# Run production build
npm start
```

## 📞 Support

If you encounter issues during testing:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console for errors
3. Check server logs
4. Verify environment variables
5. Ensure database is accessible

---

**Last Updated**: 2025
**Version**: 1.0.0

