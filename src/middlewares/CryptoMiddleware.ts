import { Context } from "koa";
import { KoaMiddlewareInterface, Middleware, Ctx } from "routing-controllers";
import NodeRSA = require("node-rsa");

@Middleware({ type: 'before', priority: 50 })
export class CryptoMiddleware implements KoaMiddlewareInterface {

  public async use(@Ctx() ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    try {
      await next();
    } catch (error) {
      return ctx.throw(500, { error: 'Unknown error' }); 
    } 
  
  }

}