import React, { useCallback, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect, useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { api, useAuth } from '../../src/auth';

import { BAYER_LOGO_URL, ThemeColors, useTheme } from '../../src/theme';

import { formatDateLabel, todayISO } from '../../src/types';

type Dashboard = {
  date: string;
  total: number;

  by_status: Record<string, number>;

  by_situation: Record<string, number>;

  by_unit: Record<string, number>;

  timeline: {
    date: string;
    count: number;
  }[];

  greeting: string;
};

type QuickActionProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  colors: ThemeColors;
  testID?: string;
};

type BigStatProps = {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  colors: ThemeColors;
};

type SituationRowProps = {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: ThemeColors;
};

type DividerProps = {
  colors: ThemeColors;
};

export default function DashboardScreen() {
  const { colors } = useTheme();

  const { user } = useAuth();

  const router = useRouter();

  const [data, setData] = useState<Dashboard | null>(null);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get('/dashboard', {
        params: {
          date: todayISO(),
        },
      });

      setData(response.data);
    } catch (error) {
      console.log('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const maxCount = useMemo(() => {
    if (!data?.timeline?.length) {
      return 1;
    }

    return Math.max(1, ...data.timeline.map(item => item.count));
  }, [data]);

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor: colors.background,
        },
      ]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={styles.logoBg}>
              <Image
                source={{
                  uri: BAYER_LOGO_URL,
                }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.greeting,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {data?.greeting || 'Olá'}, {user?.name?.split(' ')[0]?.trim() || 'Usuário'}
              </Text>

              <Text
                style={[
                  styles.brand,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Formulação · Bayer
              </Text>

              <Text
                style={[
                  styles.dateLabel,
                  {
                    color: colors.textTertiary,
                  },
                ]}
              >
                {formatDateLabel(todayISO())}
              </Text>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsRow}>
          <QuickAction
            label="Planilha"
            icon="grid-outline"
            color={colors.primary}
            colors={colors}
            testID="qa-planilha"
            onPress={() => router.push('/(tabs)/planilha')}
          />

          <QuickAction
            label="Relatório"
            icon="logo-whatsapp"
            color={colors.whatsapp}
            colors={colors}
            testID="qa-report"
            onPress={() => router.push('/(tabs)/report')}
          />

          <QuickAction
            label="Guia"
            icon="library-outline"
            color={colors.secondary}
            colors={colors}
            testID="qa-guia"
            onPress={() => router.push('/(tabs)/guia')}
          />
        </View>

        {/* LOADING */}
        {loading && !data ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* STATS */}
            <Text
              style={[
                styles.section,
                {
                  color: colors.textTertiary,
                },
              ]}
            >
              RESUMO DO TURNO
            </Text>

            {/* SITUAÇÃO */}
            <Text
              style={[
                styles.section,
                {
                  color: colors.textTertiary,
                },
              ]}
            >
              SITUAÇÃO DA PRODUÇÃO
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <SituationRow
                label="Preparado"
                value={data?.by_situation?.['Preparado'] ?? 0}
                color={colors.success}
                bg={colors.successBg}
                icon="checkmark-done-circle"
                colors={colors}
              />

              <Divider colors={colors} />

              <SituationRow
                label="A preparar"
                value={data?.by_situation?.['A preparar'] ?? 0}
                color={colors.warning}
                bg={colors.warningBg}
                icon="time-outline"
                colors={colors}
              />

              <Divider colors={colors} />

              <SituationRow
                label="Em fábrica"
                value={data?.by_situation?.['Em fábrica'] ?? 0}
                color={colors.info}
                bg={colors.infoBg}
                icon="sync-circle"
                colors={colors}
              />
            </View>

            {/* POR UNIDADE */}
            {data && Object.keys(data.by_unit).length > 0 && (
              <>
                <Text
                  style={[
                    styles.section,
                    {
                      color: colors.textTertiary,
                    },
                  ]}
                >
                  POR UNIDADE
                </Text>

                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      padding: 0,
                    },
                  ]}
                >
                  {Object.entries(data.by_unit).map(([unit, count], index, arr) => (
                    <View
                      key={unit}
                      style={[
                        styles.unitRow,
                        index < arr.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <View style={styles.unitLeft}>
                        <Ionicons name="business-outline" size={18} color={colors.primary} />

                        <Text
                          style={[
                            styles.unitText,
                            {
                              color: colors.textPrimary,
                            },
                          ]}
                        >
                          {unit}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.unitCount,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* TIMELINE */}
            <Text
              style={[
                styles.section,
                {
                  color: colors.textTertiary,
                },
              ]}
            >
              ÚLTIMOS 7 DIAS
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.bars}>
                {data?.timeline?.map(item => {
                  const height = (item.count / maxCount) * 80;

                  const day = item.date.slice(8, 10);

                  return (
                    <View key={item.date} style={styles.barCol}>
                      <Text
                        style={[
                          styles.barValue,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        {item.count}
                      </Text>

                      <View
                        style={[
                          styles.bar,
                          {
                            height: Math.max(6, height),
                            backgroundColor:
                              item.date === data.date ? colors.primary : colors.surfaceElevated,
                          },
                        ]}
                      />

                      <Text
                        style={[
                          styles.barDay,
                          {
                            color: colors.textTertiary,
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ label, icon, color, onPress, colors, testID }: QuickActionProps) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.qa,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.qaIcon,
          {
            backgroundColor: color + '22',
          },
        ]}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <Text
        style={[
          styles.qaText,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function BigStat({ label, value, icon, color, colors }: BigStatProps) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor: color + '22',
          },
        ]}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>

      <Text style={[styles.statValue, { color }]}>{value}</Text>

      <Text
        style={[
          styles.statLabel,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function SituationRow({ label, value, color, bg, icon, colors }: SituationRowProps) {
  return (
    <View style={styles.sitRow}>
      <View style={styles.sitLeft}>
        <View
          style={[
            styles.sitIcon,
            {
              backgroundColor: bg,
            },
          ]}
        >
          <Ionicons name={icon} size={12} color={color} />
        </View>

        <Text
          style={[
            styles.sitText,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <Text style={[styles.sitValue, { color }]}>{value}</Text>
    </View>
  );
}

function Divider({ colors }: DividerProps) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.border,
      }}
    />
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 100,
  },

  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  headerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logoBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },

  logo: {
    width: '100%',
    height: '100%',
  },

  greeting: {
    fontSize: 13,
    fontWeight: '500',
  },

  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },

  dateLabel: {
    fontSize: 11,
    marginTop: 2,
    textTransform: 'capitalize',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  qa: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  qaIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  qaText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
  },

  section: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 22,
    marginBottom: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  statCard: {
    width: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },

  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  sitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  sitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sitIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sitText: {
    fontSize: 14,
    fontWeight: '600',
  },

  sitValue: {
    fontSize: 18,
    fontWeight: '800',
  },

  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  unitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  unitText: {
    fontSize: 15,
    fontWeight: '600',
  },

  unitCount: {
    fontSize: 18,
    fontWeight: '800',
  },

  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingTop: 16,
  },

  barCol: {
    alignItems: 'center',
    flex: 1,
  },

  bar: {
    width: 18,
    borderRadius: 4,
    marginTop: 4,
  },

  barValue: {
    fontSize: 11,
    fontWeight: '600',
  },

  barDay: {
    fontSize: 10,
    marginTop: 4,
  },
});
