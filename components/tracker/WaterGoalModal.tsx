import { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { waterGoalModalStyles as s } from '../../styles/tracker/water-goal-modal.styles';
import { clampWaterGoal, parseWaterGoal } from '../../utils/tracker/water-goal.utils';

interface Props {
  visible: boolean;
  initialGoal: number;
  onClose: () => void;
  onConfirm: (goal: number) => void;
}

export default function WaterGoalModal({ visible, initialGoal, onClose, onConfirm }: Props) {
  const [value, setValue] = useState(String(initialGoal));

  useEffect(() => {
    if (visible) setValue(String(initialGoal));
  }, [visible, initialGoal]);

  const bump = (delta: number) => {
    const current = Number(value) || initialGoal;
    setValue(String(clampWaterGoal(current + delta)));
  };

  const confirm = () => {
    const parsed = parseWaterGoal(value);
    if (parsed == null) return;
    Keyboard.dismiss();
    onConfirm(parsed);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>Mục tiêu uống nước</Text>
          <Text style={s.sub}>Số ly nước bạn muốn uống mỗi ngày (1–20 ly).</Text>

          <View style={s.row}>
            <TouchableOpacity style={s.stepBtn} onPress={() => bump(-1)}>
              <Text style={s.stepText}>−</Text>
            </TouchableOpacity>

            <TextInput
              value={value}
              onChangeText={(text) => setValue(text.replace(/[^0-9]/g, '').slice(0, 2))}
              keyboardType="number-pad"
              style={s.input}
              maxLength={2}
              selectTextOnFocus
            />

            <TouchableOpacity style={s.stepBtn} onPress={() => bump(1)}>
              <Text style={s.stepText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.unit}>ly / ngày</Text>

          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.okBtn} onPress={confirm}>
              <Text style={s.okText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
