import { CONFIG } from 'src/global-config';

import { UserListView } from 'src/sections/admins/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page seven | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserListView />;
}
