import request from 'supertest';
import { app } from '../../app';

test('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

test('fails when an incorrect password is supplied', async () => {
  await global.signup();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'foobar'
    })
    .expect(400);
});

test('responsds with a cookie when given valid credentials', async () => {
  await global.signup();

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

  const cookie = response.get('Set-Cookie');
  expect(cookie).toBeDefined();
});