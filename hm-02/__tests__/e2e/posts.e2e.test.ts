import request from 'supertest';
import { app } from '../../src/app';
import { HTTP_STATUSES, RouterPaths } from '../../src/utils';



const getRequest = () => {
    return request(app);
}

describe('tests for /posts', () => {
    beforeAll( async () => {
        await getRequest().delete(`${RouterPaths.__test__}/all-data`)
    })

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })
})

