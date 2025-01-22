import { gql, useMutation } from "@apollo/client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import React, { useCallback } from "react";
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
};


const DELETE_EARTHQUAKE = gql`
  mutation DeleteEarthquake($id: ID!) {
    deleteEarthquake(id: $id)
  }
`;

const DeleteModal: React.FC<Props> = ({ isOpen, onClose, id }) => {
  const [deleteEarthquake] = useMutation<{ id: string }>(
    DELETE_EARTHQUAKE, {
      refetchQueries: ['GetEarthquakes']
    }
  );

  const onConfirm = useCallback(async () => {
    await deleteEarthquake({
      variables: {
        id,
      }
    });

    onClose();
  }, [deleteEarthquake, id, onClose]);

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Delete earthquake
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="flex flex-col gap-[12px]">
        Are you sure you want to delete this earthquake?
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
        >
          Close
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default DeleteModal;