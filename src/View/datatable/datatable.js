import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
//import { useDemoData } from '@material-ui/x-grid-data-generator';
import coronacasesService from '../../Shared/Services/database-services/corona-cases-service'

const cServ = new coronacasesService();




function loadServerRows(page) {
  const response = cServ.coronacases(page,10,"");
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
 
  
  const [page, setPage] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  
  const handlePageChange = (params) => {
    setPage(params.page);
  };

  React.useEffect(() => {
    let active = true;

   
    (async () => {
      setLoading(true);
      const newRows = await loadServerRows(page);
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
  }, [page,total]);
 
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        disableColumnMenu 
        rows={rows}
        columns={columns}
        pagination
        pageSize={10}
        rowCount={total}
        paginationMode="server"
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}