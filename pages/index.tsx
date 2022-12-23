import { Calendar, TimeInput } from "@mantine/dates";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Container,
  Divider,
  Grid,
  Icon,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

function About() {
  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Typography
        gutterBottom
        variant="h5"
        sx={{
          fontWeight: 700,
        }}
      >
        Find the best time to meet
      </Typography>
      <Typography color="text.secondary">
        Availability helps you find the best time to meet with others by showing
        you when they&apos;re free. Create an event and share a link with others
        to gather available free times, and Carbon will automatically find the
        best time to meet! No signup required.
      </Typography>
      <Divider sx={{ my: 3 }} />
    </Box>
  );
}

function EventCalendarPicker({
  dates,
  setDates,
  minStartTime,
  setMinStartTime,
  maxEndTime,
  setMaxEndTime,
}: any) {
  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: "700" }}>
            When?
          </Typography>
          <Typography sx={{ mb: 1 }} color="text.secondary">
            Select the days and times you are <b>open to meeting.</b>
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography gutterBottom sx={{ mt: 1 }}>
            No earlier than
          </Typography>
          <TimeInput
            value={minStartTime}
            onChange={setMinStartTime}
            sx={{ marginBottom: "25px" }}
            variant="filled"
            size="md"
            radius="md"
            error={
              dayjs(minStartTime).isAfter(dayjs(maxEndTime)) &&
              "Start time should be before end time"
            }
            required
            format="12"
          />
          <Typography gutterBottom>No later than</Typography>
          <TimeInput
            value={maxEndTime}
            onChange={setMaxEndTime}
            sx={{ marginBottom: "25px" }}
            variant="filled"
            size="md"
            error={
              dayjs(maxEndTime).isBefore(dayjs(minStartTime)) &&
              "End time should be after start time"
            }
            required
            withAsterisk
            radius="md"
            format="12"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Calendar
            multiple
            value={dates}
            fullWidth
            firstDayOfWeek="sunday"
            onChange={setDates}
            style={{
              marginBottom: "15px",
            }}
            styles={(theme) => ({
              day: {
                borderRadius: 19,
                transition: "border-radius .2s",
                "&:hover": {
                  background: "#ddd",
                },
                "&:active": {
                  background: "#ccc",
                },
                color: "#000",
                "&[data-outside]": {
                  color:
                    (theme.colorScheme === "dark"
                      ? theme.colors.dark[3]
                      : theme.colors.gray[5]) + "!important",
                },
                "&[data-selected]": {
                  backgroundColor: "#000",
                  color: "#fff!important",
                  borderRadius: 9,
                  position: "relative",
                },

                "&[data-weekend]": {
                  color: "#000",
                },
              },
              cell: {
                padding: 1,
              },
            })}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function CreateEventMenu() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const [dates, setDates] = useState<Date[]>([
    dayjs().startOf("day").toDate(),
    // dayjs().startOf("day").add(1, "day").toDate(),
  ]);
  const [minStartTime, setMinStartTime] = useState<any>(
    dayjs().startOf("hour").toDate()
  );
  const [maxEndTime, setMaxEndTime] = useState<any>(
    dayjs().startOf("hour").add(9, "hour").toDate()
  );

  const handleSubmit = async () => {
    if (title == "") {
      return toast.error("Please enter a title for your event");
    }
    if (dayjs(minStartTime).isAfter(dayjs(maxEndTime))) {
      return toast.error("Start time should be before end time");
    }
    if (dates.length == 0) {
      return toast.error("Please select at least one date");
    }
    if (dates.length > 21) {
      return toast.error("Please select a maximum of 21 dates");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/createEvent", {
        method: "POST",
        body: JSON.stringify({
          name: title,
          description,
          location,
          noEarlierThan: minStartTime,
          noLaterThan: maxEndTime,
          defaultDates: JSON.stringify(
            dates.map((date) => dayjs(date).format("YYYY-MM-DD"))
          ),
        }),
      }).then((res) => res.json());
      const eventId = res.id;
      setLoading(false);
    } catch (err: any) {
      toast.error("An error occured:" + err.message);
      setLoading(false);
    }
  };
  const inputRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Box sx={{ mb: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "700" }}>
            What?
          </Typography>
          <Typography color="text.secondary">
            Give your event a title. What is this event about?
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="dense"
            label="Event name"
            placeholder="“Family meet”"
            inputRef={inputRef}
            variant="filled"
          />
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="filled"
            fullWidth
            multiline
            margin="dense"
            label="Description (optional)"
          />
          <TextField
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            variant="filled"
            fullWidth
            margin="dense"
            label="Location (optional)"
          />
        </Grid>
      </Grid>

      <EventCalendarPicker
        dates={dates}
        setDates={setDates}
        minStartTime={minStartTime}
        setMinStartTime={setMinStartTime}
        maxEndTime={maxEndTime}
        setMaxEndTime={setMaxEndTime}
      />
      <LoadingButton
        loading={loading}
        onClick={handleSubmit}
        fullWidth
        size="large"
        variant="contained"
        sx={{ gap: 2, borderRadius: 9 }}
      >
        <Icon>check</Icon>
        Create event
      </LoadingButton>
    </Box>
  );
}

export default function Render() {
  return (
    <Container>
      <About />
      <CreateEventMenu />
    </Container>
  );
}