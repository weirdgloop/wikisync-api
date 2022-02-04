from collections import defaultdict
import csv
import json
import sys

diaries = defaultdict(lambda: defaultdict(lambda: { "tasks": [] }))

with open(sys.argv[1], "r") as csvfile:
  csvrows = csv.DictReader(csvfile)
  for row in csvrows:
    diary_name = row["Achievement Diary"]
    tier = row["Tier"]
    task = row["Task"]
    player_or_bits = row["Var type"]
    var_id = row["Var ID"]
    varplayer_offset = row["Bit"]
    varbits_value = row["Equal"]
    notes = row["Notes"]

    if var_id != '':
      spec = { "type": player_or_bits, "var_id": int(var_id) }
      if player_or_bits == "player":
        spec["offset"] = int(varplayer_offset)
      elif player_or_bits == "bits":
        spec["value"] = int(varbits_value)
      else:
        continue
      if task == "COMPLETE":
        diaries[diary_name][tier]["complete"] = spec
      else:
        task = int(task)
        assert len(diaries[diary_name][tier]["tasks"]) == task - 1
        diaries[diary_name][tier]["tasks"].append(spec)

print(json.dumps(diaries, sort_keys=True))