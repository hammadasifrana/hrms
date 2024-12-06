import {Context} from "moleculer";
import {Meta} from "../interfaces/meta.interface";
import ApiGateway, {IncomingRequest, Route} from "moleculer-web";
import {verifyToken} from "./jwt.util";
import {decode} from "jsonwebtoken";
import {AppDataSource} from "../database/data-source";
import {Permission} from "../database/entities/permission.entity";

interface DecodedTokenPayload {
	sub: string;
	email: string;
	roles: string[];
	tenantId: string;
	permissions: string[];
}

interface PermissionEntry {
	resource: string;
	roles: string;
	permissions: string;
}


export const authenticate = (
	ctx: Context<unknown, Meta>,
	route: Route,
	req: IncomingRequest
): Record<string, unknown> | null => {
	// Read the token from header
	const authHeader = req.headers.authorization;

	// Validate authorization header
	if (!authHeader) {
		throw new ApiGateway.Errors.UnAuthorizedError(
			ApiGateway.Errors.ERR_NO_TOKEN,
			null
		);
	}

	// Validate Bearer token format
	if (!authHeader.startsWith("Bearer")) {
		throw new ApiGateway.Errors.UnAuthorizedError(
			ApiGateway.Errors.ERR_NO_TOKEN,
			null
		);
	}

	// Extract token
	const token = authHeader.split(" ")[1];

	// Validate token
	if (!token || token === "null" || token === "") {
		throw new Error("No token provided");
	}

	// Verify token
	if (verifyToken(token)) {
		try {
			// Decode token
			const decodedToken = extractUserFromToken(token);

			// Validate decoded token
			if (!decodedToken) {
				throw new ApiGateway.Errors.UnAuthorizedError(
					ApiGateway.Errors.ERR_INVALID_TOKEN,
					'Unable to decode token'
				);
			}

			console.log('decodedTokenJson', decodedToken);

			// Return user information
			return {
				id: decodedToken.sub,
				email: decodedToken.email,
				roles: decodedToken.roles,
				tenantId: decodedToken.tenantId,
				permissions: decodedToken.permissions,
			};
		} catch (error) {
			// Handle any unexpected errors during token processing
			throw new ApiGateway.Errors.UnAuthorizedError(
				ApiGateway.Errors.ERR_INVALID_TOKEN,
				error.message
			);
		}
	}

	// Invalid token
	throw new ApiGateway.Errors.UnAuthorizedError(
		ApiGateway.Errors.ERR_INVALID_TOKEN,
		null
	);
};

// Additional utility functions can be added here
export const extractUserFromToken = (token: string): DecodedTokenPayload | null => {
	try {
		const decodedToken = decode(token) as DecodedTokenPayload;
		return decodedToken;
	} catch (error) {
		console.error('Failed to extract user from token:', error);
		return null;
	}
};


export class AuthorizationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthorizationError';
	}
}


export const authorize = async (
	ctx: Context<unknown, Meta>,
	route: Route,
	req: IncomingRequest,
	requiredPermission: string
): Promise<boolean> => {
	// Get user from context
	const user = ctx.meta.user;

	if (!user) {
		throw new AuthorizationError('No user found in context');
	}

	// Construct the requested resource with the full path
	const requestedResource = `${req.method} ${req.originalUrl || req.url}`;

	const permissionRepository = AppDataSource.getRepository(Permission);

	const permissionEntry = await permissionRepository.findOne({
		where: {
			resource: requestedResource
		}
	});

	// Check if any permission entries were found
	if (!permissionEntry) {
		throw new AuthorizationError('Resource not found');
	}

	// Get required permission from permission entry
	 const permissionForResource = permissionEntry.name;

	// Ensure user is defined and handle permissions safely
	const userPermissions = user.permissions || [];

	// Check if the user has the required permission
	const hasPermissions = userPermissions.includes(permissionForResource);

	if (!hasPermissions) {
		throw new AuthorizationError('User does not have the required permissions');
	}

	// Return true if the user has the required permission
	return true;

};
