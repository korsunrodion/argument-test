'use client'

import client from "@/app/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import React from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import NextAdapterApp from 'next-query-params/app';
import { QueryParamProvider } from 'use-query-params';

type Props = {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ApolloProvider client={client}>
        <QueryParamProvider adapter={NextAdapterApp}>
          {children}
        </QueryParamProvider>
      </ApolloProvider>
    </LocalizationProvider>
  )
};

export default Layout;