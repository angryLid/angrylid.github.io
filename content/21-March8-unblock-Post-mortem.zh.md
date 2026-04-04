---
title: 三八解锁节事件复盘
slug: March8-unblock-Post-mortem
created-time: 2026-04-04
---
# 三八解锁节事件复盘

> [!NOTE]
> 在撰写本文过程中使用了 AI 进行事实核查。

让我用最直白，最通俗，不绕弯的方式跟你讲清楚。

## 起因

3 月 8 日，社区传来喜讯，凡是系统安全补丁早于 2026 年 2 月，且搭载高通骁龙 8Elite Gen5 的小米手机，包括

- 小米 17 Ultra 徕卡版
- 小米 17 Ultra 
- 小米 17 Pro Max
- 小米 17 Pro
- 小米 17 
- 红米 K90 Pro Max

均可绕开官方限制，使用一键脚本实现解锁 BootLoader。[^link]

尽管在 Gemini 和 Grok 的帮助下，我对很多概念细节依然一知半解。不过大抵可以确定是下面三个漏洞环环相扣，引爆了这次事故。

## 原理
### 漏洞 1

引导程序 `GBL` 的 `efisp` 分区校验漏洞。

搭载高通骁龙 8Elite Gen5 这枚芯片的手机有个新加入的 `GBL` 启动阶段，但是高通却没有为其使用标准的签名校验。

所以通过 EDL 模式，或者用热风枪把芯片吹下来，即可把修改后的 `efi` 烧录进 `efisp` 分区，以实现解锁 BootLoader. [^2]

目前找到最早的 PoC 发布于 3 月 4 日[^1]。
### 漏洞 2

小米系统服务权限 `miui.mqsas.IMQSNative` 存在小米留的后门，可以用 `root` 身份来执行任何命令。

社区较早就意识到这个功能存在，然而由于 `SELinux` 限制，此进程访问不了块设备，也不可以刷写 `efisp` 分区。

### 漏洞 3

`fastboot` 指令注入漏洞。

因为 `fastboot oem` 没做参数校验[^3]，可以把 `SELinux` 设置为宽容后启动。

```bash
fastboot oem set-gpu-preemption 0 androidboot.selinux=permissive
fastboot continue
```

故而激活了前两个漏洞，使得下面命令得以成功运行，实现解锁BL

```bash
adb shell service call miui.mqsas.IMQSNative 21 i32 1 s16 "dd" i32 1 s16 "if=/data/local/tmp/gbl of=/dev/block/by-name/efisp" s16 "/data/mqsas/log.txt" i32 60
```


## 余波

尽管非 8Elite Gen5 芯片的手机依旧不能利用漏洞 1解锁，但安全补丁在2026 年 1 月以及之前的手机都有可能把 `SELinux` 设为宽容，再利用 `KernelSU` 最新的越狱模式获得临时root 权限。

- 实测 小米 14 Ultra 安全补丁2026 年 1 月 可行
- 实测 一加 Ace3V 安全补丁2026 年 1 月 可行
- 社区反馈 vivo/iQOO 由于屏蔽了 `fastboot continue` 不可行

### 局限性
尽管这种临时 root 权限赋予了用户完整的 `/data` 分区读写，以及调节 CPU 和充电策略等权限。

不过因为 `dm-verity` 机制的存在，不可以修改 `/system` 或 `/vendor` 等分区，否则会导致手机变砖。

由于 `ZygiskNext` 必须在 boot 早期注入 init 进程，所以也不可用。小米设备可以尝试用这个项目[^fix]修补。


[^1]: [Unlocking qualcomm bootloader via gbl exploit ](https://github.com/kasnria001/qualcomm_gbl_exploit_poc)
[^2]: [小米解锁BL 小米17ProMax/红米K90ProMax解锁BL方法已开源](https://www.bilibili.com/video/BV1YxPBz9E3B)
[^3]: [参数校验的补丁](https://git.codelinaro.org/clo/la/abl/tianocore/edk2/-/commit/fb8e864254cdc370670233e3cb73a2b18ff33c9f)
[^fix]: [小米免解bl的ksu+lsp方案](https://github.com/xunchahaha/mi_nobl_root)
