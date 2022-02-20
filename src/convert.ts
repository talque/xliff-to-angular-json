import { JsonFile, saveJson } from './json-file';
import { Writeable } from './util';
import {
    loadXliff,
    XliffFile,
    XliffTranslationArray,
    XliffTranslationObject,
    XliffTranslationString,
} from './xliff-file';


export async function convertXliff2Json(src: string, dst: string): Promise<void> {
    const xliff = await loadXliff(src);
    const json = xliff2Json(xliff);
    saveJson(json, dst);
}


export function xliff2Json(xliff: XliffFile): JsonFile {
    const json: Writeable<JsonFile> = {};
    const template = xliff.resources['ng2.template'];
    for (const key in template) {
        const target = template[key].target;
        json[key] = xliffTranslation2jsonString(target);
    }
    return json;
}


function xliffTranslation2jsonString(xliff: XliffTranslationArray | XliffTranslationObject | XliffTranslationString): string {
    if (typeof xliff === 'string') {
        // translation is plain string without interpolation
        // console.log('translation string', xliff);
        return xliff;
    }
    if (!(xliff instanceof Array)) {
        // translation just interpolation (makes no linguistical sense, but technically possible)
        // console.log('translation object', xliff);
        return makeParsedTranslation(['', ''], [xliff.Standalone.id]);
    }
    // makeParsedTranslation expects messagePart0, placeholderName0,
    // messagePart1, placeholderName1, ..., messagePartN. May have to
    // add empty messagePart at front or back.
    const messageParts: string[] = [];
    const placeholderNames: string[] = [];
    // console.log('translation array', xliff);
    for (const part of xliff) {
        // console.log('translation array part', part);
        if (typeof part === 'string') {
            messageParts.push(part);
        } else {
            // part is placeholder object
            if (messageParts.length === placeholderNames.length)
                messageParts.push('');
            placeholderNames.push(part.Standalone.id);
        }
    }
    if (messageParts.length === placeholderNames.length)
        messageParts.push('');
    return makeParsedTranslation(messageParts, placeholderNames);
}


/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * Adapted from the function in @angular/localize of the same name
 */
export function makeParsedTranslation(
    messageParts: readonly string[],
    placeholderNames: readonly string[],
): string {
    // console.log('makeParsedTranslation', messageParts, placeholderNames);
    if (messageParts.length !== placeholderNames.length + 1)
        throw new Error('translation part length mismatch')
    let messageString = messageParts[0];
    for (let i = 0; i < placeholderNames.length; i++) {
        messageString += `{$${placeholderNames[i]}}${messageParts[i + 1]}`;
    }
    return messageString;
}
