import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

interface useSearchConfig<Type> {
    data: Type[];
    keys: string[];
    query: string;
    sorter: (el: Array<Type>) => Array<Type>;
}
export function useSearch<Type>({ data, keys, query, sorter }: useSearchConfig<Type>): Type[] {
    const [engine, setEngine] = useState<Fuse<Type> | undefined>();
    useEffect(() => {
        setEngine(
            new Fuse<Type>(data, { keys }),
        );
    }, [query]);
    if (query === '' || engine === undefined) {
        return sorter(data);
    }
    const res = engine.search(query);
    return res.map((el) => el.item);
}
