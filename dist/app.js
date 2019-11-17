"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // this shim is required
const routing_controllers_1 = require("routing-controllers");
const UserController_1 = require("./controllers/UserController");
// creates express app, registers all controller routes and returns you express app instance
const app = routing_controllers_1.createExpressServer({
    controllers: [UserController_1.UserController] // we specify controllers we want to use
});
// run express application on port 3000
app.listen(3000);
