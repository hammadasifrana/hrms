import {User} from "./user.interface";

export interface Meta {
	domainName?: string | null | undefined;
	userAgent?: string | null | undefined;
	user?: User | null | undefined;
	tenantId?: string | null | undefined;
	tenant?: object | null | undefined;
}
