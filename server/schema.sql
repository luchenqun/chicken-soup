-- 用户信息表
drop table if exists users;
CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,             -- id
  `account` varchar(255) NOT NULL,                   -- 账号
  `nickname` varchar(255) NOT NULL,                  -- 昵称
  `password` varchar(255) NOT NULL,                  -- 密码
  `email` varchar(255) NOT NULL,                     -- 邮箱
  `avatar` varchar(1024) NOT NULL,                   -- 上传头像
  `registered` datetime NOT NULL DEFAULT now(),      -- 创建时间
  `role` tinyint(4) NOT NULL DEFAULT '1',            -- 状态 0 管理员 1 普通
  `last_login` datetime NOT NULL DEFAULT now(),      -- 最后一次登录时间
  PRIMARY KEY (`uid`),
  UNIQUE KEY `account` (`account`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
);

-- 发表内容
drop table if exists jokes;
CREATE TABLE `jokes` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,          -- pid
  `user_id` int(11) NOT NULL,                     -- 用户id
  `content` varchar(8192) NOT NULL,               -- 内容
  `type` tinyint(4) NOT NULL DEFAULT '1',         -- 类型 0 毒汤 1 鸡汤 
  `created_at` datetime NOT NULL DEFAULT now(),   -- 创建时间
  `imgs` varchar(2048) DEFAULT NULL,              -- 上传图片
  `see` int(11) NOT NULL DEFAULT '1',             -- 浏览次数
  `status` tinyint(4) NOT NULL DEFAULT '1',       -- 状态 0 待审核 1 审核通过 2 删除 
  PRIMARY KEY (`pid`)
);

-- 对jokes里面的type做类型说明
drop table if exists terms;
CREATE TABLE `terms` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,    -- tid
  `name` varchar(255) NOT NULL,             -- 类型
  PRIMARY KEY (`tid`)
);
REPLACE INTO `terms` VALUES ('1', '心灵毒汤');
REPLACE INTO `terms` VALUES ('2', '表情包');
REPLACE INTO `terms` VALUES ('3', '搞笑图片');
REPLACE INTO `terms` VALUES ('4', '搞笑动态图片');
REPLACE INTO `terms` VALUES ('5', '神回复');
REPLACE INTO `terms` VALUES ('6', '神吐槽');
REPLACE INTO `terms` VALUES ('7', '神转折');
REPLACE INTO `terms` VALUES ('8', '段子');
REPLACE INTO `terms` VALUES ('9', '污段子');
REPLACE INTO `terms` VALUES ('10', '搞笑对话段子');
REPLACE INTO `terms` VALUES ('11', '内涵段子');
REPLACE INTO `terms` VALUES ('12', '糗事段子');
REPLACE INTO `terms` VALUES ('13', '新闻有才评论');
REPLACE INTO `terms` VALUES ('14', '娱乐搞笑');
REPLACE INTO `terms` VALUES ('15', 'IT科技搞笑');
REPLACE INTO `terms` VALUES ('16', '爱情笑话');
REPLACE INTO `terms` VALUES ('17', '男女笑话');
REPLACE INTO `terms` VALUES ('18', '家庭笑话');
REPLACE INTO `terms` VALUES ('19', '夫妻笑话');
REPLACE INTO `terms` VALUES ('20', '儿童笑话');
REPLACE INTO `terms` VALUES ('21', '成人笑话');
REPLACE INTO `terms` VALUES ('22', '职场笑话');
REPLACE INTO `terms` VALUES ('23', '官场笑话');
REPLACE INTO `terms` VALUES ('24', '大学笑话');
REPLACE INTO `terms` VALUES ('25', '寝室笑话');
REPLACE INTO `terms` VALUES ('26', '古代笑话');
REPLACE INTO `terms` VALUES ('27', '校园笑话');
REPLACE INTO `terms` VALUES ('28', '课堂笑话');
REPLACE INTO `terms` VALUES ('29', '动物笑话');
REPLACE INTO `terms` VALUES ('30', '口误笑话');
REPLACE INTO `terms` VALUES ('31', '地域笑话');
REPLACE INTO `terms` VALUES ('32', '名人笑话');
REPLACE INTO `terms` VALUES ('33', '笑话');
REPLACE INTO `terms` VALUES ('34', '冷笑话');
REPLACE INTO `terms` VALUES ('35', '短笑话');
REPLACE INTO `terms` VALUES ('36', '经典语录');
REPLACE INTO `terms` VALUES ('37', '情感语录');
REPLACE INTO `terms` VALUES ('38', '人生感悟');
REPLACE INTO `terms` VALUES ('39', '正能量语录');
REPLACE INTO `terms` VALUES ('40', '心灵鸡汤');
REPLACE INTO `terms` VALUES ('41', '名人名言');
REPLACE INTO `terms` VALUES ('42', '短句子');
REPLACE INTO `terms` VALUES ('43', '优美句子');
REPLACE INTO `terms` VALUES ('44', '诗词名句');
REPLACE INTO `terms` VALUES ('45', '小故事');
REPLACE INTO `terms` VALUES ('46', '幽默故事');
REPLACE INTO `terms` VALUES ('47', '打油诗');
REPLACE INTO `terms` VALUES ('48', '顺口溜');
REPLACE INTO `terms` VALUES ('49', '极品图');
REPLACE INTO `terms` VALUES ('50', '搞笑改歌词');
REPLACE INTO `terms` VALUES ('51', '网购神评论');
REPLACE INTO `terms` VALUES ('52', '搞笑微博');

-- 关联(收藏，评论)
drop table if exists links;
CREATE TABLE `links` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,       -- lid
  `joke_id` int(11) NOT NULL,                  -- 内容id
  `user_id` int(11) NOT NULL,                  -- 用户id(谁写的)
  `link_id` int(11) NOT NULL,                  -- 用户id(谁来评论或者收藏的)
  `date` datetime NOT NULL DEFAULT now(),      -- 创建时间
  `status` tinyint(4) NOT NULL DEFAULT '1',    -- 状态 0 待审核 1 审核通过 2 删除 
  `comment` varchar(4096) DEFAULT NULL,        -- 内容
  `type` tinyint(4)  NOT NULL DEFAULT '0',     -- 类型 0 收藏 1 评论
  PRIMARY KEY (`lid`)
);