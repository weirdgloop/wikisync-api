import requests
import subprocess
import glob
import json
import os

tempdir = "/tmp"

if "RUNNER_TEMP" in os.environ:
    tempdir = os.getenv("RUNNER_TEMP")

print("Tempdir is", tempdir)

cache_latest_url = "https://github.com/abextm/osrs-cache/releases/latest"

tag_name = requests.get(
    cache_latest_url, headers={"Accept": "application/json"}
).json()["tag_name"]
dump_url = f"https://github.com/abextm/osrs-cache/releases/download/{tag_name}/dump-{tag_name}.tar.gz"

with open(f"{tempdir}/cache.tar.gz", "wb") as f:
    f.write(requests.get(dump_url).content)

# tarfile.extractall is very slow, using subprocess instead...
subprocess.Popen(
    ["/usr/bin/tar", "-xzf", f"{tempdir}/cache.tar.gz", "-C", tempdir],
    shell=False,
    stdout=subprocess.PIPE,
).wait()


def get_json(filepath):
    with open(f"{tempdir}/dump/" + filepath) as f:
        return json.load(f)


def set_json(data, filepath):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=4, sort_keys=type(data) == dict)


def get_quest_dbrow(dbrow_id):
    quest_dbrow = get_json("dbrow/%s.json" % dbrow_id)["columnValues"]
    quest_name = quest_dbrow[2][0]
    low_value = quest_dbrow[16][0] if quest_dbrow[16] is not None else 0
    high_value = quest_dbrow[17][0]

    return {"quest_name": quest_name, "low_value": low_value, "high_value": high_value}


def get_quest_vars():
    # https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bproc%2Cquest_progress_get%5D.cs2
    with open(f"{tempdir}/dump/rs2asm/4024.rs2asm") as f:
        content = f.read()
    VARPS = {}
    VARBITS = {}
    quest_label2id = {}
    current_label = None
    for line in content.split("\n"):
        if line.startswith("      "):
            quest_id, label = line.strip().split(": ")
            quest_label2id[label] = int(quest_id)
        if line.startswith("LABEL"):
            current_label = line.strip(":")
        if line.startswith("   get_var"):
            split = line.strip().split()
            if len(split) == 2:
                cmd, var_id = split
            else:
                # handle Dwarf Cannon...
                cmd, var_id = split[0], 0
            var_id = int(var_id)
            quest_info = get_quest_dbrow(quest_label2id[current_label])
            if cmd == "get_varbit":
                VARBITS[quest_info["quest_name"]] = [
                    var_id,
                    quest_info["low_value"],
                    quest_info["high_value"],
                ]
            elif cmd == "get_varp":
                VARPS[quest_info["quest_name"]] = [
                    var_id,
                    quest_info["low_value"],
                    quest_info["high_value"],
                ]
            else:
                raise ValueError
    return VARPS, VARBITS


def get_music_tracks():
    tracks = []
    musicDbRows = get_json("dbtable_index/44/master.json")["tupleIndexes"][0]["0"]
    for dbRow in musicDbRows:
        trackDbColumns = get_json("dbrow/" + str(dbRow) + ".json")["columnValues"]
        midiId = trackDbColumns[4][0]
        trackNameForSorting = trackDbColumns[0][0]
        trackName = trackDbColumns[1][0].replace("\t", "")
        varpIndex = -1
        varpBitIndex = -1
        if trackDbColumns[5] is not None and len(trackDbColumns[5]) > 0:
            varpIndex = trackDbColumns[5][0]
            varpBitIndex = trackDbColumns[5][1]
        tracks.append(
            {
                "trackName": trackName,
                "trackNameForSorting": trackNameForSorting,
                "midiId": midiId,
                "varpIndex": varpIndex,
                "varpBitIndex": varpBitIndex,
            }
        )
    tracks.sort(key=lambda x: x["trackNameForSorting"])
    return tracks


def get_music_varps():
    # https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bclientscript%2Cmusic_init_counter%5D.cs2
    # https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bproc%2Cscript7305%5D.cs2
    with open(f"{tempdir}/dump/rs2asm/7305.rs2asm") as f:
        content = f.read()
    varps = []
    for line in content.split("\n"):
        if line.startswith("LABEL"):
            continue
        if line.startswith("   get_varp"):
            cmd, varp_id = line.strip().split()
            varps.append(int(varp_id))
    return varps


def get_league_task_varps():
    # https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bproc%2Cleague_task_is_completed%5D.cs2
    with open(f"{tempdir}/dump/rs2asm/3216.rs2asm") as f:
        content = f.read()
    varps = []
    for line in content.split("\n"):
        if line.startswith("   get_varp"):
            cmd, varp_id = line.strip().split()
            varps.append(int(varp_id))
    return varps


def get_combat_achievement_varps():
    # https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bproc%2Cscript4834%5D.cs2
    with open(f"{tempdir}/dump/rs2asm/4834.rs2asm") as f:
        content = f.read()
    varps = []
    for line in content.split("\n"):
        if line.startswith("   get_varp"):
            cmd, varp_id = line.strip().split()
            varps.append(int(varp_id))
    return varps


MUSIC_TRACKS = get_music_tracks()

MUSIC_VARPS = get_music_varps()

QUEST_VARPS, QUEST_VARBITS = get_quest_vars()

LEAGUE_TASK_VARPS = get_league_task_varps()

COMBAT_ACHIEVEMENT_VARPS = get_combat_achievement_varps()

set_json(MUSIC_TRACKS, "musicTracks.json")
set_json(MUSIC_VARPS, "musicVarps.json")
set_json(QUEST_VARPS, "questVarps.json")
set_json(QUEST_VARBITS, "questVarbits.json")
set_json(LEAGUE_TASK_VARPS, "leagueTaskVarps.json")
set_json(COMBAT_ACHIEVEMENT_VARPS, "combatAchievementVarps.json")
