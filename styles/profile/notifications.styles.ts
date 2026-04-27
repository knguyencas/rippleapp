import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export const notificationsStyles = StyleSheet.create({
  loading: {
    marginTop: 32,
  },
  markAllButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#EAF4F4',
    marginBottom: 12,
  },
  markAllText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: Colors.teal,
  },
  empty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#1A3A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  list: {
    gap: 10,
    marginTop: 4,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEF4F8',
    shadowColor: '#1A3A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemUnread: {
    borderColor: Colors.teal,
    backgroundColor: '#F4FCFC',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    flex: 1,
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.teal,
  },
  itemBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginTop: 6,
  },
  itemTime: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: Colors.muted,
    marginTop: 10,
  },
});
