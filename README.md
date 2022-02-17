[TOC]

# 接口

## 注册

```js
http://127.0.0.1:8080/api/register
```

【功能】

- 用户名查重

- 对密码进行加密，存储在数据库中

【格式要求】

- 用户名：1-10位，a-z0-9A-Z
- 密码：5-15位，任意字符
- 头像:image/png ,base64

【post传参】都是必须传递的参数

- username
- password
- user_img

## 登录

```js
http://127.0.0.1:8080/api/login
```

【功能】

- 比较解密的密码

- **生成`Token`字符串并返回给浏览器**
  - 不包含`password`，`userlike`，`user_img`信息

【建议】

- 浏览器最好将Token字符串存在localStorage

【post传参】

- username
- password

## 获取用户信息

```js
http://127.0.0.1:8080/my/userinfo
```

【要求】

- ==请求头需要携带 `Authorization`，值为`Token`字符串==

【功能】

- 游客：返回错误信息

- **对用户喜欢的歌曲进行song_like的值改变，便于歌曲展示时显示**

【get】

## 登出

```js
http://127.0.0.1:8080/my/logout
```

【功能】

- ==请求头需要携带 `Authorization`，值为`Token`字符串==

- 清空数据库的song 的song_like

- 重置Token

【get】

## 更新用户名

```js
http://127.0.0.1:8080/my/updateUsername
```

【要求】

- ==请求头需要携带 `Authorization`，值为`Token`字符串==

【post传参】必穿参数

- username 

【格式要求】

- 用户名：1-10位，a-z0-9A-Z

## 更新用户头像

```js
http://127.0.0.1:8080/my/updateUserImg
```

【要求】

- ==请求头需要携带 `Authorization`，值为`Token`字符串==

【post传参】必穿

- user_img

【图片格式要求】

- image/png
- base64

## 重置用户密码

```js
http://127.0.0.1:8080/my/updateUserpwd
```

【要求】

- ==请求头需要携带 `Authorization`，值为`Token`字符串==

【功能】

- 旧密码不能和新密码相同

【post传参】必穿

- old_password
- new_password

【格式要求】

- 密码：5-15位，任意字符

## 获取歌单（用于生成推荐歌单）

```js
http://127.0.0.1:8080/api/getSonglist/:offset/:limit
```

【get参数】

- limit：数量限制
- offset:偏移量

## 获取轮播图图片

```js
http://127.0.0.1:8080/api/getSwiper
```

【get】

【发送数组】

## 获取搜索结果（模糊查询）

```js
http://127.0.0.1:8080/api/search
```

【功能】

- 对输入内容进行了xss的防御

【post参数】

- keyword:关键词

- limit：数量限制
- offset:偏移量

## 获取搜索结果数量（用于分页）

```js
http://127.0.0.1:8080/api/searchLen
```

【功能】

- 对输入内容进行了xss的防御

【post参数】

- keyword:关键词

## 获取歌曲信息(用于播放列表展示)

```js
http://127.0.0.1:8080/api/getSonginfo/:song_id
```

【get参数】

- song_id:歌曲id

## 获取歌曲歌词

```js
http://127.0.0.1:8080/api/getSongLryic/:song_id
```

【get参数】

- song_id:歌曲id

## 获取歌曲评论（三表查询）

是一个三表连接的操作

```js
http://127.0.0.1:8080/api/getSongComments/:song_id/:offset/:limit
```

【get参数】

- song_id:歌曲id

- limit：数量限制
- offset:偏移量

## 提交歌曲评论

```js
http://127.0.0.1:8080/m/submitSongComments
```

【要求】

- ==请求头需要携带 `Authorization`，值为`Token`字符串==

【功能】

- 对输入内容进行了xss的防御

【post参数】

- comments_id
- comments_value
- user_id

## 取消收藏

==请求头需要携带 `Authorization`，值为`Token`字符串==

```
http://127.0.0.1:8080/my/no_like/:song_like
```

【get】

传歌曲id

## 收藏

```
http://127.0.0.1:8080/my/yes_like/:song_like
```

【get]

传歌曲id
