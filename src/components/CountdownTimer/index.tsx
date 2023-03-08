import { Text } from "@chakra-ui/react";
import type { FC } from "react";
import { useCountdown } from "../../utils/hooks/useCountdown";

interface Props {
  targetDate: Date;
  onComplete?: () => void;
}

const CountdownTimer: FC<Props> = ({ targetDate, onComplete }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  if (!days && !hours && !minutes && !seconds) {
    return null;
  }

  if (days + hours + minutes + seconds <= 0) {
    onComplete && onComplete();
    return null;
  } else {
    return (
      <Text fontSize="8xl" fontWeight="bold" color="white">
        {days
          ? `${days} days ${hours} hours`
          : `${hours}:${minutes}:${seconds}`}
      </Text>
    );
  }
};

export default CountdownTimer;
