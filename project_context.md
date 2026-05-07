# UCRideshare (UCRide) - Project Context

## Overview
UCRideshare is a web application tailored exclusively for the UCR community (students and staff) to facilitate carpooling and ridesharing. The platform connects student drivers with passengers, aiming to save money, ease chronic campus parking shortages, build community, and promote eco-friendly commuting by reducing the campus carbon footprint.

## Tech Stack & Architecture
- **Frontend**: Standard HTML5 and CSS3. 
- **Assets**: Icons are stored locally in the `./icons/` directory (e.g., `car.png`, `dollar.png`, `group.png`, `leaf.png`).
- **Backend/Database**: MongoDB (entities include Users, Rides, Requests, Reviews, Messages).
- **Authentication**: Email/password (bcrypt hashed) and Google Sign-in. Strictly limited to "@ucr.edu" emails.

## Key Workflows & User Roles
1. **Drivers**: 
   - Maintain profiles with real names, pictures, and vehicle details (make, model, color, license plate).
   - Post ride schedules, available seats, and price per seat.
   - Review passenger requests based on profiles and trust-building rating history.
   - Complete rides to earn money, rate passengers, and leave comments.
2. **Passengers**: 
   - Search for rides using a recommendation system that ranks by driver rating, time difference, and seat availability.
   - Send ride requests to drivers and compare similar rides.
   - Message drivers to coordinate logistics and provide post-ride ratings and comments.
3. **Admins**: 
   - Access the admin panel (e.g., `/admin/`).
   - Manage user accounts, verify/revoke driver status, monitor rides, and moderate reviews.

## Core System Specifications
- **Database Schema**:
  - *Users*: Profile info, role, `@ucr.edu` email, hashed password, average rating.
  - *Rides*: Departure/destination, time, seats available, status (open/full/inprogress/completed), price.
  - *Requests*: Passenger/Ride ID, status (accepted/declined/inprogress).
  - *Reviews & Messages*: Reviewer/Reviewee relations, star ratings, content, timestamps.

## Important Files & Pages
- `index.html`: The landing page outlining the value proposition ("Share rides, save money") and instructions for users.
- `styles.css`: The central stylesheet containing theme variables and component styles.
- `signin.html` & `register.html`: Target routes for user authentication.
...

## Styling & Design Guidelines
- **Color Palette**: The application uses a blue-themed palette defined via CSS variables (e.g., `--blue-lightest`, `--blue-pale`, `--blue-deep`). Chatbots modifying CSS should rely on these variables for consistency.
- **Buttons**: Primary actions use `.button-dark` and secondary actions use `.button-light`.
- **Messaging UI**: 
  - Uses a `.directmessage` component with interactive hover and active states.
  - Profiles use an `.avatar` class (40x40px, circular, with initials as text fallback if an image is missing).

## Notes for AI Assistants / Contributors
- **Adding new pages**: Make sure to link the centralized `styles.css` and follow the established navigation bar (`<nav>`) structure.
- **Building the Chat Interface**: Use the existing `.directmessage` and `.avatar` classes when generating the message view for the passenger/driver communication feature.
- **Dynamic Content**: Structure new HTML components so they can be easily manipulated by JavaScript (e.g., using predictable ID structures and list containers for ride searches and chat feeds).