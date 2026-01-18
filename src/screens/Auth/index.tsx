import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Lock, Mail, Shield, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'types/Route';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { COLORS } from 'theme';
import TextView from 'components/base/Text/view';
import TextInput from 'components/base/TextInput';
import Button from 'components/base/Button';
import Card from 'components/base/Card';

type AuthNavigationProp = NativeStackNavigationProp<MainStackParamList, 'AUTH'>;

export default function AuthScreen() {
    const navigation = useNavigation<AuthNavigationProp>();
    const theme = useSelector((state: RootState) => state.theme);
    const colors = COLORS[theme.base];
    
    const [flow, setFlow] = useState('signin'); // signin, forgotPassword, resetSent, mfaVerify
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        mfaCode: ''
    });

    const renderHeader = (title: string, subtitle?: string, showBack = false) => (
        <View style={{ alignItems: 'center', marginBottom: 48, gap: 12 }}>
            {showBack && (
                <TouchableOpacity 
                    onPress={() => setFlow('signin')}
                    style={{ position: 'absolute', left: 0, top: 0 }}
                >
                    <ChevronLeft size={24} color={colors.PRIMARY_TEXT} />
                </TouchableOpacity>
            )}
            <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER, letterSpacing: 4 }}>Sushi</TextView>
            <TextView variant="title" theme={theme} style={{ fontSize: 32, textAlign: 'center' }}>{title}</TextView>
            {subtitle && <TextView variant="body" theme={theme} style={{ color: colors.SECONDARY_TEXT, textAlign: 'center' }}>{subtitle}</TextView>}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.BACKGROUND }}>
            <StatusBar
                backgroundColor={colors.BACKGROUND}
                barStyle={theme.base === 'Dark' ? 'light-content' : 'dark-content'}
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
                <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center' }}>

                    {/* SIGN IN */}
                    {flow === 'signin' && (
                        <View style={{ gap: 40 }}>
                            {renderHeader("Welcome back", "Enter to resume your practice")}

                            <View style={{ gap: 24 }}>
                                <TextInput
                                    label="EMAIL"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    placeholder="your@email.com"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    theme={theme}
                                />

                                <View>
                                    <TextInput
                                        label="PASSWORD"
                                        secureTextEntry={!showPassword}
                                        value={formData.password}
                                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                                        placeholder="Enter your password"
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

                            <View style={{ gap: 16 }}>
                                <Button
                                    onPress={() => setFlow('mfaVerify')}
                                    disabled={!formData.email || !formData.password}
                                    label="Sign in"
                                    theme={theme}
                                />

                                <TouchableOpacity
                                    onPress={() => setFlow('forgotPassword')}
                                    style={{ alignSelf: 'center' }}
                                >
                                    <TextView variant="label" theme={theme} style={{ color: colors.PLACE_HOLDER, textTransform: 'none' }}>Forgot password?</TextView>
                                </TouchableOpacity>
                            </View>

                            <View style={{ alignItems: 'center', pt: 32, borderTopWidth: 1, borderTopColor: colors.DIVIDER }}>
                                <TextView variant="body" theme={theme} style={{ fontSize: 14, color: colors.SECONDARY_TEXT }}>
                                    New to Sushi?{' '}
                                    <TouchableOpacity onPress={() => navigation.navigate('ONBOARDING')}>
                                        <TextView variant="body" theme={theme} style={{ color: colors.PRIMARY, fontWeight: '600' }}>
                                            Begin your practice
                                        </TextView>
                                    </TouchableOpacity>
                                </TextView>
                            </View>
                        </View>
                    )}

                    {/* FORGOT PASSWORD */}
                    {flow === 'forgotPassword' && (
                        <View style={{ gap: 40 }}>
                            {renderHeader("Reset password", "We'll send you a link to your email", true)}

                            <TextInput
                                label="EMAIL"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                placeholder="your@email.com"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                theme={theme}
                            />

                            <Button
                                onPress={() => setFlow('resetSent')}
                                disabled={!formData.email}
                                label="Send reset link"
                                theme={theme}
                            />
                        </View>
                    )}

                    {/* RESET SENT */}
                    {flow === 'resetSent' && (
                        <View style={{ gap: 40 }}>
                            <View style={{ alignItems: 'center', gap: 24 }}>
                                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.PRIMARY + '10', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={32} color={colors.PRIMARY} />
                                </View>
                                {renderHeader("Check your email", `We've sent a link to ${formData.email}`)}
                            </View>

                            <Card style={{ backgroundColor: colors.AREA_HIGHLIGHT }}>
                                <TextView variant="body" theme={theme} style={{ textAlign: 'center', color: colors.SECONDARY_TEXT, fontSize: 14 }}>
                                    The link will expire in 1 hour. Check your spam folder if you don't see it.
                                </TextView>
                            </Card>

                            <Button
                                onPress={() => setFlow('signin')}
                                label="Back to Sign In"
                                outline
                                theme={theme}
                            />
                        </View>
                    )}

                    {/* MFA VERIFY */}
                    {flow === 'mfaVerify' && (
                        <View style={{ gap: 40 }}>
                            <View style={{ alignItems: 'center', gap: 24 }}>
                                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.PRIMARY + '10', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={32} color={colors.PRIMARY} />
                                </View>
                                {renderHeader("Security Code", "Enter the 6-digit code from your app")}
                            </View>

                            <TextInput
                                label="AUTHENTICATION CODE"
                                value={formData.mfaCode}
                                onChangeText={(text) => setFormData({ ...formData, mfaCode: text.replace(/\D/g, '').slice(0, 6) })}
                                placeholder="000000"
                                maxLength={6}
                                keyboardType="number-pad"
                                style={{ textAlign: 'center', fontSize: 32, letterSpacing: 8 }}
                                theme={theme}
                            />

                            <Button
                                onPress={() => navigation.navigate('MAIN')}
                                disabled={formData.mfaCode.length !== 6}
                                label="Verify"
                                theme={theme}
                            />
                        </View>
                    )}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
