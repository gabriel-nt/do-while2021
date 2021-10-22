import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutText: {
    fontSize: 15,
    marginRight: 20,
    fontFamily: FONTS.REGULAR,
    color: COLORS.WHITE,
  },
});
