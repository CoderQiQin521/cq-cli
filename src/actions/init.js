const Inquirer = require('inquirer') // https://github.com/SBoudrias/Inquirer.js (向导问答交互)
const path = require('path')
const del = require('del')
const fs = require('fs')
const { promisify } = require('util')
const axios = require('axios')
const downloadGitRepo = promisify(require('download-git-repo'))
const shelljs = require('shelljs')
const ora = require('ora')

const baseUrl = 'https://api.github.com'

const existDir = async (projectName) => {
  const dir = path.resolve('.')
  const createName = path.join(dir, projectName)
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
      fs.mkdirSync(createName)
      return createName
    } else {
      console.log('取消了操作')
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

const waitLoading = async (fn, message) => {
  const spinner = ora(message)
  spinner.start()
  const result = await fn()
  spinner.succeed()
  return result
}

module.exports = async (projectName) => {
  console.log('projectName: ', projectName)
  // 1.创建目录
  const dirPath = await existDir(projectName)
  // 2.下载模版
  const repos = await fetchRepoList()
  console.log('repos: ', repos)
  const { repo } = await Inquirer.prompt({
    type: 'list',
    name: 'repo',
    message: '请选择项目模版',
    choices: repos,
  })
  console.log('repo: ', repo)
  let repoUrl = `CoderQiQin521/${repo}`
  // let repoUrl = `gitee:CoderQiQin/${repo}`
  await downloadGitRepo(repoUrl, dirPath)
  // // 3.安装依赖
  // shelljs.cd(dirPath)
  // shelljs.exec('npm install')
}
