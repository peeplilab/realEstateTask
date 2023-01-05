import { format } from "date-fns";

export const COLUMNS = [
  {
    Header: "LogId",
    accessor: "logId",
    disableFilters: true
  },
  {
    Header: "Action Type",
    accessor: "actionType",
    disableFilters: true
  },
  {
    Header: "Application Id",
    accessor: "applicationId",
    disableFilters: true

  },
  {
    Header: "Application Type",
    accessor: "applicationType",
    disableFilters: true

  },
  {
    Header: "Date",
    accessor: "creationTimestamp",
    // Cell: ({ value }) => {
    //  return format(new Date(value), "dd/MM/yyyy");
    // //return format(new Date(value), "yyyy-MM-dd'T'HH:mm:ss.SSS")
    // },
    disableFilters: true
  },
  // {
  //   Header: "Age",
  //   accessor: "age",
  //   disableFilters: true
  // },
];
