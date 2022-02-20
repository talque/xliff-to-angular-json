
import { writeFileSync } from 'fs';


export interface JsonFile {
    readonly [translationId: string]: string;
}


export function saveJson(json: JsonFile, dst: string): void {
    const content = JSON.stringify(json, Object.keys(json).sort(), 4);
    writeFileSync(dst, content);
}

