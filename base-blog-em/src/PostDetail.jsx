import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post, deleteMutation, updateTitleMutation }) {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id)
  });

  if (isLoading) { return <h3>Loading...</h3> }
  if (isError) { return <h3>Error...{error.toString()}</h3> }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && (
          <p className="loading">Deleting the post</p>
        )}
        {deleteMutation.isError && (
          <p className="error">
            Error deleting the post: {deleteMutation.error.toString()}
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p className="success">Post was (not) deleted</p>
        )}
      </div>
      <div>
        <button onClick={() => updateTitleMutation.mutate(post.id)}>Update title</button>
        {
          updateTitleMutation.isPending && (
            <p>isPending</p>
          )
        }
        {updateTitleMutation.isError && (<p>isError</p>)}
        {updateTitleMutation.isSuccess && (<p>isSuccess</p>)}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {
        data.map((comment) => (
          <li key={comment.id}>
            {comment.email}: {comment.body}
          </li>
        ))
      }
    </>
  );
}
