# FoodConnect Frontend

React frontend application for the FoodConnect community food sharing platform.

## Features
- **User Authentication**: Login/signup with Choreo integration
- **Profile Management**: Complete user profile setup
- **Food Listings**: Browse available food items with search and filtering
- **Food Management**: Add, edit, and delete food items
- **Request System**: Request food items from other users
- **Notifications**: Real-time notifications for food requests
- **Responsive Design**: Mobile-friendly interface

## Tech Stack
- **Framework**: React 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3 with modern design patterns

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation
### 1. Navigate to frontend directory
```bash
cd frontend
```
### 2. Install dependencies
```bash
npm install
```
### 3. Environment Setup
Create a `config.json` file in the `src` directory:
```json
{
  "API_URL": "http://localhost:5001/api"
}
```
### 4. Start the development server
```bash
npm start
```
The application will open at `http://localhost:3000`

## Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure
```
frontend/
├── public/                 # Static files
├── src/
│   ├── api/               # API service functions
│   │   └── api.js         # Axios configuration and endpoints
│   ├── components/        # Reusable components
│   │   ├── FoodCard.js    # Food item card component
│   │   ├── Layout.js      # Main layout with sidebar
│   │   └── Layout.css     # Layout styles
│   ├── context/           # React Context
│   │   └── AuthContext.js # Authentication context
│   ├── pages/             # Page components
│   │   ├── Login.js       # Login/signup page
│   │   ├── Profile.js     # Profile completion page
│   │   ├── Home.js        # Food listings page
│   │   ├── AddFood.js     # Add food form (placeholder)
│   │   ├── FoodDetails.js # Food details page (placeholder)
│   │   ├── MyFoods.js     # User's foods page (placeholder)
│   │   ├── Notifications.js # Notifications page (placeholder)
│   │   └── *.css          # Page-specific styles
│   ├── App.js             # Main app component with routing
│   ├── App.css            # App styles
│   └── index.js           # App entry point
├── package.json
└── README.md
```

## Pages
### Login Page (`/login`)
- Choreo OAuth integration (placeholder)
- Manual login with Choreo User ID
- Toggle between login and signup modes

### Profile Page (`/profile`)
- Complete user profile information
- Form validation for required fields
- Redirects to home after completion

### Home Page (`/`)
- Display all available food items
- Search by food type
- Filter by town/location
- Responsive grid layout

### Add Food Page (`/add-food`)
- Form for adding new food items (placeholder)
- Image upload functionality
- Date and time pickers

### Food Details Page (`/food/:id`)
- Detailed view of food item (placeholder)
- Donor contact information
- Request form with quantity validation

### My Foods Page (`/my-foods`)
- User's donated food items (placeholder)
- Edit and delete functionality
- Request status tracking

### Notifications Page (`/notifications`)
- User's notifications (placeholder)
- Mark as read functionality
- Requester information

## Components
### Layout Component
- Responsive sidebar navigation
- User information display
- Mobile menu functionality
- Logout functionality

### FoodCard Component
- Display food item information
- Image handling with placeholders
- Hover effects and animations
- Link to detailed view

### Authentication Context
- User state management
- Token handling
- Login/logout functionality
- Profile management

## API Integration
The frontend communicates with the backend API through the `api.js` service:
- **Authentication**: Login, signup, user profile
- **Food Management**: CRUD operations for food items
- **Requests**: Food request functionality
- **Notifications**: Notification management
- **File Upload**: Image upload to Firebase Storage

## Styling
- Modern, responsive design
- CSS Grid and Flexbox layouts
- Smooth animations and transitions
- Mobile-first approach
- Consistent color scheme and typography

## Development
### Adding New Pages
1. Create component in `src/pages/`
2. Add CSS file for styling
3. Update routing in `App.js`
4. Add navigation link in `Layout.js`

### Adding New Components
1. Create component in `src/components/`
2. Add CSS file if needed
3. Import and use in pages

### API Integration
1. Add new endpoints in `src/api/api.js`
2. Use in components with proper error handling
3. Update loading states and user feedback

## Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5001/api` |

## Contributing
1. Follow React best practices
2. Use functional components with hooks
3. Maintain consistent code style
4. Add proper error handling
5. Test on multiple devices

## License
This project is licensed under the ISC License.
