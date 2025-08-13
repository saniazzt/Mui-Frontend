import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }) => {
  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const res = await axios.post(endpoints.auth.signIn, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { access_token,refresh_token, user } = res.data;
    console.log(res.data)
    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    await setSession(access_token);
    // if (user) {
    //   sessionStorage.setItem('user', JSON.stringify(user));
    // }

    // return user;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ username, email, password, confirmPassword }) => {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('username', username);
  params.append('user_type', 'normal');
  params.append('password1', password);
  params.append('password2', confirmPassword);


  try {
    const res = await axios.post(endpoints.auth.signUp, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, user } = res.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, access_token);
    // if (user) {
    //   sessionStorage.setItem('user', JSON.stringify(user));
    // }
    // return user;
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
