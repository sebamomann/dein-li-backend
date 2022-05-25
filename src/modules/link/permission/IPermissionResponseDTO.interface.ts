export interface IPermissionResponseDTO {
	id: string,
	token: string,
	expiration: Date,
	comment: string,
	iat: Date,
	link: {
		short: string
	},
}
