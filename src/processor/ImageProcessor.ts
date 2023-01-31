const sharp = require('sharp');

const sharpProcessor = async (imageObj: ImageObj): Promise<void> => {
    try {
        await sharp(imageObj.fullPath)
            .resize(imageObj.width, imageObj.height)
            .toFormat('jpeg')
            .toFile(imageObj.thumbPath);
    } catch {
        throw new Error('Error with our img processor [sharp]!');
    }
};

export default sharpProcessor;

//model
class ImageObj {
    fullPath: string;
    thumbPath: string;
    width: number;
    height: number;

    constructor(sourcePath: string, targetPath: string, width: number, height: number) {
        this.fullPath = sourcePath;
        this.thumbPath = targetPath;
        this.width = width;
        this.height = height;
    }
}

