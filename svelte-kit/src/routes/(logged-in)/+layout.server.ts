import { redirect } from "@sveltejs/kit";

import type { DynamoUser } from "$data/types";
import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";
import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { getUser } from "$data/user";

export async function load({ cookies, locals, depends, isDataRequest, url, request }: any) {
  const initialRequest = !isDataRequest;

  // do NOT use the url arg that comes with the loader, since we don't want this to re-run whenever the url changes
  const requestUrl = new URL(request.url);

  const publicUserId = requestUrl.searchParams.get("user");
  let isPublic = false;
  let publicUser: DynamoUser | null = null;
  let publicName: string | null = null;
  let publicBooksHeader: string | null = null;

  const session = await locals.getSession();

  if (!session?.user && !publicUserId) {
    throw redirect(302, "/");
  }

  let activeUserId = session?.userId;
  if (publicUserId) {
    publicUser = await getUser(publicUserId);

    if (!publicUser || !publicUser.isPublic) {
      activeUserId = "";
    } else {
      isPublic = true;
      activeUserId = publicUserId;
      publicName = publicUser.publicName;
      publicBooksHeader = publicUser.publicBooksHeader;
    }
  }

  const booksCache = initialRequest ? +new Date() : cookies.get(BOOKS_CACHE);

  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE, booksCache);
  }

  depends("reload-root-data");

  const tags = allTags(activeUserId);
  const subjects = allSubjects(activeUserId);

  return {
    isPublic,
    publicName,
    publicBooksHeader,
    booksCache,
    ...(await subjects),
    ...(await tags)
  };
}
