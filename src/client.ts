import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { getCookie } from "cookies-next";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const authLink = new SetContextLink((prevContext) => {
  const accessToken = getCookie("accessToken");
  return {
    headers: {
      ...prevContext.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
