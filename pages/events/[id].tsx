import {
  Box,
  Container,
  Chip,
  Stack,
  Typography,
  Skeleton,
  IconButton,
  Icon,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import useSWR from "swr";

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
                  dayjs(data.noLaterThan).format("h:mm A").replace(":00 ", " ")
                }
              />
            </Stack>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton
              onClick={(e: any) => {
                navigator.clipboard.writeText(
                  "https://" + window.location.hostname + "/events/" + data.id
                );
              }}
              size="large"
            >
              <Icon>share</Icon>
            </IconButton>
          </Box>
        </Box>
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
