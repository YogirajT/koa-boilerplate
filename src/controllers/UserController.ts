import {
    Param,
    Body,
    Get,
    Post,
    Put,
    Delete,
    Ctx,
    JsonController,
    BadRequestError,
    Authorized,
    NotFoundError,
    BodyParam,
    Session,
    QueryParam
} from "routing-controllers";
import * as JWT from "jsonwebtoken"
import { UserService } from "../services/UserService";
import User from "../models/User";
import env from "../env/env";
import NodeRSA = require("node-rsa");

@JsonController()
export class UserController {
    constructor(private userService: UserService){
    
    }

    @Get("/users")
    async getAll(
        @Ctx() ctx,
    ): Promise<[User[], number]> {
        return this.userService.findAll();
    }

    @Get("/handshake")
    async exchangeKeys(
        @Session() session,
        @QueryParam('clientPub') clientPub
    ): Promise<any> {
        const key = new NodeRSA({b: 512});
        // const encrypted = key.encrypt(JSON.stringify(ctx.body), 'base64');
        session.serverPriv = session.serverPriv ? session.serverPriv : key.exportKey('pkcs1-private-pem');
        session.serverPub = session.serverPub ? session.serverPub : key.exportKey('pkcs1-public-pem');
        return { pub : "deployed" };
    }

    @Get("/users/:id")
    @Authorized()
    async getOne(@Param("id") id: number): Promise<User> {
        if(!User.validId(id)){
            throw new BadRequestError(
                "Invalid Parameters"
            )
        }
        return this.userService.findOne(id);
    }

    @Post("/users/token")
    async getAuthToken(
        @BodyParam('username',{required : true}) 
        username: string, 
        @BodyParam('password',{required : true}) 
        password: string
    ): Promise<any> {
        if(username && password){
            const user = await this.userService.findOneWithOptions({
                where: {
                    username: username,
                    password: password //this.userService.hashPassword(password),
                }
            });
            if(user){
                return {token: JWT.sign({ userId : user.id, authKey: user.authKey }, env.jwtSecret)}
            }else{
                throw new NotFoundError(
                    "User not found"
                )
            }
        }
        throw new BadRequestError(
            "Invalid Request Params"
        )
    }

    @Post("/users")
    async post(@Body() user: User) {
        return this.userService.save(user);
    }

    @Put("/users/:id")
    put(@Param("id") id: number, @Body() user: User) {
        return this.userService.update(user);
    }

    @Delete("/users/:id")
    remove(@Param("id") id: number) {
        return this.userService.delete(id);
    }

}