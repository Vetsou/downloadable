chrome.runtime.onInstalled.addListener(() => {
  console.log('Downloadable installed.');
});

chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  if (request.action === 'download' && request.url) {
    chrome.downloads.download({ url: request.url }, (downloadId) => console.log('Download started with ID:', downloadId));
  }
});