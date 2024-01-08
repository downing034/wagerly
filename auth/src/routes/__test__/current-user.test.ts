import request from 'supertest';
import { app } from '../../app';

test('responds with details about the current user', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const currentUser = response.body.currentUser;
  expect(currentUser).not.toBeNull();
  expect(currentUser.email).toEqual('test@test.com');
});

test('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  const currentUser = response.body.currentUser;
  expect(currentUser).toBeNull();
});