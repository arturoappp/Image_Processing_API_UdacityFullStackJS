import supertest from 'supertest';
import app from "../index";

const apiPath = "/"

const request = supertest(app);
describe('Test api home endpoint responses', () => {
        it('ImageApi response 200', async () => {
                const response = await request.get(`${apiPath}`);
                console.log(response.body)
                expect(response.status).toBe(200);
            }
        )
    }
);

describe('endpoint: 404', (): void => {
    it('returns 404 for invalid endpoint', async (): Promise<void> => {
        const response: supertest.Response = await request.get('/void');
        expect(response.status).toBe(404);
    });
});