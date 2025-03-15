import { FastifyReply, FastifyRequest } from "fastify";
import { COLL_USERS } from "../../utils/constants";
import { CreateUser, Login, UpdateUser, UpdateUserRole } from "./user.schema";
import { UserSchema } from "../../models/user";
import bcrypt from "bcryptjs";

const DB = process.env.DB_NAME;

const GetAllUsershandler = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const collUser = req?.mongo.client.db(DB).collection(COLL_USERS);
    if (!collUser) {
      const msg = "failed to retrieve from database.";
      req.logToDb("GetAllUsershandler", msg);

      return {
        success: false,
        message: msg,
      };
    }
    const pipeline = [
      { $match: { isActive: true } },
      { $project: { password: 0 } },
    ];
    const result = await collUser.aggregate(pipeline).toArray();

    if (result) {
      req.logToDb(
        "GetAllUsershandler",
        result.length + " users fetched successfully"
      );
      return {
        success: true,
        users: result,
      };
    }
  } catch (err) {
    req.logToDb(
      "GetAllUsershandler",
      "unknown error occurred",
      JSON.stringify({ err })
    );
    return {
      success: false,
      message: "unknown error occured.",
    };
  }
};

type CrtUsrRqst = FastifyRequest<CreateUser>;

const CreateUserHandler = async (req: CrtUsrRqst, res: FastifyReply) => {
  try {
    const collUser = req?.mongo.client
      .db(process.env.DB_NAME)
      .collection(COLL_USERS);

    const {
      name,
      username,
      password,
      phone,
      isActive,
      role,
      socials,
      userPic,
    } = req.body;

    if (!req.user?.role) {
      return res
        .status(401)
        .send({
          success: false,
          message: "You are not authorised to create user.",
        });
    }

    const existingUser = await collUser.findOne({ username });
    if (existingUser) {
      req.logToDb(
        "CreateUserHandler",
        "existing user",
        { username, phone }.toString()
      );
      return res.status(409).send({
        success: false,
        message: "Username already taken.",
      });
    }

    //encrypt the password
    const encryptedPassword = req.encryptPassword(password);

    // Check if phone number already exists
    const existingPhone = await collUser.findOne({ phone });
    if (existingPhone) {
      req.logToDb(
        "CreateUserHandler",
        "existing user",
        JSON.stringify({ phone, username })
      );
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

    const timestamp = req.getCurrentTimestamp();
    const createdAt = timestamp;
    const updatedAt = timestamp;

    const userData: UserSchema = {
      name,
      username,
      password: encryptedPassword,
      phone,
      isActive,
      userPic: userPic,
      role,
      socials: sanitizedSocials,
      createdAt,
      updatedAt,
      createdBy: req.user.username,
      updatedBy: req.user.username,
    };

    // Insert new user
    const result = await collUser.insertOne(userData);

    if (!result.insertedId) {
      req.logToDb(
        "CreateUserHandler",
        "Unknown error occurred while creating the user.",
        { username, phone }.toString()
      );
      return res.status(500).send({
        success: false,
        message: "Unknown error occurred while creating the user.",
      });
    }

    req.logToDb(
      "CreateUserHandler",
      "user created successfully.",
      { username, result }.toString()
    );
    return res.status(200).send({
      success: true,
      message: "User created successfully.",
      userId: result.insertedId.toString(),
    });
  } catch (err: any) {
    req.logToDb("CreateUserHandler", "Unknown error occurred", err.toString);
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Unknown error occurred.",
    });
  }
};

type UpdtUsrRqst = FastifyRequest<UpdateUser>;

const UpdateUserHandler = async (req: UpdtUsrRqst, res: FastifyReply) => {
  try {
    const collUser = req?.mongo.client
      .db(process.env.DB_NAME)
      .collection(COLL_USERS);

    const { name, userPic, socials, updatedAt, updatedBy, username } = req.body;

    const user = await collUser.findOne({ username });
    if (!user) {
      const msg = "User doesn't exist.";

      req.logToDb("UpdateUserHandler", msg, JSON.stringify({ username }));

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
    const userData: Partial<UserSchema> = {
      name,
      userPic,
      socials: sanitizedSocials,
      updatedAt,
      updatedBy: req.user.username,
    };

    const result = await collUser.updateOne({ username }, { $set: userData });

    if (result.modifiedCount === 0) {
      const msg = "User update failed. No changes were made.";

      req.logToDb("UpdateUserHandler", msg, JSON.stringify({ userData }));

      return res.status(400).send({
        success: false,
        message: msg,
      });
    }
    const msg = "User updated successfully.";
    req.logToDb("UpdateUserHandler", msg, JSON.stringify({ userData }));

    return res.status(200).send({
      success: true,
      message: msg,
    });
  } catch (err: any) {
    const msg = "Unknown error occurred.";
    req.logToDb("UpdateUserHandler", msg, JSON.stringify({ err }));
    return res.status(500).send({
      success: false,
      message: msg,
    });
  }
};

type UpdtUsrRoleReq = FastifyRequest<UpdateUserRole>;

export const UpdateUserRoleHandler = async (
  request: UpdtUsrRoleReq,
  reply: FastifyReply
) => {
  try {
    if (!request.user?.role) {
      return reply
        .status(401)
        .send({ success: false, message: "You are not authorised to update." });
    }

    // Extract role from request body
    const { role, username } = request.body;

    // Access MongoDB Collection
    const collUser = request.mongo.client
      .db(process.env.DB_NAME)
      .collection(COLL_USERS);

    if (!collUser) {
      return reply
        .status(500)
        .send({ success: false, message: "Database connection failed" });
    }

    const user = await collUser.findOne({ username });

    if (user?.role !== "admin") {
      return reply
        .status(401)
        .send({ success: false, message: "User not authorised to update." });
    }
    // Update user role
    const updateResult = await collUser.updateOne(
      { username },
      { $set: { role } }
    );

    if (updateResult.modifiedCount === 0) {
      return reply
        .status(404)
        .send({ success: false, message: "User not found or role unchanged" });
    }

    return reply.send({
      success: true,
      message: "User role updated successfully",
    });
  } catch (err: any) {
    request.logToDb(
      "UpdateUserRoleHandler",
      "unknown error",
      JSON.stringify({ err })
    );
    return reply
      .status(500)
      .send({ success: false, message: "Unknown error occurred" });
  }
};

type LoginReq = FastifyRequest<Login>;

const LoginHandler = async (req: LoginReq, res: FastifyReply) => {
  try {
    const collUser = req?.mongo.client
      .db(process.env.DB_NAME)
      .collection(COLL_USERS);

    const { username, password } = req.body;

    // Find user by username
    const user = await collUser.findOne({ username });

    if (!user) {
      req.logToDb(
        "LoginHandler",
        "Invalid username",
        JSON.stringify({ username })
      );
      return res.status(401).send({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.logToDb(
        "LoginHandler",
        "Invalid password",
        JSON.stringify({ username })
      );
      return res.status(401).send({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = req.generateToken(username, user.role);
    const refreshToken = req.generateRefreshToken(username);
    req.logToDb(
      "LoginHandler",
      "User logged in successfully",
      JSON.stringify({ username })
    );

    return res.status(200).send({
      success: true,
      message: "Login successful.",
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    req.logToDb(
      "LoginHandler",
      "Unknown error occurred",
      JSON.stringify({ err })
    );
    return res.status(500).send({
      success: false,
      message: "Unknown error occurred.",
    });
  }
};
export {
  GetAllUsershandler,
  CreateUserHandler,
  UpdateUserHandler,
  LoginHandler,
};
