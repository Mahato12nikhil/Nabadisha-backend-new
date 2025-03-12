import Fastify from 'fastify'
import {app} from './app.js'
import { loadEnv } from './utils/loadEnv.js';

loadEnv();
// start the server
const server = Fastify({logger: true});
server.register(app,{
    isAwesomeApp:true
 });
server.listen({port: Number(process.env.PORT) || 5000}).then(() => {
  server.log.info('Server has started successfully...');
});

// import Fastify from "fastify";
// import multipart from "@fastify/multipart";
// import swagger from "@fastify/swagger";
// import swaggerUI from "@fastify/swagger-ui";
// import fs from "fs";
// import path from "path";
// import { ObjectId } from "mongodb";

// const fastify = Fastify({ logger: true });

// // Register multipart for file uploads
// fastify.register(multipart);

// // Register Swagger for OpenAPI 3.0 documentation
// fastify.register(swagger, {
//   openapi: {
//     openapi: "3.0.0",
//     info: {
//       title: "User API",
//       description: "API to create users with file upload",
//       version: "1.0.0",
//     },
//   },
// });

// fastify.register(swaggerUI, {
//   routePrefix: "/docs",
// });

// // Define schema for request
// const userSchema = {
//   summary: "Create a new user",
//   description: "Creates a new user with a profile picture upload",
//   tags: ["Users"],
//   consumes: ["multipart/form-data"],
//   requestBody: {
//     required: true,
//     content: {
//       "multipart/form-data": {
//         schema: {
//           type: "object",
//           properties: {
//             name: { type: "string" },
//             username: { type: "string" },
//             phone: { type: "string" },
//             isActive: { type: "boolean" },
//             userPic: { type: "string", format: "binary" },
//             role: { type: "string" },
//             socials: {
//               type: "object",
//               properties: {
//                 facebook: { type: "string" },
//                 instagram: { type: "string" },
//                 linkedin: { type: "string" },
//               },
//             },
//             createdAt: { type: "number" },
//             updatedAt: { type: "number" },
//             updatedBy: { type: "string", description: "MongoDB ObjectId" },
//           },
//           required: ["name", "username", "phone", "isActive", "role", "createdAt", "updatedAt", "updatedBy"],
//         },
//       },
//     },
//   },
//   responses: {
//     200: {
//       description: "User created successfully",
//       content: {
//         "application/json": {
//           schema: {
//             type: "object",
//             properties: {
//               message: { type: "string" },
//               userId: { type: "string" },
//               filename: { type: "string" },
//             },
//           },
//         },
//       },
//     },
//   },
// };

// // User creation route
// fastify.post("/users", { schema: userSchema }, async (request, reply) => {
//   const parts = request.parts();
//   let user: any = {};
//   let fileBuffer: Buffer | null = null;
//   let fileName = "";

//   for await (const part of parts) {
//     if (part.type === "file") {
//       fileBuffer = await part.toBuffer();
//       fileName = `${Date.now()}-${part.filename}`;
//     } else {
//       if (part.fieldname.startsWith("socials.")) {
//         const key = part.fieldname.split(".")[1];
//         user.socials = user.socials || {};
//         user.socials[key] = part.value;
//       } else {
//         user[part.fieldname] = part.value;
//       }
//     }
//   }

//   if (!fileBuffer) {
//     return reply.status(400).send({ error: "No profile picture uploaded" });
//   }

//   // Save file locally (Replace with Cloudflare R2 storage)
//   const uploadPath = path.join(__dirname, "uploads", fileName);
//   await fs.promises.writeFile(uploadPath, fileBuffer);

//   // Convert required fields
//   user.isActive = user.isActive === "true";
//   user.createdAt = Number(user.createdAt);
//   user.updatedAt = Number(user.updatedAt);
//   user.updatedBy = new ObjectId(user.updatedBy); // Convert to MongoDB ObjectId

//   return reply.send({
//     message: "User created successfully",
//     userId: new ObjectId().toString(),
//     filename: fileName,
//   });
// });

// // Start server
// const start = async () => {
//   try {
//     await fastify.listen({ port: 3000 });
//     console.log("Server running at http://localhost:3000/docs");
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };

// start();
