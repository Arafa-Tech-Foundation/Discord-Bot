import { PrismaClient, Prisma, User } from "@prisma/client";
const prisma = new PrismaClient();

// do db stuff
export const createUser = async (id: string) => {
  return prisma.user.create({
    data: {
      id,
    },
  });
};

export const getUsers = async () => {
  return prisma.user.findMany();
};

export const updateUsers = async (ids: string[], data: Record<string, any>) => {
  return prisma.user.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: data,
  });
};

export const updateUser = async (id: string, data: Record<string, any>) => {
  return prisma.user.update({
    where: {
      ["id"]: id,
    },
    data: data,
  });
};
