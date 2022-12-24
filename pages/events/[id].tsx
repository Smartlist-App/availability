import { LoadingButton } from "@mui/lab";
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
import toast from "react-hot-toast";
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
        // disableRipple
        key={hour}
        size="small"
        color="success"
        onClick={() => handleClick(hour)}
        variant={
          userAvailableTimes[date.date].includes(hour) ? "contained" : "text"
        }
        sx={{
          transition: "border-radius .2s",
          borderRadius: userAvailableTimes[date.date].includes(hour)
            ? "13px"
            : "10px",
          ...(!userAvailableTimes[date.date].includes(hour) && {
            background: green[100] + "!important",
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
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          color="success"
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
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1, ml: 5.5 }}>
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
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/addGuestTime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          userAvailableTimes: userAvailableTimes,
          eventId: eventData.id,
        }),
      }).then((res) => res.json());
      toast.success(
        "Your edits have been carefully saved. Redirecting yout to the results..."
      );
      router.push(`/results/${eventData.id}`);
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        borderTop: "1px solid #ccc",
        mt: 5,
        pt: 5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "700" }}>
            Possible times
          </Typography>
          <Typography>Select the times you&apos;re available!</Typography>
        </Box>
        <Tooltip
          title={`Out of these selected dates, enter the times you are available with.
        Once you're done, enter your name and click "Submit" to
        continue.`}
        >
          <IconButton sx={{ ml: "auto" }}>
            <Icon className="outlined">help_outline</Icon>
          </IconButton>
        </Tooltip>
      </Box>

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
          bottom: 25,
          width: "100%",
          maxWidth: { xs: "calc(100% - 40px)", sm: "500px" },
          left: "50%",
          transform: "translateX(-50%)",
          border: "1px solid #ccc",
        }}
      >
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          size="small"
          label="What's your name?"
          autoComplete="off"
          InputProps={{
            sx: {
              borderRadius: 3,
            },
          }}
          fullWidth
          color="success"
        />
        <Tooltip
          title={
            Object.values(userAvailableTimes).filter(
              (times: any) => times.length > 0
            ).length === 0
              ? "Please select at least one time"
              : name.trim() === ""
              ? "Please enter your name"
              : "Submit"
          }
        >
          <Box>
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={handleSubmit}
              sx={{ gap: 2, borderRadius: 99, px: 2 }}
              color="success"
              disabled={
                name.trim() == "" ||
                Object.values(userAvailableTimes).filter(
                  (times: any) => times.length > 0
                ).length === 0
              }
            >
              Submit
              <Icon>send</Icon>
            </LoadingButton>
          </Box>
        </Tooltip>
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
                sx={{
                  mb: 2,
                  fontWeight: "200",
                  gap: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span>{data.description}</span>&bull;
                <span
                  style={{ gap: "10px", display: "flex", alignItems: "center" }}
                >
                  <Icon>pin_drop</Icon>
                  {data.location}
                </span>
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
          <Box sx={{ mb: 17 }} />
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
