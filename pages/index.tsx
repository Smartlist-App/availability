import { Calendar } from "@mantine/dates";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Collapse,
  Container,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  NoSsr,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& span": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Icon sx={{ color: "inherit" }}>check</Icon>
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

function About() {
  return (
    <Box
      sx={{
        mt: 10,
        p: 2,
        textAlign: "center",
        borderRadius: 5,
        mb: 12,
        px: 4,
        maxWidth: "700px",
        mx: "auto",
      }}
    >
      <Typography gutterBottom variant="h3" className="text-secondary">
        Find the best time to meet.
      </Typography>
      <Typography color="text.secondary">
        Carbon helps you find the best time to meet based on your guest&apos;s
        availability. No signup required
      </Typography>
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 1, mt: 2, fontWeight: "700" }}>
            When?
          </Typography>
          <Typography sx={{ mb: 1 }} color="text.secondary">
            Select the possible days &amp; times you are open to meeting.
          </Typography>
          <Typography sx={{ mb: 1 }} color="text.secondary">
            Generally, it&apos;s better to select a maximum of 3-5 days to make
            it easier for your guests.
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth margin="dense" variant="filled" sx={{ mt: 7 }}>
            <InputLabel>No earlier than</InputLabel>

            <Select fullWidth value={minStartTime} variant="filled">
              {Array.from(Array(24).keys()).map((hour) => (
                <MenuItem
                  key={hour.toString()}
                  value={parseInt(
                    dayjs().startOf("day").add(hour, "hour").format("H")
                  )}
                  onClick={() => {
                    setMinStartTime(
                      parseInt(
                        dayjs().startOf("day").add(hour, "hour").format("H")
                      )
                    );
                  }}
                >
                  {dayjs().startOf("day").add(hour, "hour").format("h:mm A")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" variant="filled">
            <InputLabel>No later than</InputLabel>
            <Select
              fullWidth
              value={maxEndTime}
              variant="filled"
              error={minStartTime >= maxEndTime}
            >
              {Array.from(Array(24).keys()).map((hour) => (
                <MenuItem
                  disabled={minStartTime >= hour}
                  key={hour.toString()}
                  value={parseInt(
                    dayjs().startOf("day").add(hour, "hour").format("H")
                  )}
                  onClick={() => {
                    setMaxEndTime(
                      parseInt(
                        dayjs().startOf("day").add(hour, "hour").format("H")
                      )
                    );
                  }}
                >
                  {dayjs().startOf("day").add(hour, "hour").format("h:mm A")}
                </MenuItem>
              ))}
            </Select>
            {minStartTime >= maxEndTime && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                The end time must be after the start time.
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Calendar
            multiple
            value={dates}
            fullWidth
            firstDayOfWeek="sunday"
            minDate={dayjs().startOf("day").toDate()}
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
  const [title, setTitle] = useState("Let's meet up!");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const [dates, setDates] = useState<Date[]>([
    dayjs().startOf("day").toDate(),
    // dayjs().startOf("day").add(1, "day").toDate(),
  ]);
  const [minStartTime, setMinStartTime] = useState<any>(
    parseInt(dayjs().startOf("hour").format("H"))
  );
  const [maxEndTime, setMaxEndTime] = useState<any>(
    parseInt(dayjs().startOf("hour").add(1, "hour").format("H"))
  );

  const router = useRouter();
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
    if (dates.length > 15) {
      return toast.error("Please select a maximum of 15 dates");
    }

    setLoading(true);
    try {
      const res: any = await fetch("/api/createEvent", {
        method: "POST",
        body: JSON.stringify({
          name: title,
          description,
          location,
          noEarlierThan: dayjs()
            .startOf("day")
            .set("hour", minStartTime)
            .toISOString(),
          noLaterThan: dayjs()
            .startOf("day")
            .set("hour", maxEndTime)
            .toISOString(),
          defaultDates: JSON.stringify(
            dates.map((date) => dayjs(date).format("YYYY-MM-DD"))
          ),
        }),
      }).then((res) => res.json());
      router.push("/results/" + res.id);
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

  const [hideAdvanced, setHideAdvanced] = useState(true);
  const [step, setStep] = useState(0);

  return (
    <Box sx={{ mb: 5 }}>
      <About />
      <Stepper
        alternativeLabel
        activeStep={step}
        connector={<QontoConnector />}
        sx={{
          my: 5,
        }}
      >
        <Step>
          <StepLabel StepIconComponent={QontoStepIcon}>What?</StepLabel>
        </Step>
        <Step>
          <StepLabel StepIconComponent={QontoStepIcon}>When?</StepLabel>
        </Step>
        <Step>
          <StepLabel StepIconComponent={QontoStepIcon}>Share</StepLabel>
        </Step>
      </Stepper>

      {step == 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "700" }}>
              What?
            </Typography>
            <Typography color="text.secondary">
              Give your event a title. What is it about? If you haven&apos;t
              decided, just hit &quot;Next&quot;
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="dense"
              label="Event name"
              autoComplete="off"
              placeholder="“Family meet”"
              inputRef={inputRef}
              variant="filled"
            />
            <Box sx={{ display: "flex" }}>
              <Button size="small" sx={{ ml: "auto" }}>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => setHideAdvanced(!hideAdvanced)}
                >
                  {hideAdvanced ? "Show" : "Hide"} advanced options
                </Typography>
              </Button>
            </Box>
            <Collapse in={!hideAdvanced}>
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
            </Collapse>
          </Grid>
        </Grid>
      )}

      {step == 1 && (
        <EventCalendarPicker
          dates={dates}
          setDates={setDates}
          minStartTime={minStartTime}
          setMinStartTime={setMinStartTime}
          maxEndTime={maxEndTime}
          setMaxEndTime={setMaxEndTime}
        />
      )}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          disabled={step == 0}
          onClick={() => {
            if (step == 1) {
              setStep(0);
            }
          }}
          size="large"
          sx={{
            borderRadius: 9,
            mr: 2,
            display: step == 0 ? "none" : "",
          }}
        >
          Back
        </Button>
        <LoadingButton
          loading={loading}
          onClick={() => {
            if (step == 0) {
              setStep(1);
            } else if (step == 1) {
              handleSubmit();
            }
          }}
          size="large"
          variant="contained"
          sx={{ gap: 2, borderRadius: 9, mt: 3, ml: "auto" }}
        >
          {step == 0 ? "Next" : "Create event"}
          <Icon className="outlined">
            {step == 0 ? "arrow_forward" : "check_circle"}
          </Icon>
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default function Render() {
  return (
    <Container>
      <NoSsr>
        <CreateEventMenu />
      </NoSsr>
    </Container>
  );
}
