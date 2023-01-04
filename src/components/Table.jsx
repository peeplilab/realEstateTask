import { useEffect, useMemo, useState } from "react";
import { COLUMNS } from "../column";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { ColumnFilter } from "./ColumnFilter";
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { format, isAfter, parse, parseISO, isBefore,isEqual } from 'date-fns';
import '../App.css';

import 'react-datepicker/dist/react-datepicker.css';
import { useQueryState } from "./useQueryParams";
//import { isEqual } from "date-fns/esm";

const options = [
  { value: 'LEASE_CLOSURE', label: 'LEASE_CLOSURE' },
  { value: 'ADD_COMPANY_EMPLOYEE', label: 'ADD_COMPANY_EMPLOYEE' },
  { value: 'CERT_TITLE_DEED_PLOT', label: 'CERT_TITLE_DEED_PLOT' },
  { value: 'ADD_POA', label: 'ADD_POA' },
  { value: 'ADD_COMPANY', label: 'ADD_COMPANY' },
  { value: 'CERT_PROP_OWNERSHIP', label: 'CERT_PROP_OWNERSHIP' },
  { value: 'LEASE_REGISTRATION', label: 'LEASE_REGISTRATION' },

];
const options1 = [
  { value: 'INITIATE_APPLICATION', label: 'INITIATE_APPLICATION' },
  { value: 'SUBMIT_APPLICATION', label: 'SUBMIT_APPLICATION' },
  { value: 'ADD_EMPLOYEE', label: 'ADD_EMPLOYEE' },
  { value: 'DARI_REFRESH_TOKEN', label: 'DARI_REFRESH_TOKEN' },
  { value: 'DARI_APP_LOGIN', label: 'DARI_APP_LOGIN' },

];
const Table = ({ mockData }) => {
  const columns = useMemo(() => COLUMNS, []); // memoize before adding to useTable hook
  const [fromDate, setFromDate] = useQueryState('fromDate');
  const [toDate, setToDate] = useQueryState('toDate');
  const [option, setOption] = useQueryState('actionType');
  const [logId, setLogId] = useQueryState('logId');
  const [applicationType, setApplicationType] = useQueryState('applicationType');
  const [appId, setAppId] = useQueryState('appId');
  const [filteredData, setfilteredData] = useState(mockData);
  useEffect(() => {
    setfilteredData(mockData)
  }, [mockData])

  const handleSelect = (option) => {
    setOption(option?.value || null);
  };
  const handleSelect1 = (option) => {
    setApplicationType(option?.value || null);
  };

  const handleDate = (date) => {
    setFromDate(format(date, 'MM-dd-yyyy'));
  };
  const handleDate1 = (date) => {
    setToDate(format(date, 'MM-dd-yyyy'));
  };
  // default column component
  const defaultColumn = useMemo(() => {
    return {
      Filter: ColumnFilter,
    };
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    let filters = {}
    let results = filteredData;
    if (logId) {
      filters.logId = logId
      results = results.filter((key) => {
        return Number(key.logId) === Number(logId)
      });
    }
    if (appId) {
      filters.appId = appId;
      results = results.filter((key) => {
        return Number(key.applicationId) === Number(appId)
      });

    }
    if (option) {
      filters.actionType = option;
      results = results.filter((key) => {
        return String(key.actionType) === String(option)
      });

    }
    if (applicationType) {
      filters.appType = applicationType;
      results = results.filter((key) => {
        return String(key.applicationType) === String(applicationType)
      });
    }
    if (fromDate) {
      let formattedFromDate = new Date(fromDate);
      results = results.filter((key) => {
        return isAfter(parseISO(key.creationTimestamp), formattedFromDate) ||
          isEqual(parseISO(key.creationTimestamp), formattedFromDate)
      });
    }
    if (toDate) {
      let formattedToDate = new Date(toDate);
      results = results.filter((key) => {
        return isBefore(parseISO(key.creationTimestamp), formattedToDate) ||
          isEqual(parseISO(key.creationTimestamp), formattedToDate)
      });
    }
    setfilteredData(results);
    return results;

  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,    
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredData,
      defaultColumn,
    },

    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  return (
    <>
    <div style={{alignItems:'revert'}}>
    <p>{`Home > Administration > Logger Search`}</p>
    </div>
      <div className="inputs">
        <div style={{
          marginRight: 30,
        }} className="logid">
          <input
            style={{
              height: 30,
            }}
            type="number"
            value={logId}
            onChange={(e) => setLogId(e.target.value)}
            placeholder="Log ID"
          />
        </div>
        <div className="logid" style={{
          marginRight: 30,
        }} >
          <input
            style={{ height: 30 }}
            type="number"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="Application Id"
          />
        </div>
        <div>
          <Select
            className="select-input"
            isClearable
            value={options1.find((o) => o.value === applicationType)}
            onChange={handleSelect1}
            options={options}
            placeholder="Application Type"
          />
        </div>
      </div>
      <div className="inputs">
        <div style={{
          marginRight: 30,
        }} >
          <Select
            className="select-input"
            isClearable
            value={options.find((o) => o.value === option)}
            onChange={handleSelect}
            options={options1}
            placeholder="Action Type"
          />
        </div>
        <div>
          <DatePicker
            className="date-input"
            selected={fromDate ? parse(fromDate, 'MM-dd-yyyy', new Date()) : new Date()}
            onChange={handleDate}
          />
        </div>
        <div>
          <DatePicker
            className="date-input"
            selected={toDate ? parse(toDate, 'MM-dd-yyyy', new Date()) : new Date()}
            onChange={handleDate1}
          />
        </div>
        <button
          onClick={(e) => handleSubmit(e)}
          className='button'
        >
          Search
        </button>

      </div>
      {/* <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} /> */}

      {/* apply the table props */}
      <table {...getTableProps()}>
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                      <div>{column.canFilter ? column.render("Filter") : null}</div>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            page.map((row, i) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>

                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>

      <div className="pagination" style={{ marginTop: "1rem" }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Table;
