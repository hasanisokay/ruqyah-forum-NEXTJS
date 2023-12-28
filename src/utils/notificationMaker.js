const notificationMaker = (
  name,
  type,
  commentAuthor,
  postAuthor,
  loggedUser,
  content
) => {
  let notificaion;
  let part = "";
  if (type === "comment") {
    notificaion = `${name} commented on `;
  } else if (type === `reply`) {
    notificaion = `${name} replied to`;
  } else if (type === `report`) {
    notificaion = `${name} reported`;
  } else if (type === `approve`) {
    notificaion = `Your post is approved.`;
  } else if (type === `like`) {
    notificaion = `${name} liked your ${content} `;
  }
  if (type === "reply" || type ==="comment") {
    if (commentAuthor === loggedUser) {
      part = " your comment.";
    } else if (postAuthor === loggedUser) {
      part = " your post.";
    } else {
      part = ` a ${type === "reply" ? "comment" : "post"} you are following `;
    }
  }
  return notificaion + part;
};

export default notificationMaker;
