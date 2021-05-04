const COMMIT_HASH = 'ad7b598'

const pagination = (pIdx, attrs) => {
  const getAttrs = (c, h, isNext) =>
    `class="${c}" ${h ? `href="pagination?page=${h}"` : ''} ${isNext === undefined ? '' : `id=${c.includes('pre') ? 'pagination-pre' : 'pagination-next'}`
    }`
  if (pIdx) {
    switch (pIdx) {
      case pIdx < 0 ? pIdx : null:
        attrs = [getAttrs('pre', -pIdx - 1, 0), getAttrs('next off', null)]
        break
      case 1:
        attrs = [getAttrs('pre off', null), getAttrs('next', pIdx + 1, 1)]
        break
      default:
        attrs = [getAttrs('pre', pIdx - 1, 0), getAttrs('next', pIdx + 1, 1)]
    }
    return `${`<a ${attrs[0]}><i class="fas fa-angle-left" style="font-size: 8px;"></i> PREV</a>`}<span>Page ${pIdx}</span> ${`<a ${attrs[1]}>NEXT <i class="fas fa-angle-right" style="font-size: 8px;"></i></a>`}`
  }
  return ''
}

export function renderHTML(body, pLink, pIdx) {
  pLink = pLink || ''
  const p = 'window[pLinkId]'

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge, chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <title>一个假的网盘</title>
      <link rel="shortcut icon" type="image/png" sizes="16x16" href="https://cdn.jsdelivr.net/gh/lufsx/res@master/file/storage-icon.png" />
      <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "2030b837895a48439e4bd30fb497cf63"}'></script>
      <script>
      window.ga_tid = "UA-139861604-5";
      window.ga_api = "https://cfga.lufs.workers.dev/";
      </script>
      <script async="">
        !function(t,e,n){var a=t.screen,r=encodeURIComponent,o=Math.max,i=t.performance,d=i&&i.timing,c=function(t){return isNaN(t)||t==1/0||t<0?void 0:t};function g(){var i=["ga="+t.ga_tid,"dt="+r(e.title),"de="+r(e.characterSet||e.charset),"dr="+r(e.referrer),"ul="+(n.language||n.browserLanguage||n.userLanguage),"sd="+a.colorDepth+"-bit","sr="+a.width+"x"+a.height,"vp="+o(e.documentElement.clientWidth,t.innerWidth||0)+"x"+o(e.documentElement.clientHeight,t.innerHeight||0),"plt="+c(d.loadEventStart-d.navigationStart||0),"dns="+c(d.domainLookupEnd-d.domainLookupStart||0),"pdt="+c(d.responseEnd-d.responseStart||0),"rrt="+c(d.redirectEnd-d.redirectStart||0),"tcp="+c(d.connectEnd-d.connectStart||0),"srt="+c(d.responseStart-d.requestStart||0),"dit="+c(d.domInteractive-d.domLoading||0),"clt="+c(d.domContentLoadedEventStart-d.navigationStart||0),"z="+Date.now()];t.__ga_img=new Image,t.__ga_img.src=t.ga_api+"?"+i.join("&")}"complete"===e.readyState?g():t.addEventListener("load",g)}(window,document,navigator);
      </script>
      <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.13.1/css/all.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/gh/spencerwooo/onedrive-cf-index@${COMMIT_HASH}/themes/spencer.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@gh-pages/github-markdown.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/gh/spencerwooo/onedrive-cf-index@${COMMIT_HASH}/themes/prism-github.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.17.1/prism.min.js" data-manual></script>
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.17.1/plugins/autoloader/prism-autoloader.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/medium-zoom@1.0.6/dist/medium-zoom.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/turbolinks@5.2.0/dist/turbolinks.min.js"></script>
      <script src="https://cdn.jsdelivr.net/gh/pipwerks/PDFObject/pdfobject.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/flv.js@1.5.0/dist/flv.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/dplayer@1.26.0/dist/DPlayer.min.js"></script>
    </head>
    <body>
      <nav id="navbar" data-turbolinks-permanent><div class="brand"><a href="/" style="text-decoration:none">📂</a> 一个假的网盘</div></nav>
      ${body}
      <div class="paginate-container">${pagination(pIdx)}</div>
      <div id="flex-container" data-turbolinks-permanent style="flex-grow: 1;"></div>
      <footer id="footer" data-turbolinks-permanent><p>Powered by <a href="https://github.com/spencerwooo/onedrive-cf-index">onedrive-cf-index</a>, hosted on <a href="https://www.cloudflare.com/products/cloudflare-workers/">Cloudflare Workers</a>.</p></footer>
      <script>
        if (typeof ap !== "undefined" && ap.paused !== true) {
          ap.destroy()
          ap = undefined
        }
        if (typeof dp !== "undefined" && dp.paused !== true) {
          dp.destroy()
          dp = undefined
        }
        Prism.highlightAll()
        mediumZoom('[data-zoomable]')
        Turbolinks.Location.prototype.isHTML = () => {return true}
        Turbolinks.start()
        pagination()

        function pagination() {
          if ('${pLink ? 1 : ''}') {
            if (location.pathname.endsWith('/')) {
              pLinkId = history.state.turbolinks.restorationIdentifier
              ${p} = { link: ['${pLink}'], idx: 1 }
            } else if (!window.pLinkId) {
              history.pushState(history.state, '', location.pathname.replace('pagination', '/'))
              return
            }
            if (${p}.link.length < ${p}.idx) (${p} = { link: [...${p}.link, '${pLink}'], idx: ${p}.idx })
          }
          listen = ({ isNext }) => {
            isNext ? ${p}.idx++ : ${p}.idx--
            addEventListener(
              'turbolinks:request-start',
              event => {
                const xhr = event.data.xhr
                xhr.setRequestHeader('pLink', ${p}.link[${p}.idx -2])
                xhr.setRequestHeader('pIdx', ${p}.idx + '')
              },
              { once: true }
            )
          }
          preBtn = document.getElementById('pagination-pre')
          nextBtn = document.getElementById('pagination-next')
          if (nextBtn) {
            nextBtn.addEventListener('click', () => listen({ isNext: true }), { once: true })
          }
          if (preBtn) {
            preBtn.addEventListener('click', () => listen({ isNext: false }), { once: true })
          }
        }
      </script>
    </body>
  </html>`
}
