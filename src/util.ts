


export type Writeable<T extends { [x: string]: any }> = {
    [P in string]: T[P];
}
