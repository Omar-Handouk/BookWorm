# BookWorm

#### A newer experience for car booking services

---

## What is BookWorm?

BookWorm is a service that helps you choose your perfect car. It facilitates the process of choosing your car by providing a versatile user experience that gives you the ability to choose everything for a car fitting your personality, starting from brand, car type, color, engine type, …etc.

---

## What will you be able to do?

_Our services will provide you with the following:_

- The ability to choose your car flexibly.
- Save your car configuration to review later or purchase.
- Helps you book your car.
- You can cancel your booking anytime.<sup>\*</sup>

> <sup>\*</sup> Booking cancels are only valid as long as no down payment is provided.

---

## What will you not be able to do?

- You cannot pay online; you must pay on premises.
- You cannot cancel your booked car after providing a down payment.


## INSTRUCTIONS:
## To run the application: 
- npm install .
- npm run .

## Dependency isolation tool:
- npm for NodeJs

## Environmental variables:
- NODE_ENV=dev.
- PORT=8080.
- DB_URL=(Replace with firebase cloud db or firestore).
- COOKIE_SECRET=2C9B7727CED8D72637D6589347ED8.
(They are placed in a .env file on the repo)

## Docker commands:
- docker container run.
- docker-compose up OR docker container run --publish 8080:8080 --detach --name bookworm bookworm-app:latest (after building the image).
- docker image build -t bookworm-app .


