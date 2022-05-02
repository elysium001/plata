import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import { ListItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://elysium001.github.com">
        i_am_techgnosis
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const categories = [
  {
    value: "utilities",
    label: "Utilities",
  },
  {
    value: "debt",
    label: "Debt",
  },
  {
    value: "personal",
    label: "Personal",
  },
  {
    value: "food",
    label: "Food",
  },
  {
    value: "health",
    label: "Health",
  },
  {
    value: "home",
    label: "Home",
  },
];

const columns = [
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    editable: true,
  },
  {
    field: 'planned',
    headerName: 'Planned',
    type: 'number',
    width: 120,
    editable: true,
    valueFormatter: ({ value }) => `$${value}` 
  },
  {
    field: 'actual',
    headerName: 'Actual',
    type: 'number',
    width: 120,
    editable: false,
    valueFormatter: ({ value }) => `$${value}` 
  },
  {
    field: 'diff',
    headerName: 'Difference',
    type: 'number',
    width: 120,
    editable: false,
    valueGetter: (params) => {
      const val = params.row.planned - params.row.actual
      if(val < 0){
        return `-$${Math.abs(val)}`
      }else{
        return `+$${params.row.planned - params.row.actual}`
      }
    },
  },
];

const defaultRows = categories.map((cat, i)=>{
  return { id: i, category: cat.label, planned: 0, actual: 0 }
})

const catMapper = {}

for (let index = 0; index < categories.length; index++) {
  const { label } = categories[index];
  catMapper[label.toLowerCase()] = index
}

const mdTheme = createTheme();

function Budget() {
  const [open, setOpen] = React.useState(true);
  const [view, setView] = React.useState('transactions');
  const [totalExpenses, setTotalExpenses] = React.useState(0);
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [remaining, setRemaining] = React.useState(0);
  const [budgetRows, setBudgetRows] = React.useState(defaultRows);
  const [incomeRows, setIncomeRows] = React.useState([{ date: "", amount: "", description: "", category: "" }]);
  const [expenseRows, setExpenseRows] = React.useState([{ date: "", amount: "", description: "", category: "" }]);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(()=>{
    const diff = totalIncome - totalExpenses
    if(remaining !== diff){
      setRemaining(totalIncome - totalExpenses)
    }
  }, [totalIncome, remaining, totalExpenses])

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Budget with Plata
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItem selected={view === 'transactions'} onClick={()=>setView('transactions')}>Transactions</ListItem>
            <ListItem selected={view === 'budget'} onClick={()=>setView('budget')}>Budget</ListItem>
            <ListItem selected={view === 'debt-balances'} onClick={()=>setView('debt-balances')}>Debt Balances</ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem>Log Out</ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {view === 'transactions' && <Grid container spacing={3}>
              <Grid item container xs={12} md={8} lg={9} spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'auto',
                    }}
                  >
                    <ExpenseForm 
                      rows={expenseRows}
                      categories={categories}
                      onUpdate={(d) => {
                        // let sum = d.reduce((total, obj) => Number(obj.amount) + total,0)
                        let sum = 0
                        const bRows = [...budgetRows]
                        for (let index = 0; index < d.length; index++) {
                          const { amount, category } = d[index];
                          sum += Number(amount);
                          if(category){
                            bRows[catMapper[category]].actual += Number(amount)
                          }
                        }
                        setBudgetRows(bRows)
                        setExpenseRows(d)
                        setTotalExpenses(sum)
                      }}/>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <IncomeForm 
                      rows={incomeRows}
                      onUpdate={(d)=>{
                        let sum = d.reduce((total, obj) => Number(obj.amount) + total, 0)
                        setTotalIncome(sum)
                        setIncomeRows(d)
                    }}/>
                  </Paper>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h3>Total Income</h3>
                  <h4 style={{margin: 0}}>{`$${totalIncome}`}</h4>
                  <Divider sx={{ my: 1 }} />
                  <h3>Total Expenses</h3>
                  <h4 style={{margin: 0}}>{`$${totalExpenses}`}</h4>
                  <Divider sx={{ my: 1 }} />
                  <h3>Money Leftover</h3>
                  <h4 style={{margin: 0}}>{`$${remaining}`}</h4>
                </Paper>
              </Grid>
            </Grid>}
            {view === 'budget' && <Grid container spacing={3}>
              <Grid item container xs={12} md={8} lg={9} spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'auto',
                    }}
                  >
                    <h2>Budget</h2>
                    <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={budgetRows}
                      columns={columns}
                      onCellEditCommit={(e)=>{
                        const { value, id, field} = e
                        const rows = [...budgetRows]
                        rows[id][field] = value
                        setBudgetRows(rows)
                      }}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      checkboxSelection
                      disableSelectionOnClick
                    />
                  </div>
                  </Paper>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  test123
                </Paper>
              </Grid>
            </Grid>}
            {view === 'debt-balances' && <Grid container spacing={3}>
              <Grid item container xs={12} md={8} lg={9} spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 'auto',
                    }}
                  >
                    <h2>debt-balances</h2>
                  </Paper>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  test123
                </Paper>
              </Grid>
            </Grid>}
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <Budget />;
}
