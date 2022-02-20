import { readFileSync } from 'fs';
import { xliff12ToJs } from 'xliff';

    
export type XliffTranslationString = string;


export interface XliffTranslationObject {
    readonly 'Standalone': {
        readonly 'id': string;
        readonly 'equiv-text': string;
    }
};


export type XliffTranslationArray = ReadonlyArray<XliffTranslationString | XliffTranslationObject>;


export interface XliffFile {
    readonly sourceLanguage: string;
    readonly targetLanguage: string;
    readonly resources: {
        readonly 'ng2.template': {
            readonly [translationId: string]: {
                readonly source: XliffTranslationString | XliffTranslationObject | XliffTranslationArray;
                readonly target: XliffTranslationString | XliffTranslationObject | XliffTranslationArray;
            };
        };
    };
}


export async function loadXliff(src: string): Promise<XliffFile> {
    const xliff = readFileSync(src);
    return xliff12ToJs(xliff.toString());
}
