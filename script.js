const body = document.body;
const themeToggle = document.querySelector("#themeToggle");
const tweetInput = document.querySelector("#tweetInput");
const charCount = document.querySelector("#charCount");
const inlineCompose = document.querySelector("#inlineCompose");
const inlinePostButton = inlineCompose.querySelector("button[type='submit']");
const homeView = document.querySelector("#homeView");
const followingView = document.querySelector("#followingView");
const exploreView = document.querySelector("#exploreView");
const viewTitle = document.querySelector("#viewTitle");
const openCompose = document.querySelector("#openCompose");
const mobileCompose = document.querySelector("#mobileCompose");
const composeModal = document.querySelector("#composeModal");
const modalComposeForm = document.querySelector("#modalComposeForm");
const modalTweetInput = document.querySelector("#modalTweetInput");
const modalPostButton = document.querySelector("#modalPostButton");
const modalCharCount = document.querySelector("#modalCharCount");
const openLogin = document.querySelector("#openLogin");
const loginModal = document.querySelector("#loginModal");

const savedTheme = localStorage.getItem("q-theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
}

let activeFeed = "for-you";

function normalizeButtonLabels(scope = document) {
  scope.querySelectorAll(".tweet-actions").forEach((actions) => {
    const buttons = actions.querySelectorAll("button");
    const labels = ["Reply", "Repost", "Like", "Save"];

    buttons.forEach((button, index) => {
      const count = button.querySelector("span")?.textContent?.trim();
      const baseLabel = button.classList.contains("liked")
        ? "Liked"
        : button.classList.contains("bookmarked")
          ? "Saved"
          : labels[index];

      button.textContent = count ? `${baseLabel} ${count}` : baseLabel;
    });
  });

  const tools = document.querySelector(".tool-row");
  if (tools) {
    tools.innerHTML = `
      <button class="tool-icon media-icon" type="button" aria-label="Add media"></button>
      <button class="tool-icon gif-icon" type="button" aria-label="Add GIF"></button>
      <button class="tool-icon poll-icon" type="button" aria-label="Add poll"></button>
      <button class="tool-icon emoji-icon" type="button" aria-label="Add emoji"></button>
      <button class="tool-icon location-icon" type="button" aria-label="Add location"></button>
      <button class="tool-icon content-icon" type="button" aria-label="Add content warning"></button>
      <button class="tool-icon schedule-icon" type="button" aria-label="Schedule post"></button>
    `;
  }

  const themeLabel = document.querySelector("#themeToggle span");
  if (themeLabel) {
    themeLabel.textContent = "";
    themeLabel.classList.add("theme-icon");
  }

  const mobileItems = document.querySelectorAll(".mobile-nav a, .mobile-nav button");
  ["Home", "Explore", "Post", "Alerts", "Chat"].forEach((label, index) => {
    if (mobileItems[index]) mobileItems[index].textContent = label;
  });
}

function updateComposer(input, count, button) {
  const remaining = 280 - input.value.length;
  count.textContent = remaining;
  button.disabled = input.value.trim().length === 0;
}

function createTweet(text) {
  const article = document.createElement("article");
  article.className = "tweet";
  article.innerHTML = `
    <img class="avatar" src="./assets/avatar-me.svg" alt="Student Dev avatar" />
    <div class="tweet-body">
      <header>
        <strong>Student Dev</strong>
        <span>@qbuilder · now</span>
      </header>
      <p></p>
      <div class="tweet-actions">
        <button type="button">💬 <span>0</span></button>
        <button type="button" class="repost-button">↻ <span>0</span></button>
        <button type="button" class="like-button">♡ <span>0</span></button>
        <button type="button" class="bookmark-button">▱</button>
      </div>
    </div>
  `;
  article.querySelector("p").textContent = text;
  homeView.prepend(article);
  normalizeButtonLabels(article);
  showFeed("for-you");
}

function showFeed(feedName) {
  activeFeed = feedName;
  const isFollowing = feedName === "following";

  homeView.hidden = isFollowing;
  followingView.hidden = !isFollowing;

  document.querySelectorAll("[data-feed-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.feedTab === feedName);
  });
}

function showView(name, title = null) {
  const isExplore = name === "explore";
  if (isExplore) {
    homeView.hidden = true;
    followingView.hidden = true;
  } else {
    showFeed(activeFeed);
  }

  document.querySelector(".home-only").hidden = isExplore;
  exploreView.hidden = !isExplore;

  if (title) {
    viewTitle.textContent = title;
  } else if (isExplore) {
    viewTitle.textContent = "Explore";
  } else if (name === "home") {
    viewTitle.textContent = "Home";
  } else {
    viewTitle.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  }

  document.querySelectorAll("[data-view-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.viewLink === name);
  });
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("q-theme", body.classList.contains("dark") ? "dark" : "light");
});

tweetInput.addEventListener("input", () => updateComposer(tweetInput, charCount, inlinePostButton));
modalTweetInput.addEventListener("input", () => updateComposer(modalTweetInput, modalCharCount, modalPostButton));

inlineCompose.addEventListener("submit", (event) => {
  event.preventDefault();
  createTweet(tweetInput.value.trim());
  tweetInput.value = "";
  updateComposer(tweetInput, charCount, inlinePostButton);
});

modalComposeForm.addEventListener("submit", (event) => {
  if (event.submitter && event.submitter.value === "cancel") return;
  event.preventDefault();
  createTweet(modalTweetInput.value.trim());
  modalTweetInput.value = "";
  updateComposer(modalTweetInput, modalCharCount, modalPostButton);
  composeModal.close();
  showView("home");
});

document.addEventListener("click", (event) => {
  const feedTab = event.target.closest("[data-feed-tab]");
  if (feedTab) {
    showView("home");
    showFeed(feedTab.dataset.feedTab);
  }

  const viewLink = event.target.closest("[data-view-link]");
  if (viewLink) {
    if (viewLink.classList.contains("more-toggle")) {
      event.preventDefault();
      const menu = viewLink.parentElement.querySelector(".more-menu");
      menu.classList.toggle("open");
      return;
    }

    event.preventDefault();
    const label = viewLink.querySelector("span")?.textContent?.trim() || viewLink.dataset.viewLink;
    showView(viewLink.dataset.viewLink, label);
  }

  const likeButton = event.target.closest(".like-button");
  if (likeButton) {
    likeButton.classList.toggle("liked");
    likeButton.firstChild.textContent = likeButton.classList.contains("liked") ? "♥ " : "♡ ";
  }

  const repostButton = event.target.closest(".repost-button");
  if (repostButton) {
    repostButton.classList.toggle("reposted");
  }

  const bookmarkButton = event.target.closest(".bookmark-button");
  if (bookmarkButton) {
    bookmarkButton.classList.toggle("bookmarked");
    bookmarkButton.textContent = bookmarkButton.classList.contains("bookmarked") ? "▰" : "▱";
  }
  normalizeButtonLabels();
});

function openComposeModal() {
  composeModal.showModal();
  modalTweetInput.focus();
}

openCompose.addEventListener("click", openComposeModal);
mobileCompose.addEventListener("click", openComposeModal);
openLogin.addEventListener("click", () => loginModal.showModal());

showView(location.hash.replace("#", "") === "explore" ? "explore" : "home");
normalizeButtonLabels();
