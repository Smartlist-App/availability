import {
  Box,
  Container,
  Chip,
  Stack,
  Typography,
  Skeleton,
  IconButton,
  Icon,
  Grid,
  Button,
  Tooltip,
  Checkbox,
  TextField,
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { memo, useCallback, useRef, useState } from "react";
import useSWR from "swr";

function EventDayTimes({
  userAvailableTimes,
  setUserAvailableTimes,
  date,
  eventData,
}: any) {
  let { noEarlierThan, noLaterThan } = eventData;
  noEarlierThan = dayjs(noEarlierThan).format("H");
  noLaterThan = dayjs(noLaterThan).format("H");

  const hoursInBetween: any = [];
  for (let i = noEarlierThan; i <= noLaterThan; i++) {
    hoursInBetween.push(parseInt(i));
  }

  const HourButton = memo(function HourButton({
    hour,
    userAvailableTimes,
    handleClick,
  }: any) {
    return (
      <Button
        disableRipple
        key={hour}
        size="small"
        color="success"
        onClick={() => handleClick(hour)}
        variant={
          userAvailableTimes[date.date].includes(hour) ? "contained" : "text"
        }
        sx={{
          transition: "none",
          ...(!userAvailableTimes[date.date].includes(hour) && {
            boxShadow: "0 0 0px 2px " + green["600"] + " inset !important",
          }),
        }}
      >
        {dayjs(date.date).hour(hour).format("h A")}
      </Button>
    );
  });

  const handleClick = useCallback(
    (hour: any) => {
      const newAvailableTimes = [...userAvailableTimes[date.date]];
      if (newAvailableTimes.includes(hour)) {
        newAvailableTimes.splice(newAvailableTimes.indexOf(hour), 1);
      } else {
        newAvailableTimes.push(hour);
      }
      setUserAvailableTimes({
        ...userAvailableTimes,
        [date.date]: newAvailableTimes,
      });
    },
    [date.date, setUserAvailableTimes, userAvailableTimes]
  );
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 5,
        background: "rgba(200,200,200,.3)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 1, display: "flex", alignItems: "center" }}
      >
        <Checkbox
          checked={userAvailableTimes[date.date].length > 0}
          indeterminate={
            userAvailableTimes[date.date].length > 0 &&
            userAvailableTimes[date.date].length < hoursInBetween.length
          }
          onChange={(e) => ref.current?.click()}
        />
        {dayjs(date.date).format("dddd, MMMM D")}
      </Typography>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
          {hoursInBetween.map((hour: any) => (
            <HourButton
              hour={hour}
              key={hour}
              userAvailableTimes={userAvailableTimes}
              handleClick={handleClick}
            />
          ))}
        </Stack>
        <Box>
          <Tooltip title="Apply to all">
            <Button
              sx={{ minWidth: 0, px: 1, borderRadius: 999 }}
              onClick={() => {
                // apply key `date.date`'s values to all dates in object
                setUserAvailableTimes({
                  ...userAvailableTimes,
                  ...Object.keys(userAvailableTimes).reduce(
                    (acc: any, key: any) => {
                      acc[key] = userAvailableTimes[date.date];
                      return acc;
                    },
                    {}
                  ),
                });
              }}
            >
              <Icon>copy_all</Icon>
            </Button>
          </Tooltip>
          <Tooltip
            title={
              userAvailableTimes[date.date].length > 0
                ? "Deselect all"
                : "Select all"
            }
          >
            <Button
              sx={{ minWidth: 0, px: 1, borderRadius: 999 }}
              onClick={() => {
                // apply all values `date.date` if not already selected, else empty array
                if (userAvailableTimes[date.date].length > 0) {
                  setUserAvailableTimes({
                    ...userAvailableTimes,
                    [date.date]: [],
                  });
                } else {
                  setUserAvailableTimes({
                    ...userAvailableTimes,
                    [date.date]: hoursInBetween,
                  });
                }
              }}
              ref={ref}
            >
              <Icon>
                {userAvailableTimes[date.date].length > 0
                  ? "deselect"
                  : "select_all"}
              </Icon>
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

function Scheduling({ eventData }: any) {
  const [userAvailableTimes, setUserAvailableTimes] = useState<{
    [key: string]: number[];
  }>({
    ...eventData.defaultDates.reduce((acc: any, date: any) => {
      acc[date.date] = [];
      return acc;
    }, {}),
  });

  return (
    <Box
      sx={{
        borderTop: "1px solid #ccc",
        mt: 5,
        pt: 5,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "700" }}>
        Open times
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Out of these selected dates, enter the times you are available with.
        Once you&apos;re done, enter your name and click &quot;Submit&quot; to
        continue.
      </Typography>
      {eventData.defaultDates.map((date: any) => (
        <EventDayTimes
          key={date.date}
          date={date}
          eventData={eventData}
          userAvailableTimes={userAvailableTimes}
          setUserAvailableTimes={setUserAvailableTimes}
        />
      ))}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "#fff",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          borderRadius: 5,
          p: 2,
          position: "fixed",
          bottom: 15,
          width: "100%",
          maxWidth: { xs: "calc(100% - 40px)", sm: "500px" },
          left: "50%",
          transform: "translateX(-50%)",
          border: "1px solid #ccc",
        }}
      >
        <TextField
          variant="standard"
          placeholder="What's your name?"
          fullWidth
        />
        <Button
          variant="contained"
          sx={{ gap: 2, borderRadius: 99, px: 4 }}
          color="success"
        >
          Submit
          <Icon>send</Icon>
        </Button>
      </Box>
    </Box>
  );
}

export default function Event() {
  const router = useRouter();
  const id = router.query.id;
  const url = `/api/events?id=${id}`;
  const { data, error } = useSWR(url, (url) =>
    fetch(url).then((r) => r.json())
  );

  return (
    <Container sx={{ mt: 8 }}>
      {data ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  mb: 2,
                  textDecoration: "underline",
                }}
              >
                {data.name}
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                gutterBottom
                sx={{ mb: 2 }}
              >
                {data.description}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={
                    "No earlier than " +
                    dayjs(data.noEarlierThan)
                      .format("h:mm A")
                      .replace(":00 ", " ")
                  }
                />
                <Chip
                  label={
                    "No later than " +
                    dayjs(data.noLaterThan)
                      .format("h:mm A")
                      .replace(":00 ", " ")
                  }
                />
              </Stack>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <IconButton
                onClick={(e: any) => {
                  navigator.share({
                    url:
                      "https://" +
                      window.location.hostname +
                      "/events/" +
                      data.id,
                    text: "Carbon Availability • Find the best time to meet",
                  });
                }}
                size="large"
              >
                <Icon>share</Icon>
              </IconButton>
            </Box>
          </Box>
          <Scheduling eventData={data} />
        </>
      ) : (
        <Box>
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={75}
            sx={{ borderRadius: 5, mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={30}
            sx={{ borderRadius: 5, mb: 2, width: "60%" }}
          />
          <Stack spacing={2} direction="row">
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={30}
              sx={{ borderRadius: 5, mb: 2, width: "100px" }}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={30}
              sx={{ borderRadius: 5, mb: 2, width: "100px" }}
            />
          </Stack>
        </Box>
      )}
      {error && (
        <Box
          sx={{
            p: 2,
            borderRadius: 5,
            mb: 5,
            background: "rgba(200,200,200,.3)",
          }}
        >
          An error occured while trying to fech the event information. Please
          try again later.
        </Box>
      )}
    </Container>
  );
}
