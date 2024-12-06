export interface TokenPayload {
	id: string;
	email: string;
	tenantId: string;
	roles: string[];
	permissions: string[];
}
