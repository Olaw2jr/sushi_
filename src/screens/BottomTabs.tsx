import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TransactionsScreen from './Transactions';
import BudgetScreen from './Budget';
import AccountsScreen from './Accounts';
import InsightsScreen from './Insights';
import { List, Folder, CreditCard, PieChart } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';
import { TRANSLATIONS } from 'constants/translations';

const Tab = createBottomTabNavigator<any>();

const BottomTabs = () => {
  const theme = useSelector((state: RootState) => state.theme);
  const language = useSelector((state: RootState) => state.language.selected);
  const colors = COLORS[theme.base];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.SECONDARY_TEXT,
        tabBarStyle: {
          backgroundColor: colors.BACKGROUND,
          borderTopColor: colors.DIVIDER,
        },
      }}>
      <Tab.Screen
        name="INSIGHTS"
        component={InsightsScreen}
        options={{
          title: TRANSLATIONS[language].INSIGHTS,
          tabBarIcon: ({ color, size }) => (
            <PieChart size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TRANSACTIONS"
        component={TransactionsScreen}
        options={{
          title: TRANSLATIONS[language].TRANSACTIONS,
          tabBarIcon: ({ color, size }) => (
            <List size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BUDGET"
        component={BudgetScreen}
        options={{
          title: TRANSLATIONS[language].BUDGET,
          tabBarIcon: ({ color, size }) => (
            <Folder size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ACCOUNTS"
        component={AccountsScreen}
        options={{
          title: TRANSLATIONS[language].ACCOUNTS,
          tabBarIcon: ({ color, size }) => (
            <CreditCard size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;