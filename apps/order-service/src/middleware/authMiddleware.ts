import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify"{
    interface FastifyRequest{
        userId?:string
    }
}
export const shouldBeUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId } = getAuth(request);
    if (!userId) {
        reply.status(401).send({ message: "You are not logged in" });
        return;
    }
    request.userId = userId;
};