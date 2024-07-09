const User = require ("../models/user");
const jwt = require ("jsonwebtoken");
 

// Error handling
const handleErrors = (err) => {
  console.log (err.message, err.code);

  let errors = { email: '', password: ''};
  
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered"
  }
  
   if (err.message === "incorrect password") {
    errors.password = "Wrong password"
  }
  
  if (err.code === 11000) {
    errors.email = "Email address already in use";
    return errors;
  }
  
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach( ({properties}) => {
      
      errors [properties.path] = proprties.message;
    })
  }

  return errors;
}

// Tokens

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign ({ id }, process.env.SECRET, { expiresIn: maxAge })
}
module.exports.homePage_get = (req, res) => {
  res.render ('index');
}
module.exports.signup_get = (req, res) => {
  res.render ('sign_up');
}

module.exports.signup_post = async (req, res) => {
  console.log (req.body);
  const { email, username, password } = req.body;
  
  try {
    const user = await User.create({ email, username, password });
    const token = createToken(user._id);
    res.cookie ('jwt', token, {httpOnly: true, expiresIn: maxAge * 1000});
    res.status(201).json({user: user._id})
  }
  catch (err) {
    const errors = handleErrors (err);
    res.status(400).json(errors)
  }
  
}

module.exports.signin_get = (req, res) => {
  res.render ('sign_in');
}

module.exports.signin_post = async (req, res) => {
  console.log (req.body);
  
  const { email, password } = req.body;
  
  try{ 
    const user = await User.login (email, password);
    const token = createToken (user._id);
    res.cookie ('jwt', token, {httpOnly: true, expiresIn: maxAge * 1000});
    res.status(200).json ({user: user._id})
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json ({errors})
  }
}

module.exports.success_get = (req, res) => {
  res.render ('success');
}

module.exports.logout_get = (req, res) => {
  res.cookie ("jwt", '', {maxAge: 1});
  res.redirect ("/");
}
