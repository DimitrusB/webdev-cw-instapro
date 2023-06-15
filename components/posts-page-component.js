import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { addLike, disLike } from "../api.js";





export function renderPostsPageComponent({ appEl }) {
  const appHtml = posts.map((post) =>{

     const timeToGo = formatDistanceToNow(new Date(post.createdAt),  {locale: ru});
    return     `              <div class="page-container">
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
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
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
console.log(user.name);


  for (let postEl of document.querySelectorAll(".like-button")) {
    postEl.addEventListener("click", () => {
      const postId = postEl.dataset.postId;
        console.log(postEl);
      if (!posts.isLiked) {
        addLike({
          token: token,
          id: postId,
        })
        posts.isLiked =true;
      }
        if (posts.isLiked){
          disLike({
            token: token,
            id: postId,
        })
        posts.isLiked =false;
      }
    });

  }
}
