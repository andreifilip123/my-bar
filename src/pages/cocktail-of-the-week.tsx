import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

import CountdownTimer from "@/components/cocktail-of-the-week/CountdownTimer";
import Spotlight from "@/components/cocktail-of-the-week/Spotlight";
import CocktailCard from "@/components/cocktails/CocktailCard";
import { env } from "@/env.mjs";
import { api } from "@/utils/api";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";

const CocktailOfTheWeek = () => {
  const { width, height } = useWindowDimensions();
  let targetDate;
  if (env.NEXT_PUBLIC_TARGET_DATE) {
    targetDate = new Date(env.NEXT_PUBLIC_TARGET_DATE);
  } else {
    // if no date is set, use the next thursday at 20:00
    targetDate = new Date();
    targetDate.setDate(
      targetDate.getDate() + ((4 + 7 - targetDate.getDay()) % 7),
    );
    targetDate.setHours(20);
  }

  const ONE_DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
  const shouldShowCountdownTimer =
    targetDate.getTime() - ONE_DAY_IN_MILISECONDS < Date.now() &&
    Date.now() < targetDate.getTime();

  const [showCocktail, setShowCocktail] = useState(!shouldShowCountdownTimer);

  const { data: cocktail } = api.cocktail.getCocktailOfTheWeek.useQuery(
    {},
    { enabled: showCocktail },
  );

  const angle = useCallback(
    (x: number, y: number) => {
      if (!width || !height) {
        return 0;
      }
      const center = {
        x: width / 2,
        y: height * 0.75,
      };
      const radians = Math.atan2(y - center.y, x - center.x);
      return 90 + (radians * 180) / Math.PI;
    },
    [width, height],
  );

  if (!width || !height) return null;

  return (
    <Flex
      height="100vh"
      backgroundColor="black"
      color="white"
      justifyContent="center"
      alignItems={shouldShowCountdownTimer ? "center" : "flex-end"}
    >
      <motion.div
        style={{ position: "absolute", top: "0", left: "0" }}
        animate={{ rotate: angle(0, 0) }}
        transition={
          shouldShowCountdownTimer
            ? {
                ease: "linear",
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
      >
        <Spotlight state="on" />
      </motion.div>
      <motion.div
        style={{ position: "absolute", top: "0", right: "0" }}
        animate={{ rotate: angle(width, 0) }}
        transition={
          shouldShowCountdownTimer
            ? {
                ease: "linear",
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
      >
        <Spotlight state="on" />
      </motion.div>
      {showCocktail && cocktail ? (
        <>
          <ConfettiExplosion />
          <CocktailCard {...cocktail} />
        </>
      ) : null}
      {shouldShowCountdownTimer ? (
        <CountdownTimer
          targetDate={targetDate}
          onComplete={() => setShowCocktail(true)}
        />
      ) : null}
    </Flex>
  );
};

export default CocktailOfTheWeek;
