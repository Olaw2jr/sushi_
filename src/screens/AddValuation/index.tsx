import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';
import Text from 'components/base/Text';
import TextView from 'components/base/Text/view';
import TextInput from 'components/base/TextInput';
import Button from 'components/base/Button';
import DatePicker from 'components/module/DatePicker';
import { addValuation } from 'store/valuations';

const AddValuationScreen = ({ navigation, route }: any) => {
  const { walletId } = route.params;
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const colors = COLORS[theme.base];
  const wallet = useSelector((state: RootState) => state.wallets[walletId]);

  const [date, setDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (value) {
      dispatch(addValuation({
        assetId: walletId,
        date: (date || new Date()).toISOString(),
        value: parseFloat(value),
        price: null,
        quantity: null,
        note: note || null,
      }));
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar backgroundColor={colors.BACKGROUND} barStyle={colors.STATUS_BAR} />
      <View style={[styles.header, { borderBottomColor: colors.BORDER }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.PRIMARY_TEXT} size={24} />
        </TouchableOpacity>
        <TextView variant="title" style={{ marginLeft: 16 }} theme={theme}>Add Valuation</TextView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <TextView variant="body" style={{ marginBottom: 24, color: colors.SECONDARY_TEXT }} theme={theme}>
          Record a new point-in-time value for {wallet.label}.
        </TextView>

        <DatePicker
          containerStyle={styles.inputContainer}
          labelTranslationKey="TRANSACTION_DATE"
          startDate={date}
          setStartDate={setDate}
          theme={theme}
        />

        <TextInput
          containerStyle={styles.inputContainer}
          label="New Value"
          value={value}
          onChangeText={setValue}
          keyboardType="decimal-pad"
          placeholder="0.00"
          theme={theme}
        />

        <TextInput
          containerStyle={styles.inputContainer}
          label="Note"
          value={note}
          onChangeText={setNote}
          placeholder="Optional notes"
          theme={theme}
        />

        <Button
          onPress={handleSave}
          label="SAVE VALUATION"
          theme={theme}
          containerStyle={{ marginTop: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  inputContainer: { marginBottom: 20 }
});

export default AddValuationScreen;
