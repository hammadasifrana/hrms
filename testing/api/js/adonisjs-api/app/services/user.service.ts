import User from '#models/user'
import Role from '#models/role'
import hash from '@adonisjs/core/services/hash'

class UserService {
  public async registerUser(payload: any) {
    // Hash the password
    payload.password = await hash.make(payload.password)

    // Create the user
    const user = await User.create(payload)

    // Get roles from the payload
    const roles = payload.roles

    if (roles && roles.length > 0) {
      try {
        // Assuming tenantId is available in the context
        const roleInstances = await Role.query()
          .whereIn('name', roles)
          .where('tenant_id', payload.tenant_id); // Ensure correct casing

        // Check if any roles were found
        if (roleInstances.length > 0) {
          await user.related('roles').attach(roleInstances.map((role) => role.id));
        }
      } catch (error) {
        console.error('Error attaching roles:', error);
        // Handle the error appropriately (e.g., throw, return a response, etc.)
      }
    }
    return user
  }

  public async listUsers() {
    // Fetch all users
    return await User.all()
  }

  public async getCurrentUser(userId: number) {
    // Fetch the current user by ID
    return await User.query().where('id', userId).firstOrFail()
  }
}

export default new UserService()
