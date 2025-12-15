export function calculateWeight(n1, n2) {
  const da = n1.aktiflik - n2.aktiflik;
  const de = n1.etkileşim - n2.etkileşim;
  const db = n1.bagSayisi - n2.bagSayisi;

  return 1 / (1 + da * da + de * de + db * db);
}
