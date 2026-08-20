import os, json, glob, urllib.request, re

url = os.environ["SUPABASE_URL"] + "/functions/v1/db-migrate-runner"
KEY = "d41f8a2c9b6e47f0a1c35e8b7d92f604"


def split_sql(s):
    out = []
    buf = []
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c == "'":
            j = i + 1
            while j < n:
                if s[j] == "'":
                    if j + 1 < n and s[j + 1] == "'":
                        j += 2
                        continue
                    break
                j += 1
            buf.append(s[i:j + 1])
            i = j + 1
            continue
        if c == "$":
            m = re.match(r"\$[A-Za-z_0-9]*\$", s[i:])
            if m:
                tag = m.group(0)
                end = s.find(tag, i + len(tag))
                if end == -1:
                    end = n
                buf.append(s[i:end + len(tag)])
                i = end + len(tag)
                continue
        if s[i:i + 2] == "--":
            j = s.find("\n", i)
            j = n if j == -1 else j
            buf.append(s[i:j])
            i = j
            continue
        if s[i:i + 2] == "/*":
            j = s.find("*/", i)
            j = n if j == -1 else j + 2
            buf.append(s[i:j])
            i = j
            continue
        if c == ";":
            out.append("".join(buf))
            buf = []
            i += 1
            continue
        buf.append(c)
        i += 1
    if "".join(buf).strip():
        out.append("".join(buf))
    return [x.strip() for x in out if x.strip() and not x.strip().startswith("--")]


def run(sql, name):
    req = urllib.request.Request(
        url,
        data=json.dumps({"sql": sql, "name": name}).encode(),
        headers={"Content-Type": "application/json", "x-access-key": KEY},
    )
    try:
        return json.load(urllib.request.urlopen(req, timeout=180))
    except Exception as e:
        return {"ok": False, "error": "http:" + str(e)}


IGNORE = (
    "already exists", "does not exist", "dependent privileges exist", "duplicate key value",
    "already member of publication", "cannot drop", "multiple primary keys", "already a member",
)

errors = []
for f in sorted(glob.glob("supabase/migrations/*.sql")):
    for st in split_sql(open(f).read()):
        r = run(st, os.path.basename(f))
        if not r.get("ok"):
            e = str(r.get("error"))
            if not any(k in e for k in IGNORE):
                errors.append((os.path.basename(f), e[:160], st[:100].replace("\n", " ")))
print("hard errors:", len(errors))
for e in errors:
    print("ERR", *e, sep=" | ", flush=True)
