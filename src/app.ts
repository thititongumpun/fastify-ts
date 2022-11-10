import {
  fastify,
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import fastifyJwt from "@fastify/jwt";
import cors from '@fastify/cors';
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

const PORT = 8000 || process.env.PORT;
declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

export const server: FastifyInstance = fastify({
  logger: true,
});

server.register(cors, { 
  allowedHeaders: "*",
  origin: true,
  exposedHeaders: "*",
  credentials: true
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

server.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});