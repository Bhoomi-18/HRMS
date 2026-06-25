'use client';

import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client/react";
import { PropsWithChildren } from "react";
import { store } from "../store";
import { apolloClient } from "../lib/apolloClient";
import { SessionProvider } from "../context/SessionContext";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: PropsWithChildren) {
	return (
		<ReduxProvider store={store}>
			<ApolloProvider client={apolloClient}>
				<SessionProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
					</ThemeProvider>
				</SessionProvider>
			</ApolloProvider>
		</ReduxProvider>
	);
}


