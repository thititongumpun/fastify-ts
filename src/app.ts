import {
  fastify,
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import fastifyJwt, { JWT } from "@fastify/jwt";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

const PORT = process.env.PORT || 8080;
declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare const process: {
  env: {
    PORT: number | undefined;
  };
};

export const server: FastifyInstance = fastify({
  logger: true,
});

server.register(cors, {
  allowedHeaders: "*",
  origin: true,
  exposedHeaders: "*",
  credentials: true,
});

server.register(fastifyJwt, {
  secret: "321dsadDASDSADASDadssadadasdasd",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

server.register(userRoutes, { prefix: "api/users" });

server.register(
  swagger,
  withRefResolver({
    routePrefix: "/swagger",
    swagger: {
      info: {
        title: "Fastify AP",
        description: "Fastify API",
        version: "0.1.0",
      },
      host: "localhost",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
    exposeRoute: true,
    staticCSP: true,
  })
);

for (const schema of userSchemas) {
  server.addSchema(schema);
}

server.get("/healthcheck", async () => {
  return { status: "OK" };
});

server.addHook("preHandler", (request, reply, next) => {
  request.jwt = server.jwt;
  return next();
});

server.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server listening at ${address}`);
});
