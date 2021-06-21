import {LinkPermission} from './link-permission.entity';
import {IPermissionCreationResponseDTO} from './IPermissionCreationResponseDTO.interface';
import {IPermissionResponseDTO} from './IPermissionResponseDTO.interface';

export class PermissionMapper {
	constructor() {
	}

	/**
	 * Create a object only containing the important creation values of the passed {@link LinkPermission}.<br/>
	 * Those values are {@link LinkPermission.id} and {@link LinkPermission.token}.
	 *
	 * @param permission       {@link LinkPermission} to minify
	 *
	 * @return {@link IPermissionCreationResponseDTO} Minified object
	 */
	public create({id, token}: LinkPermission): IPermissionCreationResponseDTO {
		const obj = {} as IPermissionCreationResponseDTO;

		obj.id = id;
		obj.token = token;

		return obj;
	}

	/**
	 * Process {@link LinkPermission} into a user friendly format. <br/>
	 * Unused values (null, undefined []) get removed. <br/>
	 *
	 * @param linkPermission           {@link LinkPermission} Object to process
	 *
	 * @return {@link IPermissionResponseDTO} Object containing processed user information
	 */
	public basic(linkPermission: LinkPermission): IPermissionResponseDTO {
		let permissionDTO = {} as IPermissionResponseDTO;

		permissionDTO.id = linkPermission.id;
		permissionDTO.token = linkPermission.token;
		permissionDTO.comment = linkPermission.comment;
		permissionDTO.expiration = linkPermission.expiration;
		permissionDTO.iat = linkPermission.iat;
		permissionDTO.link = {short: linkPermission.link.short};

		permissionDTO = this.stripEmptyFields(permissionDTO);

		return permissionDTO;
	}

	/**
	 * Remove all fields containing null, undefined or []. Boolean fields are an exception.
	 *
	 * @param permissionDTO        Finished {@link IPermissionResponseDTO} to strip.
	 */
	private stripEmptyFields(permissionDTO: IPermissionResponseDTO) {
		const keys = Object.keys(permissionDTO);

		keys.forEach(
			(key: string) => {
				if (typeof permissionDTO[key] !== 'boolean' && (!permissionDTO[key] || permissionDTO[key].length === 0)) {
					delete permissionDTO[key];
				}
			},
		);

		return permissionDTO;
	}

	public basicMultiple(permissions: LinkPermission[]) {
		const output = [];

		permissions.forEach(
			(fPermission) => {
				output.push(this.basic(fPermission));
			}
		)

		return output;
	}
}
