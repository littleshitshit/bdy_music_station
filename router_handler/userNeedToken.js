//导入db
const db = require('../db');
//导入bcrypt
const bcrypt = require('bcryptjs');
//引入xss
const xss = require("xss");
//需要携带Token
//-------------获取用户信息
exports.userinfo = (req, res) => {
    //req.user.user_id无法显示但是能用 
    const sql = 'select user_id,username,user_img,user_like from user where user_id=?'
    //查询用户是否存在
    db.query(sql, req.user.user_id, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length !== 1) return res.cc("用户不存在")
        //用户喜欢的
        let arr_user = rows[0].user_like;
        //如果用户还没有喜欢的歌，则直接返回
        if (arr_user === null) {
            //返回浏览器数据
            return res.succ({ rows }, "获取用户信息成功,用户没有喜欢的歌曲")
        } else {
            //对用户喜欢的歌曲进行song_like的值改变
            arr_user = arr_user.split(',')//转成数组
            //整理总歌曲id数组
            const sql = "select song_id from song"
            db.query(sql, (err, rows) => {
                if (err) return res.cc(err)
                if (rows.length === 0) return res.cc("查询歌曲库失败或者歌曲库没有存歌")
                //将所有歌曲id取出生成数组
                let arr_mysql = []
                rows.forEach((item) => {
                    arr_mysql.push(item.song_id);
                })
                //两个数组取交集
                let arr_mysql_set = new Set(arr_mysql)
                arr_user.forEach((item) => {
                    if (arr_mysql_set.has(item)) {
                        //设置song_like为1
                        //注意db是异步,forEach是同步
                        const sql = "update song set song_like='1' where song_id=?"
                        db.query(sql, item, (err, rows) => {
                            if (err) return res.cc(err)
                            if (rows.affectedRows !== 1) return res.cc("更新song_like失败")
                        })
                    }
                })
            })
            return res.succ({ rows }, "获取用户信息成功,更新song_like完成")
        }




    })

}
//-------------更新用户名
//更新用户名
exports.updateUsername = (req, res) => {
    console.log(req.body.username);
    const sql = "select * from user where username=?"
    db.query(sql, req.body.username, (err, rows) => {
        //错误处理
        if (err) return res.cc(err)
        if (rows.length > 0) return res.cc("用户名已经被注册了")
        const sql = "update user set ? where user_id=?"
        db.query(sql, [req.body, req.user.user_id], (err, rows) =>  {
            if (err) return res.cc(err)
            if (rows.affectedRows != 1) return res.cc("更新用户名失败")
            res.succ({}, "更新成功")
        })
    })

}
//--------------更新用户密码
exports.updateUserpwd = (req, res) => {
    //查询是否存在该用户
    const sql = "select password from user where user_id=?"
    db.query(sql, req.user.user_id, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length !== 1) return res.cc("用户不存在")
        //验证旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.old_password, rows[0].password)
        if (!compareResult) return res.cc('旧密码不匹配')
        //将新密码加密后存储
        let new_password = bcrypt.hashSync(req.body.new_password, 10);
        const sql = "update user set password=? where user_id=?"
        db.query(sql, [new_password, req.user.user_id], (err, rows) => {
            if (err) return res.cc(err)
            if (rows.affectedRows != 1) return res.cc("密码重置失败")
            res.succ({}, '密码重置成功')

        })
    })
}
//---------------更新用户头像
//image/png base64
exports.updateUserImg = (req, res) => {
    //查询用户是否存在
    const sql = "select * from user where user_id=?"
    db.query(sql, req.user.user_id, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length !== 1) return res.cc("用户不存在")
        //更新user_img
        const sql = "update user set ? where user_id=?"
        db.query(sql, [req.body, req.user.user_id], (err, rows) => {
            if (err) return res.cc(err)
            if (rows.affectedRows != 1) return res.cc("头像更新失败")
            res.succ({}, '头像更新成功')
        })
    })

}
//-----------------------------退出登录
//清空数据库的song 的song_like
exports.logout = (req, res) => {
    //清空数据库的song 的song_like
    const sql = "update song set song_like='0'"
    db.query(sql, (err, rows) => {
        if (err) return res.cc(err)
        res.succ({ token: '' }, '退出登录成功!请清空Token')
    })
}
//-------------------------收藏
exports.yes_like = (req, res) => {
    let add_song = req.params.song_id;
    //更新用户的收藏歌单
    const sql = "select user_like from user where user_id=?"
    db.query(sql, req.user.user_id, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length !== 1) return res.cc("用户不存在")
        let new_user_like_string
        //如果是空字符串
        if (!rows[0].user_like) {
            new_user_like_string = add_song;
        } else {
            let user_like_string = rows[0].user_like + "," + add_song;
            let user_like_arr = [...new Set(user_like_string.split(','))]
            new_user_like_string = user_like_arr.join(',');
        }

        //更新用户的user_like
        const sql = `update user set user_like='${new_user_like_string}' where user_id=${req.user.user_id}`
        db.query(sql, (err, rows) => {
            if (err) return res.cc(err)
            if (rows.affectedRows != 1) return res.cc("取消收藏失败")
            //添加song的song_like值
            const sql = `update song set song_like='1' where song_id=${add_song}`
            db.query(sql, (err, rows) => {
                if (err) return res.cc(err)
                if (rows.affectedRows != 1) return res.cc("取消收藏失败")
                res.succ({}, "收藏成功")

            })
        })


    })
}
//-------------------------取消收藏
exports.no_like = (req, res) => {
    let delete_song = req.params.song_id;
    //更新用户的收藏歌单
    const sql = "select user_like from user where user_id=?"
    db.query(sql, req.user.user_id, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.length !== 1) return res.cc("用户不存在")
        let user_like_string = rows[0].user_like;
        let user_like_arr = user_like_string.split(',')
        let new_user_like_arr = user_like_arr.filter((item) => {
            return item !== delete_song
        })
        let new_user_like_string = new_user_like_arr.join(',');
        //更新用户的user_like
        const sql = `update user set user_like='${new_user_like_string}' where user_id=${req.user.user_id}`
        db.query(sql, (err, rows) => {
            if (err) return res.cc(err)
            if (rows.affectedRows != 1) return res.cc("取消收藏失败")
            //重置song_like
            //清理song的song_like值
            const sql = `update song set song_like='0' where song_id=${delete_song}`
            db.query(sql, (err, rows) => {
                if (err) return res.cc(err)
                if (rows.affectedRows != 1) return res.cc("取消收藏失败")
                //重置song_like
                res.succ({}, "取消收藏成功")

            })
        })


    })

}
//----------------------提交歌曲评论
//需要post comments_id,comments_value,user_id
exports.submitSongComments = (req, res) => {
    //从req.user中获取user_id
    //comments_id,comments_value 在req.body里
    let xss_comments_value = xss(req.body.comments_value)
    const sql = `insert into comments set ?`
    db.query(sql, { comments_id: req.body.comments_id, comments_value: xss_comments_value, user_id: req.user.user_id }, (err, rows) => {
        if (err) return res.cc(err)
        if (rows.affectedRows != 1) return res.cc("评论失败")
        res.succ({ rows }, "评论成功")
    })
}
