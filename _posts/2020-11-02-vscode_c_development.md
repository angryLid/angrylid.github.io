---
layout:post
title:使用VSCode开发C语言
---

## 安装相应软件和扩展

- VSCode [软件主页](https://code.visualstudio.com/) 
- 官方C/C++ 扩展 
- gcc 我习惯用 [MinGW-w64](http://mingw-w64.org/doku.php)

## 写一个简单C程序

1. 找一个地方写两行代码，类似：

   ```c
   #include <stdio.h>
   
   int main(int argc, char const *argv[])
   {
   	printf("Hello, VSCode!\n");
   	return 0;
   }
   
   ```

2. 自动生成配置文件，依次选择

   - Run
   - Start Debugging
   - C++(GDB/LLDB)
   - 随缘选一个

3. 自动生成的配置文件如下：
   - launch.json 是调试程序的配置
   - tasks.json 是编译文件的配置

4. 接着你可以

   - 使用Terminal - Run Build Task... 或快捷键Ctrl + Shift + B 对文件进行编译
   - 使用Run - Start Debugging 或快捷键F5 进行断点调试

**小技巧：可以Watch ```*nums@5```来查看数组



## 编译多个文件

可以编写Makefile 然后修改tasks.json中的command和args字段