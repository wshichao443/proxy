const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 代理处理器
const proxyHandler = async (req, res) => {
  const targetURL = req.headers["target-url"]; // 获取目标 URL
  if (!targetURL) {
    res.status(400).send("Target-URL header is missing.");
    return;
  }

  try {
    // 使用 axios 向目标 URL 发起请求
    const proxyResponse = await axios({
      method: req.method,
      url: targetURL,
      data: req.body,
      headers: { ...req.headers, host: new URL(targetURL).host },
    });

    // 将响应内容返回给原请求方
    res.status(proxyResponse.status).send(proxyResponse.data);
  } catch (error) {
    // 错误处理
    console.error("Error in proxy request:", error);
    res.status(500).send("Internal Server Error");
  }
};

// 使用中间件
app.use(proxyHandler);

// 监听端口
app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});