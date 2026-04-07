import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { commonStyles as c } from '../../../styles/common.styles';
import { profileStyles as s } from '../../../styles/profile.styles';
import { useAuthStore } from '../../../stores/auth.store';

const SECTION_ITEMS = [
  {
    title: 'Tài khoản',
    items: [
      { icon: '', label: 'Chỉnh sửa hồ sơ',    arrow: true },
      { icon: '', label: 'Bảo mật & Mật khẩu',  arrow: true },
      { icon: '', label: 'Thông báo',             arrow: true },
    ],
  },
  {
    title: 'Cài đặt',
    items: [
      { icon: '', label: 'Ngôn ngữ',                    arrow: true },
      { icon: '', label: 'Giao diện',                   arrow: true },
    ],
  },
  {
    title: 'Hỗ trợ',
    items: [
      { icon: '', label: 'Trợ giúp & FAQ',               arrow: true },
      { icon: '', label: 'Gửi phản hồi',                 arrow: true },
      { icon: '', label: 'Điều khoản & Quyền riêng tư', arrow: true },
    ],
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const displayName = user?.displayName || user?.username || 'Người dùng';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={c.safe}>
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


        <View style={s.streakCard}>
          <View style={s.streakLeft}>
            <Text style={s.streakFire}></Text>
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
            <Text style={s.reminderIcon}></Text>
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


        <View style={s.section}>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Text style={s.logoutIcon}></Text>
            <Text style={s.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.version}>Ripple v1.0.0</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}