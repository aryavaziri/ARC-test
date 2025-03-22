"use server";
import { auth, signOut } from "@/auth";
import { handleWithTryCatch } from "@/lib/helpers";
import sequelize from "@/lib/Sequelize";
import { User } from "@/models/UserData/User";
import { UserRole } from "@/models/UserData/UserRole";
import { passwordSetSchema, signInSchema, TPassInput, TUser, userSchema } from "@/types/user";
let i = 0;


export async function signInAction(formData: FormData) {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    const { email, password } = signInSchema.parse(Object.fromEntries(formData.entries()));
    const user = await User.findOne({
      where: { email }, attributes: ["id", "email", "hpassword", "firstName", "lastName", 'roleId']
    });
    if (!user) {
      throw new Error("No user found with provided email!");
    }

    const res = await user.comparePassword(password);
    if (!res) {
      throw new Error("Credentials are not valid!");
    }

    // if (!user.isVerified) {
    //   throw new Error("Access denied!");
    // }

    // const roleId: number = user.isAdmin
    //   ? " Administrator"
    //   : user.isVerified
    //     ? "Verified"
    //     : "NotVerified";
    console.log(user.role)
    return {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      isAdmin: user.roleId < 3,
      name: `${user.firstName} ${user.lastName}`,
    };

  })
}

export async function signOutAction() {
  return handleWithTryCatch(async () => {
    const res = await signOut({ redirectTo: undefined, redirect: false });
    console.log("signOutAction");
    // console.log(res);
    return { redirectTo: res.redirect };
  });
}
export async function getUserAction(userId: string) {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    const session = await auth();
    if (session?.user.isAdmin || session?.user.id === userId) {
      const user = await User.findByPk(userId, {
        attributes: ["id", "email", "firstName", "lastName", "profileImg", "roleId"],
      });
      if (user) {
        console.log(i++);
        return user.toJSON() as TUser;
      } else {
        throw new Error(`User not found!`);
      }
    }
    throw new Error(`User fetch failed!`);
  });
}

export async function setUserAction(user: Partial<TUser> & { id: string }) {
  return handleWithTryCatch(async () => {
    const validatedUser = userSchema.parse(user);
    await sequelize.authenticate();
    const session = await auth();
    if (session?.user.isAdmin || session?.user.id === validatedUser.id) {
      const user = await User.findByPk(validatedUser.id);
      if (user) {
        await user.update(validatedUser);
        const newUser = await User.findByPk(user.id, {
          // include: [{ model: Company, as: "company", attributes: ["name", "id"] }],
          attributes: ["id", "email", "firstName", "lastName", "companyId", "profileImg", "isAdmin"],
        });
        return newUser?.toJSON() as TUser;
      } else {
        throw new Error(`User not found!`);
      }
    }
    throw new Error(`User modification failed!`);
  });
}

export async function setPassword(payload: TPassInput) {
  return handleWithTryCatch(async () => {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const input = passwordSetSchema.parse(payload);

    const user = await User.findOne({ where: { email: payload.email }, attributes: ["id", "firstName", "lastName", "email", "profileImg"] });
    if (!user) {
      throw new Error("Invalid Token");
    }
    await user.update({
      // hpassword: input.password,
    });
    const data = user.get({ plain: true });
    delete data.createdAt;
    delete data.updatedAt;
    return data;
  });
}