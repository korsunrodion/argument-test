'use client'

import { Earthquake } from "@/types";
import { gql, useMutation } from "@apollo/client";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  earthquake?: Earthquake;
};

const initialValues: Omit<Earthquake, 'id'> = {
  magnitude: 0,
  location: '',
  date: new Date()
}

const CREATE_EARTHQUAKE = gql`
  mutation CreateEarthquake($input: CreateEarthquakeInput!) {
    createEarthquake(input: $input) {
      id
      magnitude
      location
      date
    }
  }
`;

const UPDATE_EARTHQUAKE = gql`
  mutation UpdateEarthquake($id: ID!, $input: UpdateEarthquakeInput!) {
    updateEarthquake(id: $id, input: $input) {
      id
      magnitude
      location
      date
    }
  }
`;

const EarthquakeSchema = Yup.object().shape({
  magnitude: Yup.number()
    .required('Magnitude is required')
    .min(0, 'Magnitude must be positive')
    .max(10, 'Magnitude cannot be greater than 10'),
  location: Yup.string()
    .required('Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location cannot exceed 100 characters'),
  date: Yup.date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future')
});

const CreateUpdateModal: React.FC<Props> = ({ isOpen, onClose, earthquake }) => {
  const [createEarthquake] = useMutation(
    CREATE_EARTHQUAKE, {
      refetchQueries: ['GetEarthquakes']
    }
  );
  const [updateEarthquake] = useMutation(UPDATE_EARTHQUAKE, {
    refetchQueries: ['GetEarthquakes']
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: EarthquakeSchema,
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const v = values as Omit<Earthquake, 'id'>

      if (earthquake?.id) {
        await updateEarthquake({
          variables: {
            id: earthquake.id,
            input: values
          }
        })
      } else {
        await createEarthquake({
          variables: {
            input: {
              ...v
            }
          }
        });
      }

      onClose();
    }
  });

  useEffect(() => {
    if (earthquake) {
      formik.setValues({
        magnitude: earthquake.magnitude,
        location: earthquake.location,
        date: earthquake.date
      }, false);
    } else {
      formik.setValues({
        magnitude: 0,
        location: '',
        date: new Date()
      }, false)
    }
  }, [earthquake, formik.setValues]);

  console.log(formik.errors);
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Create new earthquake
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
        <TextField
          name="magnitude"
          id="magnitude"
          type="number"
          label="Magnitude"
          className="w-full"
          onChange={formik.handleChange}
          value={formik.values.magnitude}
        />
        {formik.errors.magnitude && (
          <Typography color="red">{formik.errors.magnitude}</Typography>
        )}
        <TextField
          name="location"
          id="location"
          type="text"
          label="Location"
          className="w-full"
          onChange={formik.handleChange}
          value={formik.values.location}
        />
        {formik.errors.location && (
          <Typography color="red">{formik.errors.location}</Typography>
        )}

        <DatePicker label="Date" value={moment(formik.values.date)} onChange={(v) => formik.setFieldValue('date', v?.toDate())} />
        {formik.errors.date && (
          <Typography color="red">{formik.errors.date as string}</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
        >
          Close
        </Button>
        <Button
          onClick={() => formik.submitForm()}
          variant="contained"
          color="primary"
          disabled={!formik.values.date || !formik.values.location || !formik.values.magnitude}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default CreateUpdateModal;