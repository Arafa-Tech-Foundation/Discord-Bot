import { PrismaClient, Prisma, User } from "@prisma/client";
const prisma = new PrismaClient();

// do db stuff
export const createUser = async (id: string): Promise<User> => {
  return await prisma.user.create({
    data: {
      id,
    },
  });
};

export const getUsers = async (): Promise<User[]> => {
  return await await prisma.user.findMany();
};
