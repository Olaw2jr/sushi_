import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, StatusBar, StyleSheet, TextInput, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, Plus, ChevronLeft, ChevronRight, Target, Search, Sparkles, MoreVertical } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from 'store';
import { COLORS } from 'theme';
import TextView from 'components/base/Text/view';
import { formatCurrency } from 'utils/formatCurrency';
import useBudgetPlan from 'utils/hooks/useBudgetPlan';
import { addMonths, format, parseISO } from 'date-fns';
import { assignMoney, moveMoney } from 'store/budgets';
import { updateCategory, setCategoryTarget } from 'store/categories';
import { TargetType, TargetCadence } from 'constants/enums';
import Chip from 'components/base/Chip';
import Picker from 'components/base/Picker';
import { v4 as uuidv4 } from 'uuid';

const BudgetScreen = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const language = useSelector((state: RootState) => state.currency.language);
  const colors = COLORS[theme.base];
  
  const categoryState = useSelector((state: RootState) => state.categories);
  
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentMonthStr, setCurrentMonthStr] = useState(new Date().toISOString().slice(0, 7));
  const [moveFundsAmount, setMoveFundsAmount] = useState('');
  const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'underfunded' | 'overspent'>('all');

  const plan = useBudgetPlan(currentMonthStr);

  const nextMonth = () => {
    const next = addMonths(parseISO(currentMonthStr + '-01'), 1);
    setCurrentMonthStr(format(next, 'yyyy-MM'));
  };

  const prevMonth = () => {
    const prev = addMonths(parseISO(currentMonthStr + '-01'), -1);
    setCurrentMonthStr(format(prev, 'yyyy-MM'));
  };

  // Group data calculation
  const groups = Object.values(categoryState.groups);
  const categories = Object.values(categoryState.categories);

  const budgetData = groups.map(group => {
    const groupCategories = plan.categories.filter(cat => cat.groupId === group.id);
    
    // Filter categories based on search and status filters
    const filteredCategories = groupCategories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeFilter === 'underfunded') return cat.underfunded > 0;
      if (activeFilter === 'overspent') return cat.available < 0;
      
      return true;
    });

    const groupAvailable = groupCategories.reduce((sum, cat) => sum + cat.available, 0);

    return {
      ...group,
      available: groupAvailable,
      categories: filteredCategories,
      totalCount: groupCategories.length
    };
  }).filter(group => group.categories.length > 0 || searchQuery === '');

  const totalToAllocate = plan.rtaAmount;

  const selectedCategoryDetail = selectedCategoryId 
    ? plan.categories.find(c => c.id === selectedCategoryId)
    : null;

  const handleMoveFunds = () => {
    if (selectedCategoryId && targetCategoryId && moveFundsAmount) {
      dispatch(moveMoney({
        month: currentMonthStr,
        fromCategoryId: selectedCategoryId,
        toCategoryId: targetCategoryId,
        amount: parseFloat(moveFundsAmount)
      }));
      setMoveFundsAmount('');
      setTargetCategoryId(null);
      setSelectedCategoryId(null);
    }
  };

  const handleAutoAssign = () => {
    let remainingRta = totalToAllocate;
    if (remainingRta <= 0) return;

    plan.categories.forEach(cat => {
      if (cat.underfunded > 0 && remainingRta > 0) {
        const amountToAssign = Math.min(cat.underfunded, remainingRta);
        dispatch(assignMoney({
          month: currentMonthStr,
          categoryId: cat.id,
          amount: (cat.assigned || 0) + amountToAssign
        }));
        remainingRta -= amountToAssign;
      }
    });
  };

  return (
    <SafeAreaView style={[localStyles.container, { backgroundColor: colors.BACKGROUND }]} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={colors.BACKGROUND} barStyle={colors.STATUS_BAR} />
      
      {/* Header */}
      <View style={[localStyles.header, { borderBottomColor: colors.BORDER, backgroundColor: colors.BACKGROUND + 'CC' }]}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <TouchableOpacity onPress={prevMonth}>
              <ChevronLeft size={20} color={colors.PRIMARY_TEXT} />
            </TouchableOpacity>
            <TextView variant="label" style={localStyles.headerSubtitle} theme={theme}>
              {format(parseISO(currentMonthStr + '-01'), 'MMMM yyyy').toUpperCase()}
            </TextView>
            <TouchableOpacity onPress={nextMonth}>
              <ChevronRight size={20} color={colors.PRIMARY_TEXT} />
            </TouchableOpacity>
          </View>
          <TextView variant="title" theme={theme}>Budget</TextView>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity 
            onPress={handleAutoAssign}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}
          >
            <Sparkles size={12} color={colors.PRIMARY} />
            <TextView variant="label" style={{ color: colors.PRIMARY }} theme={theme}>AUTO ASSIGN</TextView>
          </TouchableOpacity>
          <TextView variant="label" style={localStyles.headerSubtitle} theme={theme}>READY TO ASSIGN</TextView>
          <TextView variant="moneyLg" theme={theme} style={{ color: totalToAllocate >= 0 ? colors.POSITIVE : colors.NEGATIVE }}>
            {formatCurrency(totalToAllocate, { language })}
          </TextView>
        </View>
            </View>
      
            {/* Toolbar: Search and Filters */}
            <View style={{ paddingHorizontal: 24, paddingTop: 16, gap: 16 }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: colors.AREA_HIGHLIGHT, 
                borderRadius: 12, 
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: colors.BORDER
              }}>
                <Search size={18} color={colors.PLACE_HOLDER} />
                <TextInput
                  style={{ flex: 1, height: 44, marginLeft: 8, color: colors.PRIMARY_TEXT }}
                  placeholder="Search categories..."
                  placeholderTextColor={colors.PLACE_HOLDER}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <TextView variant="label" style={{ color: colors.PRIMARY }} theme={theme}>Clear</TextView>
                  </TouchableOpacity>
                )}
              </View>
      
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <Chip 
                  label="All" 
                  selected={activeFilter === 'all'} 
                  onPress={() => setActiveFilter('all')} 
                />
                <Chip 
                  label="Underfunded" 
                  selected={activeFilter === 'underfunded'} 
                  onPress={() => setActiveFilter('underfunded')} 
                />
                <Chip 
                  label="Overspent" 
                  selected={activeFilter === 'overspent'} 
                  onPress={() => setActiveFilter('overspent')} 
                />
              </ScrollView>
            </View>
      
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128, paddingTop: 32 }}>
        <View style={{ gap: 64 }}>
          {budgetData.map((group) => (
            <View key={group.id}>
              <View style={[localStyles.groupHeader, { alignItems: 'center' }]}>
                <TouchableOpacity
                  onPress={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                  activeOpacity={0.7}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  <ChevronDown
                    size={20}
                    color={colors.PLACE_HOLDER}
                    style={{ transform: [{ rotate: expandedGroup === group.id ? '180deg' : '0deg' }] }}
                  />
                  <View>
                    <TextView variant="subtitle" style={localStyles.groupTitle} theme={theme}>{group.name}</TextView>
                    <TextView variant="label" style={localStyles.groupSubtitle} theme={theme}>
                      AVAILABLE: {formatCurrency(group.available, { language })}
                    </TextView>
                  </View>
                </TouchableOpacity>
                
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TouchableOpacity onPress={() => {/* TODO: Implement New Category */}}>
                    <Plus size={20} color={colors.PRIMARY} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {/* TODO: Implement Group Menu */}}>
                    <MoreVertical size={20} color={colors.PLACE_HOLDER} />
                  </TouchableOpacity>
                </View>
              </View>

              {expandedGroup === group.id && (
                <View style={{ marginTop: 32, gap: 24 }}>
                  {group.categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategoryId(cat.id)}
                      activeOpacity={0.6}
                      style={[localStyles.categoryRow, { paddingVertical: 16 }]}
                    >
                      <View style={localStyles.categoryTopRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          {cat.underfunded > 0 && <Target size={14} color={colors.NEGATIVE} />}
                          <TextView variant="body" style={localStyles.categoryName} theme={theme}>{cat.name}</TextView>
                        </View>
                        <TextView variant="money" style={localStyles.categoryAvailable} theme={theme}>
                          {formatCurrency(cat.available, { language })}
                        </TextView>
                      </View>

                      {/* Minimal progress indicator */}
                      <View style={[localStyles.progressBarBg, { backgroundColor: colors.BORDER }]}>
                        <View
                          style={[
                            localStyles.progressBarFill,
                            { 
                              width: `${Math.min(((cat.assigned + cat.rollover - cat.available) / (cat.assigned + cat.rollover || 1)) * 100, 100)}%`,
                              backgroundColor: colors.PRIMARY
                            }
                          ]}
                        />
                      </View>

                      <View style={localStyles.categoryBottomRow}>
                        <TextView variant="label" theme={theme}>
                          {formatCurrency(Math.abs(cat.activity), { language })} spent
                        </TextView>
                        <TextView variant="label" theme={theme}>
                          {formatCurrency(cat.assigned, { language })} allocated
                        </TextView>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

  

        {/* Floating Action Button */}

        <TouchableOpacity style={[localStyles.fab, { backgroundColor: colors.PRIMARY }]}>

          <Plus size={24} color={colors.BACKGROUND} />

        </TouchableOpacity>

      {/* Category Detail Modal */}
      <Modal
        visible={!!selectedCategoryId}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCategoryId(null)}
      >
        <TouchableOpacity
          style={localStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedCategoryId(null)}
        >
          <TouchableOpacity
            style={[localStyles.modalContent, { backgroundColor: colors.BACKGROUND }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[localStyles.modalIndicator, { backgroundColor: colors.BORDER }]} />

            {selectedCategoryDetail && (
              <ScrollView style={{ maxHeight: 600 }}>
                <View style={{ gap: 24 }}>
                  <View style={{ gap: 8 }}>
                    <TextInput
                      style={{ fontSize: 28, fontWeight: '300', color: colors.PRIMARY_TEXT }}
                      defaultValue={selectedCategoryDetail.name}
                      onBlur={(e) => {
                        dispatch(updateCategory({
                          id: selectedCategoryDetail.id,
                          name: e.nativeEvent.text
                        }));
                      }}
                    />
                    <TextView variant="label" style={{ color: colors.PLACE_HOLDER }} theme={theme}>
                      {groups.find(g => g.id === selectedCategoryDetail.groupId)?.name || 'Unknown Group'}
                    </TextView>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View>
                      <TextView variant="label" theme={theme}>AVAILABLE</TextView>
                      <TextView variant="moneyLg" theme={theme} style={{ color: selectedCategoryDetail.available >= 0 ? colors.POSITIVE : colors.NEGATIVE }}>
                        {formatCurrency(selectedCategoryDetail.available, { language })}
                      </TextView>
                    </View>
                    
                    {selectedCategoryDetail.target && selectedCategoryDetail.target.amount > 0 && (
                      <View style={{ alignItems: 'flex-end' }}>
                        <TextView variant="label" theme={theme}>FULFILLMENT</TextView>
                        <TextView variant="title" theme={theme} style={{ color: colors.PRIMARY_TEXT, opacity: 0.6 }}>
                          {Math.round(((selectedCategoryDetail.rollover + selectedCategoryDetail.assigned) / selectedCategoryDetail.target.amount) * 100)}%
                        </TextView>
                      </View>
                    )}
                  </View>

                  {/* Target Archetype Configuration */}
                  <View style={{ padding: 20, backgroundColor: colors.AREA_HIGHLIGHT, borderRadius: 16, gap: 16, borderWidth: 1, borderColor: colors.BORDER }}>
                    <TextView variant="sectionTitle" theme={theme}>GOAL STRATEGY</TextView>
                    
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <Picker
                        containerStyle={{ flex: 1 }}
                        label="Archetype"
                        selectedValue={selectedCategoryDetail.target?.type || 'SET_ASIDE'}
                        onSelect={(val) => {
                          const currentTarget = selectedCategoryDetail.target || {
                            id: uuidv4(),
                            type: val,
                            amount: 0,
                            cadence: 'MONTHLY',
                            isPaused: false
                          };
                          dispatch(setCategoryTarget({
                            categoryId: selectedCategoryDetail.id,
                            target: { ...currentTarget, type: val as any }
                          }));
                        }}
                        options={Object.values(TargetType).map(t => ({ label: t.replace(/_/g, ' '), value: t }))}
                        theme={theme}
                      />
                      <Picker
                        containerStyle={{ flex: 1 }}
                        label="Rhythm"
                        selectedValue={selectedCategoryDetail.target?.cadence || 'MONTHLY'}
                        onSelect={(val) => {
                          const currentTarget = selectedCategoryDetail.target || {
                            id: uuidv4(),
                            type: 'SET_ASIDE',
                            amount: 0,
                            cadence: val,
                            isPaused: false
                          };
                          dispatch(setCategoryTarget({
                            categoryId: selectedCategoryDetail.id,
                            target: { ...currentTarget, cadence: val as any }
                          }));
                        }}
                        options={Object.values(TargetCadence).map(t => ({ label: t, value: t }))}
                        theme={theme}
                      />
                    </View>

                    <View>
                      <TextView variant="label" theme={theme}>Threshold</TextView>
                      <TextInput
                        style={{ fontSize: 20, fontWeight: '600', color: colors.PRIMARY_TEXT, borderBottomWidth: 1, borderBottomColor: colors.BORDER, paddingVertical: 8 }}
                        keyboardType="decimal-pad"
                        defaultValue={(selectedCategoryDetail.target?.amount || 0).toString()}
                        onBlur={(e) => {
                          const currentTarget = selectedCategoryDetail.target || {
                            id: uuidv4(),
                            type: 'SET_ASIDE',
                            amount: 0,
                            cadence: 'MONTHLY',
                            isPaused: false
                          };
                          dispatch(setCategoryTarget({
                            categoryId: selectedCategoryDetail.id,
                            target: { ...currentTarget, amount: parseFloat(e.nativeEvent.text) || 0 }
                          }));
                        }}
                      />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <TextView variant="body" theme={theme}>Snooze Logic</TextView>
                      <Switch
                        value={selectedCategoryDetail.target?.isPaused || false}
                        onValueChange={(val) => {
                          if (selectedCategoryDetail.target) {
                            dispatch(setCategoryTarget({
                              categoryId: selectedCategoryDetail.id,
                              target: { ...selectedCategoryDetail.target, isPaused: val }
                            }));
                          }
                        }}
                        trackColor={{ false: colors.BORDER, true: colors.PRIMARY }}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 24 }}>
                    <View style={{ flex: 1 }}>
                      <TextView variant="label" theme={theme}>ALLOCATED</TextView>
                      <TextInput
                        style={{ 
                          fontSize: 20, 
                          fontWeight: '600', 
                          color: colors.PRIMARY_TEXT,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.BORDER,
                          paddingVertical: 4
                        }}
                        keyboardType="decimal-pad"
                        defaultValue={selectedCategoryDetail.assigned.toString()}
                        onBlur={(e) => {
                          dispatch(assignMoney({
                            month: currentMonthStr,
                            categoryId: selectedCategoryDetail.id,
                            amount: parseFloat(e.nativeEvent.text) || 0
                          }));
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <TextView variant="label" theme={theme}>SPENT</TextView>
                      <TextView variant="money" theme={theme} style={{ marginTop: 8 }}>
                        {formatCurrency(Math.abs(selectedCategoryDetail.activity), { language })}
                      </TextView>
                    </View>
                  </View>

                  <View>
                    <TextView variant="label" theme={theme}>ROLLOVER FROM PREVIOUS MONTHS</TextView>
                    <TextView variant="money" theme={theme} style={{ marginTop: 4 }}>
                      {formatCurrency(selectedCategoryDetail.rollover, { language })}
                    </TextView>
                  </View>

                  {/* Reflections Section */}
                  <View style={{ gap: 12 }}>
                    <TextView variant="sectionTitle" theme={theme}>REFLECTIONS</TextView>
                    <TextInput
                      style={{ 
                        padding: 16, 
                        backgroundColor: colors.AREA_HIGHLIGHT, 
                        borderRadius: 16, 
                        borderWidth: 1, 
                        borderColor: colors.BORDER,
                        color: colors.PRIMARY_TEXT,
                        minHeight: 100,
                        textAlignVertical: 'top'
                      }}
                      placeholder="Capture the essence of this category..."
                      placeholderTextColor={colors.PLACE_HOLDER}
                      multiline
                      defaultValue={selectedCategoryDetail.note || ''}
                      onBlur={(e) => {
                        dispatch(updateCategory({
                          id: selectedCategoryDetail.id,
                          note: e.nativeEvent.text
                        }));
                      }}
                    />
                  </View>

                  {/* Move Funds Section */}
                  <View style={{ marginTop: 16, gap: 12, padding: 16, backgroundColor: colors.AREA_HIGHLIGHT, borderRadius: 12 }}>
                    <TextView variant="label" theme={theme}>MOVE FUNDS</TextView>
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                      <TextInput
                        style={{ 
                          flex: 1,
                          padding: 8,
                          borderWidth: 1,
                          borderColor: colors.BORDER,
                          borderRadius: 8,
                          color: colors.PRIMARY_TEXT
                        }}
                        placeholder="Amount"
                        placeholderTextColor={colors.PLACE_HOLDER}
                        keyboardType="decimal-pad"
                        value={moveFundsAmount}
                        onChangeText={setMoveFundsAmount}
                      />
                      <TextView theme={theme}>to</TextView>
                      <View style={{ flex: 2, borderWidth: 1, borderColor: colors.BORDER, borderRadius: 8 }}>
                        <ScrollView style={{ maxHeight: 100 }}>
                          {categories.filter(c => c.id !== selectedCategoryId && !c.isSystem).map(c => (
                            <TouchableOpacity 
                              key={c.id} 
                              onPress={() => setTargetCategoryId(c.id)}
                              style={{ 
                                padding: 8, 
                                backgroundColor: targetCategoryId === c.id ? colors.PRIMARY + '20' : 'transparent' 
                              }}>
                              <TextView theme={theme} style={{ fontSize: 12 }}>{c.name}</TextView>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={handleMoveFunds}
                      disabled={!moveFundsAmount || !targetCategoryId}
                      style={[
                        localStyles.modalButton, 
                        { 
                          borderColor: colors.PRIMARY, 
                          opacity: (!moveFundsAmount || !targetCategoryId) ? 0.5 : 1,
                          paddingVertical: 12,
                          marginTop: 8
                        }
                      ]}>
                      <TextView variant="label" style={{ color: colors.PRIMARY }} theme={theme}>Move Funds</TextView>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
  },
  headerSubtitle: {
    marginBottom: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  groupTitle: {
    marginBottom: 4,
  },
  groupSubtitle: {
  },
  categoryRow: {
    width: '100%',
  },
  categoryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  categoryName: {
  },
  categoryAvailable: {
  },
  progressBarBg: {
    height: 1,
    width: '100%',
  },
  progressBarFill: {
    height: 1,
  },
  categoryBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.2)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    paddingBottom: 64,
  },
  modalIndicator: {
    width: 48,
    height: 4,
    backgroundColor: '#e7e5e4',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -1,
    color: '#1c1917',
  },
  modalLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#a8a29e',
    fontWeight: '300',
    marginBottom: 8,
  },
  modalMainValue: {
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -2,
    color: '#1c1917',
  },
  modalSubValue: {
    fontSize: 20,
    fontWeight: '300',
    color: '#1c1917',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#1c1917',
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: '#1c1917',
    textTransform: 'uppercase',
  }
});

export default BudgetScreen;