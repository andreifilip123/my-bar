import Image from "next/image";
import type { FC } from "react";

import styles from "./Spotlight.module.scss";

import { Box } from "@chakra-ui/react";
import spotlightOff from "./off.png";
import spotlightOn from "./on.png";

interface Props {
  state: "on" | "off";
}

const Spotlight: FC<Props> = ({ state }) => (
  <Box position="relative">
    <Box className={state === "off" ? styles.spotlightOff : styles.spotlightOn}>
      <Image
        src={state === "off" ? spotlightOff : spotlightOn}
        alt="Spotlight"
      />
    </Box>
  </Box>
);

export default Spotlight;
