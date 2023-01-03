import requests
import subprocess
import glob
import json

cache_latest_url = "https://github.com/abextm/osrs-cache/releases/latest"

tag_name = requests.get(cache_latest_url, headers={"Accept": "application/json"}).json()['tag_name']
dump_url = f"https://github.com/abextm/osrs-cache/releases/download/{tag_name}/dump-{tag_name}.tar.gz"

with open('/tmp/cache.tar.gz', 'wb') as f:
	f.write(requests.get(dump_url).content)

# tarfile.extractall is very slow, using subprocess instead...
subprocess.Popen(["/usr/bin/tar", "-xzf", '/tmp/cache.tar.gz', "-C", '/tmp'], shell=False, stdout=subprocess.PIPE).wait()

def get_json(filepath):
	with open('/tmp/dump/' + filepath) as f:
		return json.load(f)

def set_json(data, filepath):
	with open(filepath, 'w') as f:
		json.dump(data, f, indent=4, sort_keys=type(data) == dict)

def get_quest_dbrow(dbrow_id):
	quest_dbrow = get_json('dbrow/%s.json' % dbrow_id)['columnValues']
	quest_name = quest_dbrow[2][0]
	low_value = quest_dbrow[16][0] if quest_dbrow[16] is not None else 0
	print(quest_dbrow)
	high_value = quest_dbrow[17][0]

	return { "quest_name": quest_name, "low_value": low_value, "high_value": high_value}

def get_quest_vars():
	# https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bproc%2Cquest_progress_get%5D.cs2
	with open('/tmp/dump/rs2asm/4024.rs2asm') as f:
		content = f.read()
	VARPS = {}
	VARBITS = {}
	quest_label2id = {}
	current_label = None
	for line in content.split('\n'):
		if line.startswith('      '):
			quest_id, label = line.strip().split(': ')
			quest_label2id[label] = int(quest_id)
		if line.startswith('LABEL'):
			current_label = line.strip(':')
		if line.startswith('   get_var'):
			split = line.strip().split()
			if len(split) == 2:
				cmd, var_id = split
			else:
				# handle Dwarf Cannon...
				cmd, var_id = split[0], 0
			var_id = int(var_id)
			quest_info = get_quest_dbrow(quest_label2id[current_label])
			if cmd == 'get_varbit':
				VARBITS[quest_info["quest_name"]] = [var_id, quest_info["low_value"], quest_info["high_value"]]
			elif cmd == 'get_varp':
				VARPS[quest_info["quest_name"]] = [var_id, quest_info["low_value"], quest_info["high_value"]]
			else:
				raise ValueError
	return VARPS, VARBITS
	
def get_music_varps():
	# https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bclientscript%2Cmusic_init_counter%5D.cs2
	with open('/tmp/dump/rs2asm/2257.rs2asm') as f:
		content = f.read()
	varps = []
	for line in content.split('\n'):
		if line.startswith('LABEL'):
			break
		if line.startswith('   get_varp'):
			cmd, varp_id = line.strip().split()
			varps.append(int(varp_id))
	return varps

def get_league_task_varps():
	# https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bproc%2Cleague_task_is_completed%5D.cs2
	with open('/tmp/dump/rs2asm/3216.rs2asm') as f:
		content = f.read()
	varps = []
	for line in content.split('\n'):
		if line.startswith('   get_varp'):
			cmd, varp_id = line.strip().split()
			varps.append(int(varp_id))
	return varps

def get_combat_achievement_varps():
	# https://github.com/Joshua-F/cs2-scripts/blob/master/scripts/%5Bproc%2Cscript4834%5D.cs2
	with open('/tmp/dump/rs2asm/4834.rs2asm') as f:
		content = f.read()
	varps = []
	for line in content.split('\n'):
		if line.startswith('   get_varp'):
			cmd, varp_id = line.strip().split()
			varps.append(int(varp_id))
	return varps


music_id2name = get_json("enums/812.json")
music_id2varpcoord = get_json("enums/819.json")

if music_id2name['size'] != music_id2varpcoord['size']:
	raise ValueError

MUSIC_TRACKS = []

for trackId, varpCoord in zip(music_id2varpcoord['keys'], music_id2varpcoord['intVals']):
	MUSIC_TRACKS.append({"trackId": trackId, "varpCoord": varpCoord})

MUSIC_VARPS = get_music_varps()

QUEST_VARPS, QUEST_VARBITS = get_quest_vars()	

LEAGUE_TASK_VARPS = get_league_task_varps()

COMBAT_ACHIEVEMENT_VARPS = get_combat_achievement_varps()

set_json(MUSIC_TRACKS, 'musicTracks.json')
set_json(MUSIC_VARPS, 'musicVarps.json')
set_json(QUEST_VARPS, 'questVarps.json')
set_json(QUEST_VARBITS, 'questVarbits.json')
set_json(LEAGUE_TASK_VARPS, 'leagueTaskVarps.json')
set_json(COMBAT_ACHIEVEMENT_VARPS, 'combatAchievementVarps.json')
