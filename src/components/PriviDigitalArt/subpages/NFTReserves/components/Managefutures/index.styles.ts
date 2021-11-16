import { makeStyles } from "@material-ui/core/styles";
import { Color } from "shared/ui-kit";

export const manageOptionStyles = makeStyles(theme => ({
    content : {
        padding: '35px'
    },
    subTitleSection: {
        width: '180px',
        display: 'flex',
        border: '2px solid #431AB7',
        padding: '0px',
        borderRadius: '80px',
        marginBottom: '20px',
        cursor: "pointer",
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '104.5%',
    },
    tabSection: {
        height: 42,
        padding: '13px 20px'
    },
    selectedTabSection: {
        background: '#431AB7',
        borderRadius: '19px',
        color: 'white',
    },
}));