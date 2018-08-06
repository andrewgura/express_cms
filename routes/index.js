var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const requestPromise = require('request-promise');
var Event = require('../models/Event');
var keystone = require('keystone');

//Setup connection information for the postgres database
const pg = new Client({
  user: 'me',
  password: 'password',
  database: 'mydb'
})


//connect to the database
pg.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected to: ' + pg.database)
  }
})

/*
Render results from one query and view/index

*/
router.get('/', async function(req, res) {
  const tic = await pg.query('SELECT * FROM tic');

  //Options to use with the get API call
  var options = {
    uri: 'https://api.github.com/users/andrewgura',
    headers: {'user-agent': 'node.js', 'Content-Type': 'application/json'}
  }

  //Make the API call
  const gitAPI = await requestPromise(options)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    })

    //Results are returned as JSON, need to convert to Javascript object to display
    var gitAPIResults = JSON.parse(gitAPI);

    res.render('index', {tic: tic.rows, gitAPIResults: gitAPIResults});
})


/*
Render results from multiple queries and view/other-page
async/await
*/
router.get("/other-page", async function(req, res) {
     const tic = await pg.query('SELECT * FROM tic');
     const tac = await pg.query('SELECT * FROM tac');
     res.render('other-page',{tic: tic.rows, tac: tac.rows});
});

router.get("/cms", function(req, res) {
    var view = new keystone.View(req, res);
    view.query('event', keystone.list('Event').model.find().sort('sortOrder'));
    view.render('cms');
});

module.exports = router;
