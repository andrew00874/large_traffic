// cache_server.js
const express = require("express");
const redis = require("redis");

const app = express();
const PORT = 3000;

// Redis 클라이언트 생성 및 연결
const redisClient = redis.createClient({ url: "redis://127.0.0.1:6379" });
redisClient.on("error", (err) => console.log("Redis Client Error", err));
(async () => {
  await redisClient.connect();
})();

// 가상의 느린 데이터베이스 조회 함수
const getSlowDataFromDB = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: "홍길동",
        level: 99,
        timestamp: new Date().toISOString(),
      });
    }, 1500); // 1.5초간 지연
  });
};

app.get("/data", async (req, res) => {
  const cacheKey = "user:profile";

  try {
    // 1. Redis에서 데이터 조회
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      // 2. 캐시 히트(Cache Hit)! 캐시된 데이터를 바로 응답
      console.log("Cache Hit! 응답을 캐시에서 가져옵니다.");
      return res.json(JSON.parse(cachedData));
    }

    // 3. 캐시 미스(Cache Miss)! DB에서 데이터 조회
    console.log("Cache Miss! DB에서 데이터를 가져옵니다.");
    const dbData = await getSlowDataFromDB();

    // 4. 조회한 데이터를 Redis에 저장 (10초간 유효)
    await redisClient.setEx(cacheKey, 10, JSON.stringify(dbData));

    return res.json(dbData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(PORT, () => {
  console.log(`캐시 서버가 ${PORT} 포트에서 실행 중입니다.`);
});
