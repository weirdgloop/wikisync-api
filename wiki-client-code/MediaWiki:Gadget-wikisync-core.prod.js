/**
 * WikiSync:
 * - Utilises our WikiSync API, with data provided by users via RuneLite.
 * - Adds the ability to check a user's completed quests.
 * 
 * Slightly adapted from https://runescape.wiki/w/MediaWiki:Gadget-questchecker-core.js
 *
 * @author Jayden
 * @author Andmcadams
 * @author Jakesterwars
 * @author Cook Me Plox
 * @author Lezed1
 * @author Haidro
 */


 var QC_ACTIVATOR_CLASS = '.qc-active',
 QC_INPUT_CLASS = '.qc-input',
 ENDPOINTS = {
	osrs: 'https://sync.runescape.wiki/runelite/player/username/STANDARD',
	shatteredrelics: 'https://sync.runescape.wiki/runelite/player/username/SHATTERED_RELICS_LEAGUE' //use actual url
 };

var questCorrections = {
	// Add corrections for API quest names -> wiki names here.
	// API quest name is the key and the wiki page name is the value.
 },

 conf = mw.config.get([
	'wgArticlePath'
 ]),
 icons = {
	'yes': ' <span class="rs-qc-icon"><img class="qc-complete" src="/images/Yes_check.svg?00000" width="15px" ></span>',
	'no':	' <span class="rs-qc-icon"><img class="qc-not-started" src="/images/X_mark.svg?00000" width="13px" ></span>'
 };

