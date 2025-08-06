# Active Context: ICS Boltz App

## 1. Current Work Focus

**COMPLETED: New User Creation Pages (Mobile & Web)**
Successfully created both mobile and web versions of the new user creation pages (`new-user.tsx`, `new-user.web.tsx`) following the exact design and styling patterns from the new-request pages with minimal changes.

**Key Features Implemented:**
- **MOBILE VERSION**: Complete mobile-optimized form with SafeAreaView, proper keyboard handling, and modal dropdowns
- **WEB VERSION**: Two-column layout with image upload area and form fields, matching the new-request.web.tsx design
- **FORM FIELDS**: Name, Email, Phone No, Role, Department, Rank with proper validation
- **DROPDOWN FUNCTIONALITY**: Interactive dropdowns for Role (Admin, Manager, Employee, Supervisor), Department (Marketing, Sales, IT, HR, Finance, Operations), and Rank (CEO, Director, Manager, Senior, Junior, Intern)
- **IMAGE UPLOAD**: Drag-and-drop image upload area in web version with user icon placeholder
- **VALIDATION**: Email format validation, required field validation, and proper error handling
- **CONSISTENT STYLING**: Followed exact design patterns from new-request files with minimal modifications
- **NAVIGATION**: Proper back navigation and success flow with router.back()
- **RESPONSIVE DESIGN**: Mobile-first approach with web-optimized layouts and hover effects

**COMPLETED: Mobile Version of 3-Step GM View Request Pages**
Successfully created mobile versions of the 3-step GM view request pages (`gm-view-request-step1.tsx`, `gm-view-request-step2.tsx`, `gm-view-request-step3.tsx`) adapted from their web counterparts with mobile-optimized sizing and layout.

**Key Mobile Adaptations:**
- **MOBILE LAYOUT**: Replaced web-specific centered containers and max-width constraints with mobile-friendly full-width layout
- **SAFEAREAVIEW**: Used SafeAreaView instead of regular View for proper mobile screen handling
- **MOBILE TEXT SIZING**: Reduced text sizes from web versions (text-lg → text-base, text-sm → text-xs, etc.)
- **MOBILE FIELD SIZING**: Adjusted input field heights (min-h-[44px] → min-h-[36px], min-h-[80px] → min-h-[60px])
- **MOBILE SPACING**: Reduced padding and margins (px-6 py-6 → px-4 py-4, space-y-6 → space-y-4)
- **MOBILE ICONS**: Scaled down icon sizes (size={24} → size={20}, size={20} → size={16})
- **MOBILE PROGRESS INDICATOR**: Smaller progress circles (w-8 h-8 → w-6 h-6) and thinner connecting lines (h-1 → h-0.5)
- **MOBILE BUTTONS**: Reduced button heights (min-h-[44px] → min-h-[40px]) and adjusted text sizes
- **MOBILE DROPDOWNS**: Adjusted dropdown heights and scroll areas for mobile screens
- **MOBILE ATTACHMENTS**: Smaller upload area and icons for mobile interface

**COMPLETED: Web Version of View Request Page**
Successfully created `view-request.web.tsx` - a comprehensive web version of the view request page following the same design pattern as the new request web version with centered card layout and proper web styling.

**Key Features Implemented:**
- **CENTERED CARD LAYOUT**: Follows the same design pattern as new-request.web.tsx with max-width container and proper spacing
- **ROLE-BASED FIELD EDITING**: Fields are editable/read-only based on user role permissions with visual indicators
- **COMPREHENSIVE REQUEST INFORMATION**: Displays all request details including technical and financial information in organized sections
- **DYNAMIC ACTION BUTTONS**: Shows Approve/Reject buttons only for users with appropriate permissions in sticky footer
- **STATUS BADGE INTEGRATION**: Color-coded status badge in header matching the request status
- **WEB-OPTIMIZED DROPDOWNS**: Custom dropdown implementations for Priority, Department, and Approval Level selections
- **RESPONSIVE DESIGN**: Proper flex layouts and web-specific styling with gray background and white card
- **ATTACHMENT HANDLING**: File upload area with drag-and-drop styling (non-functional for requesters)
- **COMMENTS SYSTEM**: Supports HOD comments, manager comments, and rejection reasons with proper conditional rendering
- **FORM VALIDATION**: Rejection requires reason input with proper error handling

**COMPLETED: Web Version of New Requests Page**
Successfully created `new-request.web.tsx` - a popup-style web version of the new requests page matching the provided design with shorter width, file upload area, and all form fields.

**COMPLETED: Web Version of Requests Page**
Successfully created `requests.web.tsx` - a production-ready web version of the requests page with table layout, row selection, expansion functionality, and proper navigation integration.

