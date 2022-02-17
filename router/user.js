const express = require('express')
const router = express.Router()
//导入路由函数
const user_handler = require('../router_handler/user')
//导入验证中间件
const expressJoi = require('@escook/express-joi')
//导入验证规则
const {userRegister,userLogin,search} = require('../schema')
//路由
//注册
router.post('/register', expressJoi(userRegister), user_handler.register)
//登录
router.post('/login', expressJoi(userLogin),user_handler.login)
//获取歌单
router.get('/getSonglist/:offset/:limit',  user_handler.getSonglist)
//获取轮播图
router.get('/getSwiper',  user_handler.getSwiper)
//获取搜索结果(有限制)
router.post('/search',expressJoi(search),user_handler.search)
//获取搜索数量(无限制)
router.post('/searchLen',user_handler.searchLen)
//获取歌曲详细信息
router.get('/getSonginfo/:song_id',  user_handler.getSonginfo)
//获取歌词
router.get('/getSongLryic/:song_id',  user_handler.getSongLryic)
//获取评论
router.get('/getSongComments/:song_id/:offset/:limit',  user_handler.getSongComments)

module.exports = router