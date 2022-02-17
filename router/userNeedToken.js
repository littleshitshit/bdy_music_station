const express = require('express')
const router = express.Router()
//导入路由函数
const user_handler = require('../router_handler/userNeedToken')
//导入验证中间件
const expressJoi = require('@escook/express-joi')
//导入验证规则
const {updateUserSchema,updateUserpwd,updateUserImg,submitSongComments} = require('../schema')
//路由
//需要携带Token
//获取用户信息
router.get('/userinfo',user_handler.userinfo)
//更改用户名
router.post('/updateUsername',expressJoi(updateUserSchema),user_handler.updateUsername)
//更改密码
router.post('/updateUserpwd',expressJoi(updateUserpwd),user_handler.updateUserpwd)
//更该头像
router.post('/updateUserImg',expressJoi(updateUserImg),user_handler.updateUserImg)
//退出登录
router.get('/logout',user_handler.logout)
//取消收藏
router.get('/no_like/:song_id',user_handler.no_like)
//收藏
router.get('/yes_like/:song_id',user_handler.yes_like)
//提交评论
router.post('/submitSongComments',expressJoi(submitSongComments),user_handler.submitSongComments)



module.exports = router