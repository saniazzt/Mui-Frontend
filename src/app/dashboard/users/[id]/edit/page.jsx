import { CONFIG } from 'src/global-config';
import { _userList } from 'src/_mock/_user';
import { UserFetcher } from 'src/sections/user/user-fetcher';

// ----------------------------------------------------------------------

export const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { id } = await params;

  return <UserFetcher id={id} />;
}

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * 1. Set `isStaticExport = true` in `next.config.{mjs|ts}`.
 * 2. This allows `generateStaticParams()` to pre-render dynamic routes at build time.
 *
 * For more details, see:
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 *
 * NOTE: Remove all "generateStaticParams()" functions if not using static exports.
 */
// export async function generateStaticParams() {
//   const data = CONFIG.isStaticExport ? _userList : _userList.slice(0, 1);

//   return data.map((user) => ({
//     id: user.id,
//   }));
// }
