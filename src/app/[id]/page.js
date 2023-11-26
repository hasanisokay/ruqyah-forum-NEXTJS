import SinglePostInHomePage from "./SinglePostInHomePage";

const singlePost = ({ params }) => {
    const postID = params.id;

    return (
        <div>
            <SinglePostInHomePage id={postID}/>
        </div>
    );
};

export default singlePost;