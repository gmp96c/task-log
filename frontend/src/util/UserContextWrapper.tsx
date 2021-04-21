import React from 'react';
import { UserConfig } from '../Types';

export const UserContext = React.createContext<undefined | UserConfig>(undefined);

export const UserContextWrapper: React.FC<{ value: UserConfig | undefined; children: JSX.Element[] }> = ({
    children,
    value,
}) => {
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
