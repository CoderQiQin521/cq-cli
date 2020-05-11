const Inquirer = require('inquirer') // https://github.com/SBoudrias/Inquirer.js (向导问答交互)
const path = require('path')
const del = require('del')
const fs = require('fs')
const chalk = require('chalk')
const { promisify } = require('util')
const axios = require('axios')
const downloadGitRepo = promisify(require('download-git-repo'))
const shelljs = require('shelljs')
const ora = require('ora')

const baseUrl = 'https://api.github.com'

const existDir = async (projectName) => {
  const dir = path.resolve('.')
  const createName = path.posix.join(dir, projectName)
  if (fs.existsSync(createName)) {
    const result = await Inquirer.prompt({
      type: 'confirm',
      name: 'init',
      message: '是否覆盖已存在的目录?',
      default: true,
    })
    if (result.init) {
      await del(createName, {
        force: true,
      })
      fs.mkdirSync(createName, { recursive: true })
      return createName
    } else {
      console.log('您取消了命令')
      process.exit(1)
    }
  }
  fs.mkdirSync(createName)
  return createName
}

const fetchRepoList = async () => {
  const { data } = await axios.get(
    baseUrl +
      '/users/CoderQiQin521/repos?sort=updated&direction=desc&visibility=all'
  )
  const repolist = data
    .map((item) => item.name)
    .filter((item) => /template/.test(item))
  return repolist
}

const waitLoading = (fn, message) => async (...arg) => {
  const spinner = ora(message)
  spinner.start()
  const result = await fn(...arg)
  spinner.succeed()
  return result
}

module.exports = async (projectName) => {
  // 1.创建目录
  const dirPath = await existDir(projectName)
  // 2.下载模版
  const repos = await fetchRepoList()
  const { repo } = await Inquirer.prompt({
    type: 'list',
    name: 'repo',
    message: '请选择项目模版',
    choices: repos,
  })
  let repoUrl = `CoderQiQin521/${repo}`
  await waitLoading(downloadGitRepo, '下载远程仓库模版...')(repoUrl, dirPath)
  // 3.安装依赖
  shelljs.cd(dirPath)
  shelljs.exec('npm install')
  console.log(chalk.yellow('依赖已经安装,执行以下命令: '))
  console.log(chalk.yellow(`1. cd ${projectName}`))
  console.log(chalk.yellow('2. npm run serve'))
}
