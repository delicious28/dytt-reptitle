# dytt-reptitle-v2

>dytt8.net reptile

[![npm](https://img.shields.io/badge/npm-v1.0.3-brightgreen.svg)](https://www.npmjs.com/package/dytt-reptitle-v2)

[![NPM](https://nodei.co/npm/dytt-reptitle-v2.png?downloads=true&stars=true)](https://nodei.co/npm/dytt-reptitle-v2)

## Tip 
[原作者项目地址](https://github.com/HuangXiZhou/dytt-reptitle)  

本版本是Fork原作者过来的,我发现这个版本有bug时,已经提交了PR给原作者,但原作者一直没有处理,可能是没有时间吧。所以我修复后更新了一个新的包。感谢原作者[HuangXiZhou](https://github.com/HuangXiZhou)的贡献。  
  
1.修复了设置page无效的bug  
2.修复了获取的链接不是真正的下载链接的bug  
3.增加了跳页(skip)扒取数据的功能  

## Demo
[Demo请勿商用](http://www.zi-yuan.club)

## Install

```bash
npm install dytt-reptitle-v2
```

## Usage

```js
const dyttReptitle = require('dytt-reptitle-v2');
dyttReptitle().then(res => {
  // do what you want...
});
```

## Configure

```js
// example
const config = {
  page: 1,
  skip: 0,
  include: [ 'title', 'imgUrl', 'desc', 'downloadLink', 'descPageLink' ]
};

dyttReptitle(config).then(res => {
  // do what you want...
});
```

### config

| param | Description | Type | Required
| --- | --- | --- | --- |
| page | crawl page number | Number | true |
| skip | skip page number | Number | false |
| include | needed data | Array | false |

### include

| param | Description | Type | Required
| --- | --- | --- | --- |
| title | movie title | String | false |
| imgUrl | movie poster | String | false |
| desc | movie description | String | false |
| downloadLink | movie download link | String | false |
| descPageLink | movie description page link | String | false |

### Response example

```js
[{ title: '2018年悬疑《拉普拉斯的魔女》BD日语中字',
  imgUrl: 'https://extraimage.net/images/2018/12/04/103eda9e26f1028d9cc99f4a10c84b83.jpg',
  downloadLink: 'ftp://ygdy8:ygdy8@yg45.dydytt.net:8363/阳光电影www.ygdy8.com.拉普拉斯的魔女.BD.720p.日语中字.mkv',
  descPageLink: 'https://www.dytt8.net/html/gndy/dyzz/20181204/57892.html'
}]
```

## Uninstall

```bash
npm uninstall dytt-reptitle-v2
```

## License

MIT
