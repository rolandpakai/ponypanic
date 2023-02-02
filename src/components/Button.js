import {default as MuiButton} from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

const Button = (props) => {
  const { loading } = {...props};

  const buttonProps = {
    color: "error",
    size: "large",
    variant: "contained",
    fullWidth: true,
    sx: {
      borderRadius: 8,
      backgroundImage: "url(./images/button.svg)",
      backgroundSize: "cover",
      justifyContent: "center",
      alignItems: "center",
      fontSize: '1.25rem',
    },
    ...props
  }

  if(loading) {
    buttonProps.loadingIndicator = <CircularProgress color="inherit" size={25} sx={{color: '#fff'}}/>

    return ( 
      <LoadingButton 
        {...buttonProps}
      >
        {props.children}
      </LoadingButton>
    )
  } else {
    delete buttonProps.loading;
    
    return (
      <MuiButton 
        {...buttonProps}
      >
        {props.children}
      </MuiButton>   
    )
  } 
}

export default Button;