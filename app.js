// app.js
import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  console.log(`[${process.pid}] 요청 처리!`); // 어떤 프로세스가 요청을 처리했는지 확인
  res.send(`안녕하세요! 이 응답은 프로세스 ${process.pid}에서 보냈습니다.`);
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
