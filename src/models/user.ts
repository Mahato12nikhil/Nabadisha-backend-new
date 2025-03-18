
export interface UserSchema{
    name: string,
    username:string,
    password:string,
    phone: string,
    isActive:boolean,
    userPic:string,
    roles: string[], 
    socials: {
        facebook: string,
        instagram: string,
        linkedin: string,
    },
    createdAt: number, 
    updatedAt: number,
    createdBy:string,
    updatedBy:string
}