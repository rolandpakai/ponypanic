import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";

const Button = (props) => {
  const { disabled, loading, onClick, children } = { ...props };

  const loadingIndicator = (
    <CircularProgress color="inherit" size={25} sx={{ color: "#fff" }} />
  );

  return (
    <LoadingButton
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      color="error"
      size="large"
      variant="contained"
      fullWidth
      sx={{
        borderRadius: 8,
        backgroundImage: "url(./images/button.svg)",
        backgroundSize: "cover",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.25rem",
      }}
      loadingIndicator={loadingIndicator}
    >
      {children}
    </LoadingButton>
  );
};

export default Button;
