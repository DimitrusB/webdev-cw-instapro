import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { addLike, disLike, getPosts } from "../api.js";





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

function updateLikeCount(postEl, post) {
  const likeCountEl = postEl.querySelector(".like-count");
  likeCountEl.textContent = `${post.likes.length}`;
}
const isAuthenticated = Boolean(token && user.name);

for (let postEl of document.querySelectorAll(".like-button")) {
  postEl.addEventListener("click", () => {

    const postId = postEl.dataset.postId;
    const post = posts.find(post => post.id === postId);

    if (!isAuthenticated) {
      postEl.classList.add("disabled");
      alert("Авторизуйтесь, для возможности ставить лайки");
      return;
    }

    if (!post) {
      return;
    }
    const like = post.likes.find(like => like.name === user.name);


    if (like) {
      disLike({
        token: token,
        id: postId,
      })
      console.log("dislike!!!");
      post.likes = post.likes.filter(like => like.name !== user.name);
      updateLikeCount(postEl, post);
    } else {
      addLike({
        token: token,
        id: postId,
      })
      console.log("like!!!");
      post.likes.push({
        name: user.name,
      });
      updateLikeCount(postEl, post);
    }
  })
}
}
