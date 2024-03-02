import { AdminsOnlyBuilder } from './admins-only.hook';

export async function GetHooks(input: HookBuilderInput) {
	return {
		adminsOnly: await AdminsOnlyBuilder(input),
	};
}
