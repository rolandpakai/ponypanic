import {default as MuiButton} from '@mui/material/Button';

const Button = (props) => {
  const { onClick } = {...props};

  return (
    <MuiButton 
      color="error"
      fullWidth
      size="large"
      variant="contained"
      sx={{
        borderRadius: 8,
        backgroundImage: "url(./images/button.svg)",
        backgroundSize: "cover",
        justifyContent: "center",
        alignItems: "center",
        fontSize: '1.25rem',
      }}
      onClick={onClick}
      {...props}
    >
      {props.children}
    </MuiButton>
  )
}

export default Button;