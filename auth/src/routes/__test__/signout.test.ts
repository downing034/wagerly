import request from 'supertest';
import { app } from '../../app';

test('clears the cookie after signing out', async () => {
  await global.signup();

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  const expectedSetCookieResponse = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly';
  const cookie = response.get('Set-Cookie');
  expect(cookie).toBeDefined();
  expect(cookie[0]).toEqual(expectedSetCookieResponse);
});