import User from '#models/user'

export default class UserService {
  public async listUsers() {
    // Fetch all users
    return await User.all();

  }
}
//export default new UserService()
