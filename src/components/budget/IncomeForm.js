import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const cats = [
  {
    value: "paycheck",
    label: "Paycheck",
  },
  {
    value: "business",
    label: "Business",
  },
  {
    value: "income-tax",
    label: "Income Tax",
  },
  {
    value: "bonus",
    label: "Bonus",
  },
];

function IncomeRepeater(props) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <TextField
          id="date"
          label="Date"
          type="date"
          value={props?.date || ""}
          onChange={({ target: { value } }) => {
            const d = { ...props };
            d.date = value;
            props.onRowUpdate(d);
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
          onChange={({ target: { value } }) => {
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
          fullWidth
          select
          label="Category"
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

export default function IncomeForm(props) {
  const { onUpdate, rows: r } = props
  const [rows, setRows] = useState(r);

  return (
    <>
      <h2>Income</h2>
      {rows &&
        rows.map((row, i) => {
          return (
            <div style={{marginBottom: '16px'}} key={i}>
              <IncomeRepeater
                {...row}
                onRowUpdate={(v) => {
                  const d = [...rows];
                  d[i] = v;
                  setRows(d);
                  onUpdate(d)
                }}
              />
            </div>
          );
        })}
      <Button
        variant="outlined"
        color="success"
        style={{ width: "140px", marginLeft: "auto", marginTop: "8px" }}
        onClick={() => {
          const r = [...rows];
          r.push({ date: "", amount: "", description: "", category: "" });
          setRows(r);
        }}
      >
        Add Income
      </Button>
    </>
  );
}
