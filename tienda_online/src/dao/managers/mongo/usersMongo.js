import { usersModel } from "../../models/users.model.js";

export class UsersMongo{
    constructor(){
        this.model = usersModel;
    };

    async getAll() {
        try {
          const allUsers = await this.model.find({}, 'first_name email role').lean();
          return allUsers;
        } catch (error) {
          throw error;
        }
      }

    async save(user){
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }
    };

    async getById(userId){
        try {
            const user = await this.model.findById(userId);
            if(user){
                return user;
            } else{
                throw new Error("El usuario no existe");
            }
        } catch (error) {
            throw error;
        }
    };

    async getByEmail(userEmail){
        try {
            const user = await this.model.findOne({email:userEmail});
            if(user){
                return user;
            } else{
                return null;
            }
        } catch (error) {
            throw error;
        }


    };
    
    async update(userId,newUserInfo){
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId,newUserInfo,{new:true})
            return userUpdated;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };
    async getInactiveUsers(inactiveDate) {
        try {
          const inactiveUsers = await this.model
            .find({ last_connection: { $lt: inactiveDate } }, 'first_name email')
            .lean();
          return inactiveUsers;
        } catch (error) {
          throw error;
        }
      }

}