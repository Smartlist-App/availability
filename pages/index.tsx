import {
  Container,
  Box,
  Typography,
  Divider,
  Icon,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import { TimeInput } from "@mantine/dates";
import { Calendar } from "@mantine/dates";
import { useState } from "react";

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

function EventCalendarPicker() {
  const [dates, setDates] = useState<Date[]>([]);

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
            sx={{ marginBottom: "25px" }}
            variant="filled"
            size="md"
            radius="md"
            format="12"
          />
          <Typography gutterBottom>No later than</Typography>
          <TimeInput
            sx={{ marginBottom: "25px" }}
            variant="filled"
            size="md"
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
              // margin: "auto",
              marginBottom: "15px",
            }}
            styles={(theme) => ({
              day: {
                borderRadius: 19,
                transition: "border-radius .2s",
                "&:hover": {
                  background: "#ddd",
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
            fullWidth
            margin="dense"
            label="Event name"
            placeholder="“Family meet”"
            autoFocus
            variant="filled"
          />
          <TextField
            variant="filled"
            fullWidth
            multiline
            margin="dense"
            label="Description (optional)"
          />
        </Grid>
      </Grid>

      <EventCalendarPicker />
      <Button
        fullWidth
        size="large"
        variant="contained"
        sx={{ gap: 2, borderRadius: 9 }}
      >
        <Icon>check</Icon>
        Create event
      </Button>
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
