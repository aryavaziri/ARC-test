"use server";
import sequelize from "@/lib/Sequelize";
import { User } from "@/models/UserData/User";
import { handleWithTryCatch } from "@/lib/helpers";
import { TPreRegister, TUser } from "@/types/user";
import { auth } from "@/auth";
// import { resetPasswordEmail, sendVerification } from "./email/email";
// import { newUserRegiser } from "./email/emailService";
// import { getAccessibilities } from "./accessibilities";
import { Op } from "sequelize";




export async function fetchAllUsers() {
  return handleWithTryCatch(async () => {
    const session = await auth();
    if (!session?.user.isAdmin || !session?.user?.id) {
      console.log(`ONLY ADMIN`);
      return;
    }
    await sequelize.authenticate();
    const users = await User.findAll();
    return users.map(user => user.get({ plain: true }));
  });
}

// export async function setAdminAction(userId: string) {
//   return handleWithTryCatch(async () => {
//     await sequelize.authenticate();
//     const user = await User.findByPk(userId);
//     if (!user) throw new Error(`User with ID ${userId} not found.`);
//     await user.update({ isAdmin: true });
//     const updatedUser = await User.findByPk(userId, { attributes: { exclude: [`hpassword`, `createdAt`, `updatedAt`] } });
//     const data = updatedUser?.get({ plain: true });
//     console.log(data);
//     return data;
//   });
// }


export async function editUserAction(userId: string, userData: Partial<TUser>) {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.update(userData);
    const newUser = await User.findByPk(user.id, {
      attributes: ["id", "firstName", "lastName", "email", "profileImg", "isVerified" ],
    });
    if (!newUser) {
      throw new Error("User not found");
    }
    return newUser.get({ plain: true });
  });
}
export async function preRegister(data: TPreRegister) {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    const user = await User.create({ ...data, roleId: 3, isVerified: false });
    // await newUserRegiser(user);
    return { userId: user.id, message: "User created and notification send to admin." };
  });
}
export async function resetPassword(email: string) {
  return handleWithTryCatch(async () => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error(`User with email ${email} not found.`);
    // await resetPasswordEmail(user.id);
    return { message: "Reset password link has been sent." };
  });
}
// export async function getToken() {
//   return handleWithTryCatch(async () => {
//     const websiteToken = jwt.sign({ websiteId: website.id }, process.env.NEXTAUTH_SECRET, { expiresIn: "1m" });

//     return { websiteToken };
//   });
// }
