// cluster_server.js
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isPrimary) {
  console.log(`[마스터] 프로세스 ID: ${process.pid}`);
  console.log(`CPU 개수: ${numCPUs}개`);

  // CPU 코어 수만큼 워커(Worker) 프로세스를 생성합니다.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 워커가 종료되었을 때 다시 생성해줍니다.
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `${worker.process.pid}번 워커가 종료되었습니다. 새로운 워커를 생성합니다.`
    );
    cluster.fork();
  });
} else {
  // 워커 프로세스들이 실제 서버 로직을 수행합니다.
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`안녕하세요! 이 응답은 프로세스 ${process.pid}에서 보냈습니다.`);
    })
    .listen(3000);

  console.log(`[워커] ${process.pid}번 프로세스 실행 완료`);
}
