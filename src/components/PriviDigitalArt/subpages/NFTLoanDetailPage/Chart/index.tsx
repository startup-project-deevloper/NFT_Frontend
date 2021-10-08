import { Box } from "@material-ui/core";
import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";

const PrintLoanChart = ({ config, loan }) => {
  return (
    <div className="mt-5">
      <div className="mt-5 social-profile-chart-container" style={{ height: "204px" }}>
        {loan?.bidHistory?.length ? (
          <Box
            style={{
              backgroundColor: "white",
              width: "fit-content",
              borderRadius: "6px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
              padding: "12px 6px",
              marginLeft: "12px",
              marginBottom: "-70px",
            }}
          >
            <Box color="#181818" fontSize="16px" mb="4px">
              {loan.Bid} {loan.FundingToken}
            </Box>
            <Box color="#431AB7" fontSize="12px">
              {loan?.bidHistory.length > 1 ? (
                `+${loan.bidHistory[0].amount - loan.bidHistory[1].amount} (+${loan.bidHistory[1].amount ? Math.floor(((loan.bidHistory[0].amount - loan.bidHistory[1].amount) / loan.bidHistory[1].amount) * 100) : 100}%)`
              ) : (
                `+${loan.bidHistory[0].amount} (+100%)`
              )}
            </Box>
          </Box>
        ) : null}
        <PrintChart config={config} />
      </div>
    </div>
  );
};

export default PrintLoanChart;
