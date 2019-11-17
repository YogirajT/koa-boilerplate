import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import { UserRepository } from "../repositories/UserRepository";
import User from "../models/User";
import { HttpError, InternalServerError, BadRequestError } from "routing-controllers";
import { UpdateResult, FindConditions, FindOneOptions, FindManyOptions } from "typeorm";
import * as md5 from "md5"
import env from "../env/env";
@Service()
export class UserService {

    // using constructor injection
    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository,
    ) {}

    public async findOne(id: number): Promise<User> {
        try{
          return (await this.userRepository.findById(id)).sanitize();
        } catch (error) {
          if(error instanceof HttpError){
            throw new HttpError( 400,
              "Bad Request"
            )
          }
          throw new InternalServerError (
            "It Broke"
          )
        }
    }

    public async findOneWithOptions(options: FindOneOptions): Promise<User> {
      try{
        return (await this.userRepository.findOne(options)).sanitize();
      } catch (error) {
        if(error instanceof HttpError){
          throw new HttpError( 400,
            "Bad Request"
          )
        }
        throw new InternalServerError (
          "It Broke"+error
        )
      }
    }


    public async save(user: User): Promise<User> {
      try{

      if(user)
        return (await this.userRepository.save(user)).sanitize();
      } catch (error) {
        if(error instanceof HttpError){
          throw new HttpError( 400,
            "Bad Request"
          )
        }
        throw new InternalServerError (
          "It Broke"
        )
      }
    }

    public async update(user: User): Promise<UpdateResult> {
      try{
        
      if(user)
        return (await this.userRepository.update(user.id, user));
      } catch (error) {
        if(error instanceof HttpError){
          throw new HttpError( 400,
            "Bad Request"
          )
        }
        throw new InternalServerError (
          "It Broke"
        )
      }
    }


    public async delete(id: number): Promise<UpdateResult> {
      try{
        if(User.validId(id)){
          throw new BadRequestError(
            "Invalid Request Params"
          )
        }
        const user = new User();
        user.id = id;
        user.deletedAt = new Date().getTime();
        
        return (await this.userRepository.update(user.id, user));
      } catch (error) {
        if(error instanceof HttpError){
          throw new HttpError( 400,
            "Bad Request"
          )
        }
        throw new InternalServerError (
          "It Broke"
        )
      }
    }


    public async findAll(): Promise<[User[], number]> {
      try{

        const userList: [User[], number] = (await this.userRepository.findAndCount({
          where :{
            deletedAt: 0,
          }
        }));
        userList[0] = userList[0].map(user=> user.sanitize());
        return userList;
      } catch (error) {
        if(error instanceof HttpError){
          throw new HttpError( 400,
            "Bad Request"
          )
        }
        throw new InternalServerError (
          "It Broke"
        )
      }
    }

    public hashPassword(password: string){
        return password ? md5(`${password}${env.hashSalt}`) : '';
    }

}