import React from "react";
import { Pagination, PaginationItem } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

const Paginate = ({ page, count }) => {
  const [searchParams] = useSearchParams();

  return (
    <Pagination
      count={count}
      page={page}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        mb: 4,
      }}
      renderItem={(item) => {
        // Create a new URLSearchParams object from the current ones
        const newSearchParams = new URLSearchParams(searchParams);
        
        // Update the 'page' parameter for the current item
        newSearchParams.set("page", item.page);
        
        // Use the updated search parameters to create the full URL
        const linkTo = `/products/trending?${newSearchParams.toString()}`;

        return (
          <PaginationItem
            {...item}
            component={Link}
            to={linkTo} // Use the dynamically created link here
            sx={{
              borderRadius: "8px",
              minWidth: "36px",
              height: "36px",
              fontWeight: 500,
              mx: "4px",
              "&.Mui-selected": {
                backgroundColor: "#ccb5a2",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#dcc5b2",
                },
              },
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          />
        );
      }}
    />
  );
};

export default Paginate;