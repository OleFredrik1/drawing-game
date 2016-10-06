/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Game from "../api/game/game.model";

Game.find({}).remove()
  .then(() =>{
  Game.create({
    name: "mygame",
    drawer: "me",
    language: "english"
  },{
    name: "mygame2",
    drawer: "me2",
    language: "norwegian",
    password: "pass"
  })
});

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
