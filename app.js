require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000; //?? 5000 fourni une valeur par défaut (=5000) si APP_PORT n'est pas fourni (déclaré dans .env)

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const validator = require("./validator");


app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/movies", validator.validateMovie, movieHandlers.postMovie);
app.post("/api/users", validator.validateUser, userHandlers.postUser);
app.put("/api/movies/:id", validator.validateMovie, movieHandlers.putMovieById);
app.put("/api/users/:id", validator.validateUser,userHandlers.putUserById);
app.delete("/api/movies/:id", movieHandlers.deleteMovieById);
app.delete("/api/users/:id", userHandlers.deleteUserById);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
