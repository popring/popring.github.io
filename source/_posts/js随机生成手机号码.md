---
title: js随机生成手机号码
date: 2019-03-10 13:32:49
tags:
- demo
categories:
- JavaScript
---



简单标识：

1-3 网络识别号

4-7 - 地区编码

8 - 11 用户号码

<!-- more -->

## 号码段：

> 中国电信号段
>
> 133、149、153、173、177、180、181、189、191、199
>
> 
>
> 中国联通号段
>
> 130、131、132、145、155、156、166、171、175、176、185、186
>
> 
>
> 中国移动号段
>
> 134(0-8)、135、136、137、138、139、147、150、151、152、157、158、159、172、178、182、183、184、187、188、198
>
> 
>
> ### 其他号段
>
> 14号段以前为[上网卡](https://baike.baidu.com/item/%E4%B8%8A%E7%BD%91%E5%8D%A1/2807977)专属号段，如[中国联通](https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E8%81%94%E9%80%9A)的是145，[中国移动](https://baike.baidu.com/item/%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8)的是147等等。
>
> [虚拟运营商](https://baike.baidu.com/item/%E8%99%9A%E6%8B%9F%E8%BF%90%E8%90%A5%E5%95%86)
>
> 电信：1700、1701、1702、162
>
> 移动：1703、1705、1706、165
>
> [联通](https://baike.baidu.com/item/%E8%81%94%E9%80%9A)：1704、1707、1708、1709、171、167
>
> [卫星通信](https://baike.baidu.com/item/%E5%8D%AB%E6%98%9F%E9%80%9A%E4%BF%A1)：1349



归属地随机 数据太多，暂时没有想到解决的办法。

```js
// MAC 网络识别号
// 中国电信
var TELECOM = [133, 149, 153, 173, 177, 180, 181, 189, 191, 199];
// 联通
var UNICOM = [130, 131, 132, 145, 155, 156, 166, 171, 175, 176, 185, 186];
// 中国移动
var MOBILE = [134, 135, 136, 137, 138, 139, 147, 150, 151, 152, 157, 158, 159, 172, 178, 182, 183, 184, 187, 188, 198];

console.log(generate());


function generate(){
    var operator = ['TELECOM', 'UNICOM', 'MOBILE'];
    // 随机选择手机号码
    var mac = MOBILE[Math.floor(Math.random()*MOBILE.length)].toString();

    var area = '5210';
    
    var num = ranNum(4).join('');

    var phone = mac + area + num;
    return phone;
}

// 地区编码
function area(areaName) {
    // TODO
}

// 用户号码
function ranNum(len) {
    len = len ? len : 1;
    var arr = [];
    for (var i = 0; i < len; i++) {
        var ran = parseInt(Math.random()*10);
        arr.push(ran);
    }
    return arr;
}
```



### 参考

[手机号码 百度百科](https://baike.baidu.com/item/%E6%89%8B%E6%9C%BA%E5%8F%B7%E7%A0%81/1417348?fr=aladdin#1)