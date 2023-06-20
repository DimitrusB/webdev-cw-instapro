import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { addLike, disLike} from "../api.js";

export function renderPostsPageComponent({ appEl }) {

  const appHtml = posts.map((post) =>{

     const timeToGo = formatDistanceToNow(new Date(post.createdAt),  {locale: ru});
    return     `    <button id="scrollButt" class="upbtn"></button>   
    <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="./assets/images/like-active.svg">
            <p class="post-likes-text">
            Нравится: <strong class="like-count">${post.likes.length}</strong>
          </p>
          </button>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
      ${timeToGo} назад
        </p>
      </li>
        </ul>
          </div>`;}).join('');

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  
const token = getToken();

const btn = document.getElementById("scrollButt");

document.body.appendChild(btn);

btn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

btn.style.display = "none";

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
});

function updateLikeCount(postEl, post) {
  const likeCountEl = postEl.querySelector(".like-count");
  likeCountEl.textContent = `${post.likes.length}`;
}

for (let postEl of document.querySelectorAll(".like-button")) {
  const postId = postEl.dataset.postId;
  const post = posts.find(post => post.id === postId);
  const isAuthenticated = Boolean(token && user.name);

  if (!isAuthenticated) {
    postEl.classList.add("disabled");
  } else {
    const isLikedByUser = post.likes.some(like => like.name === user.name);
    const likeIcon = postEl.querySelector("img");
    if (isLikedByUser) {
      likeIcon.setAttribute("src", "./assets/images/like-active.svg");
    } else {
      likeIcon.setAttribute("src", "./assets/images/like-not-active.svg");
    }
  }

  postEl.addEventListener("click", () => {
    if (!isAuthenticated) {
      alert("Авторизуйтесь, чтобы ставить лайки");
      return;
    }

    const postId = postEl.dataset.postId;
    const post = posts.find(post => post.id === postId);
    if (!post) {
      return;
    }

    const isLikedByUser = post.likes.some(like => like.name === user.name);
    const likeIcon = postEl.querySelector("img");

    if (isLikedByUser) {
      disLike({
        token: token,
        id: postId,
      });
      post.likes = post.likes.filter(like => like.name !== user.name);
      likeIcon.setAttribute("src", "./assets/images/like-not-active.svg");
    } else {
      addLike({
        token: token,
        id: postId,
      });
      post.likes.push({
        name: user.name,
      });
      likeIcon.setAttribute("src", "./assets/images/like-active.svg");
    }

    updateLikeCount(postEl, post);
  });
}
}