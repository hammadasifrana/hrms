export interface User {
	id: string;
	email: string;
	roles: string[];
	tenantId: string;
	permissions: string[];
}
