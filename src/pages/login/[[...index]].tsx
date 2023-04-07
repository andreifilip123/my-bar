import { Center } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <Center h="100vh" w="100vw">
    <SignIn path="/login" routing="path" signUpUrl="/signup" />
  </Center>
);

export default SignInPage;
