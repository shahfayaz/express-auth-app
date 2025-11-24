const http = require('http');
const { Session } = require('./src/models');
const sequelize = require('./src/config/database');

async function verifySession() {
  const baseUrl = `http://localhost:${process.env.PORT || 3011}/api/auth`;
  const cookieJar = { cookie: '' };

  async function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(baseUrl + path);
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TestClient/1.0',
          ...headers,
        },
      };

      if (cookieJar.cookie) {
        options.headers['Cookie'] = cookieJar.cookie;
      }

      const req = http.request(url, options, (res) => {
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

  try {
    console.log('--- Starting Session Verification ---');
    
    // 1. Register/Login
    const username = `testuser_${Date.now()}`;
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Registering user: ${username}`);
    await request('POST', '/register', { username, email, password });

    console.log('Logging in...');
    const loginRes = await request('POST', '/login', { email, password });
    console.log('Login Response:', loginRes.status);

    if (loginRes.status === 200) {
      // 2. Check Database for Session
      console.log('Checking database for session...');
      // Wait a bit for async session save if needed (though it should be awaited in controller/middleware usually, but store might be async)
      await new Promise(r => setTimeout(r, 1000));

      const sessions = await Session.findAll();
      const latestSession = sessions[sessions.length - 1];

      if (latestSession) {
        console.log('Session found in DB:');
        console.log('SID:', latestSession.sid);
        console.log('IP:', latestSession.ip);
        console.log('User Agent:', latestSession.userAgent);
        console.log('City:', latestSession.city);
        console.log('Country:', latestSession.country);
        console.log('Expires:', latestSession.expires);
        
        if (latestSession.ip && latestSession.userAgent) {
            console.log('SUCCESS: Client info stored in session.');
        } else {
            console.log('WARNING: Client info missing.');
        }
      } else {
        console.log('ERROR: No session found in DB.');
      }
    }

    console.log('--- Verification Complete ---');
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    // await sequelize.close(); // Don't close if app is running separately
  }
}

verifySession();
