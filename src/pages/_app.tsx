import { ChakraProvider } from "@chakra-ui/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useEffect } from "react";

import { api } from "../utils/api";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const wakeUpDatabase = api.neon.wakeUpDatabase.useMutation({
    onSuccess: () => console.log("Database is awake"),
    onError: (error) => console.log("Error waking up database", error),
    retry: 3,
  });

  useEffect(() => {
    wakeUpDatabase.mutate();
  }, [wakeUpDatabase]);

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
