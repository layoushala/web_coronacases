import * as React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper, Box } from '@material-ui/core';
import { DataGrid } from "@material-ui/data-grid";
import coronacasesService from "../../Shared/Services/database-services/corona-cases-service";


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
  leftBox:{
    padding: theme.spacing(2),
    textAlign: 'left',
  }
  
}));

const cServ = new coronacasesService();

function loadDetails(country) {

  const response = cServ.countryDetails(country);

  return response;
}
function CountryDetails(props) {
  const columns = [
    { field: 'region', headerName: 'Region', flex: 1 },
    { field: 'name', headerName: 'Case Name', flex: 1 },  
    { field: 'date', headerName: 'Date ', flex: 1 ,
    valueFormatter: (params) => {

      const valueFormatted = params.value ;
      return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(valueFormatted);
    },},
    { field: 'value', headerName: 'Value', flex: 1 },
   
  ];

  const [rows, setRows] = React.useState([]);
  //const [country, setCountry] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  let history = useHistory();
  const goToPreviousPath = () => {
      history.goBack()
  }
  const country =props.location.state;

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const newRows = await loadDetails(country);
    
      if (!active) {
        return;
      }
      if (typeof (newRows) != "undefined") {
        setRows(newRows);       
        setLoading(false);
      }

    })();

    return () => {

      active = false;
    };
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} >
          <Paper className={classes.paperflex}>
            <Box display="flex" flexDirection="row" p={1} m={1} >
              <Box p={1} >
               Country: 
              </Box>
              <Box p={1} style={{ width: '60%' }}>
               {country}
              </Box>
              <Box p={1} className={classes.leftBox}>
              <Button  variant="outlined" color="default" onClick={goToPreviousPath}>
          Back
            </Button>
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
              loading={loading}
              pageSize={10}
            />
          
          </Paper>
        </Grid>
        <Grid item xs={12} >
          <Paper className={classes.paperflex}>
          
          </Paper>
        </Grid>  
      </Grid>
    </div>)
  }
  
  export default CountryDetails;