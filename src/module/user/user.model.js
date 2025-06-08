// module/user/user.model.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export class UserModel {
  #_prisma;
  constructor() {
    this.#_prisma = new PrismaClient();
  }

  async signIn(payload) {
    const { name, password } = payload;
    const user = await this.#_prisma.user.findUnique({
      where: { name },
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async register(payload) {
    const { name, email, password, role } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.#_prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });
    return newUser;
  }

  async getUserById(id) {
    return await this.#_prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
