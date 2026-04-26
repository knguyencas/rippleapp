import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { TIME_PICKER_ITEM_HEIGHT } from '../../constants/profile/time-picker.constants';

export const timePickerModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 44, 58, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  sub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  wheelWrap: {
    width: 72,
    height: TIME_PICKER_ITEM_HEIGHT * 3,
    overflow: 'hidden',
    position: 'relative',
  },
  selector: {
    position: 'absolute',
    top: TIME_PICKER_ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: TIME_PICKER_ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.teal,
    zIndex: 1,
  },
  item: {
    height: TIME_PICKER_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 20,
    color: Colors.muted,
  },
  itemTextActive: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 26,
    color: Colors.teal,
  },
  colon: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: Colors.textPrimary,
    paddingHorizontal: 4,
  },
  listSpacer: {
    height: TIME_PICKER_ITEM_HEIGHT,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  okBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.teal,
    alignItems: 'center',
  },
  okText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.textLight,
  },
});
