
const Joi = require("joi");

const movieSchema = Joi.object({
    title: Joi.string().max(255).required(),
    director: Joi.string().max(255).required(),
    year: Joi.number().integer().min(1900).max(2100).required(),
    color: Joi.string().max(255).required(),
    duration: Joi.number().integer().required()
})

const userSchema = Joi.object({
    email: Joi.string().email().max(255).required(),
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    city: Joi.string().max(255),
    language: Joi.string().max(255)
  });

  const validateMovie = (req, res, next) => {
    const {title,director,year, color, duration} = req.body;

    const {error} = movieSchema.validate(
        {title,director,year, color, duration},
        {abortEarly : false}
    )

    if (error) {
        res.status(422).json({ validationErrors: error.details });
      } else {
        next();
      }
  }

  const validateUser = (req, res, next) => {
    const {firstname, lastname, email, city, language} = req.body;

    const {error} = movieSchema.validate(
        {firstname, lastname, email, city, language},
        {abortEarly : false}
    )

    if (error) {
        res.status(422).json({ validationErrors: error.details });
      } else {
        next();
      }
  }

// const validateMovie = (req, res, next) => {
//     const {title,director,year, color, duration} = req.body;
    
//     const errors = [];

//   if (title == null) {
//     errors.push({ field: "title", message: "This field is required" });
//   }
//   if (director == null) {
//     errors.push({ field: "director", message: "This field is required" });
//   }
//   if (year == null) {
//     errors.push({ field: "year", message: "This field is required" });
//   }
//   if (color == null) {
//     errors.push({ field: "color", message: "This field is required" });
//   }
//   if (duration == null) {
//     errors.push({ field: "duration", message: "This field is required" });
//   }
//   if (title.length >=255) {
//     errors.push({ field: "title", message: "This field is too long (255 chararcters max)" });
//   }
 
//   if (errors.length) {
//     res.status(422).json({ validationErrors: errors });
//   } else {
//     next();
//   }
// }


// const validateUser = (req, res, next) => {
//     const { email } = req.body;
//     const errors = [];
  
//     // ...
  
//     const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;
  
//     if (!emailRegex.test(email)) {
//       errors.push({ field: 'email', message: 'Invalid email' });
//     }
  
//     // ...
  
//     if (errors.length) {
//       res.status(422).json({ validationErrors: errors });
//     } else {
//       next();
//     }
//   };

module.exports = {
    validateMovie,
    validateUser
}