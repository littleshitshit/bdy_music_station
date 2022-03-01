//导入db
const db = require('../db');
//导入bcrypt
const bcrypt = require('bcryptjs');
//用于生成Token
const jwt = require('jsonwebtoken')
//导入全局配置文件
const config = require('../config')
//引入xss过滤
let xss = require("xss");
//-------------------注册功能
exports.register = (req, res) => {
    let userinfo = req.body;
    //查重用户名
    const sql = "select * from user where username=?"
    db.query(sql, userinfo.username, (err, rows) => {
        //错误处理
        if (err) return res.cc(err)
        if (rows.length > 0) return res.cc("用户名已经被注册了")
        //加密用户密码
        //(需要加密的信息，生成加密信息的长度)
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        //插入新用户
        const sql = "insert into user set ?"
        db.query(sql, { username: userinfo.username, password: userinfo.password, user_img: userinfo.user_img }, (err, rows) => {
            if (err) return res.cc(err)
            if (rows.affectedRows != 1) return res.cc("注册失败,请重试")
            res.succ({},'注册成功')
        })
    })
}
//-----------------------登录功能
//管理员:admin 123456
exports.login = (req, res) => {
    let userinfo = req.body;
    const sql = 'select * from user where username=?'
    db.query(sql, userinfo.username, (err, rows) => {
        //错误处理
        if (err) return res.cc(err)
        if (rows.length != 1) return res.cc("用户名未被注册")
        //比较加密后的密码
        const compareResult = bcrypt.compareSync(userinfo.password, rows[0].password)
        if (!compareResult) return res.cc('登录失败')
        //生成Token字符串
        //设置需要加密的用户信息
        const user = { ...rows[0], password: '', userlike: '', user_img: '' }
        //生成Token
        const TokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.succ( { token: 'Bearer ' + TokenStr },"登陆成功",)
    })
}
//--------------------获取歌单
//需要参数 offset：偏移量（页数）,limit:前几条,
exports.getSonglist = (req, res) => {
    const sql = `select * from songlist LIMIT ${req.params.offset},${req.params.limit}`;//offset,limit
    db.query(sql, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length === 0) return res.cc("获取歌单失败")
        res.succ({rows})

    })
}
//--------------------获取轮播图图片
exports.getSwiper = (req, res) => {
    const sql = "select * from swiper";
    db.query(sql, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length !== 5) return res.cc("获取轮播图失败")
        res.succ({rows})

    })
}
//--------------------获取搜索结果
//需要参数 keyword:关键词 ，limit:前几条， offset：偏移量
//对xss 进行过滤
exports.search = (req, res) => {
    let xss_keyword = xss(req.body.keyword)
    const sql = `select song_id,song_name,song_time,song_like,singer_name,song_img from song join singer using  (singer_id) 
    where song_name like '%${xss_keyword}%'
    LIMIT ${req.body.offset},${req.body.limit}`;
    db.query(sql, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length === 0) return res.cc("获取歌曲失败")
        res.succ({rows})
    })
}
//------------------------获取搜索结果总数量
exports.searchLen = (req, res) => {
    let xss_keyword = xss(req.body.keyword)
    const sql = `select count(song_id) as len from song join singer using  (singer_id) 
    where song_name like '%${xss_keyword}%'`;
    db.query(sql, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length === 0) return res.cc("获取歌曲失败")
        res.succ({rows})
    })
}
//-------------------获取歌曲信息(用于播放列表展示)

exports.getSonginfo = (req, res) => {
    
    const sql = `select song_id,song_name,song_time,song_like,singer_name,song_img,comments_id from song join singer using  (singer_id) 
    where song_id=?`;
    db.query(sql, req.params.song_id, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length === 0) return res.cc("获取歌曲信息失败")
        res.succ({rows})

    })
}
//-------------------获取歌曲歌词
exports.getSongLryic = (req, res) => {
    const sql = `select song_lryic from song where song_id=?`;
    db.query(sql, req.params.song_id, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length === 0) return res.cc("获取歌词失败")
        res.succ({rows})
    })

}
//---------------------获取歌曲评论
//需要参数 offset：偏移量,limit:前几条,
exports.getSongComments = (req, res) => {
    //三表连接，显示用户名，评论内容，
    //歌曲表的comments_id是外键
    //评论表显示对应的comments_id有的用户_id和其评论
    //用户表里获取用户名
    const sql = `select comments_value,username,user_img from (song LEFT JOIN comments on comments.comments_id=song.comments_id)LEFT JOIN user on comments.user_id=user.user_id 
    where song_id='${req.params.song_id}' LIMIT ${req.params.offset},${req.params.limit}`;
    db.query(sql, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length === 0) return res.cc("获取歌曲评论失败")
        // if(rows[0].username===null) return res.cc("评论为空")
        res.succ({rows})
    })
}
