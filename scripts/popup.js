document.addEventListener('DOMContentLoaded', () => {
  getCurrentTab(currTab => {
    const url = new URL(currTab.url);
    const downloadBtn = document.getElementById('download-btn');
  
    if (isStreamable(url) || isStreamin(url)) {
      downloadBtn.style.display = 'block';
    } else {
      downloadBtn.disabled = true;
      const msgElem = document.getElementById('msg-span')
      msgElem.innerText = "No videos found on webpage"
    }
  })
})

document.getElementById('download-btn').addEventListener('click', async () => {
  getCurrentTab((currTab) => {
    chrome.scripting.executeScript({
      target: { tabId: currTab.id },
      func: downloadVideo
    });
  })
});

// ============================================================================

async function getCurrentTab(callback) {
  const queryOptions = { active: true, lastFocusedWindow: true };
  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    callback(tab)
  });
}

function downloadVideo() {
  const videoElems = document.querySelectorAll('video')[0];
  const source = videoElems.querySelector('source');
  const mp4Link = source?.src;

  if (mp4Link) {
    chrome.runtime.sendMessage({ action: 'download', url: mp4Link })
  } else {
    const msgElem = document.getElementById('msg-span')
    msgElem.innerText = "No videos found on webpage"
  }
}

function isStreamable(url) {
  return url.hostname === 'streamable.com' && url.pathname && url.pathname !== '/';
}

function isStreamin(url) {
  return url.hostname === 'streamin.me' && url?.pathname.startsWith('/v/') && url?.pathname.length > 3;
}