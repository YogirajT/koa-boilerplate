import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import User from "../models/User";

// create custom Repository class
@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    public findById(id: number) {
        return this.findOne({ id, deletedAt: 0 });
    }
    
}