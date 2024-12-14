import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('#controllers/users.controller');
const AuthController = () => import('#controllers/auth.controller')

router.group(() => {
  router.post('login', [AuthController, 'login'])
  router.post('/forgot-password', [AuthController, 'forgotPassword'])
  router.post('/reset-password', [AuthController, 'resetPassword'])
}).use(middleware.tenant()).prefix('auth')

router.group(() => {
  router.post('register', [UsersController, 'register'])
  router.get('list', [UsersController, 'list']).use([middleware.auth(), middleware.permission([])])
  router.get('me', [UsersController, 'me']).use([middleware.auth(), middleware.permission([])])
}).use(middleware.tenant()).prefix('users')

router.get('myself', async ({auth, response}) => {
  try {
    const user = auth.getUserOrFail()
    return response.ok(user)
  } catch (error) {
    return response.unauthorized({error: 'User not found'})
  }
}).use(middleware.auth())
