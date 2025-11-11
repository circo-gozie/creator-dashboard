import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import Cookies from 'js-cookie';

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
});

const authLink = new SetContextLink((prevContext) => {
    const accessToken = Cookies.get('accessToken');
    return {
        headers: {
            ...prevContext.headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
