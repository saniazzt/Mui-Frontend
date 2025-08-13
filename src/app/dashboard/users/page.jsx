import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';
import { UserListView } from 'src/sections/user/view';
// ----------------------------------------------------------------------

export const metadata = { title: `Page four | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserListView />;
}