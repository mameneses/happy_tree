var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var request = require('request');

var config = require('./config');
 
mongoose.connect(config.db);

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var User = require('./models/user')
var Student = require('./models/student')

var router = express.Router();

// middleware to use for all requests
function isAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(400).send({ message: 'You did not provide a JSON Web Token in the Authorization header.' });
  }
 
  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, config.tokenSecret);
  var now = moment().unix();
 
  if (payload.exp <= now) {
    return res.status(401).send({ message: 'Token has expired.' });
  }
 
  User.findById(payload.sub, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User no longer exists.' });
    }
 
    req.user = user;
    next();
  })
}

function createToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };
  return jwt.encode(payload, config.tokenSecret);
}

app.use('/api', router)

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/users')
  .get(isAuthenticated, function(req, res) { 

  User.find({}, function(err, users) {
      var users = users

      res.json(users)
    })
  });

router.route('/users/:user_id')
  .get(isAuthenticated, function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
          if (err)
              res.send(err);
          res.json(user);
      });
  });

//////////////////// SAVE STUDENT /////////////////

router.route('/students')
  .post(isAuthenticated, function(req,res) {

    var student = new Student ({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      currentGrade: req.body.currentGrade,
      currentTeacherID: req.body.currentTeacherID
    })

    student.save(function(){
    
      Student.find({currentTeacherID: req.body.currentTeacherID}, function(err, students) {
        if (err)
          res.send(err);
        res.json(students)
      })
    })
  })

//////////////////// Get STUDENTs /////////////////
router.route('/students')
  .get(isAuthenticated, function(req,res) {
    Student.find({currentTeacherID: req.query.currentTeacherID}, function(err, students) {
      if (err)
        res.send(err);
      res.json(students)
    })
  });

  //////////////////// update STUDENTs /////////////////

  router.route('/students')
  .put(isAuthenticated, function(req,res) {

    Student.findOne({_id: req.body._id}, function(err, student) {

      student.firstName = req.body.firstName
      student.lastName = req.body.lastName
      student.currentGrade = req.body.currentGrade
      student.currentTeacherID = req.body.currentTeacherID
      student.letterAssesmentScores = req.body.letterAssesmentScores

      student.save( function(){
        Student.find({currentTeacherID: req.body.currentTeacherID}, function(err, students) {
          if (err)
            res.send(err);
          res.json(students)
        })
      })

    })
  });





// ############# LOGIN ROUTE #############

app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: { email: 'Incorrect email' } });
    }
 
    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: { password: 'Incorrect password' } });
      }
 
      user = user.toObject();
      delete user.password;
 
      var token = createToken(user);
      res.send({ token: token, user: user });
    });
  });
});

// // ############# SIGNUP ROUTE #############

app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' });
    }
 
    var user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      school: req.body.school,
      email: req.body.email,
      password: req.body.password
    });
 
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
 
        user.save(function() {
          var token = createToken(user);
          res.send({ token: token, user: user });
        });
      });
    });
  });
});
 
 
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