**Key Features Implemented:**
- **TABLE-BASED LAYOUT**: Complete table implementation with headers, data rows, and proper column alignment
- **ROW SELECTION**: Individual checkboxes and "Select All" functionality using Set-based state management
- **ROW EXPANSION**: Click-to-expand rows with action panels (View Details, Approve, Reject buttons)
- **SEARCH FUNCTIONALITY**: Header search bar with proper styling and state management
- **STATUS DISPLAY**: Color-coded status text (green/red/orange) without badge components
- **IMAGE DISPLAY**: 40x40 pixel images in File/Image column using placeholder service
- **STATIC DATA**: 7 sample RequestData objects with all three status types for testing
- **NAVIGATION**: "New Requests" button properly navigates to `/new-request` route
- **RESPONSIVE DESIGN**: Proper flex layouts and Tailwind CSS styling matching UI requirements

**COMPLETED: Role-Based Navigation System with User Management**
Successfully implemented a comprehensive role-based navigation system that dynamically shows different tabs based on user roles, along with user management capabilities.

**Key Features Implemented:**
- **ROLE-BASED TAB NAVIGATION**: Modified tab layout (`app/(tabs)/_layout.tsx`) to show different tabs based on user roles:
  - **REQUESTER**: Dashboard, My Requests, Scan, More
  - **HEAD_OF_DEPARTMENT & GENERAL_MANAGER**: Dashboard, My Requests, Notifications, More  
  - **ADMIN**: Dashboard, My Requests, Users, More
- **NEW SCAN PAGE**: Created QR code scanner page (`app/(tabs)/scan.tsx`) for requesters with manual entry and simulation
- **NEW NOTIFICATIONS PAGE**: Created notifications page (`app/(tabs)/notifications.tsx`) for GM and HoD with filtering and read/unread status
- **NEW USER MANAGEMENT**: Created UserCard component (`components/ui/UserCard.tsx`) and user page for admins
- **USER CARD FEATURES**: Shows name, phone number, profile picture, and status indicator dot in normal state
- **EXPANDABLE USER DETAILS**: Dropdown reveals role and department information
- **STATUS INDICATORS**: Visual status dots for online (green), active (blue), suspended (orange), terminated (red)
- **ROLE-BASED ACTIONS**: Admin users see management buttons (View Profile, Edit User, Suspend/Activate, Delete)
- **MULTIPLE CARD EXPANSION**: Users can expand multiple user cards simultaneously
- **STATUS FILTERING**: Filter tabs for All, Online, Active, Suspended, Terminated users
- **NOTIFICATION SYSTEM**: Complete notification management with filtering, mark as read, and different notification types
- **HIDDEN TAB ROUTING**: Proper routing setup to hide unused tabs while maintaining navigation functionality

**COMPLETED: View Request Page with Role-Based Access Control**
Successfully implemented a comprehensive "View Request" page that utilizes the existing role-based access control system. This page serves as the main interface for viewing and managing request details with different permissions based on user roles.

**Key Features Implemented:**
- **NEW PAGE**: Created dedicated view request page (`app/(screens)/view-request.tsx`)
- **Role-Based Field Editing**: Fields are editable/read-only based on user role permissions
- **Comprehensive Request Information**: Displays all request details including technical and financial information
- **Dynamic Action Buttons**: Shows Approve/Reject buttons only for users with appropriate permissions
- **Status Badge Integration**: Uses PremiumStatusBadge to display current request status
- **Additional Technical Fields**: Added Request ID, requester information, estimated cost, budget code, approval level, etc.
- **Comments System**: Supports HOD comments, manager comments, and rejection reasons
- **Navigation Integration**: Added to More page for easy access

**Previous Completed Work:**
- **Role-Based Access Control System**: Dynamic role configuration with 4 user roles and role-specific permissions
- **Resubmit Request Page**: Mirrors new request page with HOD feedback integration
- **New Request Page**: Full-featured request creation with file uploads and form validation

- **IMPLEMENTED: Role-Based Access Control System** (`constants/UserRoles.tsx` & `components/ui/RequestCard.tsx`)
  - **NEW CONSTANTS FILE**: Created comprehensive role configuration system with unique search keywords
  - **Role Definitions**: Defined 4 user roles with specific permissions and priority levels
    - **REQUESTER**: scan, info, resubmit actions (current default for testing)
    - **HEAD_OF_DEPARTMENT**: view_log, approve, reject actions
    - **GENERAL_MANAGER**: view_log, approve, reject actions  
    - **ADMIN**: view, approve, warranty actions
  - **Dynamic Button Rendering**: RequestCard now dynamically renders buttons based on user role
  - **Smart Layout**: Buttons render in pairs for better layout, with overflow as full-width buttons
  - **Status-Aware Logic**: Resubmit button only appears for unsuccessful requests
  - **Easy Configuration**: Role can be changed by modifying `ICSBOLTZ_CURRENT_USER_ROLE` constant
  - **Search Keywords**: Added `ICSBOLTZ_USER_ROLES_CONFIG`, `role-based-access`, `user-permissions` for easy finding
  - **Future-Ready**: System designed for dynamic role fetching from authentication in the future
  - **Comprehensive Action Handlers**: Added placeholder handlers for all role-specific actions
  - **Fallback UI**: Shows appropriate message when no actions are available for a role

