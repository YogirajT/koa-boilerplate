import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { IsString, IsNotEmpty, IsInt, validate } from 'class-validator';


@Entity('user') 
export default class User {

  constructor(obj? : {
    username: string,
    password: string,
    authKey: string,
    createdAt: number,
    updatedAt: number,
    deletedAt: number,
  }){
    if(obj){
      if(obj.username) this.username = obj.username;
      if(obj.password) this.password = obj.password;
      if(obj.authKey) this.authKey = obj.authKey;
      if(obj.createdAt) this.createdAt = obj.createdAt;
      if(obj.updatedAt) this.updatedAt = obj.updatedAt;
      if(obj.deletedAt) this.deletedAt = obj.deletedAt;
    }
  }

  @PrimaryGeneratedColumn({name: 'id'})
  @IsInt()
  id: number;

  @Column({
    name: 'username',
    unique: true
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column({
    name: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;


  @Column({
    name: 'auth_key',
  })
  @IsString()
  @IsNotEmpty()
  authKey: string;


  @Column({
    name: 'created_at',
  })
  createdAt: number;

  @Column({
    name: 'updated_at',
  }) 
  updatedAt: number;

  @Column({
    name: 'deleted_at',
  }) 
  deletedAt: number;

  static validId(id: number){
    return id !== null && id !== undefined && parseInt(id +"", 10) === id;
  }

  insertSanitize(){
    delete this.id;
    delete this.authKey;
    return this
  }

  sanitize(){
    delete this.deletedAt;
    return this
  }

  updateSanitize(){
    delete this.id;
    delete this.authKey;
    delete this.createdAt;
    return this
  }

  async validate(){
    return await validate(this);
  }

  clean(){
    for(const key in this){
      if( !this.hasOwnProperty(key) ) delete this[key];
    }
    return this
  }

}