---
title: leetcode-70.爬楼梯
date: 2020-11-08 11:13:40
tags: 算法
categories: 算法
---



假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

注意：给定 n 是一个正整数。

示例 1：

输入： 2
输出： 2
解释： 有两种方法可以爬到楼顶。

1.  1 阶 + 1 阶
2.  2 阶
示例 2：

输入： 3
输出： 3
解释： 有三种方法可以爬到楼顶。

1.  1 阶 + 1 阶 + 1 阶
2.  1 阶 + 2 阶
3.  2 阶 + 1 阶

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/climbing-stairs
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

---

<!-- more -->



## 递归

> 实测，这个会超时
>
> 时间复杂度：O(n^2)
>
> 空间复杂度：O(n)

```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
    if(n<=3) return n
    return climbStairs(n-1) + climbStairs(n-2)
};
```



## 递归缓存（记忆化递归）

> 时间复杂度：O(n)
>
> 空间复杂度：O(n)

```js
/**
 * 递归缓存
 * @params {Array} steps 
 * @return {number}
 */
var climbStairsMemo = function (steps, n) {
    if (steps[n] > 0) {
        return steps[n]
    } else if (n === 1 || n === 2) {
        steps[n] = n
    } else {
        steps[n] = climbStairsMemo(steps, n - 1) + climbStairsMemo(steps, n - 2)
    }
    return steps[n]
}

/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
    let steps = new Array(n).fill(0)
    return climbStairsMemo(steps, n)
};
```



## 动态规划

> 时间复杂度：O(n)
>
> 空间复杂度：O(n)

```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
    let steps = []
    steps[1] = 1
    steps[2] = 2

    for (let i = 3; i <= n; i++) {
        steps[i] = steps[i-1] + steps[i-2]
    }
    return steps[n]
};
```



## 动态规划优化版（斐波那契数列）

> 时间复杂度：O(n)
>
> 空间复杂度：O(1)

```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
    let first = 1, second = 2, res = 0

    if(n<=2) return n

    for (let i = 3; i <= n; i++) {
        res = first + second
        first = second
        second = res
    }
    return res
};
```

