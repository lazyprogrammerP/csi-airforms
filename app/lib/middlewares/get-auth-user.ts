import { User } from ".prisma/client";
import Exception from "@/lib/common/exception";
import Prisma from "@/prisma";
import { auth } from "@clerk/nextjs";

const getAuthUser = async (): Promise<User> => {
  const { userId } = auth();
  if (!userId) {
    throw new Exception(`Unauthorized access.`, 401);
  }

  try {
    const user = await Prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      throw new Exception(`User account has not been synced with the database yet. Please try again later.`, 400);
    }

    return user;
  } catch (error) {
    throw new Exception(`An error occured when searching for user in the database. For details refer to:\n${error}`, 500);
  }
};

export default getAuthUser;
