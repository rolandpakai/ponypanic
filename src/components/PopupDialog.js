import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const PopupDialog = (props) => {
  //const [open, setOpen] = useState(false);
  const { dialogContentText, buttonOkText, buttonCancelText, open, okHandler, cancelHandler } = {...props};

  return (
    <Dialog
    open={open}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    PaperProps={{
      style: {
          textAlign: 'center',
      },
   }}
  >
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {dialogContentText}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={cancelHandler}>{buttonCancelText}</Button>
      <Button onClick={okHandler} autoFocus>{buttonOkText}</Button>
    </DialogActions>
  </Dialog>
  )
}

export default PopupDialog;

