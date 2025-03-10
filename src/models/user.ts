import { ObjectId } from "@fastify/mongodb";

export interface UserSchema{
    name: string,
    username:string,
    phone: string,
    isActive:boolean,
    userPic:string,
    role: string, 
    socials: {
        facebook: string,
        instagram: string,
        linkedin: string,
    },
    createdAt: number, 
    updatedAt: number,
    updatedBy:ObjectId
}