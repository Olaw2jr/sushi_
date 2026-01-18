import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch, useWindowDimensions, StatusBar } from 'react-native';
import { ChevronRight, Eye, EyeOff, Sparkles, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'types/Route';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';
import TextWithTranslation from 'components/base/Text';
import TextView from 'components/base/Text/view';
import TextInput from 'components/base/TextInput';
import Button from 'components/base/Button';
import Card from 'components/base/Card';

type OnboardingNavigationProp = NativeStackNavigationProp<MainStackParamList, 'ONBOARDING'>;

export default function OnboardingScreen() {
    const navigation = useNavigation<OnboardingNavigationProp>();
    const theme = useSelector((state: RootState) => state.theme);
    const colors = COLORS[theme.base];
    const { width } = useWindowDimensions();

    const [step, setStep] = useState('welcome');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        accountBalance: '',
        categories: [] as string[],
        moneyFeeling: '',
        primaryGoal: '',
    });

    const philosophyPrinciples = [
        {
            title: 'Give every dollar a job',
            description: 'Before spending, decide what each dollar needs to accomplish. Intentionality brings clarity.'
        },
        {
            title: 'Embrace true expenses',
            description: 'Large expenses arrive in time. Break them into manageable pieces, preparing monthly for what must come.'
        },
        {
            title: 'Roll with the punches',
            description: 'Life flows like water. When reality differs from plan, adjust with grace rather than resistance.'
        },
        {
            title: 'Age your money',
            description: 'Distance from urgency brings peace. Spend money earned last month, not yesterday.'
        }
    ];

    const suggestedCategories = [
        'Groceries', 'Rent', 'Utilities', 'Transportation',
        'Dining', 'Entertainment', 'Savings', 'Emergency fund'
    ];

    const getProgress = () => {
        const steps = ['welcome', 'moneyRelationship', 'goals', 'philosophy', 'account', 'connect', 'firstBudget', 'reflection'];
        const index = steps.indexOf(step);
        return ((index + 1) / steps.length) * 100;
    };

    const renderHeader = (title: string, subtitle?: string) => (
        <View style={{ marginBottom: 32 }}>
            <TextView variant="title" theme={theme} style={{ fontSize: 32, marginBottom: 12 }}>{title}</TextView>
            {subtitle && <TextView variant="body" theme={theme} style={{ color: colors.SECONDARY_TEXT }}>{subtitle}</TextView>}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.BACKGROUND }}>
            <StatusBar
                backgroundColor={colors.BACKGROUND}
                barStyle={theme.base === 'Dark' ? 'light-content' : 'dark-content'}
            />
            {/* Progress indicator */}
            <View style={{ height: 4, backgroundColor: colors.BORDER, width: '100%' }}>
                <View
                    style={{
                        height: '100%',
                        backgroundColor: colors.PRIMARY,
                        width: `${getProgress()}%`,
                    }}
                />
            </View>

            <ScrollView 
                className="flex-1" 
                contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 48, paddingBottom: 100 }}
            >
                {/* STEP 1: Welcome */}
                {step === 'welcome' && (
                    <View style={{ gap: 32 }}>
                        <View style={{ height: 40 }} />
                        <View>
                            <TextView variant="title" theme={theme} style={{ fontSize: 48, lineHeight: 56, marginBottom: 24 }}>
                                Welcome to a new practice
                            </TextView>
                            <TextView variant="body" theme={theme} style={{ fontSize: 18, color: colors.SECONDARY_TEXT, lineHeight: 28 }}>
                                Sushi is a method—a way of relating to money with intention and peace.
                            </TextView>
                        </View>

                        <Button
                            onPress={() => setStep('moneyRelationship')}
                            label="Begin"
                            theme={theme}
                            containerStyle={{ width: 160, height: 56 }}
                        />
                    </View>
                )}

                {/* STEP 2: Money Relationship */}
                {step === 'moneyRelationship' && (
                    <View style={{ gap: 32 }}>
                        {renderHeader("How does money make you feel?", "Choose the feeling that resonates most deeply.")}

                        <View style={{ gap: 12 }}>
                            {[
                                { value: 'anxious', label: 'Anxious', subtitle: 'Worry follows me' },
                                { value: 'overwhelmed', label: 'Overwhelmed', subtitle: 'Too many demands' },
                                { value: 'uncertain', label: 'Uncertain', subtitle: 'I don\'t know where I stand' },
                                { value: 'hopeful', label: 'Hopeful', subtitle: 'Ready for change' },
                                { value: 'calm', label: 'Calm', subtitle: 'Seeking to maintain peace' }
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => {
                                        setFormData({ ...formData, moneyFeeling: option.value });
                                        setStep('goals');
                                    }}
                                >
                                    <Card style={{ 
                                        borderColor: formData.moneyFeeling === option.value ? colors.PRIMARY : colors.BORDER,
                                        backgroundColor: formData.moneyFeeling === option.value ? colors.PRIMARY + '05' : colors.AREA_HIGHLIGHT
                                    }}>
                                        <TextView variant="body" theme={theme} style={{ fontWeight: '600' }}>{option.label}</TextView>
                                        <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER, textTransform: 'none', marginTop: 4 }}>{option.subtitle}</TextView>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* STEP 3: Goals */}
                {step === 'goals' && (
                    <View style={{ gap: 32 }}>
                        {renderHeader("What brings you here?", "What do you hope to achieve?")}

                        <View style={{ gap: 12 }}>
                            {[
                                { value: 'debt', label: 'Pay off debt', subtitle: 'Freedom from burden' },
                                { value: 'save', label: 'Build savings', subtitle: 'Create a foundation' },
                                { value: 'control', label: 'Feel in control', subtitle: 'End the uncertainty' },
                                { value: 'peace', label: 'Find peace', subtitle: 'Release the stress' }
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => {
                                        setFormData({ ...formData, primaryGoal: option.value });
                                        setStep('philosophy');
                                    }}
                                >
                                    <Card style={{ 
                                        borderColor: formData.primaryGoal === option.value ? colors.PRIMARY : colors.BORDER,
                                        backgroundColor: formData.primaryGoal === option.value ? colors.PRIMARY + '05' : colors.AREA_HIGHLIGHT
                                    }}>
                                        <TextView variant="body" theme={theme} style={{ fontWeight: '600' }}>{option.label}</TextView>
                                        <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER, textTransform: 'none', marginTop: 4 }}>{option.subtitle}</TextView>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* STEP 4: Philosophy */}
                {step === 'philosophy' && (
                    <View style={{ gap: 48 }}>
                        {renderHeader("The Four Principles", "These guide everything. Take time to understand them.")}

                        <View style={{ gap: 32 }}>
                            {philosophyPrinciples.map((principle, i) => (
                                <View key={i} style={{ flexDirection: 'row', gap: 20 }}>
                                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.PRIMARY + '10', alignItems: 'center', justifyContent: 'center' }}>
                                        <TextView variant="label" theme={theme} style={{ color: colors.PRIMARY }}>{i + 1}</TextView>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TextView variant="body" theme={theme} style={{ fontWeight: '600', marginBottom: 4 }}>{principle.title}</TextView>
                                        <TextView variant="body" theme={theme} style={{ color: colors.SECONDARY_TEXT, fontSize: 14, lineHeight: 22 }}>{principle.description}</TextView>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <Button
                            onPress={() => setStep('account')}
                            label="I understand"
                            theme={theme}
                        />
                    </View>
                )}

                {/* STEP 5: Account Creation */}
                {step === 'account' && (
                    <View style={{ gap: 32 }}>
                        {renderHeader("A simple beginning", "Just the essentials to begin your practice.")}

                        <View style={{ gap: 24 }}>
                            <TextInput
                                label="YOUR NAME"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="How should we address you?"
                                theme={theme}
                            />
                            <TextInput
                                label="EMAIL"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                placeholder="your@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                theme={theme}
                            />
                            <View>
                                <TextInput
                                    label="PASSWORD"
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                                    placeholder="At least 8 characters"
                                    secureTextEntry={!showPassword}
                                    theme={theme}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 16, bottom: 12 }}
                                >
                                    {showPassword ? <EyeOff size={20} color={colors.PLACE_HOLDER} /> : <Eye size={20} color={colors.PLACE_HOLDER} />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Button
                            onPress={() => setStep('connect')}
                            label="Continue"
                            disabled={!formData.name || !formData.email || formData.password.length < 8}
                            theme={theme}
                        />
                    </View>
                )}

                {/* STEP 6: Connect Account */}
                {step === 'connect' && (
                    <View style={{ gap: 32 }}>
                        {renderHeader("Where do you stand?", "To begin, we must know the present moment.")}

                        <Card style={{ backgroundColor: colors.PRIMARY + '05', borderColor: colors.PRIMARY + '20' }}>
                            <TextView variant="body" theme={theme} style={{ color: colors.SECONDARY_TEXT, fontSize: 14 }}>
                                Enter the total amount currently in your checking account. Be honest—there is no judgment here, only truth.
                            </TextView>
                        </Card>

                        <TextInput
                            label="CURRENT BALANCE"
                            value={formData.accountBalance}
                            onChangeText={(text) => setFormData({ ...formData, accountBalance: text })}
                            placeholder="0.00"
                            keyboardType="numeric"
                            theme={theme}
                        />

                        <Button
                            onPress={() => setStep('firstBudget')}
                            label="Continue"
                            disabled={!formData.accountBalance}
                            theme={theme}
                        />
                    </View>
                )}

                {/* STEP 7: First Budget */}
                {step === 'firstBudget' && (
                    <View style={{ gap: 32 }}>
                        {renderHeader("Name your priorities", "Select the categories that matter. You can add more later.")}

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                            {suggestedCategories.map((category) => {
                                const isSelected = formData.categories.includes(category);
                                return (
                                    <TouchableOpacity
                                        key={category}
                                        onPress={() => {
                                            setFormData({
                                                ...formData,
                                                categories: isSelected
                                                    ? formData.categories.filter(c => c !== category)
                                                    : [...formData.categories, category]
                                            });
                                        }}
                                        style={{
                                            paddingHorizontal: 20,
                                            paddingVertical: 12,
                                            borderRadius: 24,
                                            borderWidth: 1,
                                            borderColor: isSelected ? colors.PRIMARY : colors.BORDER,
                                            backgroundColor: isSelected ? colors.PRIMARY : colors.BACKGROUND
                                        }}
                                    >
                                        <TextView variant="label" theme={theme} style={{ color: isSelected ? colors.BACKGROUND : colors.PRIMARY_TEXT, textTransform: 'none' }}>
                                            {category}
                                        </TextView>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Button
                            onPress={() => setStep('reflection')}
                            label="Continue"
                            disabled={formData.categories.length === 0}
                            theme={theme}
                        />
                    </View>
                )}

                {/* STEP 8: Final Reflection */}
                {step === 'reflection' && (
                    <View style={{ gap: 48 }}>
                        <View style={{ gap: 24 }}>
                            <TextView variant="title" theme={theme} style={{ fontSize: 48 }}>You have begun</TextView>
                            <TextView variant="body" theme={theme} style={{ color: colors.SECONDARY_TEXT, fontSize: 18, lineHeight: 28 }}>
                                The journey to financial peace is not measured in days or weeks, but in consistent practice.
                            </TextView>
                        </View>

                        <Card style={{ backgroundColor: colors.PRIMARY + '10', gap: 16, padding: 32 }}>
                            <Sparkles size={32} color={colors.PRIMARY} />
                            <TextView variant="body" theme={theme} style={{ fontStyle: 'italic', lineHeight: 24 }}>
                                "The journey of a thousand miles begins with a single step."
                            </TextView>
                            <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER }}>— LAO TZU</TextView>
                        </Card>

                        <Button
                            onPress={() => navigation.navigate('MAIN')}
                            label="Enter your budget"
                            theme={theme}
                        />
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}