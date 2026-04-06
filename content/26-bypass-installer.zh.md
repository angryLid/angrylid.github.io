---
title: 绕过应用包安装器
slug: bypass-installer
created-time: 2024-05-29
updated-time: 2026-04-06
tags: ["备忘", "Notion"]
---
# 绕过应用包安装器

在 ColorOS 16 上只需要下面两行命令就可以回退到原生的安全器

禁用安全管家：
`adb shell pm disable-user com.coloros.phonemanager`

禁用软件安装器：
`adb shell pm disable-user com.oplus.appdetail`


<details>
<summary>以下是原文</summary>

## 去腥法

1. 从 Google 网站下载 Debug 包
   - [Compatibility Test Suite downloads | Android Open Source Project](https://source.android.google.cn/docs/compatibility/cts/downloads)
   - 下载对应 Android 版本的「Android 14 R4 CTS 验证程序 - ARM」
   - 解压缩，安装其中的 *CrossProfileTestApp.apk* 并安装

2. 打开 *CrossProfileTestApp*
   - 单击唯一的按钮，可能会闪退，不用管
   - 重启

3. 此时安装应用包就会调用原生的安装器，同时也会另一些其他功能退化到原生，类似于「关闭MIUI 优化」，比较显著的副作用就是设置里面的「权限与隐私」会退化到原生。

4. （可选）
   - 将*手机管家*这个包停用
   - 卸载 *CrossProfileTestApp*
   - 重启

5. 然后脑残安装器又回来了，此时会有以下两种表现：
   - 断网情况，安装前不进行任何扫描，但是安装时需要验证锁屏密码（可以改为生物解锁）
   - 联网情况，似乎仍然会进行检测，检测结束后无需验证密码
   - 网友分析这里是有双重检测，只停用手机管家属于阉割不干净

## 提权法

1. 从 Github releases 下载 Shizuku 并安装
2. 按照指引通过网络 adb 授权
3. 利用 Shizuku 给安装狮或者 R 安装套件提权，替换掉系统的应用包安装器
4. 设备重启以后需要重新授权 adb，所以用 su 给 Shizuku 提权才会有比较好的舒适度


</details>