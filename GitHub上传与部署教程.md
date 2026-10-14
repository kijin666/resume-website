# GitHub 上传与部署完整教程

> 适用对象：本项目（`resume-website`）的完整上线流程。
> 全程只需要复制粘贴命令，每一步都写了「应该看到什么」和「出错了怎么办」。
> 对应课程目录：**1-1 打开 CMD → 1-2 用 Trae IDE 打开项目 → 1-3 新建 GitHub 仓库并推送 → 1-4 CI/CD 部署 → 1-5 手动启动 actions → 1-6 修改源文件 → 3- CI/CD 再次部署**。

---

## 目录

- [第 0 步 · 准备：安装 Git 并配置身份](#第-0-步--准备安装-git-并配置身份)
- [第 1 步 · 在 GitHub 上创建仓库](#第-1-步--在-github-上创建仓库)
- [第 2 步 · 本地初始化并推送代码](#第-2-步--本地初始化并推送代码)
- [第 3 步 · 开启 GitHub Pages（CI/CD 自动部署）](#第-3-步--开启-github-pagescicd-自动部署)
- [第 4 步 · 查看 Actions 运行结果并访问网站](#第-4-步--查看-actions-运行结果并访问网站)
- [第 5 步 · 日常维护：改完文件怎么再次部署](#第-5-步--日常维护改完文件怎么再次部署)
- [用 Trae IDE 完成同样的操作（更省事）](#用-trae-ide-完成同样的操作更省事)
- [常见报错与解决办法](#常见报错与解决办法)
- [命令速查表](#命令速查表)
- [作业提交清单](#作业提交清单)
- [附：用 Surge 部署（参考 Week04）](#附用-surge-部署参考-week04)

---

## 第 0 步 · 准备：安装 Git 并配置身份

### 0.1 检查是否已安装 Git

按 `Win + R` → 输入 `cmd` → 回车，打开命令提示符，输入：

```cmd
git --version
```

- 如果显示 `git version 2.4x.x` → 已安装，跳到 0.3；
- 如果提示 `'git' 不是内部或外部命令` → 继续 0.2 安装。

> ✅ **本机当前状态（已由我确认）**：Git **2.55.0** 已安装完成（路径 `C:\Program Files\Git\cmd\git.exe`），
> 提交身份也已配置好（`user.name=kijin666`、`user.email=xing_070604@qq.com`）。
> 所以下面的 0.1~0.3 你已经可以跳过，直接从**第 1 步**开始。

### 0.2 安装 Git（Windows 推荐两种方式）

**方式 A：winget 一行命令（最快，Win10/11 自带）**

在 **管理员** CMD 或 PowerShell 里执行：

```powershell
winget install --id Git.Git -e --source winget
```

**方式 B：官网下载安装包（最稳）**

1. 打开 <https://git-scm.com/download/win>，下载 64 位安装包；
2. 双击安装，全部保持默认，一路 `Next` 到最后 `Install`；
3. 安装完成后**必须重新打开 CMD**（旧窗口读不到新的环境变量），再次执行 `git --version` 验证。

### 0.3 配置提交身份（只做一次）

Git 需要知道「这次提交是谁做的」：

```cmd
git config --global user.name "你的名字或GitHub昵称"
git config --global user.email "你的GitHub注册邮箱"
```

检查是否配置成功：

```cmd
git config --global --list
```

应该能看到 `user.name=...` 和 `user.email=...` 两行。

### 0.4 注册 GitHub 账号（已有则跳过）

1. 打开 <https://github.com/> → 右上角 `Sign up`；
2. 用户名建议用英文+数字（例如 `lisi2025`），它会出现在你的网址里；
3. **邮箱必须验证**，否则无法部署 Pages。

---

## 第 1 步 · 在 GitHub 上创建仓库

1. 登录 GitHub，点右上角 `+` → `New repository`（或直接访问 <https://github.com/new>）。
2. 按下表填写：

| 字段 | 填写内容 | 说明 |
| --- | --- | --- |
| Repository name | `resume-website` | 必须和本地文件夹名一致，方便对照 |
| Description | 个人网页简历 - 前端课程作业 | 可选 |
| Public / Private | **选 Public** | Private 仓库用免费账号无法发布 Pages |
| Add a README file | **不要勾选** | 本地已有文件，勾选会导致推送冲突 |
| Add .gitignore | **None** | 项目里已经自己写了 |
| Choose a license | None | 可选 |

3. 点 `Create repository`。
4. 创建完成后页面会显示仓库地址，形如：

```
https://github.com/你的用户名/resume-website.git
```

📌 **把这个地址记下来**，第 2 步要用。如果仓库里显示的是一片「quick setup」教程，说明仓库是空的——这正是我们想要的状态。

---

## 第 2 步 · 本地初始化并推送代码

### 2.1 打开项目目录的 CMD（课程里的「管理员打开 CMD」）

**方法一（推荐）**：在文件资源管理器里进入 `C:\Users\20461\Desktop\resume-website`，在地址栏输入 `cmd` 后回车 —— 会直接在这个目录打开 CMD。

**方法二**：打开 CMD，手动切换盘符和目录：

```cmd
cd /d "%USERPROFILE%\Desktop\resume-website"
dir
```

`dir` 应该能看到 `index.html`、`css`、`js`、`assets`、`.github`、`README.md`。**如果看不到这些文件，说明目录不对，后面全部会失败。**

### 2.2 初始化仓库并做第一次提交

> ✅ 这一步**你已经完成了**（本地仓库已初始化，第一次提交为 `first commit: 个人网页简历（幸锦鸿）初始版本`，共 11 个文件）。
> 只有在**换电脑、重装系统、或者想重新做一遍**时才需要执行下面的命令。

按顺序执行（一行一行来，不要一次全贴）：

```cmd
git init
git add .
git commit -m "first commit: 个人网页简历初始版本"
git branch -M main
```

每步的预期输出：

| 命令 | 你应该看到 |
| --- | --- |
| `git init` | `Initialized empty Git repository in .../.git/` |
| `git add .` | 无输出（正常） |
| `git commit -m "..."` | `7 files changed, xxx insertions(+)` 之类的统计 |
| `git branch -M main` | 无输出（把主分支名统一成 main） |

> ❗ 如果 `git commit` 报错 `Please tell me who you are`，说明第 0.3 步没配置好，回去配置再执行一次 `git commit`。

### 2.3 关联远程仓库并推送

把下面的 `你的用户名` 换成自己的 GitHub 用户名：

```cmd
git remote add origin https://github.com/你的用户名/resume-website.git
git push -u origin main
```

**第一次推送会弹出登录窗口**，两种认证方式二选一：

- **方式一（推荐）**：弹窗里选 `Sign in with your browser`，浏览器里点授权即可；
- **方式二（Token）**：GitHub 网页 → 右上角头像 → `Settings` → 左侧最下 `Developer settings` → `Personal access tokens` → `Tokens (classic)` → `Generate new token (classic)` → 勾选 `repo` → 生成后**立刻复制**（只显示一次）。
  推送时：
  - `Username`：你的 GitHub 用户名
  - `Password`：**粘贴刚才的 Token**（不是账号密码！GitHub 早就禁止用密码推送了）

推送成功的标志：

```
Writing objects: 100% (...), done.
branch 'main' set up to track 'origin/main'.
```

刷新 GitHub 仓库页面，应该能看到 `index.html` 等文件了 —— 这一步就等于课程里的「新建 GitHub 仓库并推送 git」。

---

## 第 3 步 · 开启 GitHub Pages（CI/CD 自动部署）

本项目已经内置了工作流文件 `.github/workflows/deploy.yml`，只要在仓库里打开开关即可。

1. 进入仓库页面 → 顶部 `Settings`（设置）；
2. 左侧菜单找到 `Pages`；
3. 在 **Build and deployment → Source** 下拉框里选择 **`GitHub Actions`**（不要选 `Deploy from a branch`）；
4. 不需要点保存，选完即生效。

![设置路径示意] Source: Settings → Pages → Source → GitHub Actions

> 说明：本项目采用 **GitHub Actions 部署**，好处是提交即上线、可看到构建日志、可以随时手动重跑，这正是课程里 CI/CD 的要求。
>
> 如果你更想用传统方式：把 Source 选成 `Deploy from a branch` → Branch 选 `main` + `/ (root)` → `Save`，也能访问，但不会走 Actions 流程，课程要求的 CI/CD 环节就拿不到分了。

---

## 第 4 步 · 查看 Actions 运行结果并访问网站

### 4.1 看工作流有没有跑起来

1. 回到仓库页面 → 点顶部 **`Actions`** 标签；
2. 左侧会看到 `Deploy to GitHub Pages`，右侧是最新一次运行；
3. 状态说明：
   - 🟡 黄点 = 正在运行（一般 30~60 秒）；
   - ✅ 绿勾 = 部署成功；
   - ❌ 红叉 = 失败，点进去看红色步骤的日志（常见原因见下文 FAQ）。

### 4.2 手动启动一次（课程 1-5 步「手动启动 actions」）

即使没有新的提交，也可以手动跑：

`Actions` → 左侧选 `Deploy to GitHub Pages` → 右侧 `Run workflow` 按钮 → 分支选 `main` → 绿色 `Run workflow` 确认。
几秒后刷新页面，就会看到多出一条运行记录（提交说明会显示你刚才填的内容）。

### 4.3 拿到你的网址

部署成功后，网址固定为：

```
https://你的用户名.github.io/resume-website/
```

也可以从这些地方查到：`Settings → Pages` 页面顶部会显示 `Your site is live at ...`；或 `Actions → 最新一次运行 → deploy 任务 → 页面右下角 url`。

### 4.4 把网址填回简历里

打开 `index.html`，把两处示例地址换成真实地址（否则访客点「在线预览」会跳到不存在的页面）：

```html
<a href="https://你的用户名.github.io/resume-website/" target="_blank">在线预览 ↗</a>
```

改完记得再提交推送一次（见第 5 步）。

> ⚠️ 常见 404 原因：① 刚部署完，等 1~2 分钟再刷新；② 访问时**多写/少写了仓库名**；③ 仓库是 Private。

---

## 第 5 步 · 日常维护：改完文件怎么再次部署

以后任何一次修改（改简历内容、加项目、调颜色）都只需要三条命令：

```cmd
cd /d "%USERPROFILE%\Desktop\resume-website"
git add .
git commit -m "更新：新增 Vue 项目经历"
git push
```

推送后 GitHub Actions 会自动重新部署，约 30 秒后打开网址即可看到新内容（浏览器按 `Ctrl + F5` 强制刷新，避免缓存）。**这就是 CI/CD 的价值：你只管提交，部署交给流水线。**

查看本次改了哪些文件、有没有漏掉：

```cmd
git status
git log --oneline -5
```

如果提交写错了想改掉最后一条说明：

```cmd
git commit --amend -m "新的提交说明"
```

### 撤销与回滚（了解即可）

| 场景 | 命令 |
| --- | --- |
| 改乱了某个文件，想恢复成上次提交的样子 | `git checkout -- index.html` |
| 已经 `git add` 但还没提交，想撤销暂存 | `git reset HEAD index.html` |
| 想回退到上一个版本（保留改动） | `git reset --soft HEAD~1` |

---

## 用 Trae IDE 完成同样的操作（更省事）

对应课程 **1-2 使用 Trae IDE 打开项目**：

1. 打开 Trae IDE → `文件 → 打开文件夹` → 选择 `桌面/resume-website`；
2. 左侧会看到完整目录树，直接点开 `index.html` 修改；
3. 右侧 `源代码管理`（Git）面板：
   - 如果提示「初始化仓库」，点一下即可（等价于 `git init`）；
   - 在消息框写提交说明 → 点 `✓ 提交`（等价于 `git commit`）；
   - 点 `...` → `推送`（等价于 `git push`）；
   - 也可以点 `发布分支 / Publish Branch` 让 IDE 帮你创建 GitHub 仓库并推送。
4. 推荐装一个 **Live Server** 插件：右键 `index.html → Open with Live Server`，改代码浏览器自动刷新，比手动刷快得多。

> 💡 IDE 只是把命令图形化了，**推荐至少手动跑通一次第 2、5 步的命令**，面试和课程答辩都会被问到。

---

## 常见报错与解决办法

| 报错信息 | 原因 | 解决 |
| --- | --- | --- |
| `'git' 不是内部或外部命令` | 未安装 Git 或安装后没重开 CMD | 回到 0.2 安装，然后**重新打开** CMD |
| `Please tell me who you are` | 没配 user.name / user.email | `git config --global user.name/email` 配置一次 |
| `remote origin already exists` | 之前加过远程地址 | `git remote set-url origin 新地址`，或先 `git remote remove origin` |
| `src refspec main does not match any` | 还没提交，或分支不叫 main | 先 `git add . && git commit`，再 `git branch -M main` |
| `failed to push some refs / rejected` | 远程有本地没有的提交（例如创建仓库时勾了 README） | `git pull --rebase origin main` 后再 `git push` |
| 弹窗登录后仍提示 `Authentication failed` | 用了账号密码 | 改用浏览器登录或 Personal Access Token |
| `Support for password authentication was removed` | 同上 | 用 Token 当密码 |
| Actions 红叉：`Get Pages site failed` | Pages 的 Source 没选 GitHub Actions | 回到第 3 步重新设置 |
| Actions 红叉：`Resource not accessible by integration`（Create Pages site failed） | 仓库还没开启 Pages，而 `GITHUB_TOKEN` 无权替你创建 Pages 站点 | **必须由仓库所有者手动开启一次**：Settings → Pages → Source 选 `GitHub Actions`。这一步无法自动化 |
| Actions 红叉：`Resource not accessible by integration` | 权限不足 | 确认 `deploy.yml` 里的 `permissions:` 三行没有被删掉；`Settings → Actions → General → Workflow permissions` 选 `Read and write permissions` |
| 网站打开是 404 | ① 还没部署完 ② 网址写错 ③ 仓库 Private | 等 2 分钟；核对 `用户名.github.io/仓库名/`；把仓库改成 Public |
| 网页打开只有文字没有样式 | `css/js/assets` 路径错了或没上传 | 本地确认文件夹层级；`git status` 看是否漏提交（Linux 区分大小写，`CSS/` ≠ `css/`） |
| 改了代码网站没变 | 浏览器缓存 / 没 push 成功 | `Ctrl + F5`；看 Actions 是否有新记录 |
| 中文文件名乱码 | Windows 与 Git 编码差异 | 尽量用英文文件名；或执行 `git config --global core.quotepath false` |

---

## 命令速查表

| 目的 | 命令 |
| --- | --- |
| 查看版本 | `git --version` |
| 查看当前状态 | `git status` |
| 暂存所有改动 | `git add .` |
| 提交 | `git commit -m "说明"` |
| 推送到 GitHub | `git push` |
| 拉取远程更新 | `git pull` |
| 查看提交历史 | `git log --oneline --graph` |
| 查看远程地址 | `git remote -v` |
| 修改远程地址 | `git remote set-url origin 新地址` |
| 查看改动内容 | `git diff` |

---

## 作业提交清单

上线前对照打勾 ✅：

- [ ] 已把示例信息（姓名 / 学号 / 邮箱 / 手机号 / GitHub 地址）全部替换成自己的
- [ ] 已上传自己的头像（`assets/avatar.jpg` 并在 `index.html` 里引用）
- [ ] 手机上打开网址检查一遍，没有横向滚动条、文字没有溢出
- [ ] 网址 `https://用户名.github.io/resume-website/` 能在无痕窗口打开
- [ ] GitHub 仓库里能看到 `.github/workflows/deploy.yml`，Actions 最新一次是绿勾
- [ ] `README.md` 里的在线预览链接已改成自己的真实网址
- [ ] 打印预览（`Ctrl + P`）排版正常，可另存为 PDF 一并提交
- [ ] 提交给老师的内容：**仓库链接 + 部署网址 + （可选）简历 PDF**

---

## 附：用 Surge 部署（参考 Week04）

Surge 适合快速把静态页面发布到一个临时网址（不能自动更新，每次都要重新发布）：

```cmd
npm install --global surge
cd /d "%USERPROFILE%\Desktop\resume-website"
surge
```

按提示输入邮箱和密码（首次会注册），`project path` 直接回车用当前目录，`domain` 可以自定义形如 `lisi-resume.surge.sh`。
发布成功后终端会打印你的网址。

| 对比项 | GitHub Pages | Surge |
| --- | --- | --- |
| 是否需要 Git | 需要 | 不需要 |
| 自动更新 | ✅ push 即更新（CI/CD） | ❌ 每次手动重新发布 |
| 适合场景 | 课程作业、长期维护、写进简历 | 临时演示、快速给同学看 |

**课程作业以 GitHub Pages 为主，Surge 作为备用方案。**

---

## 参考链接

- Git 官网下载：<https://git-scm.com/download/win>
- GitHub 新建仓库：<https://github.com/new>
- GitHub Pages 官方文档：<https://docs.github.com/zh/pages>
- GitHub Actions 官方文档：<https://docs.github.com/zh/actions>
- Surge：<https://surge.sh/>
- MDN 前端学习：<https://developer.mozilla.org/zh-CN/>
