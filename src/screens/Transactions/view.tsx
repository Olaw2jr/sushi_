import React, { useEffect, useState } from 'react';
import Text from 'components/base/Text';
import { View, StatusBar, TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStyles from './styles';
import { TransactionsProps } from './props';
import { ChevronLeft } from 'lucide-react-native';
import { createListItemRenderer } from 'components/module/TransactionCard';
import TextView from 'components/base/Text/view';
import Button from 'components/base/Button';
import { createCSV, recordToCSVString } from 'services/CSV';
import Info from 'components/module/Info';
import { formatDate } from 'utils/formatDate';
import useFilteredTransactions from 'utils/hooks/useFilteredTransactions';
import FilterButton from 'components/module/FilterButton';

const TransactionsView = (props: TransactionsProps) => {
  const { navigation, wallets, language } = props;
  const { styles, theme, colors } = useStyles();

  const { filteredTransactions, dailyFilteredTransactions } =
    useFilteredTransactions();

  const [exportedFileName, setExportedFileName] = useState('');
  const [exportStatus, setExportStatus] = useState<
    'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILED'
  >('IDLE');

  useEffect(() => {
    if (exportStatus === 'SUCCESS' || exportStatus === 'FAILED') {
      setTimeout(() => {
        setExportStatus('IDLE');
      }, 3000);
    }
  }, [exportStatus]);

  const renderTransaction = createListItemRenderer({
    wallets,
    theme,
    language,
    containerStyle: styles.transactionCard,
    showDescription: true,
    onPressItem: (transactionId) =>
      navigation.navigate('TRANSACTION_DETAILS', { transactionId }),
  });

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
          <ChevronLeft size={24} color={colors.PRIMARY_TEXT} />
        </TouchableOpacity>
        <Text
          containerStyle={styles.headerTitleContainer}
          variant="title"
          theme={theme}
          translationKey="TRANSACTIONS"
        />
        <FilterButton
          onPress={() => {
            navigation.navigate('FILTERS');
          }}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.transactionsContainer}>
          <SectionList
            contentContainerStyle={styles.contentScroll}
            sections={dailyFilteredTransactions}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section: { day } }) => (
              <TextView
                variant="subtitle"
                theme={theme}
                style={styles.dateText}>
                {day}
              </TextView>
            )}
            renderItem={({ item }) => renderTransaction({ item: item })}
          />
        </View>
        {exportStatus === 'SUCCESS' ? (
          <Info
            theme={theme}
            label={`Transactions has been successfully exported to ${exportedFileName}`}
          />
        ) : (
          <View style={styles.actionsContainer}>
            <Button
              outline
              onPress={() => {
                if (exportStatus !== 'LOADING') {
                  setExportStatus('LOADING');
                  const fileName =
                    'transactions_' +
                    formatDate(new Date().toISOString(), 'yyyyMMddHHmmss');
                  setExportedFileName(`sushi_${fileName}.csv`);
                  createCSV(
                    fileName,
                    recordToCSVString(
                      filteredTransactions.map((t) => ({
                        ...t,
                        sourceWalletLabel: wallets[t.sourceWalletId]?.label,
                        sourceWalletInitialAmount:
                          wallets[t.sourceWalletId]?.initialAmount,
                        ...(t.destinationWalletId
                          ? {
                              destinationWalletLabel:
                                wallets[t.destinationWalletId]?.label || null,
                              destinationWalletInitialAmount:
                                wallets[t.destinationWalletId]?.initialAmount ||
                                null,
                            }
                          : {
                              destinationWalletLabel: null,
                              destinationWalletInitialAmount: null,
                            }),
                      })),
                    ),
                  )
                    .then(() => {
                      setExportStatus('SUCCESS');
                    })
                    .catch((e) => {
                      console.log(e);
                      setExportStatus('FAILED');
                    });
                }
              }}
              translationKey="EXPORT"
              theme={theme}
              loading={exportStatus === 'LOADING'}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TransactionsView;
