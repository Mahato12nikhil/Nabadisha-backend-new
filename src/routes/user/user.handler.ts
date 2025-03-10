import { FastifyReply, FastifyRequest } from "fastify"
import { COLL_USERS } from "../../utils/constants"
import {  ObjectId } from "@fastify/mongodb";
import { CreateUser } from "./user.schema";
import { UserSchema } from "../../models/user";

const DB=process.env.DB_NAME;

const GetAllUsershandler=async(req : FastifyRequest,res : FastifyReply)=>{
    try{
        const collUser=req?.mongo.client.db(DB).collection(COLL_USERS);
        if(!collUser){
            return {
                success:false,
                message:'failed to retrieve from database.'
            }
        }
        const pipeline=[
            {$match: {isActive: true}},
            {$project:{password:0}}
        ]
        const result=await collUser.aggregate(pipeline).toArray();

        if(result){
            return {
                success:true,
                users:result
            }
        }
    }
    catch(err){
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

        const { name, username, phone, isActive, userPic, role, socials, createdAt, updatedAt, updatedBy } = req.body;

        const existingUser = await collUser.findOne({ username });
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: "Username already taken.",
            });
        }

        // Check if phone number already exists
        const existingPhone = await collUser.findOne({ phone });
        if (existingPhone) {
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
        const userData : UserSchema= {
            name,
            username,
            phone,
            isActive,
            userPic,
            role, 
            socials:sanitizedSocials,
            createdAt,
            updatedAt,
            updatedBy: new ObjectId(updatedBy),
        };

        // Insert new user
        const result = await collUser.insertOne(userData);

        if (!result.insertedId) {
            return res.status(500).send({
                success: false,
                message: "Unknown error occurred while creating the user.",
            });
        }

        return res.status(200).send({
            success: true,
            message: "User created successfully.",
            userId: result.insertedId.toString(),
        });

    } catch (err) {
        console.error("Error in CreateUserHandler:", err);
        return res.status(500).send({
            success: false,
            message: "Unknown error occurred.",
        });
    }
};
export {GetAllUsershandler, CreateUserHandler}