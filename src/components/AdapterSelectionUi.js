import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function AdapterSelectionUi({
  currentAdapter = "knex",
  setCurrentAdapter,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value) => {
    setCurrentAdapter(value);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="adapter-writer"
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        variant="outlined"
        title={`click to change output mode`}
      >
        Output target: {currentAdapter}
      </Button>
      <Menu
        id="adapter-writer"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClose("typescript")}>
          TypeScript
        </MenuItem>
        <MenuItem onClick={() => handleClose("knex")}>Knex</MenuItem>
        <MenuItem onClick={() => handleClose("mongoose")}>Mongoose</MenuItem>
      </Menu>
    </div>
  );
}
