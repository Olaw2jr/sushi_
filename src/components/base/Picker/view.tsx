import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, ScrollView } from 'react-native';
import Text from 'components/base/Text/view';
import useStyles from './style';
import { PickerPrivateProps } from './props';
import { ChevronDown, X } from 'lucide-react-native';

const Picker = (props: PickerPrivateProps) => {
  const {
    containerStyle = {},
    theme,
    onSelect,
    selectedValue,
    options,
    label = '',
    placeholder,
    renderLabel,
    renderActionButton,
  } = props;

  const { styles, colors } = useStyles(theme);

  const [showModal, setShowModal] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  const selectedLabel = selectedOption ? selectedOption.label : '';

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        {renderLabel ? (
          renderLabel()
        ) : (
          <Text variant="label" style={styles.label}>
            {label}
          </Text>
        )}

        <TouchableOpacity
          style={styles.inputContainer}
          activeOpacity={0.6}
          onPress={() => {
            if (options.length > 0) {
              setShowModal(true);
            }
          }}>
          <Text theme={theme} style={selectedValue ? {} : styles.placeholder}>
            {selectedLabel || props.placeholder}
          </Text>
          <ChevronDown size={20} color={colors.PRIMARY_TEXT} />
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={[styles.modalContainer, containerStyle]}>
          <View style={styles.modalContentArea}>
            <View style={styles.modalHeader}>
              <Text theme={theme} variant="subtitle" translationKey={props.translationKey} />
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color={colors.PRIMARY_TEXT} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  activeOpacity={0.6}
                  onPress={() => {
                    setShowModal(false);
                    if (onSelect) {
                      onSelect(option.value);
                    }
                  }}>
                  <View style={styles.modalItemContainer}>
                    <Text
                      style={
                        option.value === selectedValue
                          ? styles.modalItemLabelActive
                          : styles.modalItemLabel
                      }>
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {renderActionButton
                ? renderActionButton(() => {
                    if (onSelect) {
                      onSelect(null);
                    }
                    setShowModal(false);
                  })
                : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Picker;