import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api, useAuth } from '../../../src/auth';
import { useTheme } from '../../../src/theme';

type Product = {
  name: string;
  abbr: string;
};

export default function SettingsScreen() {
  const { colors, mode, toggle } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [newAbbr, setNewAbbr] = useState<string>('');

  const loadProducts = useCallback(async () => {
    try {
      const response = await api.get('/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar produtos');
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = async () => {
    if (!newName.trim()) {
      Alert.alert('Atenção', 'Informe o nome do produto');
      return;
    }

    try {
      await api.post('/products', {
        name: newName.trim(),
        abbr: newAbbr.trim() || undefined,
      });

      setNewName('');
      setNewAbbr('');

      await loadProducts();
    } catch {
      Alert.alert('Erro', 'Falha ao adicionar produto');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Confirma encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* HEADER */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Configurações</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* CONTA */}
          <Section title="Conta" colors={colors}>
            <View
              style={[
                styles.userBox,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                >
                  {user?.name || 'Usuário'}
                </Text>

                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{user?.email}</Text>
              </View>

              <View style={[styles.roleBadge, { backgroundColor: colors.successBg }]}>
                <Text
                  style={{
                    color: colors.success,
                    fontWeight: '700',
                    fontSize: 11,
                  }}
                >
                  {(user?.role || 'user').toUpperCase()}
                </Text>
              </View>
            </View>
          </Section>

          {/* TEMA */}
          <Section title="Aparência" colors={colors}>
            <TouchableOpacity
              testID="toggle-theme-row"
              onPress={toggle}
              style={[
                styles.row,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name={mode === 'dark' ? 'moon' : 'sunny'}
                size={20}
                color={colors.primary}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Modo {mode === 'dark' ? 'escuro' : 'claro'}
                </Text>

                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                  }}
                >
                  Toque para alternar
                </Text>
              </View>

              <Ionicons name="swap-horizontal" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </Section>

          {/* PRODUTOS */}
          <Section title="Catálogo de Produtos" colors={colors}>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View
                  style={[
                    styles.input,
                    {
                      flex: 2,
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <TextInput
                    testID="new-product-name"
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Novo produto"
                    placeholderTextColor={colors.textTertiary}
                    style={{
                      flex: 1,
                      color: colors.textPrimary,
                      fontSize: 14,
                    }}
                  />
                </View>

                <View
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <TextInput
                    testID="new-product-abbr"
                    value={newAbbr}
                    onChangeText={t => setNewAbbr(t.toUpperCase())}
                    placeholder="ABR"
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="characters"
                    style={{
                      flex: 1,
                      color: colors.textPrimary,
                      fontSize: 14,
                      textAlign: 'center',
                    }}
                  />
                </View>

                <TouchableOpacity
                  testID="add-product"
                  onPress={addProduct}
                  style={[styles.addBtn, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.productList,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {products.map((p, index) => (
                  <View
                    key={`${p.name}-${index}`}
                    style={[
                      styles.productRow,
                      index < products.length - 1 && {
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontSize: 14,
                        flex: 1,
                      }}
                    >
                      {p.name}
                    </Text>

                    <View style={[styles.abbrChip, { backgroundColor: colors.primary + '22' }]}>
                      <Text
                        style={{
                          color: colors.primary,
                          fontWeight: '700',
                          fontSize: 12,
                        }}
                      >
                        {p.abbr}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </Section>

          {/* LOGOUT */}
          <TouchableOpacity
            testID="logout"
            onPress={handleLogout}
            style={[
              styles.row,
              {
                backgroundColor: colors.dangerBg,
                borderColor: colors.danger + '55',
              },
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text
              style={{
                color: colors.danger,
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              Sair da conta
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: colors.textTertiary,
              fontSize: 11,
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            Bayer Produção · v1.0.0
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* COMPONENTE AUXILIAR */
function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          color: colors.textTertiary,
          fontWeight: '600',
          fontSize: 11,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
  },

  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  abbrChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
