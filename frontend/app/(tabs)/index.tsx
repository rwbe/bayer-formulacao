import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, useAuth } from '../../src/auth';
import { BAYER_LOGO_URL, useTheme } from '../../src/theme';
import { formatDateLabel, todayISO } from '../../src/types';

type Dashboard = {
  date: string;
  total: number;
  by_status: Record<string, number>;
  by_situation: Record<string, number>;
  by_unit: Record<string, number>;
  timeline: { date: string; count: number }[];
  greeting: string;
};

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/dashboard', {
        params: { date: todayISO() },
      });

      setData(r.data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const timeline = data?.timeline ?? [];

  const maxCount = timeline.length > 0 ? Math.max(...timeline.map(t => t.count)) : 1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* HEADER */}
        <View
          style={[
            styles.headerCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={[styles.logoBg, { backgroundColor: '#fff' }]}>
              <Image
                source={{ uri: BAYER_LOGO_URL }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                {data?.greeting || 'Olá'}, {user?.name?.split(' ')[0] || 'usuário'}
              </Text>

              <Text style={[styles.brand, { color: colors.textPrimary }]}>Formulação · Bayer</Text>

              <Text style={[styles.dateLabel, { color: colors.textTertiary }]}>
                {formatDateLabel(todayISO())}
              </Text>
            </View>
          </View>
        </View>

        {/* RESUMO */}
        <Text style={[styles.section, { color: colors.textTertiary }]}>RESUMO DO TURNO</Text>

        {loading && !data ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.totalRow}>
              <View>
                <Text style={[styles.totalLabel, { color: colors.textTertiary }]}>
                  MATERIAIS HOJE
                </Text>
                <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
                  {data?.total ?? 0}
                </Text>
              </View>

              <View style={[styles.totalBadge, { backgroundColor: colors.primary + '22' }]}>
                <Ionicons name="cube-outline" size={28} color={colors.primary} />
              </View>
            </View>
          </View>
        )}

        {/* SITUAÇÃO */}
        <Text style={[styles.section, { color: colors.textTertiary }]}>SITUAÇÃO DA PRODUÇÃO</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border, padding: 0 },
          ]}
        >
          <SitRow
            label="Recebido"
            value={data?.by_situation?.['Recebido'] ?? 0}
            color={colors.secondary}
            bg={colors.infoBg}
            icon="archive-outline"
            colors={colors}
            isLast={false}
          />
          <SitRow
            label="A preparar"
            value={data?.by_situation?.['A preparar'] ?? 0}
            color={colors.warning}
            bg={colors.warningBg}
            icon="time-outline"
            colors={colors}
            isLast={false}
          />
          <SitRow
            label="Preparado"
            value={data?.by_situation?.['Preparado'] ?? 0}
            color={colors.success}
            bg={colors.successBg}
            icon="checkmark-done-circle-outline"
            colors={colors}
            isLast={false}
          />
          <SitRow
            label="Em fábrica"
            value={data?.by_situation?.['Em fábrica'] ?? 0}
            color={colors.info}
            bg={colors.infoBg}
            icon="sync-outline"
            colors={colors}
            isLast={true}
          />
        </View>

        {/* POR UNIDADE */}
        {data && Object.keys(data.by_unit ?? {}).length > 0 && (
          <>
            <Text style={[styles.section, { color: colors.textTertiary }]}>POR UNIDADE</Text>

            <View
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border, padding: 0 },
              ]}
            >
              {Object.entries(data.by_unit ?? {}).map(([u, c], i, arr) => (
                <View
                  key={u}
                  style={[
                    styles.unitRow,
                    i < arr.length - 1 && {
                      borderBottomColor: colors.border,
                      borderBottomWidth: 1,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="business-outline" size={18} color={colors.primary} />
                    <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 15 }}>
                      {u}
                    </Text>
                  </View>

                  <Text style={{ color: colors.textPrimary, fontWeight: '800', fontSize: 18 }}>
                    {c}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* TIMELINE */}
        <Text style={[styles.section, { color: colors.textTertiary }]}>ÚLTIMOS 7 DIAS</Text>

        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.bars}>
            {timeline.map(t => {
              const h = (t.count / maxCount) * 80;
              const day = t.date?.slice(8, 10) ?? '--';

              return (
                <View key={t.date} style={styles.barCol}>
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{t.count}</Text>

                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(4, h),
                        backgroundColor:
                          t.date === data?.date ? colors.primary : colors.surfaceElevated,
                      },
                    ]}
                  />

                  <Text style={{ color: colors.textTertiary, fontSize: 10, marginTop: 4 }}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* COMPONENTES */
function SitRow({
  label,
  value,
  color,
  bg,
  icon,
  colors,
  showDivider = true,
  isLast = false,
}: any) {
  return (
    <>
      <View style={styles.sitRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={[styles.sitIcon, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={18} color={color} />
          </View>
          <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 14 }}>
            {label}
          </Text>
        </View>

        <Text style={{ color, fontSize: 20, fontWeight: '800' }}>{value}</Text>
      </View>
      {showDivider && !isLast && <Divider colors={colors} />}
    </>
  );
}

function Divider({ colors }: any) {
  return <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 16 }} />;
}

/* STYLES */
const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerCard: { borderRadius: 16, borderWidth: 1, padding: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBg: { width: 48, height: 48, borderRadius: 12, padding: 4 },
  greeting: { fontSize: 13, fontWeight: '500' },
  brand: { fontSize: 18, fontWeight: '800' },
  dateLabel: { fontSize: 11 },
  section: { fontSize: 11, fontWeight: '700', marginTop: 22, marginBottom: 8 },
  card: { padding: 14, borderRadius: 14, borderWidth: 1 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 11, fontWeight: '700' },
  totalValue: { fontSize: 36, fontWeight: '800' },
  totalBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  sitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 18, borderRadius: 4, marginTop: 4 },
});
