import { FastifyReply, FastifyRequest } from "fastify";
import { COLL_ROLES, COLL_PERMISSIONS } from "../../utils/constants";
import { PostDashQuery } from "./dashboard.schema";

const DB = process.env.DB_NAME || "";

type GetMnuRq=FastifyRequest<PostDashQuery>
const PostDashMenuHandler = async (
  request: GetMnuRq, 
  reply: FastifyReply
) => {
  try{
    const {roles}=request.body;
    const collRoles=request.mongo.client.db(DB).collection(COLL_ROLES);

    if (!collRoles) {
      return reply.status(500).send({
        success: false,
        message: 'Database error.'
      });
    };

    const pipeline = [
      { $match: { name: { $in: roles } } },
      { $unwind: "$permissions" },
      {
        $lookup: {
          from: COLL_PERMISSIONS,
          localField: "permissions",
          foreignField: "_id",
          as: "permissionDetails"
        }
      },
    
      { $unwind: "$permissionDetails" },
    
      {
        $group: {
          _id: null,
          permissions: { $addToSet: "$permissionDetails.name" }
        }
      },
    
      {
        $project: {
          _id: 0,
          permissions: 1
        }
      }
    ];
    
    
    
    const result = await collRoles.aggregate(pipeline).toArray();

    return reply.send({
      success: true,
      data: { permissions: result.length ? result[0].permissions : [] }
    });

  }
  catch(err){
    return reply.status(500).send({
      success: false,
      message: 'Internal Server Error'
    });
  }
  
};

export { PostDashMenuHandler };
