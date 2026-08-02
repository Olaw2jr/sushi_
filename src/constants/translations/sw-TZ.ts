import { Translation } from 'types/Translation';
import en_US from './en-US';

const sw_TZ: Translation = {
  ...en_US,
  // DASHBOARD
  ALL: 'Zote',
  CREDIT: 'Mkopo',
  DEBIT: 'Malipo',
  RECENT_TRANSACTIONS: 'Miamala ya Hivi Karibuni',
  MY_ACCOUNTS: 'Akaunti Zangu',

  // ADD ACCOUNT
  ADD_ACCOUNT: 'Ongeza Akaunti',
  ACCOUNT_NAME: 'Jina la Akaunti',
  INITIAL_AMOUNT: 'Kiasi cha Awali',
  CREATE_ACCOUNT: 'Fungua Akaunti',

  // EDIT ACCOUNT
  EDIT_ACCOUNT: 'Hariri Akaunti',
  UPDATE_ACCOUNT: 'Sasisha Akaunti',

  // ACCOUNT DETAILS
  ACCOUNT_DETAILS: 'Maelezo ya Akaunti',
  CURRENT_BALANCE: 'Salio la Sasa',
  INITIAL_BALANCE: 'Salio la Awali',
  DELETE_ACCOUNT: 'Futa Akaunti?',
  DELETE_ACCOUNT_INFO:
    'Hatua hii itafuta kabisa akaunti ya {{accountName}} pamoja na miamala {{transactionCount}} iliyounganishwa nayo.',

  // NEW TRANSACTION
  NEW_TRANSACTION: 'Muamala Mpya',
  CREATE_TRANSACTION: 'Fanya Muamala',
  CATEGORY: 'Kundi',
  SOURCE_ACCOUNT: 'Akaunti ya Chanzo',
  DESTINATION_ACCOUNT: 'Akaunti ya Mpokeaji',
  TRANSFER: 'Hamisha',
  SHORT_DESCRIPTION: 'Maelezo Mafupi',
  AMOUNT: 'Kiasi',

  // EDIT TRANSACTION
  EDIT_TRANSACTION: 'Hariri Muamala',
  UPDATE_TRANSACTION: 'Sasisha Muamala',

  // TRANSACTION DETAILS
  TRANSACTION_DETAILS: 'Maelezo ya Muamala',
  ACCOUNT: 'Akaunti',
  TRANSACTION_DATE: 'Tarehe ya Muamala',
  TRANSACTION_TIME: 'Muda wa Muamala',
  DATE_CREATED: 'Tarehe ya Kuundwa',
  DATE_UPDATED: 'Tarehe ya Kusasishwa',
  DELETE_TRANSACTION: 'Futa Muamala?',
  DELETE_TRANSACTION_INFO: 'Hatua hii itafuta kabisa rekodi ya muamala huu.',
  KEEP: 'Weka',
  DELETE: 'Futa',

  // Transactions
  TRANSACTIONS: 'Miamala',
  EXPORT: 'Hamisha Nje',

  // SETTINGS
  SETTINGS: 'Mipangilio',
  TRANSLATION_NAME: 'Kiswahili (TZ)',
  CURRENCY: 'Sarafu',
  LANGUAGE: 'Lugha',
  THEME: 'Mandhari',
  THEME_LIGHT: 'Angavu',
  THEME_DARK: 'Giza',

  // Insights
  INSIGHTS: 'Tathmini',

  // Filters
  FILTERS: 'Vichujio',
  SEARCH: 'Tafuta',
  SEARCH_TERM: 'Neno la Kutafuta',
  SEARCH_DESCRIPTION:
    'Hutafuta maneno yanayofanana katika maelezo au kundi la muamala.',
  DATE_RANGE: 'Kipindi cha Tarehe',
  SHOW_ALL: 'Onyesha Zote',
  TRANSACTION_TYPE: 'Aina ya Muamala',
  RESET_FILTER: 'Weka Upya',
  APPLY_FILTER: 'Tumia Vichujio',
};

export default sw_TZ;
