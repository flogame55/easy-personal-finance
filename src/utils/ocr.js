import Tesseract from 'tesseract.js'

/**
 * Runs Tesseract OCR on an image file and extracts:
 *  - amt: the largest currency-like number found
 *  - date: first date-like string found
 *  - desc: best-guess merchant name (first meaningful line)
 *
 * @param {File} file - image file from input or drop
 * @param {(progress: number) => void} onProgress - 0–100
 * @returns {Promise<{ amt: string, date: string, desc: string, raw: string }>}
 */
export async function parseReceipt(file, onProgress) {
  const { data } = await Tesseract.recognize(file, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })

  const raw = data.text
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 1)

  // ── amount: find the biggest number that looks like a total ──────────────
  // matches: 1,234.56  /  1234.56  /  1,234  /  ฿250
  const amtPattern = /(?:total|amount|sum|grand|due|pay|฿|thb|baht)[\s:]*([0-9,]+(?:\.[0-9]{1,2})?)|([0-9,]{2,}(?:\.[0-9]{1,2})?)/gi
  const amounts = []
  let m
  while ((m = amtPattern.exec(raw)) !== null) {
    const raw_num = (m[1] || m[2]).replace(/,/g, '')
    const n = parseFloat(raw_num)
    if (!isNaN(n) && n > 0 && n < 1_000_000) amounts.push(n)
  }
  // prefer the largest number (likely the total)
  const amt = amounts.length ? String(Math.max(...amounts)) : ''

  // ── date: dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy, dd MMM yyyy ───────────────
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{2,4})/i,
  ]
  let date = ''
  for (const pat of datePatterns) {
    const dm = raw.match(pat)
    if (dm) {
      // try to build a yyyy-mm-dd string
      try {
        const raw_d = dm[0]
        // try native Date parse
        const d = new Date(raw_d)
        if (!isNaN(d.getTime())) {
          date = d.toISOString().split('T')[0]
          break
        }
      } catch {
        // ignore
      }
      date = dm[0]
      break
    }
  }
  if (!date) date = new Date().toISOString().split('T')[0]

  // ── merchant: first non-trivial uppercase-ish line, before price lines ───
  const skipWords = /^(receipt|tax invoice|vat|date|time|tel|ref|no\.|cashier|server|table|order|subtotal|total|change|cash|card|visa|master|amount|thank|please|www|http)/i
  const digitHeavy = (s) => (s.replace(/[^0-9]/g, '').length / s.length) > 0.5
  let desc = ''
  for (const line of lines.slice(0, 12)) {
    if (line.length < 3) continue
    if (skipWords.test(line)) continue
    if (digitHeavy(line)) continue
    desc = line
    break
  }
  if (!desc) desc = 'Receipt'

  return { amt, date, desc, raw }
}
