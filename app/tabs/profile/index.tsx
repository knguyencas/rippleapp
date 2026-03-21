import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { useAuthStore } from '../../../stores/auth.store';

const SECTION_ITEMS = [
  {
    title: 'Tài khoản',
    items: [
      { icon: '👤', label: 'Chỉnh sửa hồ sơ',    arrow: true },
      { icon: '🔒', label: 'Bảo mật & Mật khẩu',  arrow: true },
      { icon: '🔔', label: 'Thông báo',             arrow: true },
    ],
  },
  {
    title: 'Cài đặt',
    items: [
      { icon: '🌐', label: 'Ngôn ngữ',                    arrow: true },
      { icon: '🎨', label: 'Giao diện',                   arrow: true },
    ],
  },
  {
    title: 'Hỗ trợ',
    items: [
      { icon: '❓', label: 'Trợ giúp & FAQ',               arrow: true },
      { icon: '💬', label: 'Gửi phản hồi',                 arrow: true },
      { icon: '📋', label: 'Điều khoản & Quyền riêng tư', arrow: true },
    ],
  },
];

export default function ProfileScreen() {
  const { user, clearAuth } = useAuthStore();

  const displayName = user?.displayName || user?.username || 'Người dùng';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    clearAuth();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <Text style={s.headerTitle}>Hồ sơ</Text>
        </View>

        <View style={s.avatarCard}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View style={s.avatarInfo}>
            <Text style={s.avatarName}>{displayName}</Text>
            <Text style={s.avatarSub}>@{user?.username}</Text>
            {user?.ageGroup && (
              <Text style={s.avatarAge}>Nhóm tuổi: {user.ageGroup}</Text>
            )}
          </View>
          <TouchableOpacity style={s.editBtn}>
            <Text style={s.editBtnText}>Sửa</Text>
          </TouchableOpacity>
        </View>

        {/* Streak card */}
        <View style={s.streakCard}>
          <View style={s.streakLeft}>
            <Text style={s.streakFire}>🔥</Text>
            <View>
              <Text style={s.streakNum}>7 ngày</Text>
              <Text style={s.streakLabel}>Streak hiện tại</Text>
            </View>
          </View>
          <View style={s.streakDivider} />
          <View style={s.streakRight}>
            <Text style={s.streakNum}>21</Text>
            <Text style={s.streakLabel}>Tổng ngày log</Text>
          </View>
          <View style={s.streakDivider} />
          <View style={s.streakRight}>
            <Text style={s.streakNum}>3.8</Text>
            <Text style={s.streakLabel}>Mood TB</Text>
          </View>
        </View>

        <View style={s.reminderCard}>
          <View style={s.reminderLeft}>
            <Text style={s.reminderIcon}>⏰</Text>
            <View>
              <Text style={s.reminderLabel}>Nhắc nhở hàng ngày</Text>
              <Text style={s.reminderSub}>Nhắc bạn ghi journal mỗi ngày</Text>
            </View>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ true: Colors.teal, false: Colors.border }}
            thumbColor={Colors.textLight}
          />
        </View>

        {SECTION_ITEMS.map((section, si) => (
          <View key={si} style={s.section}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.sectionCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[
                    s.settingRow,
                    ii < section.items.length - 1 && s.settingRowBorder,
                  ]}
                >
                  <Text style={s.settingIcon}>{item.icon}</Text>
                  <Text style={s.settingLabel}>{item.label}</Text>
                  {item.arrow && <Text style={s.settingArrow}>›</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View style={s.section}>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Text style={s.logoutIcon}>🚪</Text>
            <Text style={s.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.version}>Ripple v1.0.0 • Made with 💙</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.foam },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
  },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  avatarCircle: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: Colors.textLight,
  },
  avatarInfo: { flex: 1 },
  avatarName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  avatarSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  avatarAge: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    borderWidth: 1.5,
    borderColor: Colors.teal,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editBtnText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: Colors.teal,
  },
  streakCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  streakLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakFire: { fontSize: 24 },
  streakRight: {
    flex: 1,
    alignItems: 'center',
  },
  streakNum: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  streakLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  streakDivider: {
    width: 1, height: 36,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  reminderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderIcon: { fontSize: 22 },
  reminderLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  reminderSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: { fontSize: 18, width: 24 },
  settingLabel: {
    flex: 1,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  settingArrow: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.alertHigh + '40',
  },
  logoutIcon: { fontSize: 18 },
  logoutText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: Colors.alertHigh,
  },
  version: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
});