import { FastifyPluginAsync } from "fastify";
import { GetContentReqOpts, CreateContentReqOpts, UpdateContentReqOpts, ContentBody } from "./content.schema";
import { GetContentHandler, CreateContentHandler, UpdateContentHandler, UpdateContentBody } from "./content.handler";

const contentRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/get", GetContentReqOpts, GetContentHandler);
  fastify.post<{Body: ContentBody}>("/create", CreateContentReqOpts, CreateContentHandler);
  fastify.post<{Body: UpdateContentBody}>("/update", UpdateContentReqOpts, UpdateContentHandler);
};

export default contentRoute;
