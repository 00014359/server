import { UserModel } from "./user.model.js";

class UserService {
  #_userModel;
  constructor() {
    this.#_userModel = new UserModel();
  }

  async signIn(payload) {
    return await this.#_userModel.signIn(payload);
  }

  async register(payload) {
    return await this.#_userModel.register(payload);
  }

  async getUserProfile(userId) {
    return await this.#_userModel.getUserById(userId);
  }
}

export default new UserService();
