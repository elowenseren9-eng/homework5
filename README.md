# 软件开发综合实践·第五次作业

本仓库包含一个课堂案例和一个自主实践项目，均使用原生 HTML、CSS、JavaScript 完成，不依赖外部框架或网络资源。

## 项目入口

- `todo-app/index.html`：交互式任务清单案例，支持添加、完成切换、删除、筛选与 `localStorage` 持久化。
- `manager-app/index.html`：云南旅行收藏夹，支持添加、编辑、删除、查询、刷新恢复、JSON 导出和存储容量实验。

建议在仓库根目录通过本地 Web 服务器访问：

```powershell
python -m http.server 8005
```

然后打开：

- <http://localhost:8005/todo-app/>
- <http://localhost:8005/manager-app/>

## 完成情况

| 类别 | 完成内容 |
|---|---|
| 必做案例 | 添加、完成状态、删除、全部/进行中/已完成筛选、刷新持久化 |
| 自主实践 | 6 个信息字段、统一状态数组与渲染、完整增删改查、输入校验、刷新持久化 |
| 选做 1 | 使用父容器单监听器完成事件委托，并记录重构前后差异 |
| 选做 2 | 使用 `Blob`、`URL.createObjectURL()`、`URL.revokeObjectURL()` 导出 JSON |
| 选做 3 | 主动触发存储配额上限，捕获 `QuotaExceededError`，显示友好提示并清理临时数据 |
| 质量检查 | 桌面/移动端响应式检查、控制台与资源错误检查、恶意字符串安全渲染检查 |

详细研究记录位于 [`research`](research) 目录，自动测试结果见 [`TESTING.md`](TESTING.md)。

## Git 提交设计

案例严格分为教师要求的三个提交；自主实践按添加、编辑/删除/查询、持久化与三个选做项逐步提交。可运行：

```powershell
git log --oneline --reverse
```

查看完整过程。

## 数据与安全说明

- 两个应用使用不同的 `localStorage` 键，不会相互覆盖。
- 所有用户输入均通过 DOM 的 `textContent` 显示，没有拼接进 `innerHTML`。
- 容量实验只使用临时键，并在 `finally` 中清理，不删除用户的收藏数据。
- 如果本地数据损坏或存储失败，页面会捕获异常并给出可读提示。
