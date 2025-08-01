import React from "react";
import { Pagination, PaginationItem } from "@mui/material";
<<<<<<< HEAD
import { Link, useSearchParams } from "react-router-dom";

const Paginate = ({ page, count }) => {
  const [searchParams] = useSearchParams();

=======
import { Link } from "react-router-dom";

const Paginate = ({ page, count, onChange }) => {
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
  return (
    <Pagination
      count={count}
      page={page}
<<<<<<< HEAD
=======
      onChange={onChange}
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        mb: 4,
      }}
<<<<<<< HEAD
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
        );
      }}
=======
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/style-diaries?page=${item.page}`}
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
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
    />
  );
};

<<<<<<< HEAD
export default Paginate;
=======
export default Paginate;
>>>>>>> 64722959962531026d09982e49c0503bfb053ecf
