require("dotenv").config();
const mysql = require("mysql2/promise");


//on utilise mysql.createPool pour préparer un pool de connexion à l'aide des variables d'environnement DB... créées dans .env :
const database = mysql.createPool({
    host: process.env.DB_HOST, // address of the server
    port: process.env.DB_PORT, // port of the DB server (mysql), not to be confused with the APP_PORT !
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

//on essaye d'obtenir une premiere connexion depuis le pool pour vérifier si le pool fonctionne
// il faut lancer la commande "npx nodemon database.js" depuis le terminal pour vérifier si ca fonctionne
  database
  .getConnection()
  .then(() => {
    console.log("Can reach database");
  })
  .catch((err) => {
    console.error(err);
  });


  //ECRIRE UNE REQUETE
  //En utilisant notre objet database, nous pouvons envoyer des requêtes à notre serveur MySQL en utilisant la méthode query().
//La méthode a besoin d'une chaîne de caractères comme premier paramètre : le code SQL de notre requête.
//Puisque nous utilisons la version avec des promesses, nous devrons chaîner l'appel à query() avec un .then() (et un .catch() pour intercepter les erreurs).
database
  .query("select * from movies")
  .then((result) => {
    const movies = result[0];
    console.log(movies);
  })
  .catch((err) => {
    console.error(err);
  });


  //on exporte database pour l'utiliser ainsi que ses fonctionnalités dans d'autres fichiers
  module.exports = database; 

