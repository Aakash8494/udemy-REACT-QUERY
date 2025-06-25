import { useEffect, useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  /*
  1. useQuery takes an object of options
  *. or we can say takes an object returns an object 
  */

  /*
  https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  const {
  data,<----------------------------------------
  dataUpdatedAt,
  error,<----------------------------------------
  errorUpdatedAt,
  failureCount,
  failureReason,
  fetchStatus,
  isError,<----------------------------------------
  isFetched,
  isFetchedAfterMount,
  isFetching,<----------------------------------------maybe useful during pagination - difference of cached - isloading is subset
  isInitialLoading,
  isLoading,<--------------------------------------
  isLoadingError,
  isPaused,
  isPending,
  isPlaceholderData,
  isRefetchError,
  isRefetching,
  isStale,
  isSuccess,
  promise,
  refetch,
  status,
} = useQuery(
  {
    queryKey,
    queryFn,
    gcTime,
    enabled,
    networkMode,
    initialData,
    initialDataUpdatedAt,
    meta,
    notifyOnChangeProps,
    placeholderData,
    queryKeyHashFn,
    refetchInterval,
    refetchIntervalInBackground,
    refetchOnMount,
    refetchOnReconnect,
    refetchOnWindowFocus,
    retry,
    retryOnMount,
    retryDelay,
    select,
    staleTime,
    structuralSharing,
    subscribed,
    throwOnError,
  },
  queryClient,
)
  */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage)
  });

  /**
   * PREFETCHING - 
   * prefetch query is the method of the 
   * const queryClient = new QueryClient();---------- from App.jsx of QueryClient()
   * 
   * and we can get that from hook useQueryClient()
   */
  const queryClient = useQueryClient();

  /**
   * useEffect on currentPage so whenever it changes in one direction we prefetch next page
   */
  useEffect(() => {

    /**
     * and we are making use of the queryClient returned from useQueryClient to prefetch
     * UNLIKE useQuery hook
     */
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage)
      })
    }
  }, [currentPage, queryClient])



  /**
   * mutation...
1. optimistic
2. return and update then
3. invalidate that will trigger refetch

   * steps for mutation :-
1. use hook useMutation

   * points for mutation :-
1. similar to useQuery but returns mutate function
2. dosent need query key
3. isLoading but no isFetching
4. by default, no retries (configurable!)
   */
  const deleteMutation = useMutation({
    mutationFn: (postid) => deletePost(postid)
  })

  const updateTitleMutation = useMutation({
    mutationFn: (postid) => updatePost(postid)
  })

  if (isLoading) { return <h3>Loading...</h3> }
  if (isError) { return <h3>Error...{error.toString()}</h3> }


  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              updateTitleMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => { setCurrentPage(prev => prev - 1) }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => { setCurrentPage(prev => prev + 1) }}>
          Next page
        </button>
      </div>
      <hr />
      {
        selectedPost &&
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateTitleMutation={updateTitleMutation} />
      }
    </>
  );
}
