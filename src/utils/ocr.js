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
  const { data } = await Tesseract.recognize(file, 'eng+tha', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })

  let raw = data.text

  // Clean up excessive horizontal spaces between Thai characters and periods
  let prevRaw = '';
  while (raw !== prevRaw) {
    prevRaw = raw;
    // Use [ \t]+ to avoid removing newlines!
    raw = raw.replace(/([ก-๛\.])(?:[ \t]+)(?=[ก-๛\.])/g, '$1');
  }

  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 1)

  // ── amount: find the biggest number that looks like a total ──────────────
  // matches: 1,234.56  /  1234.56  /  1,234  /  ฿250 / จำนวนเงิน 640.00
  const amtPattern = /(?:total|amount|sum|grand|due|pay|฿|thb|baht|จำนวนเงิน|จํานวนเงิน|ยอดเงิน|ยอดสุทธิ|โอนเงิน)[\s:]*([0-9,]+(?:\.[0-9]{1,2})?)|([0-9,]{2,}(?:\.[0-9]{1,2})?)/gi
  const amountsWithKeyword = []
  const amountsNaked = []
  let m
  while ((m = amtPattern.exec(raw)) !== null) {
    const isKeyword = !!m[1]
    const raw_num = (m[1] || m[2]).replace(/,/g, '')
    const n = parseFloat(raw_num)
    if (!isNaN(n) && n > 0 && n < 1_000_000) {
      // Ignore pure years like 2569 or 2026 if they don't have decimals
      if (!raw_num.includes('.') && ((n >= 2500 && n <= 2600) || (n >= 2000 && n <= 2100))) {
        continue;
      }
      if (isKeyword) amountsWithKeyword.push(n)
      else amountsNaked.push(n)
    }
  }
  const amounts = amountsWithKeyword.length > 0 ? amountsWithKeyword : amountsNaked
  // prefer the largest number (likely the total)
  const amt = amounts.length ? String(Math.max(...amounts)) : ''

  // ── date: dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy, dd MMM yyyy, Thai dates ───
  const THAI_MONTHS = {
    'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
    'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
    'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12',
  };

  const datePatterns = [
    // Thai date: 31 พ.ค. 2569
    { 
      regex: /(\d{1,2})\s+(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s+(\d{2,4})/,
      parse: (dm) => {
        let year = parseInt(dm[3]);
        if (year >= 2500) year -= 543;
        const month = THAI_MONTHS[dm[2]];
        const day = dm[1].padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    },
    {
      regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
      parse: (dm) => null // rely on native parse fallback
    },
    {
      regex: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
      parse: (dm) => null
    },
    {
      regex: /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{2,4})/i,
      parse: (dm) => null
    }
  ]

  let date = ''
  for (const { regex, parse } of datePatterns) {
    const dm = raw.match(regex)
    if (dm) {
      const parsed = parse(dm);
      if (parsed) {
        date = parsed;
        break;
      }
      // try to build a yyyy-mm-dd string via native Date parse
      try {
        const d = new Date(dm[0])
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
  const skipWords = /(receipt|tax invoice|vat|date|time|tel|ref|no\.|cashier|server|table|order|subtotal|total|change|cash|card|visa|master|amount|thank|please|www|http|ธนาคาร|กรุงไทย|กสิกร|ไทยพาณิชย์|โอนเงิน|สำเร็จ|สําเร็จ|รหัส|วันที่|เวลา|จำนวน|จํานวน|ค่าธรรมเนียม|รายการ|หมายเลข|ชำระ|จ่ายบิล)/i
  const digitHeavy = (s) => (s.replace(/[^0-9]/g, '').length / s.length) > 0.5
  const hasBadChars = (s) => (s.match(/[&®“©*\/]/g) || []).length >= 2
  let desc = ''
  for (let line of lines.slice(0, 20)) {
    line = line.trim()
    if (line.length < 4) continue
    if (skipWords.test(line)) continue
    if (digitHeavy(line)) continue
    if (hasBadChars(line)) continue
    if (/x{2,}/i.test(line)) continue // e.g. XXX-X-XX561-0
    if (line.startsWith('-')) continue
    // Skip random garbage lines
    if (/^[\W_]+$/.test(line)) continue;
    // Skip very short Thai-only lines which are often OCR noise
    if (line.length < 8 && !/[a-zA-Z]/.test(line)) continue;
    
    // We found a good candidate
    // If it starts with a stray number/char like "4 SRT", clean it
    desc = line.replace(/^[0-9]\s+/, '')
    break
  }
  if (!desc) desc = 'Receipt'

  return { amt, date, desc, raw }
}