wikisync = {
	/**
	 * Startup method
	 */
	init: function () {
		wikisync.createFields();
	},

	setCheckboxText: function (text) {
		$(".rs-wikisync-hide-completed .oo-ui-labelElement-label").each(function() {
			$(this).text(text);
		})
	},

	hideCompletedEntries: function () {
		var selected = wikisync.hideCompletedCheckbox.isSelected();
		if (selected) {
			$(".wikisync-completed").hide();
		}
	},
	
	/**
	 * Creates the input fields for the user's RSN
	 */
	createFields: function () {
		if (rs.hasLocalStorage() === true) {
			$.removeCookie('RSN', { path: '/' }); // remove any existing cookies using jQuery, will return false if it doesn't exist so it's fine
			var name = localStorage.getItem('rsn');
		} else {
			var name = wikisync.getCookie('RSN');
		}
		
		var gamemode = 'osrs';

		$(QC_INPUT_CLASS).each( function() {
			var input1 = new OO.ui.TextInputWidget( { placeholder: 'Display name', id: 'rs-qc-rsn'} );

			if (name) {
				// Set input to cookie/localStorage value.
				input1.setValue(name);
			}
			
			var button1 = new OO.ui.ButtonInputWidget( {
				label: new OO.ui.HtmlSnippet(
					'<img src="' + rs.getFileURLCached('RuneLite icon.png') + '" width=' + '"20px" />' + ' Look up'
				),
				title: 'Look up player data using RuneLite',
				flags: [ 'primary', 'progressive' ],
				classes: ['wikisync-lookup-button']
			} );

			var leagueOnly = $(this).hasClass('league-only')
			if (leagueOnly) {
				gamemode = 'shatteredrelics';
			}

			var button1action = function() {
				if (rs.hasLocalStorage() === true) {
					localStorage.setItem('rsn', input1.value); // save in localStorage
				} else {
					wikisync.setCookie('RSN', input1.value, 30); // set a cookie for 30 days
				}
				wikisync.loadData(input1.value, gamemode);
			};
			button1.on('click', button1action);
			input1.on('enter', button1action);
			
			var helpModalBtn = new OO.ui.ButtonWidget({
				label: 'Learn how to enable WikiSync',
				href: '/w/RuneScape:WikiSync'
			});

			var hideCompleted = false;
			if (rs.hasLocalStorage()) {
				if (localStorage.getItem('wikisync-hide-completed') === 'true') {
					hideCompleted = true;
				}
			}
			wikisync.hideCompletedCheckbox = new OO.ui.CheckboxInputWidget({
				selected: hideCompleted
			});
			wikisync.hideCompletedCheckbox.on('change', function () {
				var selected = wikisync.hideCompletedCheckbox.isSelected();
				if (rs.hasLocalStorage() === true) {
					localStorage.setItem('wikisync-hide-completed', selected); // save in localStorage
				}
				$(".wikisync-completed").toggle(!selected);
			});

			var fieldset = new OO.ui.FieldsetLayout( {
			id: 'rs-qc-form',
			} );
			
			var fieldSetItems = [new OO.ui.FieldLayout(input1, {label:'Username:', align:'inline'})];

			fieldSetItems.push(button1);
			fieldset.addItems( [
				new OO.ui.HorizontalLayout({
					items: fieldSetItems
				}),
				new OO.ui.FieldLayout(
					helpModalBtn,
					{
						label: 'No data found. To use this, enable the WikiSync plugin in RuneLite.',
						align: 'inline',
						classes: ['rs-wikisync-help']
					}
				),
				new OO.ui.LabelWidget( {
					label: 'Missing some data from RuneLite for this page. Please log in to the game to re-sync.',
					classes: ['rs-wikisync-missingdata']
				} ),
				new OO.ui.FieldLayout(
					wikisync.hideCompletedCheckbox,
					{
						label: 'Hide completed',
						align: 'inline',
						classes: ['rs-wikisync-hide-completed']
					}
				)
			]);
			
			if ($(this).hasClass('lighttable')) {
				// If it's a lighttable, insert the fieldset before the table
				fieldset.$element.insertBefore(this);
			} else {
				// If not, insert it inside the element that has the class
				$(this).prepend( fieldset.$element );
			}
			// Hide all of the help elements to start with
			$('.rs-wikisync-help').hide();
			$('.rs-wikisync-missingdata').hide();
			if ($(".srl-tasks, .music-tracks").length === 0) {
				// only show checkbox if it's a table with hide-able tasks
				$('.rs-wikisync-hide-completed').hide();
			}
		} );
		
		if (name) {
			// If there is a saved name, load the data for it.
			wikisync.loadData(name, gamemode);
		}
	},
	
	/**
	 * Updates the status text
	 */
	updateStatus: function (text) {
		mw.notify( text, { tag: 'wikisync' } );
	},

	/**
	 * Sets a cookie
	 */
	setCookie: function (name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	},
	
	/**
	 * Returns the value of a cookie, or null if it doesn't exist
	 */
	getCookie: function (name) {
		var cookie = new RegExp("^(?:.*;)?\\s*" + name + "\\s*=\\s*([^;]+)(?:.*)?$"),
			match = document.cookie.match(cookie);
		
		if (match !== null) {
			return match[1];
		} else {
			return null;
		}
	},
	
	/**
	 * Load data
	 */
	loadData: function (rsn, gamemode) {
		if (!rsn) {
			wikisync.updateStatus("Invalid RSN");
			return;
		}
		
		var endpoint = ENDPOINTS[gamemode || 'osrs'] || ENDPOINTS.osrs;
		// Hide help text if it is showing.
		$('.rs-wikisync-help').hide();
		$('.rs-wikisync-missingdata').hide();
		$('.wikisync-success').remove();

		$.ajax({ // Get the quest data
			type: "GET",
			url: endpoint.replace("username", rsn),
			dataType: "json",
			success: function(msg) {
				var userQuests = {};
				Object.entries(msg.quests).forEach(function(q, ix) {
					var k = q[0],
						v = q[1];
					// Correct quest names to wiki page names
					if (k in questCorrections) {
						var correctName = questCorrections[k];
						userQuests[correctName] = v;
					} else {
						userQuests[k] = v;
					}
				});
				var userSkills = {};
				Object.entries(msg.levels).forEach(function(q, ix) {
					var k = q[0],
						v = q[1];
					userSkills[k] = v;
				});
				$('.rs-qc-icon').remove();
				$(".wikisync-completed").show();
				$(".wikisync-completed").removeClass("wikisync-completed");
				$('<img>').attr("src","/images/f/fb/Yes_check.svg?00000").addClass('wikisync-success').css('width', '20px').css('height', '20px').css('position', 'relative').insertAfter( '.wikisync-lookup-button' );

				const hasAllData = [
					wikisync.addQuestIcons(userQuests),
					wikisync.addQuestTable(userQuests, userSkills, msg.achievement_diaries),
					wikisync.addDiaryTable(msg.achievement_diaries),
					wikisync.addSkillTable(userSkills),
					wikisync.addSkillIcons(userSkills),
					wikisync.addMusicTracks(msg.music_tracks),
					wikisync.addCombatAchievementTasks(msg.combat_achievements),
				].every(function(result){return result});

				if (!hasAllData) {
					$('.rs-wikisync-missingdata').show();
				}
			},
			error: function(req) {
				$('.rs-qc-icon').remove();
				wikisync.setCheckboxText("Hide completed");
				if (req.responseJSON && req.responseJSON.code && req.responseJSON.code === 'NO_USER_DATA') {
					$('.rs-wikisync-help').show();
				} else {
					wikisync.updateStatus('There was a problem loading data for ' + rsn);
				}
			}
		});
	},
	
	/**
     * Clicks the Combat Achievement rows
     */
    addCombatAchievementTasks: function (combatAchievements) {
        var combatAchievementTable = $('table.qc-active.ca-tasks');
        if (combatAchievementTable.length === 0) {
            // Page doesn't have Combat Achievement tasks on it
            return true;
        }

        if (combatAchievementTable === null) {
            return false;
        }

        var seen = {};
        combatAchievements.forEach(function(taskId) {
            seen[taskId] = true;
        });
        combatAchievementTable.each(function() {
            $(this).find('tr[data-ca-task-id]').each(function() {
                var task_id = $(this).data("ca-task-id");
                if (!!seen[task_id] !== $(this).hasClass("highlight-on")) {
                    $(this).click();
                }
                if (seen[task_id]) {
                    $(this).addClass("wikisync-completed");
                }
            });
        });

        return true;
    },

	/**
	 * Clicks the music track rows
	 */
	addMusicTracks: function (musicTracks) {
		var musicTable = $('table.qc-active.music-tracks');
		if (musicTable.length === 0) {
			// Not a music track page
			return true;
		}

		if (musicTracks === null) {
			// Missing data
			return false;
		}

		var seen = {};
		var total = 0;
		var completed = 0;
		musicTracks.forEach(function(trackId) {
			seen[trackId] = true;
		});
		musicTable.each(function() {
			$(this).find('tr[data-music-id]').each(function() {
				var music_id = $(this).data("music-id");
				if (!!seen[music_id] !== $(this).hasClass("highlight-on")) {
					$(this).click();
				}
				if (seen[music_id]) {
					$(this).addClass("wikisync-completed");
					completed++;
				}
				total++;
			})
		})
		wikisync.setCheckboxText("Hide unlocked tracks (" + completed + "/" + total + " unlocked)");
		wikisync.hideCompletedEntries();
		return true;
	},

	/**
	 * Clicks the rows in a table of question and diary tiers. Also appends icons to rows dedicated to skill training
	 */
	 addQuestTable: function (quests, skills, achievementDiaries) {
		// Quest and diary completion
		$('table.qc-active.oqg-table tr[data-rowid]').each(function() {
			var rowID = $(this).data("rowid");
			var isAchievementDiary = rowID.includes("Diary#");
			
		 if (isAchievementDiary) {
			 // Achievement diary rowIDs are formatted as "$NAME Diary#$TIER", where "$NAME" may contain spaces.
			 function splitOnLastOccurence(str, splitOn) {
				 var index = str.lastIndexOf(splitOn);
				 return { before: str.slice(0, index), after: str.slice(index + 1) };
			 }
			 var diaryName = splitOnLastOccurence(rowID, " ").before;
			 var diaryTier = splitOnLastOccurence(rowID, "#").after;
			 if (diaryName in achievementDiaries && diaryTier in achievementDiaries[diaryName] && "complete" in achievementDiaries[diaryName][diaryTier]) {
				 var diaryCompleted = achievementDiaries[diaryName][diaryTier].complete;
				 if (diaryCompleted !== null) {
					 if (diaryCompleted !== $(this).hasClass("highlight-on")) {
						 $(this).click();
					 }
				 }
			 }
		 } else {
			 var questName = rowID;
			 if (questName in quests) {
				 var questCompleted = quests[questName] == 2;
				 if (questCompleted !== $(this).hasClass("highlight-on")) {
					 $(this).click();
				 }
			 }
		 }
		});


		// Skill training complete
		$('table.qc-active.oqg-table tr[data-skill][data-skill-level]').each(function() {
			var skillName = $(this).data("skill");
			skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
			var skillLevel = $(this).data("skill-level");
			var row = $(this).find('th')
			if (skills[skillName] >= skillLevel) {
				row.append(icons.yes);
			} else {
				row.append(icons.no);
			}
		});
		return true;
	},

	// Clicks cells/rows in a table based on skill levels.
	addSkillTable: function(skills) {
		$('table.qc-active.skill-table [data-skill][data-skill-level]').each(function() {
			var skillName = $(this).data("skill");
			var skillLevel = $(this).data("skill-level");
			var skillCompleted = skills[skillName] >= skillLevel;
			if (skillCompleted !== $(this).hasClass("highlight-on")) {
				$(this).click();
			}
		});
		return true;
	},

	// Clicks rows in a table based on achievement diary task completion
	addDiaryTable: function(achievementDiaries) {
		var hasAllData = true;
		$('table.qc-active.diary-table[data-diary-name][data-diary-tier]').each(function() {
			var task_index = -1;
			var diaryName = $(this).data("diary-name");
			var diaryTier = $(this).data("diary-tier");
			$(this).find('tr').each(function() {
				if (task_index < 0) {
					task_index += 1;
					return;
				}
				if (diaryName in achievementDiaries && diaryTier in achievementDiaries[diaryName] && achievementDiaries[diaryName][diaryTier].tasks.length > task_index) {
					var task_completed = achievementDiaries[diaryName][diaryTier].tasks[task_index];

					if (task_completed !== null) {
						if (task_completed !== $(this).hasClass("highlight-on")) {
							$(this).click();
						}
					} else {
						hasAllData = false;
					}
				}
				task_index += 1;
			});
		});
		return hasAllData;
	},

	/**
	 * Adds the icons next to respective quests
	 */
	addQuestIcons: function (quests) {
		$(QC_ACTIVATOR_CLASS + " a").each(function() {
			if ($(this).html().toLowerCase() != "expand" || $(this).html().toLowerCase() != "collapse") {
				var questTitle = $(this).text().trim(),
					icon = $(this).find('.rs-qc-icon'),
					imgsrc = '';
				if (quests[questTitle] === 2) {
					$(this).append(icons.yes);
				}
				if (quests[questTitle] === 0 || quests[questTitle] === 1) {
					$(this).append(icons.no);
				}
			}
		});
		return true;
	},

	/**
	 * Adds the icons next to respective skills
	 */
	addSkillIcons: function (userLevels) {
		$(QC_ACTIVATOR_CLASS + " .scp").each(function() {
			var level = $(this).data('level');
			var skill = $(this).data('skill');
			if (typeof(level) !== 'number' || userLevels[skill] === undefined) {
				return;
			}
			if (userLevels[skill] >= level) {
				$(this).append(icons.yes);
			} else {
				$(this).append(icons.no);
			}
		});
		return true;
	}
 };

$(wikisync.init);
