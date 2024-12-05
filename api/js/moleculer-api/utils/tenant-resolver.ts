import {Context} from "moleculer";
import {Meta} from "../interfaces/meta.interface";
import {AppDataSource} from "../database/data-source";
import {Tenant} from "../database/entities/tenant.entity";
import type {GatewayResponse, IncomingRequest, Route} from "moleculer-web";

export const tenantResolver = async (
	ctx: Context<unknown, Meta>,
	route: Route,
	req: IncomingRequest,
	res: GatewayResponse
): Promise<Context<unknown, Meta>> => {
	try {
		// Domain extraction logic
		const domain = req.headers['host']
			|| 'localhost:3000';

		//const cleanDomain = domain.replace(/^https?:\/\//, '').split(':')[0];
		const cleanDomain = domain;

		// Tenant lookup
		const tenantRepository = AppDataSource.getRepository(Tenant);
		const tenant = await tenantRepository.findOne({
			where: {
				domain: cleanDomain,
				isActive: true
			}
		});

		if (!tenant) {
			throw new Error(`No active tenant found for domain: ${cleanDomain}`);
		}

		// Extend context meta
		ctx.meta.tenantId = tenant.id;
		ctx.meta.tenant = tenant;

		// Proceed with original handler
		return ctx;
	} catch (error) {
		console.error('Tenant Resolution Error:', error);
		throw error;
	}
};
