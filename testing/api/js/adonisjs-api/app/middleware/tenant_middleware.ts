// app/middleware/tenant_middleware.ts
import { HttpContext } from '@adonisjs/core/http';
import Tenant from '#models/tenant'; // Adjust the import based on your project structure

export default class TenantMiddleware {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const host = request.hostname(); // Get the hostname from the request
    const domain = host.split('.')[0]; // Extract the tenant identifier from the domain
    
    try {
      // Query the database for the tenant based on the domain
      const tenant = await Tenant.query().where('domain', host).first();

      if (!tenant) {
        return response.status(404).json({ message: 'Tenant not found' });
      }

      // Attach the tenant to the request context
      request.tenant = { id: tenant.id } // You can access this in your controllers as request.tenant

      await next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error fetching tenant:', error);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
}