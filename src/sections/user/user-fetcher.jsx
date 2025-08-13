'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from 'src/lib/axios';
import { JWT_STORAGE_KEY } from 'src/auth/context/jwt/constant';
import { UserEditView } from 'src/sections/user/view';

export function UserFetcher({ id }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem(JWT_STORAGE_KEY);
        const response = await axios.get(endpoints.users.details(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched user:', response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [id]);

  return <UserEditView user={currentUser} />;
}
