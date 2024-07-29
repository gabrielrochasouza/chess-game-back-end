<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Project Description


This project is an API made with nest that manages the entities **users**, **chess games** and **notifications** of this current project. It also allows real time events using websockets, to enable chess games in real time, and chat in real time.

It was used mongo db atlas and prisma as orm.

> To check for the swagger documentation of this project, check for the `/api` endpoint of the deployed url.

It also uses authentication to some routes to provide some security to the resources of each user. It was used bcrypt to encrypt the password, and it was used json web token to create generate tokens for users.

This application also has a **dockerfile**, to run it.

This api was deployed on Render to access the deploy click this <a href="https://chess-game-back-end.onrender.com/api">link</a>.


## Technologies used:

- nestjs
- prisma
- mongodb
- swagger
- websockets
- jsonwebtoken
- bcrypt
- typescript
- docker
- eslint

## Front End

To check the front end github repository of this application, open this <a href='https://github.com/gabrielrochasouza/chess-game-front-end'>link</a>


## Dependencies Installation

```bash
$ yarn install
```

## Running the app locally

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
