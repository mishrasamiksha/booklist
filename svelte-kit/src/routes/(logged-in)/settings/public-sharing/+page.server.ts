import { createUser, getUser, updateUser } from "$data/user";
import { toJson } from "$lib/util/formDataHelpers";

export const load = async ({ locals, depends }: any) => {
  const session = await locals.getSession();
  const { userId } = session;

  depends("user:settings");

  if (!userId) {
    return {};
  }

  let user = await getUser(userId);

  if (!user) {
    await createUser(userId);
  }
  user = await getUser(userId, true);

  return {
    user
  };
};

type UserSettingsPacket = {
  isPublic: string;
  publicName: string;
  publicBooksHeader: string;
};

export const actions = {
  async updateSettings({ request, locals }: any) {
    const session = await locals.getSession();
    const { userId } = session;

    if (!userId) {
      return {};
    }

    const formData: FormData = await request.formData();

    const values = toJson(formData as any, {
      strings: ["isPublic", "publicName", "publicBooksHeader"]
    }) as UserSettingsPacket;

    const isPublic = !!values.isPublic;
    const publicName = !isPublic ? "" : values.publicName;
    const publicBooksHeader = !isPublic ? "" : values.publicBooksHeader;

    await updateUser(userId, isPublic, publicName, publicBooksHeader);
  }
};
