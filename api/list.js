// ==========================================================================
//  إرجاع كل تأكيدات الحضور للوحة الأدمن — محمي بباسورد
//  Vercel Serverless Function — المسار /api/list
//  الباسورد بيتبعت في هيدر x-admin-password ويتقارن بـ ADMIN_PASSWORD
// ==========================================================================
module.exports = async (req, res) => {
  const pass = req.headers['x-admin-password'] || '';

  if (!process.env.ADMIN_PASSWORD || pass !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'باسورد غير صحيح' });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    res.status(500).json({ error: 'السيرفر مش متظبط (متغيرات البيئة ناقصة)' });
    return;
  }

  try {
    const r = await fetch(
      `${url}/rest/v1/rsvps?select=*&order=created_at.desc`,
      { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } }
    );

    if (!r.ok) {
      const detail = await r.text();
      res.status(502).json({ error: 'خطأ في قاعدة البيانات', detail });
      return;
    }

    const rows = await r.json();
    res.status(200).json({ ok: true, rows });
  } catch (e) {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
};
