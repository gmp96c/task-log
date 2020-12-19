import React from 'react';
import { useUser } from '../hooks/User';

export const UserInfo = () => {
  const info = useUser();
  if (info.loading) {
    return <h3> </h3>;
  }
  console.log(info);
  return (
    <div>
      <h2>ME</h2>
    </div>
  );
};
