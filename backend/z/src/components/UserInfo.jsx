import React from 'react';

export const UserInfo = ({ info }) => {
  console.log(info);
  if (!info.authenticatedUser) {
    return <h3> </h3>;
  }
  console.log(info);
  return (
    <div>
      <h2>ME</h2>
    </div>
  );
};