## 2. Recent Changes

**COMPLETED: Updated View User Pages to Match New User Design** (`app/(screens)/view-user.tsx` & `app/(screens)/view-user.web.tsx`)
- **MOBILE VERSION**: Already had correct structure with editable fields and status dropdown with color indicators
- **WEB VERSION**: Completely redesigned to match new-user.web.tsx structure with pre-filled editable fields
- **STATUS DROPDOWN**: Added new status dropdown field with color-coded indicators for both mobile and web
- **STATUS OPTIONS**: Implemented Active (green), Suspended (orange), Terminated (red), On Leave (blue), Pending (gray)
- **PRE-FILLED FIELDS**: All fields are pre-populated with existing user data but remain fully editable
- **CONSISTENT DESIGN**: Web version follows exact same layout as new-user.web.tsx with two-column design
- **FORM VALIDATION**: Maintained all validation logic including email format and required field checks
- **NAVIGATION**: Updated header text to "Edit User" and button text to "Save Changes"
- **COLOR MAPPING**: Implemented STATUS_COLORS constant matching the provided color scheme

- **UPDATED: Sidebar ite** to White (`components/ui/Sidebar.tsx`)
  - **STYLINI NEFIRNMENTT**:Updptted sidebar rroerlcolor or fromorder- ray`300r-gray-order00` to2`0bofdrego testrppaaraacae
  - **WWITT BCCKGD*UoDfirmConfirmdebsidabar alleadyrue uhwtitb kackouwundh(ior both e)xpandeoth dxpandnd and collapsed slptesd states
  - **CONSISTENT STYLING**: Maintained all existing hover states, active states, and navigation functionality
  - **VISUAL IMPROVEMENT**: Softer border provides better visual hierarchy while maintaining clean white appearance

- **CREATED: Web Requests Page** (`app/(app)/(tabs)/requests.web.tsx`)
  - **NEW FILE**: Complete web version of requests page with table layout
  - **DATA STRUCTURE**: Implemented RequestData interface with proper TypeScript typing
  - **TABLE IMPLEMENTATION**: Header row with column titles and data rows with proper alignment
  - **INTERACTIVITY**: Row selection, expansion, and action panel functionality
  - **STYLING**: Tailwind CSS classes for professional web interface design
  - **NAVIGATION**: Integrated with existing routing system for "New Requests" button

- **IMPLEMENTED: Resubmit Button Hardcode Fix** (`components/ui/RequestCard.tsx`)
  - **CRITICAL FIX**: Applied hardcode fix to bypass PremiumButton gradient issue for resubmit action
  - **Import Added**: Added LinearGradient from expo-linear-gradient to imports
  - **Conditional Rendering**: Implemented conditional logic in all three button rendering sections:
    - Side-by-side buttons (first 2 actions)
    - Full-width buttons (remaining actions after first 2)
    - Single button case (when only 1 action available)
  - **Custom Button Implementation**: For 'resubmit' action, renders TouchableOpacity with LinearGradient instead of PremiumButton
  - **Style Matching**: Custom button matches PremiumButton 'sm' size and gradient variant styling
  - **Preserved Layout**: Maintained existing complex layout logic for side-by-side and full-width button arrangements
  - **Touch Handling**: Proper onPress handler attachment to TouchableOpacity for working button functionality
  - **All Other Actions**: Continue to use existing PremiumButton component as before
  - **Gradient Colors**: Uses same gradient colors as PremiumButton (['#409CFF', '#0A84FF'])
  - **Icon Support**: Properly renders icon from button config with correct styling

- **IMPLEMENTED: Multiple Card Expansion in My Requests** (`app/(tabs)/requests.tsx`)
  - **NEW FEATURE**: Changed from single card expansion to multiple card expansion capability
  - **State Management**: Replaced `expandedCard` (string | null) with `expandedCards` (Set<string>)
  - **Toggle Logic**: Updated `handleCardToggle` to add/remove cards from Set instead of replacing single value
  - **Expansion Check**: Modified `isExpanded` prop to use `expandedCards.has(request.id)` instead of equality check
  - **User Experience**: Users can now expand multiple request cards simultaneously for better comparison and workflow
  - **Performance**: Using Set for O(1) lookup performance when checking if cards are expanded

- **REMOVED: Demurrage Charges from More Page** (`app/(tabs)/more.tsx`)
  - **CLEANUP**: Removed demurrage charge menu item and its handler function
  - **UI Improvement**: Cleaned up menu layout by removing unused functionality
  - **Navigation**: Removed `handleDemurrageCharge` function and associated TouchableOpacity
  - **Separator Management**: Properly handled separator lines to maintain clean visual spacing

- **IMPLEMENTED: Role-Based View Request Button Logic** (`app/(tabs)/more.tsx`)
  - **NEW FEATURE**: Added conditional rendering logic to hide "View Request" button for requesters
  - **Role-Based Access**: View Request button now only appears for users with roles other than 'REQUESTER'
  - **Clean Implementation**: Used React conditional rendering with `!isRequester` check
  - **Proper Separator Handling**: Wrapped both the menu item and its separators in conditional rendering
  - **Import Integration**: Added import for `ICSBOLTZ_CURRENT_USER_ROLE` from UserRoles constants
  - **User Experience**: Requesters no longer see the View Request option, maintaining clean UI
  - **Testing Ready**: Current role is set to 'REQUESTER' so button should be hidden by default

- **FIXED NAVIGATION ISSUE: Moved Pages Outside Tabs Directory**
  - **Problem**: New request and resubmit pages were appearing in bottom navigation
  - **Solution**: Moved `new-request.tsx` and `resubmit-request.tsx` from `app/(tabs)/` to `app/(screens)/`
  - **Navigation Updates**: Updated all navigation paths to use absolute paths (`/new-request`, `/resubmit-request`)
  - **Tab Layout**: Cleaned up tab layout to only show intended tabs (Dashboard, My Requests, Scan, User, More)

- **Fixed RequestCard touch interaction issues** (`components/ui/RequestCard.tsx`)
  - **CRITICAL FIX**: Separated large TouchableOpacity into multiple smaller touch areas to prevent input field blocking
  - **Touch Architecture**: Split header into three separate TouchableOpacity components (ID/Date, Status, Item Requested)
  - **Maintained Functionality**: Each section still triggers dropdown toggle while allowing form interactions
  - **Animation System**: Robust parallel animations for height, opacity, and rotation with React Native's Animated API
  - **Visual Design**: Enhanced status indicators with colored backgrounds and improved spacing
  - **Navigation Fix**: Updated resubmit navigation to use absolute path `/resubmit-request`

- **Converted New Request Modal to Full Page** (`app/(screens)/new-request.tsx`)
  - **NEW PAGE**: Created dedicated full-page screen for new request form (moved from tabs)
  - **Navigation Integration**: Used Expo Router for seamless navigation from plus icon
  - **Form Functionality**: Maintained all form features including file upload, date picker, and department selection
  - **User Experience**: Removed placeholder texts and improved field interaction
  - **Success Flow**: Added proper success message and navigation back to requests page

- **Updated Requests Screen Navigation** (`app/(tabs)/requests.tsx`)
  - **Navigation Change**: Plus icon now navigates to `/new-request` page instead of showing modal
  - **Code Cleanup**: Removed all modal-related imports and state management
  - **Maintained Design**: Kept all existing visual design and functionality intact
  - **Path Fix**: Updated navigation path to use absolute path `/new-request`

- **Created Resubmit Request Page** (`app/(screens)/resubmit-request.tsx`)
  - **NEW PAGE**: Created dedicated resubmit page that mirrors the new request page (moved from tabs)
  - **Key Differences**: Different heading ("Resubmit Request"), button text ("Resubmit"), and new HOD comments field
  - **HOD Comments Field**: Uneditable field displaying Head of Department feedback with red styling
  - **Form Pre-population**: Accepts URL parameters to pre-populate form fields from existing request data
  - **Navigation Integration**: Accessible through resubmit button in RequestCard for unsuccessful requests

## 3. Next Steps

- Test the new RequestCard implementation
- Verify that all dependencies (PremiumCard, PremiumButton) work correctly
- Ensure the dropdown animations work smoothly on both iOS and Android
- Monitor for any layout or performance issues

## 4. Active Decisions and Considerations

- **Animation Strategy**: Switched to React Native's Animated API for more predictable and reliable dropdown animations
- **Height Measurement**: Implemented onLayout-based height calculation for precise animation control
- **Parallel Animations**: Used Animated.parallel for smooth height, opacity, and rotation transitions
- **Visual Improvements**: Enhanced status indicators with colored backgrounds and better visual hierarchy
- **Layout Architecture**: Used absolute positioning within animated container for better performance
- **Touch Feedback**: Improved activeOpacity and visual feedback for better user experience
- **Cross-platform**: Ensured consistent animation behavior across iOS and Android platforms

## 5. Important Patterns and Preferences

- Using LayoutAnimation for smooth expand/collapse without complex animation libraries
- Maintaining the premium design system with proper color usage
- Conditional rendering for cleaner code and better performance
- Status-based visual indicators for better UX
