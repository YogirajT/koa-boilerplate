import { Context } from "koa";
import { KoaMiddlewareInterface, Middleware, Ctx } from "routing-controllers";

@Middleware({ type: 'before', priority: 50 })
export class ErrorMiddleware implements KoaMiddlewareInterface {

  public async use(@Ctx() ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    try {
      await next();
      if(ctx.body && ctx.body.name && ctx.body.name.endsWith("Error")){

        if(ctx.body.name === "AuthorizationRequiredError"){
          ctx.status = 401;
          ctx.body = 'Protected resource, use Authorization header to get access\n';
        }else{
          ctx.body = { error: ctx.body.name, message: ctx.body.message };
        }
      }
    } catch (error) {
      return ctx.throw(500, { error: 'Unknown error' }); 
    } 
  
  }

}