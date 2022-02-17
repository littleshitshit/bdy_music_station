// 导入 Joi 来定义验证规则
const Joi = require('joi')
//用户名：1-10位,a-z0-9A-Z
const username=Joi.string().alphanum().min(1).max(10).required()
//密码：5-15位 以非空格开头的任意字符
const password=Joi.string().pattern(/^[\S]{5,15}$/).required()
const repassword=Joi.ref('password')
const user_img=Joi.string().dataUri().required()
//------------注册验证规则
exports.userRegister = {
  body: {
    user_img,
    username,
    password,
    repassword
  }

}
//------------登录验证规则
exports.userLogin = {
  body: {
    username,
    password,
  }

}
// -----------------更新信息验证规则
exports.updateUserSchema = {
  body: {
    username
  }
}
//-------------------重置密码验证规则
exports.updateUserpwd = {
  body: {
    old_password:password,
    new_password:Joi.not(Joi.ref('old_password')).concat(password)

  }
}
//------------------头像验证规则
exports.updateUserImg={
  body:{
    user_img,
  }
}
//------------------搜索输入规则
const keyword=Joi.string().pattern(/^[\S]{1,20}$/).required()
exports.search={
  body:{
    keyword,
    limit:Joi.string().alphanum(),
    offset:Joi.string().alphanum()
  }
}
//------------------评论输入规则
//非空格开头1-30个字
const comments_value=Joi.string().pattern(/^[\S]{1,30}$/).required()
exports.submitSongComments={
  body:{
    comments_value,
    comments_id:Joi.string().alphanum(),
    user_id:Joi.string().alphanum()
  }
}
