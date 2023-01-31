import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import Button from './Button';

const PopupDialog = (props) => {
  const { dialogContentText, buttonOkText, buttonCancelText, open, okHandler, cancelHandler } = {...props};

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
            textAlign: 'center',
        },
      }}
  >
    <DialogContent>
      <DialogContentText 
        id="alert-dialog-description"
        sx={{
          fontSize: "40px"
        }}
      >
        {dialogContentText}
      </DialogContentText>
    </DialogContent>
    <DialogActions
      sx={{
        justifyContent: "center",
      }}
    >
      <Button 
        onClick={cancelHandler}
      >
        {buttonCancelText}
      </Button>
      <Button 
        autoFocus
        onClick={okHandler} 
      >
        {buttonOkText}
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default PopupDialog;

