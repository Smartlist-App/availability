import {
  AppBar,
  Box,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import type { AppProps } from "next/app";
import "../styles/globals.scss";

import { ScrollArea } from "@mantine/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

function Navbar() {
  return (
    <>
      <Head>
        <title>Availability &bull; A product of Carbon</title>
      </Head>
      <AppBar
        elevation={0}
        sx={{
          height: "70px",
          background: "rgba(255,255,255,.5)",
          backdropFilter: "blur(10px)",
          color: "#505050",
          borderBottom: "1px solid rgba(200,200,200,.5)",
        }}
      >
        <Toolbar sx={{ gap: 1, height: "100%" }}>
          <Box sx={{ mr: "auto" }}>
            <Typography
              variant="h6"
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  color: "#000",
                }}
              >
                Availability
              </Link>
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            disableRipple
            sx={{
              "&:hover": { background: "rgba(200,200,200,.3)", color: "#000" },
            }}
          >
            <Icon>add</Icon>
          </IconButton>
          <IconButton
            color="inherit"
            disableRipple
            sx={{
              "&:hover": { background: "rgba(200,200,200,.3)", color: "#000" },
            }}
          >
            <Icon className="outlined">person</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar style={{ height: "70px" }} />
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
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiMenu: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.unstable_sx({
              transition: "all .2s",
              "& .MuiPaper-root": {
                mt: 1,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                ml: -1,
                borderRadius: "15px",
                minWidth: 180,
                maxWidth: "unset !important",
                background: "#000",
                width: "unset !important",
                "& .MuiMenu-list": {
                  padding: "5px",
                },
                "& .MuiMenuItem-root": {
                  gap: 2,
                  color: "#eee",
                  marginRight: "5px",
                  "&:hover": {
                    background: "rgba(255,255,255,.1)",
                    color: "#fff",
                  },
                  padding: "10px 15px",
                  minHeight: 0,
                  borderRadius: "15px",
                  marginBottom: "1px",

                  "& .MuiSvgIcon-root": {
                    fontSize: 25,
                    marginRight: 1.9,
                  },
                  "&:focus": {
                    background: "rgba(255,255,255,.1)!important",
                  },
                  "&:active": {},
                },
              },
            }),
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
    palette: {
      // mode: "dark",
      primary: {
        main: "#6b4b4b",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <ScrollArea style={{ height: "100vh" }} scrollbarSize={10}>
        <Navbar />
        <Component {...pageProps} />
      </ScrollArea>
    </ThemeProvider>
  );
}
