import { PrismaClient, User } from "@prisma/client";
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

export const updateUsers = async (ids: string[], data: Partial<User>) => {
  return prisma.user.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: data,
  });
};

export const updateUser = async (
  id: string,
  data: Record<string, any>
): Promise<any> => {
  return await prisma.user.update({
    where: {
      ["id"]: id,
    },
    data,
  });
};

export const findManyUsers = async (data: object) => {
  return prisma.user.findMany(data);
};

export const createSkullMessage = async (amount: number): Promise<any> => {
  return await prisma.skullMessage.create({
    data: {
      ["amount"]: amount,
    },
  });
};

export const getSkullMessages = async (ltDate: Date) => {
  return prisma.skullMessage.findMany({
    where: {
      created: {
        lt: ltDate,
      },
    },
  });
};

export const getAocChallenges = async () => {
  return prisma.aocChallenge.findMany();
};
