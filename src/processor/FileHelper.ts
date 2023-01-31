import {promises as fs} from 'fs';
import path from 'path';
import imgProcessor from './ImageProcessor';

const EXT: string = 'JPG'
const imgOriginFolder = path.resolve(__dirname, '../images/origin');
const imgThumbFolder = path.resolve(__dirname, '../images/thumb');

class ImgParam {
    name?: string;
    width?: string;
    height?: string;
}

class FileHelper {
    static async getOrCreateThumb(params: ImgParam): Promise<(string | null)[]> {
        if (!params.name || !params.width || !params.height) {
            return [null, "Params are not valid on this request!"];
        }

        if (await FileHelper.isThumbInFolder(params)) {
            const path: null | string = await FileHelper.getImgPath(params);
            console.log(`Thumb already exist at ${path}`);
            //return the path and null as error
            return [path, null];
        }
        //Thumb don't exist I will create it!
        try {
            await fs.access(imgThumbFolder);
        } catch {
            await fs.mkdir(imgThumbFolder);
        }

        const fullPath = FileHelper.buildFullPath(params.name);
        const thumbPath = FileHelper.buildThumbPath(params);

        console.log(`Creating thumb for ${fullPath} at ${thumbPath}`);

        try {
            await imgProcessor({
                fullPath: fullPath,
                thumbPath: thumbPath,
                width: parseInt(params.width),
                height: parseInt(params.height)
            });
            const path: null | string = await FileHelper.getImgPath(params);
            return [path, null];
        } catch (ex) {
            return [null, ex as string];
        }
    }

    static async getImgList(): Promise<string[]> {
        try {
            return (await fs.readdir(imgOriginFolder))
                .map((name: string): string => name.split('.')[0]);
        } catch {
            return [];
        }
    }

    static async isImgInList(filename: string = ''): Promise<boolean> {
        return (await FileHelper.getImgList()).includes(filename);
    }

    private static async getImgPath(params: ImgParam): Promise<null | string> {
        if (!params.name) {
            return null;
        }

        const filePath = params.width && params.height ?
            path.resolve(imgThumbFolder, `${params.name}-${params.width}-${params.height}.${EXT}`)
            : path.resolve(imgOriginFolder, `${params.name}.${EXT}`);

        try {
            // to check if file exist
            await fs.access(filePath);
            return filePath;
        } catch {
            return null;
        }
    }

    private static async isThumbInFolder(params: ImgParam): Promise<boolean> {
        if (!params.name || !params.width || !params.height) {
            return false;
        }
        const filePath: string = path.resolve(imgThumbFolder, `${params.name}-${params.width}-${params.height}.${EXT}`);
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    private static buildFullPath(name: string): string {
        return path.resolve(imgOriginFolder, `${name}.${EXT}`);
    }

    private static buildThumbPath(params: ImgParam): string {
        return path.resolve(
            imgThumbFolder,
            `${params.name}-${params.width}-${params.height}.${EXT}`);
    }
}

export default FileHelper;