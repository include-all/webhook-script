const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process'); //开启部署的子进程

const SECRET = "github-webhooks-secret"

const signatureSecret = async (body) => {
  return (
    "sha1=" +
    crypto
      .createHmac("sha1", SECRET)
      .update(JSON.stringify(body))
      .digest("hex")
  );
}

const validSecret = async (req) => {
  const signature = await signatureSecret(req.body || '');
  // 两个签名
  console.log(`signature: ${signature}`);
  console.log(
    `req.headers["x-hub-signature"]: ${req.headers["x-hub-signature"]}`
  );
  return signature === req.headers["x-hub-signature"]
}

const printLog = async (processName) => {
  processName.stdout.on('data', (data) => {
    console.log(`${data}`)
  })
  processName.stderr.on('data', (error) => {
    console.error(`${error}`);
  });
  processName.stdout.on('close', () => {
    console.log(`============end================`)
  })
}

const webhookUpdate = async (req, res) => {
  const payload = req.body;
  const name = `./src/shell/${payload.repository.name}.sh`;
  res.end(JSON.stringify({ data: "success" }))
  const child = spawn('sh', [name])
  await printLog(child)
}


const server = http.createServer(async (req, res) => {
  console.log(`请求为：${req.url}`);
  res.setHeader('Content-Type', 'application/json');
  // 不断更新数据
  let body = "";
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', async () => {
    console.log(body)
    req.body = JSON.parse(body)
    if (req.url === '/api/webhook/updateCommon') {
      const valid = await validSecret(req);
      if (!valid) {
        res.end(JSON.stringify({ error: 0, errorMsg: '校验失败' }))
        return;
      }
      await webhookUpdate(req, res);
      return
    }
  })
})

server.listen(3001, () => {
  console.log('webhook服务已经在3001端口启动');
})
