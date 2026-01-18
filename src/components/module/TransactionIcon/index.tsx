import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';
import { TRANSACTION_ICON_MAP } from 'constants/mappings';
import { TransactionKind } from 'constants/enums';
import { User, Briefcase } from 'lucide-react-native';

interface TransactionIconProps {
  entityLogo?: string | null;
  entityName?: string;
  kind?: TransactionKind | null;
  isTransfer?: boolean;
  isSocial?: boolean;
  style?: any;
}

const TransactionIcon = ({
  entityLogo,
  entityName,
  kind,
  isTransfer,
  isSocial,
  style,
}: TransactionIconProps) => {
  const theme = useSelector((state: RootState) => state.theme);
  const colors = COLORS[theme.base];
  const [error, setError] = useState(false);

  if (isSocial) {
    return (
      <View style={[styles.container, { backgroundColor: colors.PRIMARY + '20' }, style]}>
        <User size={20} color={colors.PRIMARY} />
      </View>
    );
  }

  const Icon = TRANSACTION_ICON_MAP[kind || TransactionKind.PAYMENT] || Briefcase;

  if (entityLogo && !isTransfer && !error) {
    return (
      <View style={[styles.imageContainer, { backgroundColor: colors.BORDER + '40' }, style]}>
        <Image
          source={{ uri: entityLogo }}
          style={styles.image}
          onError={() => setError(true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.BORDER + '40' }, style]}>
      <Icon size={20} color={colors.PRIMARY} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default TransactionIcon;
