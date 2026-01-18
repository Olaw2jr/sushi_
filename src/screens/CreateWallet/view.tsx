import React, { useState } from 'react';
import { ScrollView, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { CreateWalletProps } from './props';
import { ArrowLeft } from 'lucide-react-native';
import TextWithTranslation from 'components/base/Text';
import TextInput from 'components/base/TextInput';
import Button from 'components/base/Button';
import Picker from 'components/base/Picker';
import { AccountType } from 'constants/enums';
import { Switch } from 'react-native';

const ACCOUNT_TYPE_OPTIONS = Object.values(AccountType).map(t => ({ label: t, value: t }));

const CreateWalletView = (props: CreateWalletProps) => {
  const { navigation, createWallet } = props;
  const { styles, theme, colors } = useStyles();

  const [label, setLabel] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [type, setType] = useState<AccountType>(AccountType.CHECKING);
  const [onBudget, setOnBudget] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeftAction}
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowLeft color={colors.PRIMARY_TEXT} size={24} />
        </TouchableOpacity>
        <TextWithTranslation
          variant="title"
          style={styles.headerTitleContainer}
          theme={theme}
          translationKey="ADD_ACCOUNT"
        />
      </View>
      <View style={styles.content}>
        <ScrollView style={styles.contentScroll}>
          <TextInput
            containerStyle={styles.textFieldContainer}
            translationKey="ACCOUNT_NAME"
            value={label}
            onChangeText={(text) => setLabel(text)}
            theme={theme}
          />

          <Picker
            containerStyle={styles.textFieldContainer}
            translationKey="ACCOUNT_TYPE"
            selectedValue={type}
            onSelect={(value) => setType(value as AccountType)}
            options={ACCOUNT_TYPE_OPTIONS}
            theme={theme}
          />

          <View style={[styles.textFieldContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }]}>
            <TextWithTranslation theme={theme} translationKey="ON_BUDGET" />
            <Switch
              value={onBudget}
              onValueChange={setOnBudget}
              trackColor={{ false: colors.BORDER, true: colors.PRIMARY }}
            />
          </View>

          <TextInput
            containerStyle={styles.textFieldContainer}
            translationKey="INITIAL_AMOUNT"
            value={initialAmount}
            maxLength={14}
            onChangeText={(text) => setInitialAmount(text)}
            placeholder="0"
            keyboardType="decimal-pad"
            onBlur={() => {
              setInitialAmount((previousValue) =>
                (parseFloat(previousValue) || 0).toString(),
              );
            }}
            theme={theme}
          />
        </ScrollView>
        <View style={styles.actionsContainer}>
          <Button
            onPress={() =>
              createWallet({
                label: label || 'New Wallet',
                initialAmount: parseFloat(initialAmount) || 0,
                type,
                onBudget,
                note: null,
                parentId: null,
                entityId: null,
                accountNumber: null,
                interestRate: null,
                nextPaymentDate: null,
                nextPaymentAmount: null,
                maturityDate: null,
                creditLimit: 0,
              })
            }
            translationKey="CREATE_ACCOUNT"
            theme={theme}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateWalletView;
