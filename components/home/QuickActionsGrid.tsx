import { View } from 'react-native';
import { quickActionStyles as s } from '../../styles/home/quick-actions.styles';
import WaterQuickCard from './cards/WaterQuickCard';
import SleepQuickCard from './cards/SleepQuickCard';
import WalkQuickCard from './cards/WalkQuickCard';
import MeditateQuickCard from './cards/MeditateQuickCard';

export default function QuickActionsGrid() {
  return (
    <View style={s.grid}>
      <WaterQuickCard />
      <SleepQuickCard />
      <WalkQuickCard />
      <MeditateQuickCard />
    </View>
  );
}
