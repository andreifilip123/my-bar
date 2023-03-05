import { Box } from "@chakra-ui/react";
import { useCallback } from "react";
import Spotlight from "../components/Spotlight";
import useWindowDimensions from "../utils/hooks/useWindowDimensions";

const CocktailOfTheWeek = () => {
  const { width, height } = useWindowDimensions();

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
    <Box height="100vh" backgroundColor="black" color="white">
      <Spotlight
        state="on"
        angle={angle(0, 0)}
        extraStyles={{ position: "absolute", top: "0", left: "0" }}
      />
      <Spotlight
        state="on"
        angle={angle(width, 0)}
        extraStyles={{ position: "absolute", top: "0", right: "0" }}
      />
    </Box>
  );
};

export default CocktailOfTheWeek;
