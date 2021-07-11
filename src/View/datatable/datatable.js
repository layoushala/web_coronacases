import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
//import { useDemoData } from '@material-ui/x-grid-data-generator';
import coronacasesService from '../../Shared/Services/database-services/corona-cases-service'

const cServ = new coronacasesService();




function loadServerRows(page,sortModel) {
  console.log(sortModel[0]);
  const response = cServ.coronacases(page,10,"",sortModel[0].field,sortModel[0].sort);
  console.log(response);
  return response;
}


const columns = [
  { field: 'country', headerName: 'Country', flex: 1, sortable: false,},
  { field: 'deathCases', headerName: 'Death Cases', flex: 1 },
  { field: 'confirmedCases', headerName: 'Confirmed Cases', flex: 1 },
  { field: 'recoveredCases', headerName: 'Recovered Cases', flex: 1 },
];
export default function DataTable() {
 
  
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sortModel, setSortModel] = React.useState([
    { field: 'confirmedCases', sort: 'asc' },
  ]);
  
  const handlePageChange = (params) => {
    console.log(params)
    setPage(params.page);
  };

  const handleSortModelChange = (params) => {
    console.log(params);
    if (params.sortModel !== sortModel) {
      setSortModel(params.sortModel);
    }
  };

  React.useEffect(() => {
    let active = true;

   
    (async () => {
      setLoading(true);
      const newRows = await loadServerRows(page,sortModel);
      console.log(total)
      if (!active) {
      
        return;
      }
     if(typeof(newRows)!="undefined"){
      console.log(newRows)
      setRows(newRows.countryCases);
      setTotal(newRows.total);
      console.log(total)
      setLoading(false);
     }else{
      console.log("undefined")
     }
     
    })();
    

    return () => {
     
      active = false;
    };
  }, [page,total,sortModel]);
 
  return (
    <div style={{ height: 650, width: '100%' }}>
      <DataGrid
        disableColumnMenu 
        rows={rows}
        columns={columns}
        pagination
        pageSize={10}
        rowCount={total}
        paginationMode="server"
        onPageChange={handlePageChange}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        loading={loading}
      />
    </div>
  );
}