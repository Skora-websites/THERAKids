# Dump verification: compares row counts and content checksums between the live
# thera_kids database and the restored copy in thera_kids_verify.
# Usage: python server/scripts/verify-dump.py
import subprocess

MYSQL = r'C:/CodesEasy/DevKit/services/mysql/bin/mysql.exe'
TABLES = ['admins', 'appointments', 'blogs', 'conditions_data', 'contact_messages',
          'faqs', 'founders', 'gallery', 'page_content', 'page_seo',
          'process_steps', 'services', 'site_settings', 'testimonials']

# A stable content fingerprint per table: XOR of per-row CRC32s over the whole
# row (CONCAT of all columns). Order-independent, sensitive to any cell change.
CHECKSUM_SQL = ("SELECT IFNULL(BIT_XOR(CRC32(CONCAT_WS('#', t.*))), 0) "
                "FROM (SELECT * FROM {t}) AS t;")


def q(db, sql):
    r = subprocess.run([MYSQL, '-u', 'root', '-N', '-e', sql],
                       database=db, capture_output=True, text=True)
    if r.returncode != 0:
        return ['ERR: ' + r.stderr.strip().splitlines()[-1] if r.stderr else 'ERR']
    return [l for l in r.stdout.strip().split('\n') if l != '']


ok = True
print(f"{'table':<18} {'rows':>5} {'restored':>9}  content")
for t in TABLES:
    s_count = q('thera_kids', f'SELECT COUNT(*) FROM `{t}`;')[0]
    r_count = q('thera_kids_verify', f'SELECT COUNT(*) FROM `{t}`;')[0]
    s_hash = q('thera_kids', CHECKSUM_SQL.format(t=t))
    r_hash = q('thera_kids_verify', CHECKSUM_SQL.format(t=t))
    count_match = s_count == r_count
    hash_match = s_hash and r_hash and s_hash[0] == r_hash[0]
    match = count_match and hash_match
    ok = ok and match
    verdict = 'MATCH' if match else f'DIFF (src={s_hash} restored={r_hash})'
    print(f'{t:<18} {s_count:>5} {r_count:>9}  {verdict}')

print()
print('ALL TABLES VERIFIED - dump is faithful' if ok else 'DIFFERENCES FOUND')
raise SystemExit(0 if ok else 1)
