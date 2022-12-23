import { AppBar, Icon, IconButton, Toolbar, Typography } from "@mui/material";
import type { AppProps } from "next/app";
import "../styles/globals.scss";

import { ScrollArea } from "@mantine/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Link from "next/link";

function Navbar() {
  return (
    <>
      <Head>
        <title>Availability &bull; A product of Carbon</title>
      </Head>
      <AppBar elevation={0} sx={{ height: "64px" }}>
        <Toolbar sx={{ gap: 1, height: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#fff",
              }}
            >
              Availability
            </Link>
          </Typography>
          <IconButton color="inherit">
            <Icon>add</Icon>
          </IconButton>
          <IconButton color="inherit">
            <Icon className="outlined">person</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar style={{ height: "64px" }} />
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          style: {
            textTransform: "none",
          },
        },
      },
      MuiIcon: {
        defaultProps: {
          // Replace the `material-icons` default value.
          baseClassName: "material-symbols-rounded",
        },
        variants: [
          {
            props: {
              className: "outlined",
            },
            style: {
              fontVariationSettings:
                '"FILL" 0, "wght" 350, "GRAD" 0, "opsz" 40!important',
            },
          },
        ],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ScrollArea style={{ height: "100vh" }} scrollbarSize={10}>
        <Navbar />
        <Component {...pageProps} />
      </ScrollArea>
    </ThemeProvider>
  );
}
