//on récupere notre database qui est notre lien avec notre base de donnée MySQL
const database = require("./database");

// //--------------------------------------------
// //getUsers sans condition since
// //----------------------------------------------
// const getUsers = (req,res) => {
//     database
//     .query("SELECT * from users")
//     .then(([users]) =>{
//       res.json(users)
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error retrieving data from database");
//     });
//   };
// //--------------------------------------------------

const getUsers = (req, res) => {
    const initialSql = "select * from users";
    const where = [];
  
    if (req.query.language != null) {
      where.push({
        column: "language",
        value: req.query.language,
        operator: "=",
      });
    }
    if (req.query.city != null) {
      where.push({
        column: "city",
        value: req.query.city,
        operator: "=",
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
      .then(([users]) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };
  

  const getUserById = (req,res) => {
    const id = parseInt(req.params.id);
  
    database
    .query("SELECT * from users WHERE id = ?", [id] )
    .then(([users]) => { //le select renvoie le tableu users mais celui ci contient un seul élément : users[0]
      if(users[0] != null){
        res.status(200).json(users[0])
      } else {
        res.status(404).send("Aucun utilisateur avec cet id")
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    })
  }


  const postUser = (req,res) => {
    const { firstname, lastname, email, city, language} = req.body;
  
    database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?,?,?,?,?)", 
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
    
  }

  
  const putUserById = (req, res) => {
    const id = req.params.id;
    const { firstname, lastname, email, city, language} = req.body;
    
  
    database
    .query(
      `UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?`,
      [firstname, lastname, email, city, language, id]
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
  

  const deleteUserById = (req,res) => {
    const id = req.params.id;
  
    database
    .query(
      "DELETE FROM users WHERE id = ?", 
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


  module.exports = {
    getUsers,
    getUserById,
    postUser,
    putUserById,
    deleteUserById,
  };
