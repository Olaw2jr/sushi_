import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import useStyles from './style';
import { InfoProps } from './props';
import Text from 'components/base/Text/view';
import { COLORS } from 'theme';
import { TRANSLATIONS } from 'constants/translations';
import { RootState } from 'store';

const Info = (props: InfoProps) => {
  const { containerStyle = {}, theme, label, translationKey, replacementRecord = {} } = props;
  const language = useSelector((state: RootState) => state.language.selected);

  let displayLabel = label || '';
  if (translationKey) {
    displayLabel = TRANSLATIONS[language][translationKey];
    displayLabel = Object.keys(replacementRecord).reduce(
      (text, key) => text.replace(`{{${key}}}`, replacementRecord[key]),
      displayLabel,
    );
  }

  const { styles, colors } = useStyles(theme);
  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        theme={theme}
        variant="body"
        style={{ color: COLORS.LIGHT.AREA_HIGHLIGHT }}>
        {displayLabel}
      </Text>
    </View>
  );
};

export default Info;
