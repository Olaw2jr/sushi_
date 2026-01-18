import React, { useEffect, useState } from 'react';
import Text from 'components/base/Text';
import { ScrollView, View, StatusBar, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { EditTransactionProps } from './props';
import { ArrowLeft } from 'lucide-react-native';
import Picker from 'components/base/Picker';
import Button from 'components/base/Button';
import DatePicker from 'components/module/DatePicker';
import TimePicker from 'components/module/TimePicker';
import { toWalletOptions, formatCategory } from './transforms';
import TextInput from 'components/base/TextInput';
import TextView from 'components/base/Text/view';
import { TransactionStatus, TransactionKind, FlagColor } from 'constants/enums';

const TRANSACTION_TYPES: {
  label: string;
  value: 'IN' | 'OUT';
}[] = [
  {
    label: '-',
    value: 'OUT',
  },
  {
    label: '+',
    value: 'IN',
  },
];

const STATUS_OPTIONS = Object.values(TransactionStatus).map(s => ({ label: s, value: s }));
const KIND_OPTIONS = Object.values(TransactionKind).map(k => ({ label: k, value: k }));
const FLAG_OPTIONS = [
  { label: 'None', value: null },
  ...Object.values(FlagColor).map(f => ({ label: f, value: f }))
];

const EditTransactionView = (props: EditTransactionProps) => {
  const { navigation, editTransaction, wallets, transactions, transaction } =
    props;
  const { styles, theme, colors } = useStyles();
  const categoriesState = useSelector((state: RootState) => state.categories);
  const entitiesState = useSelector((state: RootState) => state.entities);

  const walletOptions = toWalletOptions(wallets);
  const categoryOptions = Object.values(categoriesState.categories)
    .filter(c => !c.isSystem)
    .map(c => ({ label: c.name, value: c.id }));
  
  const entityOptions = Object.values(entitiesState).map(e => ({ label: e.name, value: e.id }));

  const [categoryId, setCategoryId] = useState<string | null>(transaction.categoryId || (transaction.isTransfer ? 'transfer' : null));
  const [entityId, setEntityId] = useState<string | null>(transaction.entityId);
  const [sourceWalletId, setSourceWalletId] = useState<string | null>(transaction.sourceWalletId);
  const [destinationWalletId, setDestinationWalletId] = useState<string | null>(transaction.destinationWalletId);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(Math.abs(transaction.amount).toFixed(2));
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT'>(transaction.amount > 0 ? 'IN' : 'OUT');
  const [paidAt, setPaidAt] = useState<Date | null>(new Date(transaction.paidAt));
  const [cleared, setCleared] = useState<TransactionStatus>(transaction.cleared || TransactionStatus.UNCLEARED);
  const [kind, setKind] = useState<TransactionKind | null>(transaction.kind || null);
  const [flagColor, setFlagColor] = useState<FlagColor | null>(transaction.flagColor || null);

  useEffect(() => {
    if (categoryId === 'transfer') {
      setTransactionType('OUT');
    }
  }, [categoryId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      <View style={[styles.header, { borderBottomWidth: 1, borderBottomColor: colors.BORDER }]}>
        <TouchableOpacity
          style={styles.headerLeftAction}
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowLeft color={colors.PRIMARY_TEXT} size={24} />
        </TouchableOpacity>
        <Text
          variant="title"
          style={styles.headerTitleContainer}
          theme={theme}
          translationKey="EDIT_TRANSACTION"
        />
      </View>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <DatePicker
            containerStyle={styles.inputContainer}
            labelTranslationKey="TRANSACTION_DATE"
            startDate={paidAt}
            setStartDate={setPaidAt}
            defaultLabelTranslationKey="TRANSACTION_DATE"
            hideActionButton
            theme={theme}
          />
          <TimePicker
            containerStyle={styles.inputContainer}
            labelTranslationKey="TRANSACTION_TIME"
            selectedTime={paidAt}
            setSelectedTime={setPaidAt}
          />
          
          <Picker
            containerStyle={styles.inputContainer}
            label="Category"
            selectedValue={categoryId || undefined}
            onSelect={(value) => setCategoryId(value)}
            options={[
              { label: 'Transfer', value: 'transfer' },
              ...categoryOptions
            ]}
            theme={theme}
          />

          <Picker
            containerStyle={styles.inputContainer}
            label="Payee"
            selectedValue={entityId || undefined}
            onSelect={(value) => setEntityId(value)}
            options={entityOptions}
            theme={theme}
          />

          <Picker
            containerStyle={styles.inputContainer}
            translationKey="SOURCE_ACCOUNT"
            selectedValue={sourceWalletId || undefined}
            onSelect={(value) => setSourceWalletId(value)}
            options={walletOptions}
            theme={theme}
          />

          {categoryId === 'transfer' && (
            <Picker
              containerStyle={styles.inputContainer}
              translationKey="DESTINATION_ACCOUNT"
              selectedValue={destinationWalletId || undefined}
              onSelect={(value) => setDestinationWalletId(value)}
              options={walletOptions}
              theme={theme}
            />
          )}

          <TextInput
            containerStyle={styles.inputContainer}
            translationKey="SHORT_DESCRIPTION"
            value={description}
            onChangeText={(text) => setDescription(text)}
            theme={theme}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Picker
              containerStyle={[styles.inputContainer, { flex: 1 }]}
              label="Status"
              selectedValue={cleared}
              onSelect={(value) => setCleared(value as TransactionStatus)}
              options={STATUS_OPTIONS}
              theme={theme}
            />
            <Picker
              containerStyle={[styles.inputContainer, { flex: 1 }]}
              label="Flag"
              selectedValue={flagColor || undefined}
              onSelect={(value) => setFlagColor(value as FlagColor)}
              options={FLAG_OPTIONS}
              theme={theme}
            />
          </View>

          <Picker
            containerStyle={styles.inputContainer}
            label="Transaction Kind"
            selectedValue={kind || undefined}
            onSelect={(value) => setKind(value as TransactionKind)}
            options={KIND_OPTIONS}
            theme={theme}
          />

          <TextInput
            containerStyle={styles.inputContainer}
            translationKey="AMOUNT"
            value={amount}
            maxLength={14}
            onChangeText={(text) => setAmount(text)}
            placeholder="0"
            keyboardType="decimal-pad"
            onBlur={() => {
              setAmount((previousValue) =>
                (parseFloat(previousValue) || 0).toString(),
              );
            }}
            theme={theme}
          />

          {categoryId !== 'transfer' && (
            <View style={styles.transactionTypeContainer}>
              {TRANSACTION_TYPES.map(({ label, value }) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.transactionTypeBadge,
                    transactionType === value
                      ? styles.transactionTypeBadgeSelected
                      : {},
                  ]}
                  onPress={() => {
                    setTransactionType(value);
                  }}>
                  <TextView
                    style={styles.transactionTypeText}
                    variant="label"
                    theme={theme}>
                    {label}
                  </TextView>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.actionsContainer}>
          <Button
            onPress={() => {
              const selectedCategory = categoryId === 'transfer' 
                ? { name: 'Transfer', id: null } 
                : categoriesState.categories[categoryId || ''];
              
              const selectedEntity = entitiesState[entityId || ''];

              editTransaction({
                ...transaction,
                category: selectedCategory?.name || 'Others',
                categoryId: selectedCategory?.id || null,
                entityId: entityId,
                payee: selectedEntity?.name || 'Others',
                description: description || '',
                amount:
                  parseFloat(
                    `${transactionType === 'IN' ? '+' : '-'}${amount}`,
                  ) || 0,
                sourceWalletId: sourceWalletId || '',
                destinationWalletId,
                cleared,
                kind,
                flagColor,
                isTransfer: categoryId === 'transfer',
                paidAt: (paidAt || new Date()).toISOString(),
              });
            }}
            translationKey="UPDATE_TRANSACTION"
            theme={theme}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditTransactionView;
