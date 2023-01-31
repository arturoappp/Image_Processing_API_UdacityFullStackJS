import express from 'express';
import FileManager from "../processor/FileManager";

const imagesApi: express.Router = express.Router();

const myMiddlewareValidation = async (req: express.Request, res: express.Response, next: () => void) => {
    // Validate request
    const validationMessage: null | string = await validate(new ImageQuery(req.query.name as string, req.query.width as string, req.query.height as string));
    console.log("Validating query: " + req.query);
    if (validationMessage) {
        res.send(validationMessage);
        return;
    }
    next();
};

imagesApi.get('/', myMiddlewareValidation,
    async (request: express.Request, response: express.Response): Promise<void> => {
        let result = await FileManager.getPathOrCreateThumb(request.query);
        if (result[1]) {
            response.send(result[1]);
            return;
        }
        if (result[0]) {
            response.sendFile(result[0]);
        } else {
            response.send('Error and this is very difficult to happen');
        }
    }
);

const validate = async (query: ImageQuery): Promise<null | string> => {
    if (!query.width && !query.height) {
        return "Please send a width or height value";
    }

    if (!(await FileManager.isImgInList(query.name))) {
        const imgList: string = (
            await FileManager.getImgList()
        ).join(' - ');
        return `Please send a valid File Name to work with, ex: ${imgList}.`;
    }

    if (!isValidNum(query.width)) {
        return "Please provide a valid positive width. your width:" + query.width;
    }

    if (!isValidNum(query.height)) {
        return "Please provide a valid positive height. your height:" + query.height;
    }
    return null;
};

const isValidNum = (value: string | undefined) => {
    const number: number = parseInt(value || '');
    return !(Number.isNaN(number) || number < 1);

};

class ImageQuery {
    name?: string;
    width?: string;
    height?: string;

    constructor(name: string, width: string, height: string) {
        this.name = name;
        this.width = width;
        this.height = height;
    }
}

export default imagesApi;
