const fs = require('fs')
const path = require('path')

// 首字母大写
function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 递归复制并替换内容
function copyAndReplace(srcDir, destDir, map) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir)
  const files = fs.readdirSync(srcDir)
  files.forEach(file => {
    const srcPath = path.join(srcDir, file)
    let destFile = file
    Object.keys(map).forEach(key => {
      destFile = destFile.replace(key, map[key])
    })
    const destPath = path.join(destDir, destFile)
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyAndReplace(srcPath, destPath, map)
    } else {
      let content = fs.readFileSync(srcPath, 'utf8')
      Object.keys(map).forEach(key => {
        const reg = new RegExp(key, 'g')
        content = content.replace(reg, map[key])
      })
      fs.writeFileSync(destPath, content, 'utf8')
    }
  })
}

// 主函数
function generateComponent(componentName) {
  if (!componentName) {
    console.error('请提供组件名，如：npm run gen select')
    process.exit(1)
  }
  const upperName = upperFirst(componentName)
  const srcDir = path.resolve(__dirname, '../packages/components/__template__')
  const destDir = path.resolve(__dirname, `../packages/components/${componentName}`)

  if (fs.existsSync(destDir)) {
    console.error(`组件 ${upperName} 已存在`)
    process.exit(1)
  }

  copyAndReplace(srcDir, destDir, {
    '__COMPONENT__': upperName,
    '__component__': componentName
  })

  console.log(`组件 ${upperName} 创建成功！目录：packages/components/${componentName}`)
}

// 读取命令行参数
const inputName = process.argv[2]
generateComponent(inputName)