# UCR Rideshare

## Description

UCR Rideshare is a carpooling platform exclusive to UCR students and staff, designed to ease chronic parking shortages on campus. 
UCR parking lots regularly fill up before peak class hours and many students spend significant time searching for a spot and end up arriving late. 
UCR Rideshare addresses this problem directly by connecting students who drive to campus with those who need a ride and reducing the total number of cars on campus making parking easier for everyone. 
Furthermore, drivers benefit by offsetting commute costs through seat cost-sharing, and the platform as a whole reduces the campus carbon footprint. 

- Users sign up/sign in on the platform and may post their ride schedule.
- Users may also search for a driver’s ride schedule that fits their passenger ride schedule.
- NOTE: Although previously we designed drivers and riders to have different accounts, we have changed the design to be that a user can be a rider and a driver on the same account however, the current role selected from the navbar shows different dashboards (`/rider` vs `/driver`)
- Once the passenger finds the driver’s ride schedule that fits their ride schedule, they submit a request to ride.
- Passenger’s profile information and rating will be sent to the driver, and if the driver accepts the passenger’s request for a ride, they can optionally message each other. 
- After the ride is completed, the driver and passengers give a rating and optional comment. 

## Specifications 

- Profiling: Drivers and passengers must add their real name with their picture. Using the profiling features, they can update their personal information and can see the profiles of other users. Drivers provide additional information about their vehicle like make, model, color, and license plate. 
- User Authentication and Authorization: The platform authenticates users based on email and passwords. It also supports third-party authentication (Google sign-in), and only the email address that ends with “@ucr.edu” can sign up and sign in. Users can change their own password if they forget it and their personal information, but can’t change other users password nor other users’ personal information. 
- Social Network: Drivers and passengers can interact with each other. They can review each other, and other users can make a decision based on those reviews. The review history is the primary method of developing trust between users and helps passengers and drivers to make informed decisions. The drivers and passengers can also communicate via direct messages (`/messages`)
- Rating and Commenting: After rides are done, both drivers and passengers must rate each other with optional comments. Other passengers can read reviews and decide whether to request a ride, and for drivers, accept/decline.

## Database 

- The database we use is MongoDB. The database will contain the following entities in the schema: Users, Rides, Requests, Reviews, and Messages.
- Users: 
    - Profile information and picture, role(driver/passenger/admin), email address, bcrypt hashed password, and average rating.
- Rides: 
    - Driver ID, departure location, destination location, departure time, seats available, ride status (open/full/inprogress/completed), and price per seat.
- Requests: 
    - Passenger ID, Ride ID, status (accepted/declined/inprogress), and timestamp.
- Reviews: 
    - Reviewer ID, Reviewee ID, Ride ID, star rating, and optional comment.
- Messages: 
    - Sender ID, Receiver ID, Ride ID, message content, and timestamp.
- Search and Recommendation System: 
    - Passengers can search for rides by entering their location, destination, filtering by date and/or time, and price. The recommendation system ranks the results using a weighted scoring formula that accounts for the rating of the driver, time difference between departure time and passenger’s preferred departure time, and seat availability. When a passenger views a ride they can also compare similar rides.
- Admin: The admin panel is accessible via the url http://localhost:3000/admin/ and is restricted to users with the admin user role. Admins can perform the following actions within the system:
    - View, edit, and delete user accounts
    - Verify and revoke driver status
    - View, hide, and delete reviews
    - Monitor active and past rides
    - View analytics regarding the most active routes and top drivers


## Security Concerns

- Cross-Site Request Forgery (CSRF)
    - This vulnerability occurs when a website tricks a logged in user’s browser into sending an unauthorized request to the application For example, a user logs into our site http://localhost:3000. They receive a session cookie and then go to a malicious site that contains a hidden form that sends a POST request to http://localhost:3000. The browser automatically attaches the session cookie to the request and then the malicious website receives user data. To mitigate CSRF concerns, we can design all state-changing endpoints to require a CSRF token via csurf library ExpressJS middleware.
NoSQL Injection 
    - All user input is sanitized via express-mongo-sanitize middleware which is designed to remove problematic MongoDB keywords/operators before they reach the database layer and potentially cause issues.
Weak Password Security
    - To secure stored user passwords, all passwords stored in the database are hashed with BCrypt which is the industry standard for password hashing. 

