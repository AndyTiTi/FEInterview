# 第一章

## git pull 和 git fetch 的区别

1. 先谈谈 git fetch:远程跟踪分支已更新(Git 术语叫做 commit)，需要将这些更新取回本地，这时就要用到 git fetch 命令。

```js
// 对于git fetch具体用法，上面的链接的文章里有链接，所以在这里只讲常用的方法<br>
// 更新所有分支，命令可以简写为：
git fetch
// 上面命令将某个远程主机的更新的信息，全部取回本地。默认情况下，git fetch取回所有分支的更新。
// 如果只想取回特定分支的更新，可以指定分支名,如下所示
git fetch origin name branchname
// 比如，取回origin主机的master分支
git fetch origin master
```

2. git merge 命令用于将两个或两个以上的开发历史加入(合并)一起

`git merge dev` 命令的意思是将 dev 分支与当前所在的分支进行合并

3. git pull 命令的作用是：取回远程主机某个分支的更新，再与本地的指定分支合并

`git pull <远程主机名> <远程分支名>:<本地分支名>`

比如，要取回 origin 主机的 next 分支，与本地的 master 分支合并，需要写成下面这样`git pull origin next:master`

一般我们都会直接写`git pull`

这是因为当你本地的分支和你远程的分支是唯一的追踪分支的关系的话，可以省略后面的参数，相当于在本地的 master 分支上，`git pull origin next:master`

对于 git pull 的理解你可以看成是执行了 git fecth 和 git merge，git fetch 是将远程仓库代码更新的信息，同步到本地，git merge 是通知本地的分支要更新，也就是合并远程分支完成更新

## git reset 和 git revert 的区别？

### reset 介绍

[如果你还不会用 git 回滚代码，那你一定要来看看](https://juejin.cn/post/7046720828901163016)
[GIT 原理详解及实用指南 - 掘金小册](https://www.freesion.com/article/90361122641/)

1. reset 的作用是当你希望提交的 commit 从历史记录中完全消失就可以用
2. 比如你在 master 分支提交了 A-->B-->C 提交了三个记录，这个时候如果 C 记录有问题你想回滚到 B 就可以用 git reset 进行
3. 这个命令大概率的情况都是用在我们主分支的，因为我们上线的分支一般是 master 分支然后从 develop 进行功能开发
4. 开发完成之后将分支合并到 master，如果在上线之前发现合并的分支用问题可以将 develop 合并过来的分支进行回滚
5. 说白了就是取消 develop 的本次合并
6. 但是有一种情况就是协作开发的时候大家都合并到 master 之后就不能用 reset 强行回滚 commit 因为这样会把其他人的提交记录给冲掉，这时候就可以用 revert 来进行操作我们在下面说

### revert 介绍

1. revert 的原理是，在当前提交后面，新增一次提交，抵消掉上一次提交导致的所有变化。它不会改变过去的历史，所以是首选方式，没有任何丢失代码的风险
2. revert 可以抵消上一个提交，那么如果想要抵消多个需要执行 git revert 倒数第一个 commit id 倒数第二个 commit
3. 这个就常用于当你提交了一次 commit 之后发现提交的可能有问题就可以用到 revert
4. 还有一种情景是已经有很多人提交过代码，但是想改之前的某一次 commit 记录又不想影响后面的也可以使用 revert，他会把你后面提交的记录都放到工作区只是合并的时候需要注意一点

### commit 记录打 tag

> 在上线之前我们需要对当前的 commit 记录打一个 tag 方便上线的代码有问题可以及时回滚

**我们来介绍一下常用的几个命令**

1. git tag 列出所有的 tag 列表

2. 创建一个 tag，使用 git tag [name],我们新增一个 git tag 测试 4,在使用 git tag 查看一下

3. 查看 tag 对应的 commit 信息，git show [tag 名字]，举个例子 git show 测试 1,上线之后如果有问题我们就可以根据 下图的 commit id 进行代码回滚

## git merge 和 git rebase 的区别？

[冲突还在用 git merge 吗？互联网公司都用 git rebase](https://juejin.cn/post/7001409038307033119)
目的都是将一个分支的 commit 合并到到另外一个分支中去

`git pull = git fetch + git merge`

2. git rebase
   如果我们此时采用 git pull --rebase (git fetch + git rebase)
   **merge 的区别在于，rebase 不会产生分支，并且也不会产生新的提交**
