import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

export default {
  spacing: {
    iconSize: 24,
    desktopGutter: 24,
    desktopGutterMore: 32,
    desktopGutterLess: 16,
    desktopGutterMini: 8,
    desktopKeylineIncrement: 64,
    desktopDropDownMenuItemHeight: 32,
    desktopDropDownMenuFontSize: 15,
    desktopDrawerMenuItemHeight: 48,
    desktopSubheaderHeight: 48,
    desktopToolbarHeight: 56
  },
  fontFamily: 'Roboto, sans-serif',
  borderRadius: 2,
  palette: {
    primary1Color: Colors.green500,
    primary2Color: Colors.green700,
    primary3Color: Colors.green900,
    accent1Color: Colors.deepOrangeA700,
    accent2Color: Colors.deepOrangeA700,
    accent3Color: Colors.deepOrangeA700,
    textColor: Colors.darkBlack,
    secondaryTextColor: fade(Colors.darkBlack, 0.54),
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.orangeA700,
    clockCircleColor: fade(Colors.darkBlack, 0.07),
    shadowColor: Colors.fullBlack
  }
};
