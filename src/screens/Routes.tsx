import { hide as hideBootSplash } from 'react-native-bootsplash';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from 'types/Route';
import { useAppSelector } from 'store';
import { COLORS } from 'theme';
import { TranslationKey } from 'types/Translation';
import Text from 'components/base/Text';
import HomeScreen from './Home';
import InsightsScreen from './Insights';
import TransactionsScreen from './Transactions';
import BudgetsScreen from './Budgets';
import SettingsScreen from './Settings';
import CreateWalletScreen from './CreateWallet';
import EditWalletScreen from './EditWallet';
import CreateTransactionScreen from './CreateTransaction';
import EditTransactionScreen from './EditTransaction';
import WalletDetailsScreen from './WalletDetails';
import TransactionDetailsScreen from './TransactionDetails';
import FiltersScreen from './Filters';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabLabel = ({
  focused,
  translationKey,
}: {
  focused: boolean;
  translationKey: TranslationKey;
}) => {
  const theme = useAppSelector((state) => state.theme);
  const colors = COLORS[theme.base];

  return (
    <View style={{ alignItems: 'center', gap: 5 }}>
      <Text
        variant="label"
        theme={theme}
        translationKey={translationKey}
        style={{
          textTransform: 'none',
          letterSpacing: 0,
          fontWeight: focused ? '600' : '400',
          color: focused ? colors.PRIMARY_TEXT : colors.SECONDARY_TEXT,
        }}
      />
      <View
        style={{
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: focused ? colors.PRIMARY : 'transparent',
        }}
      />
    </View>
  );
};

const renderHomeTabIcon = ({ focused }: { focused: boolean }) => (
  <TabLabel focused={focused} translationKey="HOME" />
);
const renderInsightsTabIcon = ({ focused }: { focused: boolean }) => (
  <TabLabel focused={focused} translationKey="INSIGHTS" />
);
const renderTransactionsTabIcon = ({ focused }: { focused: boolean }) => (
  <TabLabel focused={focused} translationKey="TRANSACTIONS" />
);
const renderBudgetsTabIcon = ({ focused }: { focused: boolean }) => (
  <TabLabel focused={focused} translationKey="BUDGETS" />
);
const renderSettingsTabIcon = ({ focused }: { focused: boolean }) => (
  <TabLabel focused={focused} translationKey="SETTINGS" />
);

const MainTabs = () => {
  const theme = useAppSelector((state) => state.theme);
  const colors = COLORS[theme.base];

  return (
    <Tab.Navigator
      initialRouteName="HOME"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.BACKGROUND,
          borderTopWidth: 1,
          borderTopColor: colors.DIVIDER,
        },
      }}>
      <Tab.Screen
        name="HOME"
        component={HomeScreen}
        options={{ tabBarIcon: renderHomeTabIcon }}
      />
      <Tab.Screen
        name="INSIGHTS"
        component={InsightsScreen}
        options={{ tabBarIcon: renderInsightsTabIcon }}
      />
      <Tab.Screen
        name="TRANSACTIONS"
        component={TransactionsScreen}
        options={{ tabBarIcon: renderTransactionsTabIcon }}
      />
      <Tab.Screen
        name="BUDGETS"
        component={BudgetsScreen}
        options={{ tabBarIcon: renderBudgetsTabIcon }}
      />
      <Tab.Screen
        name="SETTINGS"
        component={SettingsScreen}
        options={{ tabBarIcon: renderSettingsTabIcon }}
      />
    </Tab.Navigator>
  );
};

const Routes = () => {
  useEffect(() => {
    hideBootSplash({ fade: true });
  }, []);
  return (
    <RootStack.Navigator initialRouteName="TABS">
      <RootStack.Screen
        options={{ headerShown: false }}
        name="TABS"
        component={MainTabs}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="CREATE_WALLET"
        component={CreateWalletScreen}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="EDIT_WALLET"
        component={EditWalletScreen}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="CREATE_TRANSACTION"
        component={CreateTransactionScreen}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="EDIT_TRANSACTION"
        component={EditTransactionScreen}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="WALLET_DETAILS"
        component={WalletDetailsScreen}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="TRANSACTION_DETAILS"
        component={TransactionDetailsScreen}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="FILTERS"
        component={FiltersScreen}
      />
    </RootStack.Navigator>
  );
};

export default Routes;
