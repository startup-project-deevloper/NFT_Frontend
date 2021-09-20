import { makeStyles } from "@material-ui/core";
import { Color, FontSize } from "shared/ui-kit";

export const filterButtonGroupStyles = makeStyles(() => ({
    normal: {
        padding: "8px 12px",
        borderRadius: 36,
        border: `1px solid ${Color.GrayDark}`,
        backgroundColor: Color.White,
        color: Color.GrayDark,
        fontSize: FontSize.M,
        minWidth: 50,
        "& + &": {
            marginLeft: 12,
        }
    },
    selected: {
        border: `1px solid ${Color.Black}`,
        backgroundColor: Color.Black,
        color: Color.White
    }
}));