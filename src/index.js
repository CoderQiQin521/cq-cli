const { program } = require('commander') // https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md
const { version } = require('../package.json')
const path = require('path')

program.version(version, '-v, --version', '查看版本')
// .option('-c, --create', '创建一个项目')
// .option('-i, --init [name]', '初始化一个项目')
// .option('-d, --delete <file>', '删除一个目录', delFn)
// .option('-s, --small', 'small pizza size')
// .option('-p, --pizza-type <type>', 'flavour of pizza')

const mapActions = {
  init: {
    alias: 'i',
    desc: '创建一个项目',
    examples: [],
  },
  remove: {
    alias: 'rm',
    desc: '删除',
    examples: [],
  },
  '*': {
    alias: '',
    desc: '没有找到命令',
    examples: [],
  },
}

Object.keys(mapActions).forEach((key) => {
  program
    .command(key)
    .alias(mapActions[key].alias)
    .description(mapActions[key].desc)
    .action(() => {
      if (key === '*') {
        console.log(mapActions[key].desc)
      } else {
        require(path.resolve(__dirname, `./actions/${key}`))(
          ...process.argv.slice(3)
        )
      }
    })
})

program.parse(process.argv)

// console.log(program.create)

// console.log('传入参数:', ...process.argv.slice(2))
// console.log(...process.argv.slice(3))

// if (program.init) {
//   console.log('执行了init', ...process.argv.slice(3))

//   // 创建项目目录
//   createDir(...process.argv.slice(3))
// }

// function createDir(dirname) {
//   // 判断是否存在, 存在提示是否覆盖
//   Inquirer.prompt([
//     {
//       type: 'confirm',
//       name: 'eat',
//       message: '吃饭了吗?',
//       default: false,
//     },
//     {
//       type: 'confirm',
//       name: 'read',
//       message: '看书了吗?',
//       default: true,
//     },
//   ]).then((res) => {
//     console.log('res: ', res)
//   })
//   // 创建目录
// }

// function delFn(dirname) {
//   console.log('dirname: ', dirname)
//   const dir = path.resolve('.')
//   del(dir + '/' + dirname)
// }
