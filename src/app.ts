import {
  fastify,
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import fastifyJwt, { JWT } from "@fastify/jwt";
import cors from "@fastify/cors";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

const PORT = process.env.PORT || 8080;
declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
    brypt: any;
  }
}

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

server.listen(PORT, "0.0.0.0", (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
