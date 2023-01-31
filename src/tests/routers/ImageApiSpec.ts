import supertest from 'supertest';
import app from "../../index";

const imgApiPath = "/api/img-processor"

const request = supertest(app);
describe('Test imageApi endpoint responses', () => {
    it('ImageApi response 200', async () => {
            const response = await request.get(`${imgApiPath}`);
            expect(response.status).toBe(200);
        }
    )}
);

describe('endpoint: 404', (): void => {
    it('returns 404 for invalid endpoint', async (): Promise<void> => {
        const response: supertest.Response = await request.get('/void');
        expect(response.status).toBe(404);
    });
});

describe('endpoint: imgApi', (): void => {
    it('gets with name=fjord', async (): Promise<void> => {
        const response: supertest.Response = await request.get(
            `${imgApiPath}?name=fjord`
        );

        expect(response.status).toBe(200);
    });

    it('gets with valid params : name=fjord&width=199&height=199', async (): Promise<void> => {
        const response: supertest.Response = await request.get(
            `${imgApiPath}?name=fjord&width=199&height=199`
        );
        console.log(response.body)
        expect(response.status).toBe(200);
    });

    it('gets with invalid params name=fjord&width=-200&height=200', async (): Promise<void> => {
        const response: supertest.Response = await request.get(
            `${imgApiPath}?name=fjord&width=-200&height=200`
        );
        expect(response.status).toBe(200);
    });

    it('get call with no arguments', async (): Promise<void> => {
        const response: supertest.Response = await request.get(`${imgApiPath}`);

        expect(response.status).toBe(200);
    });
});
