export interface IPermissionCreationDTO {
	expiration: Date,
	comment: string,
	link: {
		short: string,
	}
}
