# Mongodb json Schemas 

## 1. User
- represents all users(driver/rider/admin)
- authentication limited to `@ucr.edu` emails

```json
{
  "_id": "ObjectId",
  "fName": "String",
  "lName": "String",
  "email": "String (required to end w/'@ucr.edu')",
  "password": "String (bcrypt hashed string)",
  "role": "String (driver/rider/admin)",
  "profilePictureUrl": "String (URL + optional)",
  "avgRating": "Number (scales from 1-5)",
  "vehicle" (only needed if role is driver): {
    "make": "String",
    "model": "String",
    "color": "String",
    "licensePlate": "String"
  },
}
```

## 2. Ride
- drivers post to share commute schedules, available seats, and pricing info

```json
{
  "_id": "ObjectId",
  "driverId": "ObjectId (References a User object)",
  "departureLocation": "String",
  "destination": "String",
  "departureTime": "Timestamp+Date",
  "remainingSeats": "Number",
  "seatPrice": "Number",
  "status": "String (open/full/inprogress/completed)",
}
```

## 3. Request
- create when passenger makes a request to join an open ride

```json
{
  "_id": "ObjectId",
  "rideId": "ObjectId (References a Ride object)",
  "riderId": "ObjectId (References a User object)",
  "status": "String (pending/accepted/declined/inprogress)",
}
```

## 4. Review
- submitted after a ride is completed
- contributes to the user's averageRating (In referenced User object)

```json
{
  "_id": "ObjectId",
  "rideId": "ObjectId (References a Ride object)",
  "reviewerId": "ObjectId (References a User object)",
  "revieweeId": "ObjectId (References a User object)",
  "rating": "Number (scales from 1 to 5)",
  "content": "String",
}
```

## 5. Message
- for DMs between driver and rider(s?).

```json
{
  "_id": "ObjectId",
  "senderId": "ObjectId (References a User object)",
  "receiverId": "ObjectId (References a User object)",
  "content": "String",
  "isRead": "Boolean",
}
```