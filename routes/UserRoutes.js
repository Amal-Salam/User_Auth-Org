const express = require("express");
const auth = require('../middlewares/AuthMiddleware');
const UserController = require("../controllers/UserController");

const Router = express.Router();

Router.post("/register", UserController.registerUserController);
Router.post("/login", UserController.loginUserController);
Router.get('/:id', auth, UserController.checkUser);

module.exports = Router;