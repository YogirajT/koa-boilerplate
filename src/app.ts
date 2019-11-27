import "reflect-metadata"; // this shim is required
import { createKoaServer, Action } from "routing-controllers";
import * as routingControllers from "routing-controllers";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware";
import { SuccessMiddlware } from "./middlewares/SuccessMiddleware";
import { createConnection, useContainer } from "typeorm";
import { Container } from "typedi";
import env from "./env/env";
import * as cors from "koa2-cors";
import User from "./models/User";
import * as JWT from "jsonwebtoken";
import { JWTUtils } from "./utils/Utils";
import { CryptoMiddleware } from "./middlewares/CryptoMiddleware";
const session = require('koa-session');

useContainer(Container);
routingControllers.useContainer(Container);
createConnection(Object.assign(env.db,{
  entities: [
    __dirname + "/models/*.ts"
  ],
})).then(connection => {
  // creates express app, registers all controller routes and returns you express app instance
  const app = createKoaServer({
    controllers: [__dirname + "/controllers/**/*"],
    middlewares: [SuccessMiddlware, CryptoMiddleware, ErrorMiddleware],
    classTransformer: true,
    authorizationChecker: async (action: Action, roles: string[]) => {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        // demo code:
        const token = action.request.headers["authorization"];
        const authDetails = JWTUtils.decodeJWT(token)
        if(authDetails){
            const user = await connection.getRepository(User).findOne({ 
                where: {
                    id: authDetails.userId,
                    authKey: authDetails.authKey
                }
            });
            if (user && !roles.length)
                return true;
        }
 
        return false;
    }
  });

  app.keys = [...env.sessionSecret];

  const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  };

  app.use(cors());
  app.use(session(CONFIG, app));

  app.listen(3000);
  console.log("Server Started")
});



// or if you prefer all default config, just use => app.use(session(app));

// run express application on port 3000