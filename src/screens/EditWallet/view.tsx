import React, { useState } from 'react';
import { ScrollView, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { EditWalletProps } from './props';
import { ArrowLeft } from 'lucide-react-native';
import TextWithTranslation from 'components/base/Text';
import TextInput from 'components/base/TextInput';
import Button from 'components/base/Button';

const EditWalletView = (props: EditWalletProps) => {
  const { navigation, wallet, editWallet } = props;
  const { styles, theme, colors } = useStyles();

  const [label, setLabel] = useState(wallet.label);
  const [initialAmount, setInitialAmount] = useState(
    wallet.initialAmount.toFixed(2),
  );

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
          containerStyle={styles.headerTitleContainer}
          variant="title"
          theme={theme}
          translationKey="EDIT_ACCOUNT"
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
              editWallet({
                ...wallet,
                label: label || 'New Wallet',
                initialAmount: parseFloat(initialAmount) || 0,
              })
            }
            translationKey="UPDATE_ACCOUNT"
            theme={theme}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditWalletView;
