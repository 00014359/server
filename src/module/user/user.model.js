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

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }
}
