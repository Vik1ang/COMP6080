import { createTheme } from "@mui/material";
import { green, pink, red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: pink[500],
    },
    secondary: {
      main: green[500],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
