/**
 * 自动提交 url 到百度搜索
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios'); // 使用 Axios 来发送 HTTP 请求

// 定义 urls.json 的常量路径
const URLS_FILE_PATH = path.join(hexo.base_dir, 'baidu_submit_urls.json');

// 该脚本禁止在CI运行
if (process.env.GITHUB_ACTIONS === 'true') {
  console.log('This script is not intended to run in GitHub Actions environment.');
  return
}

// 在 Hexo 完成生成后运行
hexo.on('generateAfter', async function () {
  // 获取所有已发布的文章 URL
  const pages = hexo.locals.toObject().posts;
  const urls = [];

  pages.each(function (post) {
    if (post.published) {
      urls.push(post.permalink); // 获取每个已发布页面的 URL
    }
  });

  // 读取已提交的 URL 数据
  const urlData = loadUrlData(URLS_FILE_PATH);

  // 获取新的 URL，排除已提交的 URL
  const newUrls = urls.filter(url => !urlData[url]);

  // 将新的 URL 更新到 baidu_submit_urls.json 文件
  if (newUrls.length > 0) {
    newUrls.forEach(url => {
      urlData[url] = false; // 标记新 URL 为未提交
    });
    saveUrlData(URLS_FILE_PATH, urlData);
    console.log(`New URLs have been added to ${URLS_FILE_PATH}`);
  } else {
    console.log('No new URLs to submit.');
  }

  // 执行 URL 提交的操作
  await submitUrls(URLS_FILE_PATH, urlData);
});

// 读取 baidu_submit_urls.json 文件中的 URL 数据
function loadUrlData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data); // 解析 JSON 数据
  } catch (error) {
    // 如果文件不存在，则返回空对象
    return {};
  }
}

// 将 URL 数据保存到 baidu_submit_urls.json 文件
function saveUrlData(filePath, urlData) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(urlData, null, 2), 'utf-8'); // 格式化为可读的 JSON
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
  }
}

// 提交 URLs 的函数
async function submitUrls(filePath, urlData) {
  try {
    const urls = Object.keys(urlData); // 获取所有 URL
    console.log(`Total URLs to submit: ${urls.length}`);

    // 提交每个 URL
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      if (urlData[url] === true) {
        continue; // 跳过已提交的 URL
      }

      console.log(`Submitting URL: ${url}`);

      try {
        // 向百度提交 URL
        const response = await axios.post(
          'http://data.zz.baidu.com/urls?site=https://popring.cn&token=UJ6kbyaARobrFGiO',
          url,
          { headers: { 'Content-Type': 'text/plain' } }
        );

        if (response.status === 200) {
          // 提交成功后更新 URL 提交状态
          console.log(`Successfully submitted: ${url}`);
          urlData[url] = true; // 标记为已提交
          saveUrlData(filePath, urlData); // 保存更新后的数据
        } else {
          console.log(`Failed to submit ${url}: ${response.status}`);
          throw new Error(`Failed to submit ${url}: ${response.status}`);
        }
      } catch (error) {
        // 失败后暂停
        console.error(`Error submitting ${url}: ${error.message}`);
        console.log('Stopping further submissions due to an error.');
        break; // 发生错误时停止提交
      }
    }

    console.log('URL submission process completed.');
  } catch (error) {
    console.error(`Error reading the file: ${error.message}`);
  }
}
