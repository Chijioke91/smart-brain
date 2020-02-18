const router = require('express').Router();

const {
  register,
  signin,
  getUserProfile,
  getAllUsers,
  updateUserRank,
  imageApiCall
} = require('../controllers/user');

// get all users route
router.get('/', getAllUsers);

// signin route
router.post('/signin', signin);

// register user route
router.post('/register', register);

// get a single user profile
router.get('/profile/:id', getUserProfile);

// update entries
router.patch('/image', updateUserRank);

// make call to image url
router.post('/imageurl', imageApiCall);

module.exports = router;
