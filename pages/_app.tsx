import {
  AppBar,
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  NoSsr,
  Toolbar,
  Typography,
} from "@mui/material";
import { colors } from "../lib/colors";

import type { AppProps } from "next/app";
import "../styles/globals.scss";

import { ScrollArea } from "@mantine/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import cookie from "cookie";
import useSWR from "swr";
import { useEffect } from "react";

function Navbar() {
  const router = useRouter();
  const cookies = cookie.parse(document.cookie);
  const { data, error }: any = useSWR("/api/oauth/session", () =>
    fetch("/api/oauth/session").then((res) => res.json())
  );

  global.themeColor =
    data && data.profile && data.profile.user
      ? data.profile.user.color
      : "brown";

  useEffect(() => {
    global.themeColor =
      data && data.profile && data.profile.user
        ? data.profile.user.color
        : "brown";
  }, [data]);

  return (
    <>
      <Head>
        <meta name="theme-color" content="#fff" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
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
          <Box
            sx={{
              mr: "auto",
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 0.5,
            }}
          >
            <picture>
              <img
                src="https://cdn.jsdelivr.net/gh/Smartlist-App/Assets@latest/v3/windows11/Square44x44Logo.altform-unplated_targetsize-256.png"
                width="32px"
                height="32px"
                alt="Logo"
              />
            </picture>
            <Typography
              variant="h6"
              sx={{
                mt: -0.5,
                "&:hover": {
                  textDecoration: "underline",
                },
                display: "flex",
                alignItems: "center",
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
          <Button
            onClick={() => router.push("/")}
            color="inherit"
            disableRipple
            sx={{
              gap: 1.5,
              color: "#fff",
              fontWeight: "600",
              px: { xs: 1, sm: 2 },
              minWidth: "auto",
              borderRadius: 4,
              transition: "none",
              mr: 1,
              background:
                "linear-gradient(45deg, #432371 0%, #faae7b 100%)!important",
              "&:hover:not(:active)": {
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Icon>add</Icon>
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Plan my event
            </Typography>
          </Button>
          {data && data.profile && data.profile.user.name ? (
            <IconButton
              color="inherit"
              disableRipple
              sx={{
                "&:hover": {
                  background: "rgba(200,200,200,.3)",
                  color: "#000",
                },
                p: 0,
              }}
            >
              <Avatar
                sx={{
                  background: colors[themeColor][500],
                }}
              >
                {data.profile.user.name.substring(0, 1).toUpperCase()}
              </Avatar>
            </IconButton>
          ) : (
            <Button
              // variant="outlined"
              sx={{
                borderRadius: 9,
                px: 2,
                background: "rbga(200,200,200,.3)",
              }}
              onClick={() => {
                router.push(
                  "https://my.smartlist.tech/auth?application=availability"
                );
              }}
            >
              Sign&nbsp;in
            </Button>
          )}
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
        main: global.themeColor ? colors[global.themeColor]["500"] : "#6b4b4b",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <ScrollArea style={{ height: "100vh" }} scrollbarSize={10}>
        <NoSsr>
          <Navbar />
        </NoSsr>
        <Component {...pageProps} />
      </ScrollArea>
    </ThemeProvider>
  );
}
