import * as JWT from 'jsonwebtoken';
import env from '../env/env';

export class JWTUtils{
  static decodeJWT(token):{userId:number, authKey: string, iat: number} | false
  {
    const authDetails = JWT.decode(token, env.jwtSecret);
    if( authDetails && 
      authDetails['userId'] && 
      authDetails['authKey'] &&  
      authDetails['iat'])
    {
      return {userId: authDetails['userId'] , authKey: authDetails['authKey'], iat: authDetails['iat'] }
    }else{
      return false;
    }
  }
}
