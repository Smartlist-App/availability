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
} from "@mui/material";
import { green } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

function EventDayTimes({ date, eventData }: any) {
  const [userAvailableTimes, setUserAvailableTimes] = useState<number[]>([]);
  let { noEarlierThan, noLaterThan } = eventData;
  noEarlierThan = dayjs(noEarlierThan).format("H");
  noLaterThan = dayjs(noLaterThan).format("H");

  const hoursInBetween = [];
  for (let i = noEarlierThan; i <= noLaterThan; i++) {
    hoursInBetween.push(parseInt(i));
  }

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 5,
        background: "rgba(200,200,200,.3)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        {dayjs(date.date).format("dddd, MMMM D")}
      </Typography>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
          {hoursInBetween.map((hour) => (
            <Button
              key={hour}
              size="small"
              color="success"
              onClick={(e: any) => {
                const newAvailableTimes = [...userAvailableTimes];
                if (newAvailableTimes.includes(hour)) {
                  newAvailableTimes.splice(newAvailableTimes.indexOf(hour), 1);
                } else {
                  newAvailableTimes.push(hour);
                }
                setUserAvailableTimes(newAvailableTimes);
              }}
              variant={userAvailableTimes.includes(hour) ? "contained" : "text"}
              sx={{
                ...(!userAvailableTimes.includes(hour) && {
                  boxShadow:
                    "0 0 0px 2px " + green["600"] + " inset !important",
                }),
              }}
            >
              {dayjs(date.date).hour(hour).format("h A")}
            </Button>
          ))}
        </Stack>
        <Button 
        >
          <Icon>check_circle_outline</Icon>
        </Button>
      </Box>
    </Box>
  );
}

function Scheduling({ eventData }: any) {
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
      {eventData.defaultDates.map((date: any) => (
        <EventDayTimes key={date.date} date={date} eventData={eventData} />
      ))}
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
