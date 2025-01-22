'use client'

import React, { useState } from "react";
import { Button, Card, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import { Earthquake, EarthquakeData } from "@/types";
import CreateUpdateModal from "../CreateUpdateModal";
import DeleteModal from "../DeleteModal";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Loader from "../Loader";

const GET_EARTHQUAKES = gql`
  query GetEarthquakes($page: Int, $limit: Int) {
    earthquakes(page: $page, limit: $limit) {
      items {
        id
        date
        location
        magnitude
      }
      total
      page
      totalPages
      hasNext
      hasPrevious
    }
  }
`;

// TODO: add sorting
const EarthquakeList: React.FC = () => {
  const [page, setPage] = useQueryParam('page', withDefault(StringParam, '1'));

  const { data, loading } = useQuery<EarthquakeData>(GET_EARTHQUAKES, {
    variables: {
      page: parseInt(page),
      limit: 10
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState<Earthquake | undefined>();
  const [deleteId, setDeleteId] = useState<string | undefined>();

  const onCreateUpdateClose = () => {
    setUpdateItem(undefined);
    setIsModalOpen(false);
  };

  const onUpdateClicked = (item: Earthquake) => {
    setUpdateItem(item);
    setIsModalOpen(true);
  }

  return (
    <Card className="p-[32px] bg-white h-screen">
      <CreateUpdateModal earthquake={updateItem} isOpen={isModalOpen} onClose={onCreateUpdateClose} />
      <DeleteModal id={deleteId} isOpen={!!deleteId} onClose={() => setDeleteId(undefined)} />

      <div className="flex items-center gap-[16px]">
        <Typography variant="h5">Earthquakes</Typography>
        <Button onClick={() => setIsModalOpen(true)}>Create new</Button>
      </div>
      <TableContainer className="flex flex-col items-center">
        {data?.earthquakes.items && (
          <Table>
            <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Magnitude</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {data?.earthquakes.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.magnitude}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{moment(item.date).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>
                    <Button onClick={() => onUpdateClicked(item)}>Update</Button>
                    <Button onClick={() => setDeleteId(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Loader isActive={loading} />

        <Pagination className="mt-[24px]" count={data?.earthquakes.totalPages} onChange={(_, v) => setPage(v.toString())} page={parseInt(page || "1")} />
      </TableContainer>
    </Card>
  )
}

export default EarthquakeList;