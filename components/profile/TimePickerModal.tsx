import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { timePickerModalStyles as s } from '../../styles/profile/time-picker-modal.styles';
import {
  TIME_PICKER_HOURS,
  TIME_PICKER_ITEM_HEIGHT,
  TIME_PICKER_MINUTES,
} from '../../constants/profile/time-picker.constants';
import { clampListIndex, roundToClosestMinute } from '../../utils/profile/time-picker.utils';

interface Props {
  visible: boolean;
  initialHour: number;
  initialMinute: number;
  onClose: () => void;
  onConfirm: (hour: number, minute: number) => void;
}

export default function TimePickerModal({
  visible,
  initialHour,
  initialMinute,
  onClose,
  onConfirm,
}: Props) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(roundToClosestMinute(initialMinute, TIME_PICKER_MINUTES));
  const hourListRef = useRef<FlatList<number>>(null);
  const minuteListRef = useRef<FlatList<number>>(null);

  useEffect(() => {
    if (!visible) return;

    const roundedMinute = roundToClosestMinute(initialMinute, TIME_PICKER_MINUTES);
    setHour(initialHour);
    setMinute(roundedMinute);

    setTimeout(() => {
      hourListRef.current?.scrollToIndex({ index: initialHour, animated: false });
      const minuteIndex = TIME_PICKER_MINUTES.indexOf(roundedMinute);
      minuteListRef.current?.scrollToIndex({ index: minuteIndex >= 0 ? minuteIndex : 0, animated: false });
    }, 50);
  }, [visible, initialHour, initialMinute]);

  const onHourEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / TIME_PICKER_ITEM_HEIGHT);
    const clamped = clampListIndex(index, TIME_PICKER_HOURS.length);
    setHour(TIME_PICKER_HOURS[clamped]);
  };

  const onMinuteEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / TIME_PICKER_ITEM_HEIGHT);
    const clamped = clampListIndex(index, TIME_PICKER_MINUTES.length);
    setMinute(TIME_PICKER_MINUTES[clamped]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>Chọn giờ nhắc</Text>
          <Text style={s.sub}>Ripple sẽ nhắc bạn ghi journal vào giờ này mỗi ngày.</Text>

          <View style={s.row}>
            <Column
              ref={hourListRef}
              data={TIME_PICKER_HOURS}
              selected={hour}
              onEnd={onHourEnd}
              format={(value) => String(value).padStart(2, '0')}
            />
            <Text style={s.colon}>:</Text>
            <Column
              ref={minuteListRef}
              data={TIME_PICKER_MINUTES}
              selected={minute}
              onEnd={onMinuteEnd}
              format={(value) => String(value).padStart(2, '0')}
            />
          </View>

          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.okBtn} onPress={() => onConfirm(hour, minute)}>
              <Text style={s.okText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface ColumnProps {
  data: number[];
  selected: number;
  onEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  format: (value: number) => string;
}

const Column = forwardRef<FlatList<number>, ColumnProps>(function Column(
  { data, selected, onEnd, format },
  ref
) {
  return (
    <View style={s.wheelWrap}>
      <View style={s.selector} pointerEvents="none" />
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => String(item)}
        showsVerticalScrollIndicator={false}
        snapToInterval={TIME_PICKER_ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={onEnd}
        onScrollEndDrag={onEnd}
        getItemLayout={(_, index) => ({
          length: TIME_PICKER_ITEM_HEIGHT,
          offset: TIME_PICKER_ITEM_HEIGHT * index,
          index,
        })}
        ListHeaderComponent={<View style={s.listSpacer} />}
        ListFooterComponent={<View style={s.listSpacer} />}
        renderItem={({ item }) => (
          <View style={s.item}>
            <Text style={[s.itemText, item === selected && s.itemTextActive]}>
              {format(item)}
            </Text>
          </View>
        )}
      />
    </View>
  );
});
