# 课程表微信小程序

该项目使用微信小程序 `web-view` 打开现有课程表网站，网页和小程序共用同一个 Supabase 数据源，课程、宠物与排行榜会保持实时一致。

## 导入预览

1. 打开微信开发者工具，选择“导入项目”。
2. 项目目录选择本文件夹 `wechat-miniprogram`。
3. 当前 `project.config.json` 使用 `touristappid`，可直接进行本地界面预览。

## 正式发布

1. 在微信公众平台注册一个支持 `web-view` 的小程序，并取得 AppID。
2. 将 `project.config.json` 中的 `appid` 替换为真实 AppID。
3. 在小程序后台把课程表 HTTPS 域名配置为业务域名。
4. 如果微信平台不接受共享的 `jerudite.github.io` 域名，需要为 GitHub Pages 绑定一个可验证的自有 HTTPS 域名，并把 `app.js` 中的 `courseScheduleUrl` 改为该域名。
5. 在微信开发者工具中完成预览、上传、体验版审核和正式发布。

微信要求的 AppID、主体认证、业务域名校验及发布审核均属于微信平台账号操作，不能通过网站代码自动代办。
