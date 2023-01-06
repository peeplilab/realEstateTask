import { useEffect, useMemo, useState } from "react";
import { COLUMNS } from "../column";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { ColumnFilter } from "./ColumnFilter";
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { format, isAfter, parse, parseISO, isBefore, isEqual } from 'date-fns';
import '../App.css';
import { useSearchParams } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';

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
  const [filteredData, setfilteredData] = useState(mockData);
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [option, setOption] = useState('')
  const [logId, setLogId] = useState('')
  const [applicationType, setApplicationType] = useState('')
  const [appId, setAppId] = useState('')

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams]);
    // eslint-disable-next-line 
    setFromDate(queryParams.fromDate || '');
    setToDate(queryParams.toDate || '');
    setOption(queryParams.option || '');
    setLogId(queryParams.logId || '');
    setApplicationType(applicationType);
    setAppId(queryParams.appId || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    handleSubmit();
    console.log(searchParams, 'rttt');
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  
  const handleSearch = () => {
    let paramsData = {};
    if (logId) {
      paramsData.logId = logId;
    }
    if (option) {
      paramsData.option = option;
    }
    if (applicationType) {
      paramsData.applicationType = applicationType;
    }
    if (fromDate) {
      paramsData.fromDate = fromDate;
    }
    if (toDate) {
      paramsData.toDate = toDate;
    }
    if (appId) {
      paramsData.appId = appId;
    }
    setSearchParams(paramsData);
  };
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
  const handleSubmit = () => {
    const queryParams = Object.fromEntries([...searchParams]);
    let filters = {}
    let results = mockData;
    if (queryParams.logId) {
      filters.logId = queryParams.logId
      results = results.filter((key) => {
        //return String(key.logId) === String(logId)
        return String(key.logId).includes(String(queryParams.logId))
      });
    }
    if (queryParams.appId) {
      filters.appId = queryParams.appId;
      results = results.filter((key) => {
        return String(key.applicationId).includes(String(queryParams.appId))
      });

    }
    if (queryParams.option) {
      filters.actionType = queryParams.option;
      results = results.filter((key) => {
        return String(key.actionType) === String(queryParams.option)
      });

    }
    if (queryParams.applicationType) {
      filters.appType = queryParams.applicationType;
      results = results.filter((key) => {
        return String(key.applicationType) === String(queryParams.applicationType)
      });
    }
    if (queryParams.fromDate) {
      let formattedFromDate = new Date(queryParams.fromDate);
      results = results.filter((key) => {
        return isAfter(parseISO(key.creationTimestamp), formattedFromDate) ||
          isEqual(parseISO(key.creationTimestamp), formattedFromDate)
      });
    }
    if (queryParams.toDate) {
      let formattedToDate = new Date(queryParams.toDate);
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
        <p>Logger Search</p>
    
      <div className="inputs">
        <div style={{
          marginRight: 20,
        }} className="logid">
          <input
            style={{
              height: 30,
            }}
            value={logId}
            onChange={(e) => setLogId(e.target.value)}
            placeholder="Log ID"
          />
        </div>
        <div className="logid" style={{
          marginRight: 20,
        }} >
          <input
            style={{ height: 30 }}
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
      <div style={{
          marginTop: 8,
          marginBottom: 8
        }} className="inputs">
        <div style={{
          marginRight: 20,
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
            selected={fromDate && parse(fromDate, 'MM-dd-yyyy', new Date())}
            onChange={handleDate}
            placeholderText="From Date"
            showMonthYearPicker
          />
        </div>
        <div>
          <DatePicker
            className="date-input"
            selected={toDate && parse(toDate, 'MM-dd-yyyy', new Date())}
            onChange={handleDate1}
            placeholderText="To Date"
            showMonthYearPicker
          />
        </div>
        <button
          onClick={(e) => handleSearch(e)}
          className='button'
        >
          Search
        </button>

      </div>

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
