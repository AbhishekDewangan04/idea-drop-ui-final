const http = require('http');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'src', 'data', 'db.json');
function readDB(){
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function sendJSON(res, status, data){
  res.writeHead(status, {'Content-Type':'application/json'});
  res.end(JSON.stringify(data));
}

function parseBody(req){
  return new Promise((resolve,reject)=>{
    let body='';
    req.on('data',chunk=> body+=chunk);
    req.on('end',()=>{
      try{
        resolve(JSON.parse(body || '{}'))
      }catch(e){resolve({})}
    });
    req.on('error',reject);
  })
}

const server = http.createServer(async (req,res)=>{
  const { method, url } = req;

  if(url === '/ideas' && method === 'GET'){
    const db = readDB();
    return sendJSON(res, 200, db.ideas || []);
  }

  if(url === '/api/auth/login' && method === 'POST'){
    const body = await parseBody(req);
    const { email, password } = body;
    const db = readDB();
    const user = (db.users||[]).find(u=>u.email === email && u.password === password);
    if(user){
      const resp = {
        accessToken: 'fake-access-token',
        user: { id: user.id, name: user.name, email: user.email }
      };
      return sendJSON(res, 200, resp);
    }
    return sendJSON(res, 401, { message: 'Invalid credentials' });
  }

  if(url.startsWith('/ideas') && (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE')){
    // delegate to db file for basic CRUD is out of scope; return 501
    return sendJSON(res, 501, { message: 'Not implemented in mock server' });
  }

  // fallback
  sendJSON(res, 404, { message: 'Not Found' });
});

const PORT = 8000;
server.listen(PORT, ()=> console.log('Mock backend listening on', PORT));
