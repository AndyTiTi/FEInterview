---
title: 第一章
---

## 删除 Jenkins 构建历史

```shell
def jobName = "deploy-react"
def job = Jenkins.instance.getItem(jobName)
job.getBuilds().each { it.delete() }
job.nextBuildNumber = 1
job.save()
```
