import { Context } from "koa";
import { KoaMiddlewareInterface, Middleware, Ctx } from "routing-controllers";

@Middleware({ type: 'before', priority: 50 })
export class SuccessMiddlware implements KoaMiddlewareInterface {

  public async use(@Ctx() ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    try {
      await next();
      if(ctx.body){
        ctx.body = { data: ctx.body }
      }
    } catch (error) {
      return ctx.throw(500, { error: 'Unknown error' }); 
    } 
  
  }

}