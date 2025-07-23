import React from "react";
import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";

const Paginate = ({ page, count, onChange }) => {
  return (
    <Pagination
      count={count}
      page={page}
      onChange={(e, value) => onChange(value)}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        mb: 4,
      }}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/products?page=${item.page}`}
          sx={{
            borderRadius: "8px",
            minWidth: "36px",
            height: "36px",
            fontWeight: 500,
            mx: "4px",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "#fff",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        />
      )}
    />
  );
};

export default Paginate;
