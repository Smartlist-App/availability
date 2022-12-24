import { Container, Chip, Stack, Typography } from "@mui/material";
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
    <Container sx={{ mt: 4 }}>
      <Typography
        variant="h2"
        sx={{
          textDecoration: "underline",
        }}
      >
        {data.name}
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {data.description || <i>(no description provided)</i>}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Chip
          label={
            "No earlier than " + dayjs(data.noEarlierThan).format("h:mm A")
          }
        />
        <Chip
          label={"No later than " + dayjs(data.noLaterThan).format("h:mm A")}
        />
      </Stack>
      {data && JSON.stringify(data)}
      {error && (
        <div>
          An error occured while trying to fech the event information. Please
          try again later.
        </div>
      )}
    </Container>
  );
}
