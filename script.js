const body = document.body;
const themeToggle = document.querySelector("#themeToggle");
const tweetInput = document.querySelector("#tweetInput");
const charCount = document.querySelector("#charCount");
const inlineCompose = document.querySelector("#inlineCompose");
const inlinePostButton = inlineCompose.querySelector("button[type='submit']");
const homeView = document.querySelector("#homeView");
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
}

function showView(name, title = null) {
  const isExplore = name === "explore";
  homeView.hidden = isExplore;
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
  const viewLink = event.target.closest("[data-view-link]");
  if (viewLink) {
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
});

function openComposeModal() {
  composeModal.showModal();
  modalTweetInput.focus();
}

openCompose.addEventListener("click", openComposeModal);
mobileCompose.addEventListener("click", openComposeModal);
openLogin.addEventListener("click", () => loginModal.showModal());

showView(location.hash.replace("#", "") === "explore" ? "explore" : "home");
