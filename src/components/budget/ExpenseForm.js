import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { useState } from "react";

function ExpenseRepeater(props) {
  const { cats } = props
  const [row, setRow ] = useState()
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <TextField
          id="date"
          label="Due"
          type="date"
          value={props?.date || ""}
          onChange={({ target: { value } }) => {
            const d = { ...props };
            d.date = value;
            if(value){
              props.onRowUpdate(d);
            }
          }}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Amount"
          variant="outlined"
          value={props?.amount || ""}
          onChange={(e) => {
            const { value } = e.target;
            const d = { ...props };
            d.amount = value;
            props.onRowUpdate(d);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Description"
          variant="outlined"
          value={props?.description || ""}
          onChange={({ target: { value } }) => {
            const d = { ...props };
            d.description = value;
            props.onRowUpdate(d);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="outlined-select-currency"
          select
          label="Category"
          fullWidth
          value={props?.category || ""}
          onChange={({ target: { value } }) => {
            const d = { ...props };
            d.category = value;
            props.onRowUpdate(d);
          }}
        >
          {cats.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}

export default function ExpenseForm(props) {
  const { onUpdate, categories, rows } = props;
  const [expenseRows, setExpenseRows] = useState(rows);

  return (
    <>
      <h2>Expenses</h2>
      {expenseRows &&
        expenseRows.map((row, i) => {
          return (
            <div style={{ marginBottom: "16px" }} key={i}>
              <ExpenseRepeater
                {...row}
                cats={categories}
                onRowUpdate={(v) => {
                  const r = [...expenseRows];
                  r[i] = v;
                  setExpenseRows(r);
                  onUpdate(r);
                }}
              />
            </div>
          );
        })}
      <Button
        variant="outlined"
        color="error"
        style={{ width: "140px", marginLeft: "auto", marginTop: "8px" }}
        onClick={() => {
          const r = [...expenseRows];
          r.push({ date: "", amount: "", description: "", category: "" });
          setExpenseRows(r);
          onUpdate(r);
        }}
      >
        Add Expense
      </Button>
    </>
  );
}
