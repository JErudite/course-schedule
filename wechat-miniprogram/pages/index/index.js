const app = getApp();

Page({
  data: {
    courseScheduleUrl: "",
  },

  onLoad() {
    const separator = app.globalData.courseScheduleUrl.includes("?") ? "&" : "?";
    this.setData({
      courseScheduleUrl: `${app.globalData.courseScheduleUrl}${separator}source=wechat-miniprogram`,
    });
  },
});
