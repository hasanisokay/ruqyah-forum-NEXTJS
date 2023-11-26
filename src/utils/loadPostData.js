import wait from "./wait";

const loadPostData = async(id) => {
    // await wait()
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id?id:""}` ,{
        cache:"no-cache"
    });
    const r = await res.json();
return r
};

export default loadPostData;