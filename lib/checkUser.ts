import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // 1. Check if the user exists by Clerk ID
    const loggedInUser = await db?.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const email = user.emailAddresses[0].emailAddress;
    const name = `${user.firstName} ${user.lastName}`;

    // 2. Check if a user with this email already exists in the database
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      // 3. If they exist, sync their outdated Clerk ID with the new one
      const updatedUser = await db.user.update({
        where: { email },
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
        },
      });
      return updatedUser;
    }

    // 4. Otherwise, create a brand new user safely
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    // Depending on your setup, you might want to throw the error here
    // so it doesn't fail silently and break downstream layouts
    throw error; 
  }
};
