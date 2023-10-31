// Listen for extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case "install":
      console.info("EXTENSION INSTALLED");
      chrome.tabs.query({}, (tabs) => {
        tabs
          .filter((tab) => tab.url.startsWith("https://www.youtube.com/"))
          .forEach(({ id }) => {
            chrome.tabs.reload(id);
          });
      });
      break;
    case "update":
      console.info("EXTENSION UPDATED");
      break;
    case "chrome_update":
    case "shared_module_update":
    default:
      console.info("OTHER REASON");
      break;
  }
});

// Function to be injected into tabs
function taimuRipu() {
  const taimuRipuInner = async () => {
    await new Promise((resolve, _reject) => {
      const videoContainer = document.getElementById("movie_player");

      const setTimeoutHandler = () => {
        const isAd = videoContainer?.classList.contains("ad-interrupting") || videoContainer?.classList.contains("ad-showing");
        const skipLock = document.querySelector(".ytp-ad-preview-text")?.innerText;
        const surveyLock = document.querySelector(".ytp-ad-survey")?.length > 0;

        if (isAd && skipLock) {
          const videoPlayer = document.getElementsByClassName("video-stream")[0];
          videoPlayer.muted = true;
          videoPlayer.currentTime = videoPlayer.duration - 0.1;
          if (videoPlayer.paused) videoPlayer.play();
          document.querySelector(".ytp-ad-skip-button")?.click();
          document.querySelector(".ytp-ad-skip-button-modern")?.click();
        } else if (isAd && surveyLock) {
          document.querySelector(".ytp-ad-skip-button")?.click();
          document.querySelector(".ytp-ad-skip-button-modern")?.click();
        }

        resolve();
      };

      setTimeout(setTimeoutHandler, 100);
    });

    taimuRipuInner();
  };

  taimuRipuInner();
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    String(tab.url).includes("https://www.youtube.com/watch")
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: taimuRipu,
    });
  }
});
