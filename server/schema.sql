-- 用户信息表
drop table if exists users;
CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,    -- id
  `account` varchar(255) DEFAULT NULL,      -- 账号
  `nickname` varchar(255) DEFAULT NULL,     -- 昵称
  `password` varchar(255) DEFAULT NULL,     -- 密码
  `email` varchar(255) DEFAULT NULL,        -- 邮箱
  `avatar` varchar(255) DEFAULT NULL,       -- 上传头像
  `registered` datetime DEFAULT now(),      -- 创建时间
  `role` tinyint(4) DEFAULT '1',            -- 状态 0 管理员 1 普通
  `last_login` datetime DEFAULT now(),      -- 最后一次登录时间
  PRIMARY KEY (`uid`),
  UNIQUE KEY `account` (`account`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
);

-- 发表内容
drop table if exists posts;
CREATE TABLE `posts` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,    -- pid
  `user_id` int(11) DEFAULT NULL,           -- 用户id
  `content` varchar(4096) DEFAULT NULL,     -- 内容
  `type` tinyint(4) DEFAULT '1',            -- 类型 0 毒汤 1 鸡汤 
  `created_at` datetime DEFAULT now(),      -- 创建时间
  `imgs` varchar(255) DEFAULT NULL,         -- 上传图片
  `see` int(11) NOT NULL DEFAULT '1',       -- 浏览次数
  `status` tinyint(4) DEFAULT '1',          -- 状态 0 待审核 1 审核通过 2 删除 
  PRIMARY KEY (`pid`)
);

-- 对posts里面的type做类型说明
drop table if exists terms;
CREATE TABLE `terms` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,    -- tid
  `name` varchar(255) DEFAULT NULL,         -- 类型
  PRIMARY KEY (`tid`)
);

-- 关联(收藏，评论)
drop table if exists links;
CREATE TABLE `links` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,    -- lid
  `post_id` int(11) DEFAULT NULL,           -- 内容id
  `user_id` int(11) DEFAULT NULL,           -- 用户id(谁写的)
  `link_id` int(11) DEFAULT NULL,           -- 用户id(谁来评论或者收藏的)
  `date` datetime DEFAULT now(),            -- 创建时间
  `status` tinyint(4) DEFAULT '1',          -- 状态 0 待审核 1 审核通过 2 删除 
  `comment` varchar(4096) DEFAULT NULL,     -- 内容
  `type` tinyint(4) DEFAULT '0',            -- 类型 0 收藏 1 评论
  PRIMARY KEY (`lid`)
);