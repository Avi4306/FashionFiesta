import React from "react";
import { Pagination, PaginationItem } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

const Paginate = ({ page, count, basePath = "" }) => {
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
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", item.page);

        const linkTo = `${basePath}?${newSearchParams.toString()}`;

        return (
          <PaginationItem
            {...item}
            component={Link}
            to={linkTo}
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

export default Paginate