import express from 'express';
import imgApi from './routers/ImageApi';
import FileManager from "./processor/FileManager";

const app = express();
const port = 5500;
const imgApiPath = "img-processor";

const routes: express.Router = express.Router();
routes.use(`/api/${imgApiPath}`, imgApi);

const myMiddlewareLog = async (req: express.Request, res: express.Response, next: () => void) => {
    console.log(req.path as string+ ' - ' + req.hostname as string);
    next();
};

routes.get('/', myMiddlewareLog, async (request: express.Request, response: express.Response): Promise<void> => {

        const list: string[] = await FileManager.getImgList();
        console.log(list)
        let listString: string = "";
        list.forEach((item) => {
            listString += `<li>${item}</li>\n`;
        })

        response.send(
            '<h2>Hi this is an image processor for Udacity - project 1:</h2>\n' +
            '<p>please use one of the name img from the list:</p>\n' +
            '<ul>\n'
            +
            listString
            +
            '</ul>\n' +
            '<p>This is an example request you can use:&nbsp;' +
            `   <a href="http://localhost:${port}/api/${imgApiPath}?name=fjord&width=200&height=200">http://localhost:${port}/api/${imgApiPath}?name=fjord&width=200&height=200</a>` +
            '</p>'
        );
    }
);

app.use(routes);
app.listen(port, () => {
    console.log(`Listening on port ${port} at localhost:${port}`)
});

export default app;