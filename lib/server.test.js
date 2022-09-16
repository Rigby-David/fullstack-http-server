import request from 'supertest';
import { serve } from './server.js';

describe('The TCP server', () => {
  let server = null;

  beforeEach(() => {
    // Deliberately omit the port so we get an available one.
    server = serve('localhost', undefined);
  });

  afterEach(() => {
    server.close();
  });

  // This test will fail initially since the project doesn't start with a
  // working HTTP server.
  it('connects on the default port', async () => {
    await request(server).get('/').expect(200);
  });

  it('receives a 404 when requesting an unknown resource/method', async () => {
    await request(server).put('/fictitious').expect(404);
  });

  it('GET / responds with an HTML body', async () => {
    const res = await request(server).get('/');
    expect(res.text).toEqual(
      `<html>
        <main>
        <h1>Welcome to my site</h1>
        </main>
        </html>`
    );
  });

  it('GET /posts returns status 200', async () => {
    const { status } = await request(server).get('/posts');
    expect(status).toBe(200);
    const res = await request(server).get('/posts');
    expect(res.body[0]).toEqual({
      id: '1',
      name: 'Joe',
      type: 'human',
    });
  });

  it('POST /mail returns with status 204', async () => {
    const { status } = await request(server).post('/mail');
    expect(status).toBe(204);
  });
});
