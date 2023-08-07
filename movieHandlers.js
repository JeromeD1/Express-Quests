//on récupere notre database qui est notre lien avec notre base de donnée MySQL
const database = require("./database");


//------------------------------------------------------
//---SOLUTION FACILE MAIS COMPLIQUEE SI BEAUCOUP DE req.query différents
//---------------------------------------------------------------
// const getMovies = (req, res) => {
//   let sqlValues = [];
//   let sql = "";

//   if (req.query.color && req.query.max_duration) {
//     sql = "SELECT * FROM movies WHERE color = ? AND duration <= ?"
//     sqlValues.push(req.query.color)
//     sqlValues.push(req.query.max_duration)
//   } else if (req.query.color) {
//     sql = "SELECT * FROM movies WHERE color = ?"
//     sqlValues.push(req.query.color)
//   } else if (req.query.max_duration) {
//     sql = "SELECT * FROM movies WHERE duration <= ?"
//     sqlValues.push(req.query.max_duration)
//   } else {
//     sql= "SELECT * FROM movies"
//   }
  

//   database
//     .query(sql, sqlValues)
//     .then(([movies]) => { //[movies] <=> result[0] qui est la table movie d'après la commande query(...)
//       res.json(movies);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error retrieving data from database");
//     });
// };


//-------------------------------------------------------
//----SOLUTION PERMETTANT D'AJOUTER FACILEMENT PLEIN DE req.query------
const getMovies = (req, res) => {
  const initialSql = "select * from movies";
  const where = [];

  if (req.query.color != null) {
    where.push({
      column: "color",
      value: req.query.color,
      operator: "=",
    });
  }
  if (req.query.max_duration != null) {
    where.push({
      column: "duration",
      value: req.query.max_duration,
      operator: "<=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
//--------------------------------------------------


const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) { // bien sur que ça fonctionne car le query ne demande qu'un seul élément, movies dont l'id est celui demandé
        res.json(movies[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};




const postMovie = (req,res) => {
  const { title,director, year, color, duration} = req.body;

  database
  .query(
    "INSERT INTO movies(title,director,year,color,duration) VALUES (?,?,?,?,?)", 
    [title,director, year, color, duration]
  )
  .then(([result]) => {
    res.location(`/api/movies/${result.insertId}`).sendStatus(201);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error saving the movie");
  });
  
}


const putMovieById = (req, res) => {
  const id = req.params.id;
  const { title,director, year, color, duration} = req.body;


  database
  .query(
    `UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?`,
    [title, director, year, color, duration, id]
  )
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.status(404).send("Not Found - invalid id");
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error modifying the movie");
  });
}


const deleteMovieById = (req,res) => {
  const id = req.params.id;

  database
  .query(
    "DELETE FROM movies WHERE id = ?", 
    [id]
  )
  .then(([result]) => {
    if(result.affectedRows===0) {
      res.status(404).send("Movie not found on this id")
    } else {
      res.sendStatus(204); //renvoie "NO CONTENT"
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error deleting the movie");
  });
  
}



//const getMovieById = (req, res) => {
  //   const id = parseInt(req.params.id);
  
  //   const movie = movies.find((movie) => movie.id === id);
  
  //   if (movie != null) {
  //     res.json(movie);
  //   } else {
  //     res.status(404).send("Not Found");
  //   }
  // };



// const movies = [
//   {
//     id: 1,
//     title: "Citizen Kane",
//     director: "Orson Wells",
//     year: "1941",
//     colors: false,
//     duration: 120,
//   },
//   {
//     id: 2,
//     title: "The Godfather",
//     director: "Francis Ford Coppola",
//     year: "1972",
//     colors: true,
//     duration: 180,
//   },
//   {
//     id: 3,
//     title: "Pulp Fiction",
//     director: "Quentin Tarantino",
//     year: "1994",
//     color: true,
//     duration: 180,
//   },
// ];

// const getMovies = (req, res) => {
//   res.json(movies);
// };

// const getMovieById = (req, res) => {
//   const id = parseInt(req.params.id);

//   const movie = movies.find((movie) => movie.id === id);

//   if (movie != null) {
//     res.json(movie);
//   } else {
//     res.status(404).send("Not Found");
//   }
// };

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  putMovieById,
  deleteMovieById,
};
