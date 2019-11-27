import { Context } from "koa";
import { KoaMiddlewareInterface, Middleware, Ctx } from "routing-controllers";
import NodeRSA = require("node-rsa");
@Middleware({ type: 'before', priority: 50 })
export class SuccessMiddlware implements KoaMiddlewareInterface {

  public async use(@Ctx() ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    try {
      await next();
      if(ctx.body){
        const key = new NodeRSA();
        if(ctx.session.serverPub){
          key.importKey(ctx.session.serverPub,"pkcs1-public-pem")
          key.importKey(ctx.session.serverPriv,"pkcs1-private-pem")
          const encrypted = key.encrypt(JSON.stringify(ctx.body), 'base64');
          ctx.body = { data: JSON.parse(key.decrypt(encrypted,'utf8')), encrypted }
        }else{
          ctx.body = { data: ctx.body }
        }
      }
    } catch (error) {
      return ctx.throw(500, { error: 'Unknown error' }); 
    } 
  
  }

}