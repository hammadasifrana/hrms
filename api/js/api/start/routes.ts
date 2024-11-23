/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import {middleware} from "#start/kernel";
const UsersController = () => import('#controllers/users_controller');
const AuthController = () => import('#controllers/auth_controller')

router.group(() => {
  router.post('login', [AuthController, 'login'])
  router.post('logout', [AuthController, 'logout']).use(middleware.auth())
}).prefix('auth')

router.group(() => {
  router.post('register', [UsersController, 'register'])
  router.get('list', [UsersController, 'list']).use([ middleware.auth(), middleware.role(['Admin']) ])
  router.get('me', [AuthController, 'me']).use(middleware.auth())
}).prefix('users')


router.get('myself', async ({ auth, response }) => {
  try {
    const user = auth.getUserOrFail()
    return response.ok(user)
  } catch (error) {
    return response.unauthorized({ error: 'User not found' })
  }
}).use(middleware.auth())
