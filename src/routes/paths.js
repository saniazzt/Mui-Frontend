
import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];
const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      five: `${ROOTS.DASHBOARD}/users/five`,
      six: `${ROOTS.DASHBOARD}/users/six`,
    },
    preferences: {
      root: `${ROOTS.DASHBOARD}/preferences`,
      new: `${ROOTS.DASHBOARD}/preferences/new`,
      cards: `${ROOTS.DASHBOARD}/preferences/cards`,
      profile: `${ROOTS.DASHBOARD}/preferences/profile`,
      account: `${ROOTS.DASHBOARD}/preferences/account`,
    },
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      list: `${ROOTS.DASHBOARD}/users/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/users/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/users/${MOCK_ID}/edit` },
    },
    admins: {
      root: `${ROOTS.DASHBOARD}/admins`,
      list: `${ROOTS.DASHBOARD}/admins/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/admins/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/admins/${MOCK_ID}/edit` },
      new: `${ROOTS.DASHBOARD}/admins/new`,
    },
  },
};
