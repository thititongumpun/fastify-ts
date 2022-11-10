import { CreateUserInput, LoginInput } from "./user.schema";
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { verifyPassword } from "../../utils/hash";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.code(200).send(user);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await findUserByEmail(body.email);

    if (!user) {
      return reply.code(401).send({
        message: "invalid email or password",
      });
    }

    const correctPassword = verifyPassword({
      password: body.password,
      salt: user.salt,
      hash: user.password,
    });

    if (correctPassword) {
      const { password, salt, ...rest } = user;

      return { accessToken: request.jwt.sign(rest) };
    }

    return reply.code(401).send({
      message: "invalid email or password",
    });
  } catch (err) {
    console.error(err);
    return reply.code(500).send(err);
  }
}

export async function getUsersHandler() {
  const users = await findUsers();

  return users;
}
