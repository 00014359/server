import { UserModel } from "./user.model.js";

class UserService {
  #_userModel;

  constructor() {
    this.#_userModel = new UserModel();
  }

  async signIn(payload) {
    return await this.#_userModel.signIn(payload);
  }
}

export default new UserService();
