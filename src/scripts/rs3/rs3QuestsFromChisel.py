import json

import requests

chisel_url = "https://chisel.weirdgloop.org/gazproj/cache/quests.json"

res = requests.get(chisel_url).json()
varps = {}
varbs = {}

for quest in res:
    if "varps" in quest:
        varps[quest["name"]] = [
            quest["varps"][0]["varp"],
            quest["varps"][0]["startvalue"],
            quest["varps"][0]["endvalue"]
        ]

    if "varbits" in quest:
        varbs[quest["name"]] = [
            quest["varbits"][0]["varbit"],
            quest["varbits"][0]["startvalue"],
            quest["varbits"][0]["endvalue"]
        ]

with open("../runescape/data/questVarps.json", "w") as f:
    json.dump(varps, f, indent=4, sort_keys=True)

with open("../runescape/data/questVarbits.json", "w") as f:
    json.dump(varbs, f, indent=4, sort_keys=True)
