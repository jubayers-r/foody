import { prisma } from "@/lib/prisma";

const getAllUser = async () => await prisma.user.findMany();

const updateUserStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User does not exist");
  }

  const newStatus = user.status === "ACTIVE" ? "SUSPEND" : "ACTIVE";

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: newStatus,
    },
  });

  if (!updateUser) {
    throw new Error("User update unsuccessful");
  }
  return updateUser;
};

export const adminServices = {
  getAllUser,
  updateUserStatus,
};
