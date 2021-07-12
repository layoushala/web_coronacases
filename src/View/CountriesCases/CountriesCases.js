import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import coronacasesService from '../../Shared/Services/database-services/corona-cases-service'
import { Select, InputLabel, IconButton } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import DetailsIcon from '@material-ui/icons/Details';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';


const cServ = new coronacasesService();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  paperflex: {
    padding: theme.spacing(2),

    color: theme.palette.text.secondary,
  },
}));


function loadServerRows(page, sortModel, region) {
  let sortField = '';
  let sortOrder = '';
  if(sortModel.length){
    sortField = sortModel[0].field;
    sortOrder = sortModel[0].sort;
  }
  const response = cServ.coronacases(page, 10, region === "All" ?'':region, sortField, sortOrder);

  return response;
}

function loadRegions() {
  const responseR = cServ.regions();
  return responseR;
  ;
}


export default function CountriesCases(props) {
  const classes = useStyles();

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sortModel, setSortModel] = React.useState([
    { field: 'confirmedCases', sort: 'asc' },
  ]);
  const [region, setRegion] = React.useState('All');
  const [favList, setFavList] = React.useState(JSON.parse(localStorage.getItem("fvList")))
  const [jsError, setJsError] = React.useState({ foundError: false, msg: '' });


  const operationCell =(params)=>{
     
      return(            
       <Box display="flex" flexDirection="row" p={1} m={1} >
         <Box p={1} >
           <strong>
   
             <IconButton
               variant="contained"
               color="primary"
               size="small"
               style={{ marginLeft: 16 }}
               value={params.row.country}
               onClick={handleDetials}
             >
               <DetailsIcon />
             </IconButton >
           </strong>
         </Box>
         <Box p={1} >
           <strong>
             {favList.includes(params.row.country) ? (<IconButton
               variant="contained"
               color="primary"
               size="small"
               style={{ marginLeft: 16 }}
               value={params.row.country}
               onClick={deleteFavorite}
             >
               <FavoriteIcon />
             </IconButton >) : 
             ( <IconButton
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: 16 }}
              value={params.row.country}
              onClick={AddFavorite}
            >
              <FavoriteBorderIcon />
            </IconButton >)
          }
             
           </strong>
         </Box>
         <Box p={1} >
           <strong>
   
            
           </strong>
         </Box>
   
       </Box>
     )
  
  }
  const columns = [
    { field: 'country', headerName: 'Country', flex: 1, sortable: false, },

    { field: 'confirmedCases', headerName: 'Confirmed Cases', flex: 1 },
    { field: 'recoveredCases', headerName: 'Recovered Cases', flex: 1 },
    { field: 'deathCases', headerName: 'Death Cases', flex: 1 },

    {
      field: 'operation',
      headerName: '  ',
      flex: 1,
      renderCell: operationCell      
        
    },
    ];
    const handleDetials = (event) => {

      props.history.push({
        pathname: "/country",
        state: event.currentTarget.value
      });
    };
  
    const AddFavorite = (event) => {
      console.log(event.currentTarget);
      var countries = [];
      if (localStorage.getItem("fvList") == null) {
        countries.push(event.currentTarget.value);
        localStorage.setItem("fvList", JSON.stringify(countries));
      } else {
        countries = JSON.parse(localStorage.getItem("fvList"));
        let index = countries.indexOf(countries.find(x => x === event.currentTarget.value))
  
        if (index === -1) {
          countries.push(event.currentTarget.value);
        }
  
        localStorage.setItem("fvList", JSON.stringify(countries));
        setFavList(countries);
      }
    };
    const deleteFavorite = (event) => {
      var countries = [];
      if (localStorage.getItem("fvList") != null) {
  
        countries = JSON.parse(localStorage.getItem("fvList"));
        let index = countries.indexOf(countries.find(x => x === event.currentTarget.value))
  
        if (index !== -1) {
          countries.splice(index, 1);
        }
  
        localStorage.setItem("fvList", JSON.stringify(countries));
        setFavList(countries);
      }
    };
  

  const handlePageChange = (params) => {

    setPage(params.page);
  };

  const handleSortModelChange = (params) => {
  
    if (params.sortModel !== sortModel) {
     
      setSortModel(params.sortModel);
    }
  };
  const handleRegionChange = (event) => {
    setRegion(event.target.value);
  };


  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);

      const allRegions = await loadRegions();
      if (typeof (allRegions) != "undefined" && allRegions != null) {
        allRegions.unshift('All');
        var regionList = allRegions.map(function (r, index) {
          return <MenuItem key={index} value={r}>{r}</MenuItem>;
        });
        setRegions(regionList);
      } else {
        setJsError({ foundError: true, msg: 'Failed get Regions API' })
        setLoading(false);
        return;
      }

      const newRows = await loadServerRows(page, sortModel, region);

      if (!active) {
        return;
      }
      if (typeof (newRows) != "undefined" && newRows != null) {
        setRows(newRows.countryCases);
        setTotal(newRows.total);

      } else {
        setJsError({ foundError: true, msg: 'Failed get Corona Cases API' })
        setLoading(false);
        return;
      }
      setLoading(false);
    })();

    return () => {

      active = false;
    };
  }, [page, total, sortModel, region]);



  return (
    <div className={classes.root}>
      {jsError.foundError && jsError.msg ? (
        <div>
          <p>Caught an Error:</p>
          <div>
            {jsError.msg}
          </div>
        </div>
      ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} >
              <Paper className={classes.paperflex}>
                <Box display="flex" flexDirection="row" p={1} m={1} >
                  <Box p={1} >
                    <InputLabel id="demo-simple-select-helper-label">Region</InputLabel>

                  </Box>
                  <Box p={1} >
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={region}
                      onChange={handleRegionChange}
                    >
                      {
                        regions
                      }

                    </Select>

                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ height: 650, width: '100%' }}>
              <Paper className={classes.paper} style={{ height: 650, width: '100%' }}>
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
              </Paper>
            </Grid>
          </Grid>)}
    </div>
  );




}