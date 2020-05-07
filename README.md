
最近以双鸭山大佬的 Auto Piano 为基础做了一款钢琴类web应用，名字定为键盘（Clavier）。Clavier 选自 Bach 的 Well-tempered Clavier，键盘不仅仅是计算机的键盘⌨️，也可以是乐器的键盘🎹，是一款丰富输入体验的服务设计试水项目。

此文权当作该项目的总结和分享~

## 项目简介


[![Watch the video](https://github.com/MysteriousMing/Clavier/blob/master/Vimeo/Screen%20Shot%202019-10-13%20at%2019.58.36.png)](https://vimeo.com/337214345)

体验地址：https://mysteriousming.github.io/Clavier/#/

项目演示：https://vimeo.com/337214345

项目说明：https://www.suncreativesolution.com/#/project/clavier


架构来源于双鸭山大佬的auto piano。

双鸭山大佬原项目，真的特别出色：

![autopiano.png](https://user-gold-cdn.xitu.io/2019/4/1/169d81ff4a11e634?w=1318&h=850&f=png&s=579420)

> 体验地址： http://crystalworld.gitee.io/qpiano/#/

> 项目地址： https://github.com/WarpPrism/AutoPiano

## 玩法

基于英语的字母使用频率和字母组合（如 th，er，in，ed 等）的使用频率，设计音名与字母之间的对应关系，使之听起来较为符合某一种特定的音乐风格。在输入框中直接进行英文输入，即可随输入听到相应音乐。

目前提供了四种音乐风格可供选择，分别是古典与浪漫时期的 Major Scale，印象派的 Whole Tone Scale（这个用起来真的有 Debussy 的味道），现代主义中代表大佬 Schoenberg 的 Chromatic Scale，和远东风格的 Pentatonic Scale。


## 钢琴界面效果

在大佬的基础上稍微修改了 CSS

codepen上也有很多这样的例子供参考，不一定采用上述实现：

https://codepen.io/search/pens?q=piano&page=1&order=popularity&depth=everything

相信只要合理地控制css变量和数值，大家能做出更好的 Piano 界面。

## 下一步计划

1. 播放已经输入的段落；
2. 在播放功能实现的基础上，根据单词长度调节 meters，使之更符合对应的音乐风格。

## 欢迎贡献协作

> FORK时，请遵循GPL开源协议。

## 最后

> 最后再贴一下体验地址： https://mysteriousming.github.io/Clavier/#/

欢迎体验，分享。

如果下一步计划没有继续实施，那一定是因为摸太多鱼导致毕设不过延毕了。希望蟹老板不要打死我。

再次感谢双鸭山大佬 晶体世界～

## CHANGELOG
更新了 github actions 的自动打包。

