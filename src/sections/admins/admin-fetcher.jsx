'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from 'src/lib/axios';
import { JWT_STORAGE_KEY } from 'src/auth/context/jwt/constant';
import { UserEditView } from 'src/sections/admins/view';

// ----------------------------------------------------------------------

export function AdminFetcher({ id }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = sessionStorage.getItem(JWT_STORAGE_KEY);
        const response = await axios.get(endpoints.users.details(id), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentAdmin(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchAdmin();
  }, [id]);

  return <UserEditView user={currentAdmin} />;
}
