import {promises as fs} from 'fs';
import path from 'path';
import imgProcessor from './ImageProcessor';

const EXT: string = 'JPG'

async function getPathOrCreateThumb(params: ImgParam): Promise<(string | null)[]> {
    if (!params.name || !params.width || !params.height) {
        return [null, "Params are not valid on this request!"];
    }

    if (await isThumbInFolder(params)) {
        const path: null | string = await getImgPath(params);
        console.log(`Thumb already exist at ${path}`);
        //return the path and null as error
        return [path, null];
    }
    //Thumb don't exist I will create it!
    await accessOrCreateFolder()

    const fullPath = buildFullPath(params.name);
    const thumbPath = buildThumbPath(params);

    console.log(`Creating thumb for ${fullPath} at ${thumbPath}`);

    try {
        await imgProcessor({
            fullPath: fullPath,
            thumbPath: thumbPath,
            width: parseInt(params.width),
            height: parseInt(params.height)
        });
        const path: null | string = await getImgPath(params);
        return [path, null];
    } catch (ex) {
        return [null, ex as string];
    }
}

async function accessOrCreateFolder() {
    try {
        await fs.access(imgThumbFolder());
    } catch {
        await fs.mkdir(imgThumbFolder());
    }
}

async function getImgList(): Promise<string[]> {
    try {
        return (await fs.readdir(imgOriginFolder()))
            .map((name: string): string => name.split('.')[0]);
    } catch {
        return [];
    }
}

async function isImgInList(filename: string = ''): Promise<boolean> {
    return (await getImgList()).includes(filename);
}

async function getImgPath(params: ImgParam): Promise<null | string> {
    if (!params.name) {
        return null;
    }

    const filePath = params.width && params.height ?
        path.resolve(imgThumbFolder(), `${params.name}-${params.width}-${params.height}.${EXT}`)
        : path.resolve(imgOriginFolder(), `${params.name}.${EXT}`);

    try {
        // to check if file exist
        await fs.access(filePath);
        return filePath;
    } catch {
        return null;
    }
}

async function isThumbInFolder(params: ImgParam): Promise<boolean> {
    if (!params.name || !params.width || !params.height) {
        return false;
    }
    const filePath: string = path.resolve(imgThumbFolder(), `${params.name}-${params.width}-${params.height}.${EXT}`);
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function buildFullPath(name: string): string {
    return path.resolve(imgOriginFolder(), `${name}.${EXT}`);
}

function buildThumbPath(params: ImgParam): string {
    return path.resolve(
        imgThumbFolder(),
        `${params.name}-${params.width}-${params.height}.${EXT}`);
}

function imgOriginFolder(): string {
    return path.resolve(__dirname, '../images/origin');
}

function imgThumbFolder(): string {
    return path.resolve(__dirname, '../images/thumb');
}

export default {getPathOrCreateThumb, getImgList, isImgInList};