import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '../../../src/auth';
import { useTheme } from '../../../src/theme';
import { formatDateLabel, todayISO } from '../../../src/types';

const buildLast14Days = (): string[] => {
  const out: string[] = [];
  const d = new Date();

  for (let i = 7; i >= -6; i--) {
    const dt = new Date(d);
    dt.setDate(d.getDate() - i);

    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');

    out.push(`${yyyy}-${mm}-${dd}`);
  }

  return out;
};

export default function ReportScreen() {
  const { colors } = useTheme();

  const [date, setDate] = useState<string>(todayISO());
  const [text, setText] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [extraObs, setExtraObs] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const dates = buildLast14Days();

  const generate = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.post('/reports/whatsapp', {
        date,
        extra_observations: extraObs,
      });

      const data = response.data;

      setText(data?.text ?? '');
      setGreeting(data?.greeting ?? '');
      setCount(data?.count ?? 0);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao gerar relatório');
    } finally {
      setLoading(false);
    }
  }, [date, extraObs]);

  useFocusEffect(
    useCallback(() => {
      generate();
    }, [generate])
  );

  const copy = async () => {
    if (!text) return;

    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado', 'Relatório copiado para a área de transferência.');
  };

  const shareWhats = async () => {
    if (!text) return;

    const encoded = encodeURIComponent(text);
    const url = `whatsapp://send?text=${encoded}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://wa.me/?text=${encoded}`);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* HEADER */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Relatório WhatsApp</Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {formatDateLabel(date)} · {count} {count === 1 ? 'item' : 'itens'} · {greeting}
            </Text>
          </View>

          <TouchableOpacity
            testID="refresh-report"
            onPress={generate}
            style={[
              styles.iconBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="refresh" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* DATE STRIP */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
        >
          {dates.map(d => {
            const active = d === date;
            const [y, m, dd] = d.split('-');

            const dt = new Date(Number(y), Number(m) - 1, Number(dd));

            return (
              <TouchableOpacity
                key={d}
                testID={`rdate-${d}`}
                onPress={() => setDate(d)}
                style={[
                  styles.dateChip,
                  {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? '#fff' : colors.textTertiary,
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  {dt.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3).toUpperCase()}
                </Text>

                <Text
                  style={{
                    color: active ? '#fff' : colors.textPrimary,
                    fontSize: 18,
                    fontWeight: '700',
                  }}
                >
                  {dd}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* EXTRA OBS */}
        <View
          style={[styles.obsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="create-outline" size={16} color={colors.textTertiary} />

          <TextInput
            testID="extra-obs"
            value={extraObs}
            onChangeText={setExtraObs}
            placeholder="Observações extras (opcional)"
            placeholderTextColor={colors.textTertiary}
            onBlur={generate}
            style={[styles.obsInput, { color: colors.textPrimary }]}
          />
        </View>

        {/* PREVIEW */}
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.preview,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={[styles.previewHeader, { borderBottomColor: colors.border }]}>
              <Ionicons name="logo-whatsapp" size={16} color={colors.whatsapp} />

              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                }}
              >
                PRÉVIA DA MENSAGEM
              </Text>
            </View>

            {loading ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : text ? (
              <Text
                testID="report-text"
                style={[styles.previewText, { color: colors.textPrimary }]}
              >
                {text}
              </Text>
            ) : (
              <Text
                style={{
                  color: colors.textTertiary,
                  padding: 16,
                  fontStyle: 'italic',
                }}
              >
                Nenhum item para esta data.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* ACTIONS */}
        <View
          style={[
            styles.actions,
            { backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity
            testID="copy-report"
            onPress={copy}
            disabled={!text}
            style={[
              styles.btn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: text ? 1 : 0.5,
              },
            ]}
          >
            <Ionicons name="copy-outline" size={18} color={colors.textPrimary} />
            <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Copiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="share-whatsapp"
            onPress={shareWhats}
            disabled={!text}
            style={[
              styles.btn,
              {
                backgroundColor: colors.whatsapp,
                flex: 1,
                opacity: text ? 1 : 0.5,
              },
            ]}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700' }}>Enviar no WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },

  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },

  subtitle: {
    fontSize: 13,
    marginTop: 2,
    textTransform: 'capitalize',
  },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  dateStrip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  dateChip: {
    width: 50,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    gap: 2,
  },

  obsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  obsInput: {
    flex: 1,
    fontSize: 14,
  },

  scrollBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  preview: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
  },

  previewText: {
    padding: 16,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
