import {
  Box,
  Chip,
  Container,
  Icon,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  InputAdornment,
  TextField,
  Divider,
} from "@mui/material";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import useSWR from "swr";

export type GuestTimes = GuestTime[];

export interface GuestTime {
  id: number;
  name: string;
  times: Times;
  eventId: string;
}

export interface Times {
  [key: string]: number[];
}

function Results({ data }: { data: any }) {
  const {
    event,
    guestTimes,
  }: {
    event: any;
    guestTimes: GuestTimes;
  } = data;

  let { defaultDates, noEarlierThan, noLaterThan } = event;

  noEarlierThan = dayjs(noEarlierThan).format("H");
  noLaterThan = dayjs(noLaterThan).format("H");

  const hoursInBetween: any = [];
  for (let i = noEarlierThan; i <= noLaterThan; i++) {
    hoursInBetween.push(parseInt(i));
  }

  const hourWhereMostGuestsAreFree = hoursInBetween
    .map((hour: number) => {
      // Get all guestTimes time into an array
      const allGuestTimes = guestTimes
        .map((guestTime) => Object.values(guestTime.times).flat())
        .flat();
      return {
        hour,
        count: allGuestTimes.filter((time) => time === hour).length,
      };
    })
    .sort((a: any, b: any) => b.count - a.count)[0];

  const dayWhenMostGuestsAreFree = defaultDates
    .map((date: any) => {
      // Add up all the times for current date
      const currentDayCount = guestTimes
        .map((guestTime) => guestTime.times[date.date])
        .flat()
        .filter((time) => time).length;

      return {
        date: date.date,
        count: currentDayCount,
      };
    })
    .sort((a: any, b: any) => b.count - a.count)[0];

  // const overallBestDayAndTime

  return (
    <Box>
      <Box
        sx={{
          p: 2,
          borderRadius: 5,
          background: "rgba(200,200,200,.3)",
          mb: 2,
        }}
      >
        <Typography variant="body1" gutterBottom>
          The best hour to meet is{" "}
        </Typography>
        <Typography variant="h5">
          <u>
            <b>
              {hourWhereMostGuestsAreFree.hour % 12 || 12}{" "}
              {hourWhereMostGuestsAreFree.hour >= 12 ? "PM" : "AM"}
            </b>
          </u>
          , where{" "}
          <b>
            {hourWhereMostGuestsAreFree.count}{" "}
            {hourWhereMostGuestsAreFree.count == 1 ? "person" : "people"}
          </b>{" "}
          {hourWhereMostGuestsAreFree.count == 1 ? "is" : "are"} available,
          regardless of the date.
        </Typography>
      </Box>
      <Box
        sx={{
          p: 2,
          borderRadius: 5,
          background: "rgba(200,200,200,.3)",
          mb: 5,
        }}
      >
        <Typography variant="body1" gutterBottom>
          The best day to meet is{" "}
        </Typography>
        <Typography variant="h5">
          <u>
            <b>{dayjs(dayWhenMostGuestsAreFree.date).format("dddd, MMMM D")}</b>
          </u>
          , where{" "}
          <b>
            {dayWhenMostGuestsAreFree.count}{" "}
            {dayWhenMostGuestsAreFree.count == "1" ? "time slot" : "time slots"}
          </b>{" "}
          {dayWhenMostGuestsAreFree.count == 1 ? "is" : "are"} available,
          regardless of the hour.
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: "700" }}>
        Detailed view
      </Typography>

      <Typography
        color="text.secondary"
        gutterBottom
        sx={{ mb: 5 }}
        variant="h6"
      >
        {defaultDates.map((date: any) => (
          <Box
            key={date.date}
            sx={{
              background: "rgba(200,200,200,.3)",
              p: 1,
              display: "flex",
              alignItems: "center",
              my: 2,
              borderRadius: 3,
            }}
          >
            {dayjs(date.date).format("dddd, MMMM D")}
            <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
              {hoursInBetween.map((hour: number) => (
                <Box
                  key={hour}
                  sx={{
                    // If hour appears the most, make it green
                    background:
                      hourWhereMostGuestsAreFree.hour === hour
                        ? "rgba(200,200,200,.7)"
                        : "rgba(200,200,200,.3)",
                    "&:hover": {
                      background: "rgba(200,200,200,.5)",
                      color: "black",
                      cursor: "pointer",
                    },
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    borderRadius: 3,
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "rgba(0,0,0,.5)",
                  }}
                >
                  {hour % 12 || 12} {hour >= 12 ? "PM" : "AM"}
                  <span style={{ fontSize: "15px" }}>
                    {
                      guestTimes.filter(
                        (guestTime) =>
                          guestTime.times[date.date] &&
                          guestTime.times[date.date].includes(hour)
                      ).length
                    }
                  </span>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Typography>
    </Box>
  );
}

export default function Event() {
  const router = useRouter();
  const id = router.query.id;
  const url = `/api/guestTimes?id=${id}`;

  const { data, error } = useSWR(url, (url) =>
    fetch(url).then((r) => r.json())
  );

  return (
    <Container sx={{ mt: 8 }}>
      {data && data.event ? (
        <>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: "700",
              textDecoration: "underline",
            }}
          >
            {data.event.name}
          </Typography>
          {data.event.description ||
            (data.event.location && (
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{
                  mb: 2,
                  fontWeight: "200",
                  gap: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span>{data.event.description}</span>&bull;
                <span
                  style={{ gap: "10px", display: "flex", alignItems: "center" }}
                >
                  <Icon>pin_drop</Icon>
                  {data.event.location}
                </span>
              </Typography>
            ))}
          <Stack direction="row" spacing={1}>
            <Chip
              label={
                "No earlier than " +
                dayjs(data.event.noEarlierThan)
                  .format("h:mm A")
                  .replace(":00 ", " ")
              }
            />
            <Chip
              label={
                "No later than " +
                dayjs(data.event.noLaterThan)
                  .format("h:mm A")
                  .replace(":00 ", " ")
              }
            />
          </Stack>

          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" sx={{ fontWeight: "700" }} gutterBottom>
            Share
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Share this event with others to gather available free times, and
            Carbon will automatically find the best time to meet!
          </Typography>
          <TextField
            fullWidth
            onClick={(e: any) => {
              e.target.select();
              navigator.clipboard.writeText(
                "https://" +
                  window.location.hostname +
                  "/events/" +
                  data.event.id
              );
              toast.success("Copied to clipboard");
            }}
            margin="dense"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      "& .MuiIcon-root": {
                        transition: "all .2s",
                        fontVariationSettings:
                          '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
                      },
                      "&:hover .MuiIcon-root": {
                        fontVariationSettings:
                          '"FILL" 1, "wght" 350, "GRAD" 0, "opsz" 40!important',
                      },
                    }}
                    onClick={() => {
                      window.navigator.share({
                        url:
                          "https://" +
                          window.location.hostname +
                          "/events/" +
                          data.event.id,
                        text: "Carbon Availability • Find the best time to meet",
                      });
                    }}
                  >
                    <Icon>share</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={
              "https://" + window.location.hostname + "/events/" + data.event.id
            }
          />
          <Divider sx={{ my: 4 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: "700", mb: 4 }}
            gutterBottom
          >
            Results
          </Typography>
          {data.guestTimes.length > 0 ? (
            <Results data={data} />
          ) : (
            <Typography color="text.secondary" sx={{ mt: -3, mb: 5 }}>
              No results yet - Check back later!
            </Typography>
          )}
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
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={25}
            sx={{ borderRadius: 5, mb: 2, mt: 4, width: "40%" }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={20}
            sx={{ borderRadius: 5, mb: 2, width: "70%" }}
          />
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              animation="wave"
              height={100}
              sx={{ borderRadius: 5, mb: 2 }}
            />
          ))}
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
