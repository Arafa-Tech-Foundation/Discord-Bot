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

export const updateUsers = async (ids: string[], data: Record<string, any>): Promise<any> => {
  return await prisma.user.updateMany({
    where: {
      id: {
        in: ids
      }
    },
    data: data
  });
};

export const updateUser = async (id: string, data: Record<string, any>): Promise<any> => {
  return await prisma.user.update({
    where: {
      ['id']: id
    },
    data: data
  });
};