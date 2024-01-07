const getPosts = async (pageIndex) => {
  try {
    let apiUrl;
    if (pageIndex === 1)
      apiUrl = `http://localhost:3000/api/posts?page=${pageIndex}`;
    else apiUrl = `/api/posts?page=${pageIndex}`;
    const response = await fetch(apiUrl);
    const post = await response.json();
    return post;
  } catch {
    const post = { status: 500, message: "server side error occurs" };
    return post;
  }
};

export default getPosts;
