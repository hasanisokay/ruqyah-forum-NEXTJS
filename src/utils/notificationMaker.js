const notificationMaker = (
  name,
  type,
  commentAuthor,
  postAuthor,
  loggedUser,
  content
) => {
  let notificaion;
  let deleted = "";
  if ((type==="comment" || type ==="reply") && !commentAuthor) {
    deleted = " (deleted)";
  }
  if (type === "comment") {
    if (loggedUser === postAuthor) {
      notificaion = `${name} commented on your post. `;
    } else {
      notificaion = `${name} commented on a post you are following. `;
    }
  } else if (type === `reply`) {
    if (loggedUser === commentAuthor) {
      notificaion = `${name} replied to your comment.`;
    } else if (loggedUser === postAuthor) {
      notificaion = `${name} replied to a comment your post. `;
    } else {
      notificaion = `${name} replied to a comment you are following.`;
    }
  } else if (type === `report`) {
    notificaion = `${name} reported a ${content}`;
  } else if (type === `approve`) {
    notificaion = `Your post is approved.`;
  } else if (type === `like`) {
  } else if (type === `declined`) {
    notificaion = `Your post is declined. It may violated our rules.`;
  } else if (type === `like`) {
    notificaion = `${name} liked your ${content || ""} `;
  }
  return notificaion + deleted;
};

export default notificationMaker;
