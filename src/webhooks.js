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
  return signature !== req.headers["x-hub-signature"]
}

const printLog = async (processName) => {
  processName.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })
  processName.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  processName.stdout.on('close', (data) => {
    console.log(`============end================`)
  })
}

const webhookUpdate = async (req, res) => {
  res.end(JSON.stringify({ data: "success" }))
  // 获取
  const payload = JSON.parse(body);
  const name = `./src/shell/${payload.repository.name}.sh`;
  const child = spawn('sh', [name])
  await printLog(child)
}


const server = http.createServer(async (req, res) => {
  console.log(`请求为：${req.url}`);
  res.setHeader('Content-Type', 'application/json');
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

server.listen(3001, () => {
  console.log('webhook服务已经在3001端口启动');
})