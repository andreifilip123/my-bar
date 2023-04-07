import { Center } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <Center h="100vh" w="100vw">
    <SignUp path="/signup" routing="path" signInUrl="/login" />
  </Center>
);

export default SignUpPage;
