# Frontend

## Tools
React and Vite


## Pages/Routes

| route  | purpose |
|-------|----------------------------------------------|
| / | Introduces platform and links to sign in/registration |
| /signin | User login w/ ucr email (?) |
| /register | User sign up and profile creation |
| /driver | Dashboard for drivers to post schedules, manage ride requests, and view their ratings |
| /rider | Dashboard for riders to search for rides, request seats, and view their ride status |
| /messages | Interface for DMs between drivers and passengers/users |
| /admin | Dashboard for managing users, reviews, monitoring rides, and analytics. | 
| /requestReview | Dashboard to review rider request | 
| /createNewRide | Form for drivers to create and post available rides | 
| /profile | Dashboard for managing personal profile | 


## Components

| component  | purpose |
|-------|----------------------------------------------|
| Navbar | Top navigation bar, changes based on authentication status and user role. |
| RideCard | Displays details for a single ride (for search results, driver/rider dashboards, etc). |
| ReviewList | Displays reviews for a driver/rider |
| ReviewForm | Form for user to submit review a driver/rider |
| ProfileBadge | Displays user's picture, name, and average rating |
| SearchFilter | Set of forms for riders to specifiy their location, destination, time, price, etc. | 

## State Management

| context  | purpose |
|-------|----------------------------------------------|
| AuthContext | Stores users details like id, name, email, role, and jwt token to determine access to protected routes. |
