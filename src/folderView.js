import { getClassNameForMimeType, getClassNameForFilename } from 'font-awesome-filetypes'

import { renderHTML } from './render/htmlWrapper'
import { renderPath } from './render/pathUtil'
import { renderMarkdown } from './render/mdRenderer'

/**
 * Convert bytes to human readable file size
 *
 * @param {Number} bytes File size in bytes
 * @param {Boolean} si 1000 - true; 1024 - false
 */
function readableFileSize(bytes, si) {
  bytes = parseInt(bytes, 10)
  var thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  var u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
}

/**
 * Render Folder Index
 *
 * @param {*} items
 * @param {*} isIndex don't show ".." on index page.
 */
export async function renderFolderView(items, path, request) {
  const isIndex = path === '/'

  const el = (tag, attrs, content) => `<${tag} ${attrs.join(' ')}>${content}</${tag}>`
  const div = (className, content) => el('div', [`class=${className}`], content)
  const item = (icon, fileName, fileAbsoluteUrl, size, emojiIcon) =>
    el(
      'a',
      [`href="${fileAbsoluteUrl}"`, 'class="item"', size ? `size="${size}"` : ''],
      (emojiIcon ? el('i', ['style="font-style: normal"'], emojiIcon) : el('i', [`class="${icon}"`], '')) +
        fileName +
        el('div', ['style="flex-grow: 1;"'], '') +
        (fileName === '..' ? '' : el('span', ['class="size"'], readableFileSize(size)))
    )

  const intro = `<div class="intro markdown-body" style="text-align: left; margin-top: 2rem;">
                    <h2>这里是个假的网盘</h2>
                    <h4>关于网盘<h4>
                    <blockquote>
                    <p>本盘资源均为个人收集使用</p>
                    <p>网盘资源随缘更新，有什么需要的资源请联系我</p>
                    <p>资源均为网络收集，如有侵权请<a href="https://blog.isteed.cc/post/about/#%E8%81%94%E7%B3%BB%E6%88%91">联系我</a>删除</p>
                    </blockquote>
                    <h4>使用必读</h4>
                    <p>本网盘是使用 OneDrvie A1 国际版订阅，国内部分地区速度可能不理想</p>
                    <ul>
                    <li>若需要提升下载速度，请使用多线程下载器</li>
                    <li>若速度依旧不理想，请尝试代理，使用方法：
                    <ul>
                    <li>在文件链接后面加 ?raw=true&amp;proxied</li>
                    <li>例子: <a href="https://storage.isteed.cc/README.md?raw=true&amp;proxied">https://storage.isteed.cc/README.md?raw=true&amp;proxied</a></li>
                    </ul>
                    </li>
                    <li>若速度仍不理想，请尝试使用多线程代理下载，使用方法：
                    <ul>
                    <li>将文件链接粘贴进 <a href="https://proxy.lufs.workers.dev/">https://proxy.lufs.workers.dev/</a></li>
                    <li>再使用新的链接下载（可多线程）</li>
                    </ul>
                    </li>
                    <li>若速度还不理想，请添加 hosts 重新尝试上面两个方法
                    <ul>
                    <li>Hosts 内容：</li>
                    <li><code>1.0.0.1 storage.isteed.cc</code></li>
                    <li><code>1.0.0.1 proxy.lufs.workers.dev</code></li>
                    </ul>
                    </li>
                    <li>终极方法... 开代理</li>
                    </ul>
                    <h4>支持</h4>
                    <p><a href="https://github.com/spencerwooo/onedrive-cf-index"><img src="https://img.shields.io/badge/powered%20by-onedrive%20cf%20index-black?logo=github&style=for-the-badge&labelColor=24292e&longCache=true"></a></p>
                    <p><a href="https://isteed.cc">Portfolio</a> · <a href="https://blog.isteed.cc">Blog</a>
                  </div>`

  // Check if current directory contains README.md, if true, then render spinner
  let readmeExists = false
  let readmeFetchUrl = ''

  const body = div(
    'container',
    div('path', renderPath(path)) +
      div(
        'items',
        el(
          'div',
          ['style="min-width: 600px"'],
          (!isIndex ? item('far fa-folder', '..', `${path}..`) : '') +
            items
              .map(i => {
                // Check if the current item is a folder or a file
                if ('folder' in i) {
                  // const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
                  const charRegex = /\w|\s/
                  const firstNonEmojiPosition = i.name.search(charRegex)
                  if (firstNonEmojiPosition !== 0) {
                    let headerEmojiStr = i.name.slice(0, firstNonEmojiPosition)
                    let folderName = i.name.slice(firstNonEmojiPosition).trim()
                    if (firstNonEmojiPosition === -1) {
                      headerEmojiStr = i.name
                      folderName = ''
                    }
                    return item('', folderName, `${path}${i.name}/`, i.size, headerEmojiStr)
                  }
                  return item('far fa-folder', i.name, `${path}${i.name}/`, i.size)
                } else if ('file' in i) {
                  // Check if README.md exists
                  if (!readmeExists) {
                    readmeExists = i.name.toLowerCase() === 'readme.md'
                    readmeFetchUrl = i['@microsoft.graph.downloadUrl']
                  }

                  // Render file icons
                  let fileIcon = getClassNameForMimeType(i.file.mimeType)
                  if (fileIcon === 'fa-file') {
                    // Check for files that haven't been rendered as expected
                    const extension = i.name.split('.').pop()
                    if (extension === 'md') {
                      fileIcon = 'fab fa-markdown'
                    } else if (['7z', 'rar', 'bz2', 'xz', 'tar', 'wim'].includes(extension)) {
                      fileIcon = 'far fa-file-archive'
                    } else if (['flac', 'oga', 'opus'].includes(extension)) {
                      fileIcon = 'far fa-file-audio'
                    } else {
                      fileIcon = `far ${getClassNameForFilename(i.name)}`
                    }
                  } else {
                    fileIcon = `far ${fileIcon}`
                  }
                  return item(fileIcon, i.name, `${path}${i.name}`, i.size)
                } else {
                  console.log(`unknown item type ${i}`)
                }
              })
              .join('')
        )
      ) +
      (readmeExists && !isIndex ? await renderMarkdown(readmeFetchUrl, 'fade-in-fwd', '') : '') +
      (isIndex ? intro : '')
  )
  return renderHTML(body, ...[request.pLink, request.pIdx])
}
