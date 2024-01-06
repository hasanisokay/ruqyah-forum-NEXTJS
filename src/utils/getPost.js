const getPost = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
      cache: "no-cache",
    });
    const post = await response.json();
    return post[0];
  } catch {
    const post = { status: 500, message:"server side error occurs" };
    return post;
  }
};

export default getPost;
