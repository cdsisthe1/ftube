// Listen for extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case "install":
      console.info("EXTENSION INSTALLED");
      // Reload all YouTube tabs on installation
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
const taimuRipu = async () => {
  try {
    await new Promise((resolve) => {
      const videoContainer = document.getElementById("movie_player");

      const setTimeoutHandler = () => {
        try {
          const isAd = videoContainer?.classList.contains("ad-interrupting") || videoContainer?.classList.contains("ad-showing");
          const skipLock = document.querySelector(".ytp-ad-preview-text")?.innerText;
          const surveyLock = document.querySelector(".ytp-ad-survey")?.length > 0;

          console.log("Checking for ads...");

          if (isAd && skipLock) {
            console.log("Skipping skippable ad...");
            const videoPlayer = document.getElementsByClassName("video-stream")[0];
            videoPlayer.muted = true;
            videoPlayer.currentTime = videoPlayer.duration - 0.1;
            if (videoPlayer.paused) videoPlayer.play();
            document.querySelector(".ytp-ad-skip-button")?.click();
            document.querySelector(".ytp-ad-skip-button-modern")?.click();
          } else if (isAd && surveyLock) {
            console.log("Skipping survey ad...");
            document.querySelector(".ytp-ad-skip-button")?.click();
            document.querySelector(".ytp-ad-skip-button-modern")?.click();
          } else {
            console.log("No ads detected or ads are non-skippable.");
          }

          resolve();
        } catch (error) {
          console.error("Error during ad check:", error);
          resolve(); // Resolve promise even on error
        }
      };

      // Run the check after a short delay
      setTimeout(setTimeoutHandler, 100);
    });

    taimuRipu(); // Recursive call for continuous execution
  } catch (error) {
    console.error("Error in taimuRipu function:", error);
  }
};

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    String(tab.url).includes("https://www.youtube.com/watch")
  ) {
    console.log("YouTube video page loaded, executing taimuRipu...");
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: taimuRipu,
    });
  }
});
