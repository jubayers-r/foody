import { prisma } from "@/lib/prisma";

const getMe = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const userService = {
  getMe,
};
