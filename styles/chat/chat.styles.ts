import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export const chatStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.foam },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.foam,
  },
  headerAvatar: {
    width: 42, height: 42,
    borderRadius: 21,
    backgroundColor: Colors.teal + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 22 },
  headerName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  headerStatus: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.teal,
  },

  messages: { flex: 1 },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 4,
  },
  timeLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 8,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    gap: 8,
  },
  msgRowAI: { justifyContent: 'flex-start' },
  msgRowUser: { justifyContent: 'flex-end' },
  aiAvatar: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: Colors.teal + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: { fontSize: 14 },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    padding: 12,
  },
  bubbleAI: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.teal,
    borderBottomRightRadius: 4,
  },
  bubbleTyping: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bubbleText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextAI: { color: Colors.textPrimary },
  bubbleTextUser: { color: Colors.textLight },
  typingDots: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textSecondary,
    letterSpacing: 4,
  },

  quickReplies: {
    maxHeight: 48,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickRepliesContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  quickReply: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickReplyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.textPrimary,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.foam,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.border,
  },
  sendBtnText: {
    fontSize: 18,
    color: Colors.textLight,
    fontFamily: 'Nunito_700Bold',
  },
});
