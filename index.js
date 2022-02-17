const express = require('express');
const app = express();
const cors = require('cors')
const bodyParse = require('body-parser')
const userRouter = require('./router/user')
const userNeedToken = require('./router/userNeedToken')
const Joi = require('joi')

//解决跨域
app.use(cors())
//解析JSON字符串(功能同JSON.toparse())
app.use(bodyParse.json());
//解析表单
app.use(express.urlencoded({ extended: false }));
// 托管静态资源
app.use(express.static('./public'))
//解析Token
const expressJWT = require('express-jwt')
//导入全局配置文件
const config = require('./config')
//解析Token的中间件
app.use(expressJWT({
   secret: config.jwtSecretKey,
   algorithms:['HS256'],
   }).unless({ path: [/^\/api/,] }))//需要Token验证的接口

//响应失败中间件
app.use((req,res,next)=>{
  res.cc=(err,status=1)=>{
    res.send({
      status,
      message:err instanceof Error?err.message:err
    })
  }
  next()
})
//响应成功的中间件
app.use((req,res,next)=>{
  res.succ=(data={},message="获取成功",status=0)=>{
    res.send({
      status,
      message,
      data
    })
  }
  next()
})
//路由
app.use('/api', userRouter)
app.use('/my', userNeedToken)
//错误级别中间件
app.use(function (err, req, res, next) {
  // Joi 参数校验失败
  if (err instanceof Joi.ValidationError) {
    return res.send({
      status: 1,
      message: err.message
    })
  }
  //Token验证失败
  if (err.name === 'UnauthorizedError') {
    return res.send({
      status: 1,
      message: '身份验证失败'
    })
  }
  // 未知错误
  res.send({
    status: 1,
    message: err.message
  })
})
app.listen(8080, () => {
  console.log('服务器已启动，端口为:http://127.0.0.1:8080');
})