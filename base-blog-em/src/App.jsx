import { Posts } from "./Posts";
import "./App.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/*
react query concepts:-
fetching data
loading states -- error states
react query dev tools
pagination
prefetching
mutations
*/

/*
what we need for react query ?
1. create a client - query client
      that manages queries
      that manages cache.... okay buddy
2. create a provider - query provider
      provides cache                (to children)
      provides config - of client   (to children)

      requires input : query client (1.)
3. call useQuery hook
      hook - to query the server
*/

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}  >
      <div className="App">
        <h1>Blog &apos;em Ipsum</h1>
        <Posts />
        <ReactQueryDevtools />
        {/*
        ReactQueryDevtools:-
        1. status of queries 
        2. and when they were last updated 

        1. Actions 
        1. Data explorer
        1. Query explorer
        */}
      </div>
    </QueryClientProvider >
  );
}

export default App;
