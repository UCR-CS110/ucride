# UCRide
UCRide is a carpooling platform for UC Riverside students that lets verified drivers post their rides and allows riders to join the posted ride to campus.

## Frontend

### Frameworks
- React.js

### Build Tools
- Vite

### APIs/Libraries
- MapBox GL 
- Socket.IO
- react-router 
- CSS Modules
- CLSX

## Backend

### Frameworks
- Node.js with Express
- MongoDB with Mongoose

### APIs/Libraries
- Socket.IO
- Multer

## Authentication
- JWT
- Google OAuth via google-auth-library

## Team Contributions
- Amirali
    - Worked on developing the look and feel of the website
    - Worked on the database models and backend
- Karen
    - Developed the base for the Profiles, Driver, and Review System and connected to backend
    - Developed the profile settings and added admin functionality to the admin page
    - Fixed many other issues in the frontend
- David
    - Developed the Admin, Rider, Login, Register, and Messages pages
    - Helped fix styling and logic in other frontend pages
    - Developed the backend alongside Amirali
    - Integrated MapBox GL maps into the app
    - Integrated Socket.IO for the ride-based messaging
    - Implemented local storage for profile pictures

## Deployment
- Navigate to `backend/` to run `npm install` and then run `npm run start` to start the backend server
- Navigate to `frontend/` to run `npm install` and then run `npm run dev` to start the frontend server
- Open a browser and navigate to the URL given by npm after starting the web server

## AI Use
We used AI for some of the styling and also for fixing some bugs on the frontend and backend. 
- Karen
    - Used AI for styling the frontend
    - Fixed bugs when connecting frontend with backend in Profile, ProfileSetting, and Review System
    - Learned how to connect frontend with backend from AI
- David
    - We initially designed the frontend using pure CSS which sat in a components' folder (i.e. Navbar/Navbar.jsx and Navbar/Navbar.css) however it became very annoying to write css for new pages and components without affecting other styling so I used AI to refactor our CSS management to use CSS Modules instead to improve the development experience
    - I used AI to help me understand the MapBox API Documentation and how to setup, access, and configure the embedded MapBox map
    - I used AI to help me resolve a couple confusing rendering bugs related to useEffect that I couldn't figure out
    - On the backend, I used AI to help me understand the WebSocket.IO and Multer documentation
    - There was a weird bug where the profile pictures were not saving to the backend directory correctly. I used AI to figure out why it wasn't saving

## Misc
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/c4wSHrp5)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23852715&assignment_repo_type=AssignmentRepo)
