import React from 'react';
import numbro from 'numbro';
import { ScrollView, View, StatusBar, TouchableOpacity, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import useStyles from './styles';
import { SettingsProps } from './props';
import { ArrowLeft } from 'lucide-react-native';
import Text from 'components/base/Text';
import Picker from 'components/base/Picker';
import useTranslationKey from 'utils/hooks/useTranslationKey';
import { TRANSLATIONS } from 'constants/translations';

const LANGUAGE_OPTIONS = Object.keys(TRANSLATIONS).map((value) => {
  const typedValue = value as keyof typeof TRANSLATIONS;
  return {
    label: TRANSLATIONS[typedValue].TRANSLATION_NAME,
    value,
  };
});

const SettingsView = (props: SettingsProps) => {
  const {
    navigation,
    baseTheme,
    setBaseTheme,
    currencyLanguage,
    setCurrencyLanguage,
    selectedLanguage,
    setSelectedLanguage,
  } = props;
  const { styles, theme, colors } = useStyles();

  const [TEXT_THEME_LIGHT, TEXT_THEME_DARK, TEXT_THEME_WASABI] =
    useTranslationKey(['THEME_LIGHT', 'THEME_DARK', 'THEME_WASABI']);

  const numbroLanguages = numbro.languages();
  const currencyLanguageOptions = Object.keys(numbroLanguages).reduce(
    (accum: { label: string; value: string }[], key: string) => {
      const data = numbroLanguages[key];
      return [
        ...accum,
        {
          label: `${data.currency.code}/${data.languageTag} (${data.currency.symbol})`,
          value: key,
        },
      ];
    },
    [],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar
        backgroundColor={colors.BACKGROUND}
        barStyle={colors.STATUS_BAR}
      />
      <View style={[styles.header, { borderBottomColor: colors.BORDER, backgroundColor: colors.BACKGROUND + 'CC' }]}>
        <TouchableOpacity
          style={styles.headerLeftAction}
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowLeft color={colors.PRIMARY_TEXT} size={24} />
        </TouchableOpacity>
        <Text
          containerStyle={styles.headerTitleContainer}
          variant="title"
          theme={theme}
          translationKey="SETTINGS"
        />
      </View>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.contentScroll}>
          <Picker
            containerStyle={styles.inputContainer}
            translationKey="CURRENCY"
            selectedValue={currencyLanguage}
            onSelect={(value) => value && setCurrencyLanguage(value)}
            options={currencyLanguageOptions}
            theme={theme}
          />

          <Picker
            containerStyle={styles.inputContainer}
            translationKey="LANGUAGE"
            selectedValue={selectedLanguage}
            onSelect={(value) => value && setSelectedLanguage(value)}
            options={LANGUAGE_OPTIONS}
            theme={theme}
          />

          <Picker
            containerStyle={styles.textFieldContainer}
            translationKey="THEME"
            selectedValue={baseTheme}
            onSelect={(value) => {
              // @ts-ignore
              setBaseTheme(value);
              // Sync with Uniwind for CSS variable theming
              if (value === 'Dark') {
                Uniwind.setTheme('dark');
              } else {
                Uniwind.setTheme('light');
              }
            }}
            options={[
              {
                label: 'Sushi 2 (Modern)',
                value: 'SUSHI_2',
              },
              {
                label: TEXT_THEME_LIGHT,
                value: 'Light',
              },
              {
                label: TEXT_THEME_DARK,
                value: 'Dark',
              },
              {
                label: TEXT_THEME_WASABI,
                value: 'Wasabi',
              },
            ]}
            theme={theme}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsView;