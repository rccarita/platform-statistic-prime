export interface CollectionResponseType<T> {
    [key: string]: {
        data: T[];
    };
}