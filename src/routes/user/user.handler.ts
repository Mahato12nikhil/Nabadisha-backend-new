import {  FastifyReply, FastifyRequest } from "fastify"
import { COLL_USERS } from "../../utils/constants"
import {  ObjectId } from "@fastify/mongodb";
import { CreateUser, UpdateUser, UpdateUserRole } from "./user.schema";
import { UserSchema } from "../../models/user";

const DB=process.env.DB_NAME;

const GetAllUsershandler=async(req : FastifyRequest,res : FastifyReply)=>{
    try{
        const collUser=req?.mongo.client.db(DB).collection(COLL_USERS);
        if(!collUser){

            const msg='failed to retrieve from database.'
            req.logToDb('GetAllUsershandler',msg);

            return {
                success:false,
                message: msg
            }
        }
        const pipeline=[
            {$match: {isActive: true}},
            {$project:{password:0}}
        ]
        const result=await collUser.aggregate(pipeline).toArray();

        if(result){
            req.logToDb('GetAllUsershandler',result.length +' users fetched successfully');
            return {
                success:true,
                users:result
            }
        }
    }
    catch(err){
        req.logToDb('GetAllUsershandler','unknown error occurred',{err});
        return {
            success:false,
            message: 'unknown error occured.'
        }
    }

}

type CrtUsrRqst= FastifyRequest<CreateUser>;

const CreateUserHandler = async (req: CrtUsrRqst, res: FastifyReply) => {
    try {
        const collUser = req?.mongo.client.db(process.env.DB_NAME).collection(COLL_USERS);

        const { name, username, phone, isActive, role, socials, userPic, createdAt, updatedAt, updatedBy } = req.body;       

        const existingUser = await collUser.findOne({ username });
        if (existingUser) {
            req.logToDb('CreateUserHandler','existing user',{username, phone});
            return res.status(409).send({
                success: false,
                message: "Username already taken.",
            });
        }

        // Check if phone number already exists
        const existingPhone = await collUser.findOne({ phone });
        if (existingPhone) {

            req.logToDb('CreateUserHandler','existing user',{phone, username});
            return res.status(409).send({
                success: false,
                message: "User with this phone number already exists.",
            });
        }

        const sanitizedSocials = {
            facebook: socials?.facebook || "",  
            instagram: socials?.instagram || "",
            linkedin: socials?.linkedin || "",
        };

        //userPicUrl=userPicUrl?userPicUrl:"";

        const userData : UserSchema= {
            name,
            username,
            phone,
            isActive,
            userPic:userPic,
            role, 
            socials:sanitizedSocials,
            createdAt,
            updatedAt,
            updatedBy: new ObjectId(updatedBy),
        };

        // Insert new user
        const result = await collUser.insertOne(userData);

        if (!result.insertedId) {
            req.logToDb('CreateUserHandler','Unknown error occurred while creating the user.',{username, phone});
            return res.status(500).send({
                success: false,
                message: "Unknown error occurred while creating the user.",
            });
        }

        req.logToDb('CreateUserHandler','user created successfully.',{username, result});
        return res.status(200).send({
            success: true,
            message: "User created successfully.",
            userId: result.insertedId.toString(),
        });

    } catch (err) {
        req.logToDb('CreateUserHandler','Unknown error occurred',{err});
        return res.status(500).send({
            success: false,
            message: "Unknown error occurred.",
        });
    }
};

type UpdtUsrRqst= FastifyRequest<UpdateUser>;

const UpdateUserHandler = async (req: UpdtUsrRqst, res: FastifyReply) => {
    try {
        const collUser = req?.mongo.client.db(process.env.DB_NAME).collection(COLL_USERS);

        const { name, userPic, socials, updatedAt, updatedBy, username } = req.body;

        const user = await collUser.findOne({ username });
        if (!user) {
            const msg="User doesn't exist."

            req.logToDb('UpdateUserHandler',msg,{username});

            return res.status(404).send({
                success: false,
                message: msg,
            });
        }

        const sanitizedSocials = {
            facebook: socials?.facebook || "",  
            instagram: socials?.instagram || "",
            linkedin: socials?.linkedin || "",
        };
        const userData : Partial<UserSchema>= {
            name,
            userPic,
            socials:sanitizedSocials,
            updatedAt,
            updatedBy: new ObjectId(updatedBy),
        };

        const result = await collUser.updateOne({ username }, { $set: userData });

        if (result.modifiedCount === 0) {
            const msg="User update failed. No changes were made."

            req.logToDb('UpdateUserHandler',msg,{userData});

            return res.status(400).send({
                success: false,
                message: msg,
            });
        }
        const msg="User updated successfully.";
        req.logToDb('UpdateUserHandler',msg,{userData});

        return res.status(200).send({
            success: true,
            message: msg,
        });
    } catch (err) {
        const msg="Unknown error occurred.";
        req.logToDb('UpdateUserHandler',msg,{err});
        return res.status(500).send({
            success: false,
            message: msg,
        });
    }

};

type UpdtUsrRoleReq = FastifyRequest<UpdateUserRole>;

export const UpdateUserRoleHandler = async (request: UpdtUsrRoleReq, reply: FastifyReply) => {
  try {
    // Extract Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ success: false, message: "Authorization header missing" });
    }

    // Extract token from Bearer format
    const token = authHeader.split(" ")[1];

    if (!token) {
      return reply.status(401).send({ success: false, message: "Invalid Authorization header format" });
    }

    // Extract username from token
    const username = request.getUserNameFromToken(token);

    if (!username) {
      return reply.status(401).send({ success: false, message: "Invalid token" });
    }

    // Extract role from request body
    const { role } = request.body;

    // Access MongoDB Collection
    const collUser = request.mongo.client.db(process.env.DB_NAME).collection(COLL_USERS);

    if (!collUser) {
      return reply.status(500).send({ success: false, message: "Database connection failed" });
    }

    // Update user role
    const updateResult = await collUser.updateOne({ username }, { $set: { role } });

    if (updateResult.modifiedCount === 0) {
      return reply.status(404).send({ success: false, message: "User not found or role unchanged" });
    }

    return reply.send({ success: true, message: "User role updated successfully" });
  } catch (err) {
    request.logToDb("UpdateUserRoleHandler", "unknown error", { err });
    return reply.status(500).send({ success: false, message: "Unknown error occurred" });
  }
};


export {GetAllUsershandler, CreateUserHandler, UpdateUserHandler}

