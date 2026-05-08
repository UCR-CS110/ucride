# Backend

## Tools
Node.js and Express

### Config
Holds configuration files and connects db to external services.

| name  | purpose                                      |
|-------|----------------------------------------------|
| db.js | Handles connection setup to MongoDB database. |

### Controllers
Controllers handle the logic of the backend by receiving data from the routes, processing it, and then sending a response back to the client. 

| name  | purpose                                      |
|-------|----------------------------------------------|
| userController.js | Handles user operations like profile fetching, registration, etc. |
| rideController.js | Handles creating, finding, and updating rides posted by drivers. |
| requestController.js | Handles the logic for allowing riders to request to join rides. |
| reviewController.js | Handles the submission and retrieval of user reviews. |
| messageController.js | Handles the sending, receiving, and reading of DMs between users. |


### Models
Models define what kind of data and data structures are used for an entity/relationship in a database like what fields they use/require.

| name  | purpose                                      |
|-------|----------------------------------------------|
| User.js | Defines schema for the user accounts (driver, rider, and admin). |
| Ride.js | Defines schema for rides. |
| Request.js | Defines schema for passenger requests to join a ride. |
| Review.js | Defines the schema for reviews left after a completed ride (by users). |
| Message.js | Defines the schema for DMs between users. |

### Routes
Routes turn http requests like get, post, put, delete into requests to the controller. They're like the entry point of requests to the api.

| name  | purpose                                      |
|-------|----------------------------------------------|
| userRoutes.js | Defines the endpoints for all actions related to users. |
| rideRoutes.js | Defines the enpoints for all ride related actions. |
| requestRoutes.js | Defines the endpoints for ride requests. |
| reviewRoutes.js | Defines the endpoints for reviews. |
| messageRoutes.js | Defines the endpoints for messaging. |

## Other Files

| name  | purpose                                      |
|-------|----------------------------------------------|
| server.js | This is the main entry point for the backend. Sets up server and links the routes together so the server can start listening for api requests. |
| .env | Holds api keys for project. |
