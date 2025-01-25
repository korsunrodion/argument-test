'use client'

import client from "@/app/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import React, { Suspense } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import NextAdapterApp from 'next-query-params/app';
import { QueryParamProvider } from 'use-query-params';
import Loader from "../Loader";

type Props = {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Suspense fallback={<Loader isActive={true} />}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ApolloProvider client={client}>
          <QueryParamProvider adapter={NextAdapterApp}>
            {children}
          </QueryParamProvider>
        </ApolloProvider>
      </LocalizationProvider>
    </Suspense>
  )
};

export default Layout;