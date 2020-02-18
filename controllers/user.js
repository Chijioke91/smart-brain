const bcrypt = require('bcryptjs');
const Clarifai = require('clarifai');
const db = require('../utils/knex');
const app = require('../utils/clarifai');

// Get all users;
exports.getAllUsers = async (req, res, next) => {
  const users = await db.select('*').from('users');

  return res.status(200).json(users);
};

// welcome
exports.welcome = (req, res) => {
  res.send('Welcome');
};

// register a new user
exports.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json('incorrect form credentials');
    }

    password = await bcrypt.hash(password, 10);

    const trx = await db.transaction();

    trx
      .insert({
        hash: password,
        email
      })
      .into('login')
      .returning('email')
      .then(nEmail => {
        return trx('users')
          .returning('*')
          .insert({
            name,
            email: nEmail[0],
            joined: new Date()
          })
          .then(newUser => {
            res.status(200).json(newUser[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  } catch (e) {
    res.status(400).json({ error: 'Unable to register' });
  }
};

// sign in to account
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json('incorrect form credentials');
    }

    const data = await db
      .select('email', 'hash')
      .from('login')
      .where('email', '=', email);

    const passwordMatch = await bcrypt.compare(password, data[0].hash);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Unable to login' });
    }

    const user = await db
      .select('*')
      .from('users')
      .where('email', '=', email);

    return res.status(200).json({ userData: user[0] });
  } catch (e) {
    res.status(400).json({ error: 'Unable to fetch user' });
  }
};

// Get a single user profile by ID
exports.getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db
      .select('*')
      .from('users')
      .where({ id });

    if (user.length) {
      res.status(200).json({ user: user[0] });
    } else {
      throw new Error('Not Found');
    }
  } catch (e) {
    res.status(400).json({ error: 'Unable to fetch user' });
  }
};

// update user entries
exports.updateUserRank = async (req, res, next) => {
  try {
    const { id } = req.body;

    const newEntry = await db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries');

    return res.status(200).json({ data: newEntry[0] });
  } catch (e) {
    res.status(400).json({ error: 'Unable to get entries' });
  }
};

// make image api call
exports.imageApiCall = async (req, res, next) => {
  try {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => res.status(200).json(data));
  } catch (e) {
    res.status(400).json({ error: 'Api error' });
  }
};
