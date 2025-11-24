const http = require('http');

async function testAuth() {
  const baseUrl = 'http://localhost:3000/api/auth';
  const cookieJar = { cookie: '' };

  async function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (cookieJar.cookie) {
        options.headers['Cookie'] = cookieJar.cookie;
      }

      const req = http.request(`${baseUrl}${path}`, options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.headers['set-cookie']) {
            cookieJar.cookie = res.headers['set-cookie'][0].split(';')[0];
          }
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  console.log('--- Starting Verification ---');

  // 1. Register
  const user = { username: `testuser_${Date.now()}`, email: `test${Date.now()}@example.com`, password: 'password123' };
  console.log(`Registering user: ${user.username}`);
  const regRes = await request('POST', '/register', user);
  console.log('Register Response:', regRes.status, regRes.body);

  if (regRes.status !== 201) {
    console.error('Registration failed');
    return;
  }

  // 2. Login
  console.log('Logging in...');
  const loginRes = await request('POST', '/login', { email: user.email, password: user.password });
  console.log('Login Response:', loginRes.status, loginRes.body);
  
  if (loginRes.status !== 200) {
    console.error('Login failed');
    return;
  }

  const token = loginRes.body.token;

  // 3. Test JWT Protected Route
  console.log('Testing JWT Protected Route...');
  const jwtRes = await request('GET', '/profile-jwt', null, { 'Authorization': `Bearer ${token}` });
  console.log('JWT Profile Response:', jwtRes.status, jwtRes.body);

  // 4. Test Session Protected Route
  console.log('Testing Session Protected Route...');
  const sessionRes = await request('GET', '/profile-session');
  console.log('Session Profile Response:', sessionRes.status, sessionRes.body);

  // 5. Logout
  console.log('Logging out...');
  const logoutRes = await request('POST', '/logout');
  console.log('Logout Response:', logoutRes.status, logoutRes.body);

  console.log('--- Verification Complete ---');
}

// Wait for server to start
setTimeout(testAuth, 2000);
